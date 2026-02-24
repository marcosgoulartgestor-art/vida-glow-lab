import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;

    const { file_base64, mime_type, lab_name } = await req.json();

    if (!file_base64 || !mime_type) {
      return new Response(JSON.stringify({ error: "file_base64 and mime_type are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the user content with the file
    const userContent: any[] = [
      {
        type: "image_url",
        image_url: { url: `data:${mime_type};base64,${file_base64}` },
      },
      {
        type: "text",
        text: "Analise este exame de sangue e extraia todos os biomarcadores encontrados.",
      },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Você é um especialista em análises clínicas laboratoriais.
Analise este exame de sangue e extraia TODOS os biomarcadores encontrados.
Para cada marcador:
- Normalize o nome (ex: "Hemoglobina Glicada" não "HbA1c")
- Identifique o valor numérico
- A unidade de medida
- Os valores de referência mínimo e máximo
- Classifique como 'Alto', 'Baixo' ou 'Normal' comparando com a faixa de referência.
Use a tool extract_biomarkers para retornar os dados estruturados.`,
          },
          { role: "user", content: userContent },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_biomarkers",
              description: "Extrair biomarcadores estruturados de um exame de sangue",
              parameters: {
                type: "object",
                properties: {
                  markers: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Nome normalizado do biomarcador" },
                        value: { type: "number", description: "Valor numérico do resultado" },
                        unit: { type: "string", description: "Unidade de medida" },
                        reference_min: { type: "number", description: "Valor mínimo de referência" },
                        reference_max: { type: "number", description: "Valor máximo de referência" },
                        status: {
                          type: "string",
                          enum: ["Alto", "Baixo", "Normal"],
                          description: "Classificação comparada à faixa de referência",
                        },
                      },
                      required: ["name", "value", "unit", "status"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["markers"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_biomarkers" } },
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", status, errText);
      return new Response(JSON.stringify({ error: "Erro ao processar exame com IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResult = await response.json();
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response:", JSON.stringify(aiResult));
      return new Response(JSON.stringify({ error: "IA não retornou dados estruturados" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { markers } = JSON.parse(toolCall.function.arguments);

    // Save exam record
    const { data: examData, error: examError } = await supabase
      .from("exams")
      .insert({
        user_id: userId,
        lab_name: lab_name || "Laboratório",
        biomarkers: markers.map((m: any) => ({
          name: m.name,
          value: m.value,
          unit: m.unit,
          status: m.status === "Normal" ? "green" : m.status === "Alto" ? "red" : "yellow",
        })),
      })
      .select("id")
      .single();

    if (examError) {
      console.error("Exam insert error:", examError);
    }

    // Save individual markers
    if (examData?.id) {
      const markersToInsert = markers.map((m: any) => ({
        user_id: userId,
        exam_id: examData.id,
        marker_name: m.name,
        value: m.value,
        unit: m.unit,
        reference_min: m.reference_min ?? null,
        reference_max: m.reference_max ?? null,
        status: m.status,
      }));

      const { error: markersError } = await supabase
        .from("health_markers")
        .insert(markersToInsert);

      if (markersError) {
        console.error("Markers insert error:", markersError);
      }
    }

    return new Response(JSON.stringify({ markers, exam_id: examData?.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-exam error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
