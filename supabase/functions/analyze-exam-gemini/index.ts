import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é um especialista em análises clínicas laboratoriais E um educador de saúde excepcional.

Analise este exame de sangue e extraia TODOS os biomarcadores encontrados.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PARTE 1 — EXTRAÇÃO E CLASSIFICAÇÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para cada marcador encontrado no laudo:
- Normalize o nome usando o campo "name" do BIOMARKER_REGISTRY abaixo
  (ex: "Hemoglobina Glicada" não "HbA1c")
- Use os "aliases" do registry para reconhecer variações de nome entre laboratórios
- Use o "id" padronizado do registry em todos os retornos
- Identifique o valor numérico
- Identifique a unidade de medida
- Aplique as faixas do registry (referenceMin/referenceMax e optimalMin/optimalMax)

Classifique cada marcador em dois campos separados:
- status_clinical: compare com referenceMin/referenceMax → 'Alto', 'Baixo' ou 'Normal'
- status_optimal: compare com optimalMin/optimalMax →
    'Otimizado' (verde): valor dentro de optimalMin–optimalMax
    'Atenção' (amarelo): dentro de referenceMin–referenceMax, mas fora do ótimo
    'Alerta' (vermelho): fora de referenceMin–referenceMax

Para marcadores com faixas por sexo (campo "bySex" no registry):
- Use as faixas do sexo informado pelo usuário
- Se sexo não informado, use faixas masculinas como padrão

Se um valor vier com "<" ou ">" (ex: "<0.1"):
- Para "<": use referenceMin * 0.5
- Para ">": use referenceMax * 1.1

Ignore marcadores ausentes no laudo — nunca invente valores.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PARTE 2 — EXPLICAÇÕES EDUCATIVAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANTE — Para cada biomarcador, gere também explicações educativas em português brasileiro:
- what_is: Explique O QUE É esse biomarcador usando uma analogia simples do dia a dia.
  Linguagem que qualquer pessoa entenda, como se explicasse para um amigo leigo.
  Exemplo: "A ferritina é como o estoque de combustível do seu corpo..." (2-3 frases)
- why_matters: Explique POR QUE esse biomarcador IMPORTA para a saúde da pessoa,
  levando em conta o valor encontrado E o status_optimal (Otimizado/Atenção/Alerta).
  Use analogias. (2-3 frases)
- what_to_do: Lista de 2-4 ações práticas e acessíveis que a pessoa pode tomar.
  Adapte o tom ao status_optimal: mais urgente no 'Alerta', preventivo no 'Atenção',
  de manutenção no 'Otimizado'. Linguagem direta.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PARTE 3 — FORMATO DE RETORNO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Use a tool extract_biomarkers para retornar os dados estruturados.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BIOMARKER_REGISTRY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const BIOMARKER_REGISTRY = [
  // ── CORAÇÃO & METABOLISMO
  { id:"glucose", name:"Glicose em Jejum", category:"metabolic", aliases:["glicose","glucose","glicemia","glicemia em jejum","glicemia de jejum","blood glucose","glicose plasmática"], unit:"mg/dL", referenceMin:70, referenceMax:99, optimalMin:72, optimalMax:90 },
  { id:"hba1c", name:"Hemoglobina Glicada (HbA1c)", category:"metabolic", aliases:["hba1c","hemoglobina glicada","hemoglobina a1c","a1c","glico-hemoglobina","hb glicada","glycated hemoglobin"], unit:"%", referenceMin:4.0, referenceMax:5.6, optimalMin:4.6, optimalMax:5.3 },
  { id:"insulin", name:"Insulina", category:"metabolic", aliases:["insulina","insulin","insulina basal","insulina em jejum","insulina de jejum"], unit:"µUI/mL", referenceMin:2, referenceMax:25, optimalMin:2, optimalMax:10 },
  { id:"homa_ir", name:"HOMA-IR", category:"metabolic", aliases:["homa-ir","homa ir","homa","índice homa","resistência insulínica"], unit:"", referenceMin:0, referenceMax:2.7, optimalMin:0, optimalMax:1.5 },
  { id:"cholesterol_total", name:"Colesterol Total", category:"metabolic", aliases:["colesterol total","cholesterol total","col. total","colesterol","ct"], unit:"mg/dL", referenceMin:0, referenceMax:190, optimalMin:0, optimalMax:170 },
  { id:"hdl", name:"Colesterol HDL", category:"metabolic", aliases:["hdl","colesterol hdl","hdl colesterol","hdl-c","col. hdl","lipoproteína de alta densidade"], unit:"mg/dL", bySex:{ male:{ referenceMin:40, referenceMax:999, optimalMin:60, optimalMax:999 }, female:{ referenceMin:50, referenceMax:999, optimalMin:70, optimalMax:999 } } },
  { id:"ldl", name:"Colesterol LDL", category:"metabolic", aliases:["ldl","colesterol ldl","ldl colesterol","ldl-c","col. ldl","ldl direto","ldl calculado","lipoproteína de baixa densidade"], unit:"mg/dL", referenceMin:0, referenceMax:130, optimalMin:0, optimalMax:90 },
  { id:"vldl", name:"Colesterol VLDL", category:"metabolic", aliases:["vldl","colesterol vldl","vldl-c","col. vldl"], unit:"mg/dL", referenceMin:0, referenceMax:30, optimalMin:0, optimalMax:20 },
  { id:"triglycerides", name:"Triglicerídeos", category:"metabolic", aliases:["triglicerídeos","triglicérides","triglicerídios","triglycerides","tg","triglicérides séricos"], unit:"mg/dL", referenceMin:0, referenceMax:150, optimalMin:0, optimalMax:80 },
  { id:"apob", name:"Apolipoproteína B (ApoB)", category:"metabolic", aliases:["apob","apolipoproteína b","apo b","apolipoproteina b"], unit:"mg/dL", referenceMin:0, referenceMax:100, optimalMin:0, optimalMax:70 },
  { id:"apoa1", name:"Apolipoproteína A1", category:"metabolic", aliases:["apoa1","apolipoproteína a1","apo a1","apoa-1"], unit:"mg/dL", bySex:{ male:{ referenceMin:110, referenceMax:205, optimalMin:140, optimalMax:205 }, female:{ referenceMin:108, referenceMax:225, optimalMin:150, optimalMax:225 } } },
  { id:"lipoprotein_a", name:"Lipoproteína(a)", category:"metabolic", aliases:["lipoproteína(a)","lp(a)","lipoprotein a","lipoproteína a"], unit:"mg/dL", referenceMin:0, referenceMax:30, optimalMin:0, optimalMax:20 },
  { id:"non_hdl", name:"Colesterol Não-HDL", category:"metabolic", aliases:["não-hdl","nao-hdl","colesterol não hdl","non hdl"], unit:"mg/dL", referenceMin:0, referenceMax:160, optimalMin:0, optimalMax:120 },
  { id:"omega3", name:"Ômega-3 Total", category:"metabolic", aliases:["ômega-3","omega-3","omega 3","ácidos graxos ômega-3","dha+epa","índice ômega-3"], unit:"%", referenceMin:4, referenceMax:100, optimalMin:8, optimalMax:100 },
  { id:"omega6", name:"Ômega-6 Total", category:"metabolic", aliases:["ômega-6","omega-6","omega 6","ácidos graxos ômega-6"], unit:"%", referenceMin:0, referenceMax:30, optimalMin:0, optimalMax:20 },
  { id:"uric_acid", name:"Ácido Úrico", category:"metabolic", aliases:["ácido úrico","uric acid","urato sérico","uricemia"], unit:"mg/dL", bySex:{ male:{ referenceMin:3.5, referenceMax:7.2, optimalMin:3.5, optimalMax:5.5 }, female:{ referenceMin:2.6, referenceMax:6.0, optimalMin:2.6, optimalMax:4.5 } } },
  // ── HORMÔNIOS & TIREOIDE
  { id:"tsh", name:"TSH", category:"hormones", aliases:["tsh","hormônio tireoestimulante","thyroid stimulating hormone","tsh ultrassensível","tsh us","tsh 3ª geração"], unit:"µUI/mL", referenceMin:0.4, referenceMax:4.0, optimalMin:1.0, optimalMax:2.5 },
  { id:"t4_free", name:"T4 Livre", category:"hormones", aliases:["t4 livre","t4l","free t4","tiroxina livre","t4 free","ft4"], unit:"ng/dL", referenceMin:0.8, referenceMax:1.9, optimalMin:1.0, optimalMax:1.7 },
  { id:"t3_free", name:"T3 Livre", category:"hormones", aliases:["t3 livre","t3l","free t3","triiodotironina livre","ft3","t3 free"], unit:"pg/mL", referenceMin:2.3, referenceMax:4.2, optimalMin:3.0, optimalMax:4.0 },
  { id:"t4_total", name:"T4 Total", category:"hormones", aliases:["t4 total","t4t","tiroxina total","thyroxine total"], unit:"µg/dL", referenceMin:5.1, referenceMax:14.1, optimalMin:7.0, optimalMax:12.0 },
  { id:"t3_total", name:"T3 Total", category:"hormones", aliases:["t3 total","triiodotironina total","t3t"], unit:"ng/dL", referenceMin:60, referenceMax:180, optimalMin:90, optimalMax:160 },
  { id:"rt3", name:"T3 Reverso (rT3)", category:"hormones", aliases:["t3 reverso","rt3","reverse t3"], unit:"ng/dL", referenceMin:9, referenceMax:27, optimalMin:9, optimalMax:20 },
  { id:"anti_tpo", name:"Anti-TPO", category:"hormones", aliases:["anti-tpo","anti tpo","anticorpos antitireoperoxidase","anti-peroxidase tireoidiana","tpo ab"], unit:"UI/mL", referenceMin:0, referenceMax:34, optimalMin:0, optimalMax:9 },
  { id:"anti_tg", name:"Anti-Tireoglobulina", category:"hormones", aliases:["anti-tireoglobulina","anti tg","anticorpos antitireoglobulina","tg ab","anti-thyroglobulin"], unit:"UI/mL", referenceMin:0, referenceMax:115, optimalMin:0, optimalMax:20 },
  { id:"testosterone_total", name:"Testosterona Total", category:"hormones", aliases:["testosterona total","testosterone total","testosterona","testosterone"], unit:"ng/dL", bySex:{ male:{ referenceMin:270, referenceMax:1070, optimalMin:600, optimalMax:900 }, female:{ referenceMin:15, referenceMax:70, optimalMin:25, optimalMax:60 } } },
  { id:"testosterone_free", name:"Testosterona Livre", category:"hormones", aliases:["testosterona livre","testosterone free","free testosterone"], unit:"pg/mL", bySex:{ male:{ referenceMin:47, referenceMax:244, optimalMin:100, optimalMax:200 }, female:{ referenceMin:0.5, referenceMax:8.5, optimalMin:2.0, optimalMax:7.0 } } },
  { id:"shbg", name:"SHBG", category:"hormones", aliases:["shbg","globulina ligadora de hormônios sexuais","sex hormone binding globulin"], unit:"nmol/L", bySex:{ male:{ referenceMin:10, referenceMax:57, optimalMin:20, optimalMax:45 }, female:{ referenceMin:18, referenceMax:144, optimalMin:30, optimalMax:90 } } },
  { id:"estradiol", name:"Estradiol (E2)", category:"hormones", aliases:["estradiol","e2","17-beta estradiol","estradiol sérico"], unit:"pg/mL", bySex:{ male:{ referenceMin:10, referenceMax:40, optimalMin:20, optimalMax:35 }, female:{ referenceMin:12, referenceMax:400, optimalMin:50, optimalMax:200 } } },
  { id:"progesterone", name:"Progesterona", category:"hormones", aliases:["progesterona","progesterone","progesterona sérica"], unit:"ng/mL", bySex:{ male:{ referenceMin:0.1, referenceMax:0.84, optimalMin:0.2, optimalMax:0.7 }, female:{ referenceMin:0.1, referenceMax:25, optimalMin:1.0, optimalMax:20 } } },
  { id:"dhea_s", name:"DHEA-S", category:"hormones", aliases:["dhea-s","dhea sulfato","dehidroepiandrosterona sulfato","dheas","dehydroepiandrosterone sulfate","dhea-so4"], unit:"µg/dL", bySex:{ male:{ referenceMin:80, referenceMax:560, optimalMin:200, optimalMax:450 }, female:{ referenceMin:35, referenceMax:430, optimalMin:150, optimalMax:350 } } },
  { id:"cortisol", name:"Cortisol (Matutino)", category:"hormones", aliases:["cortisol","cortisol matutino","cortisol sérico","cortisol basal","cortisol 8h"], unit:"µg/dL", referenceMin:6, referenceMax:23, optimalMin:10, optimalMax:18 },
  { id:"igf1", name:"IGF-1", category:"hormones", aliases:["igf-1","igf1","fator de crescimento semelhante à insulina","somatomedin c"], unit:"ng/mL", referenceMin:100, referenceMax:300, optimalMin:150, optimalMax:250 },
  { id:"lh", name:"LH", category:"hormones", aliases:["lh","hormônio luteinizante","luteinizing hormone"], unit:"mUI/mL", bySex:{ male:{ referenceMin:1.7, referenceMax:8.6, optimalMin:2.0, optimalMax:7.0 }, female:{ referenceMin:1.0, referenceMax:76.3, optimalMin:2.0, optimalMax:20 } } },
  { id:"fsh", name:"FSH", category:"hormones", aliases:["fsh","hormônio folículo estimulante","follicle stimulating hormone"], unit:"mUI/mL", bySex:{ male:{ referenceMin:1.5, referenceMax:12.4, optimalMin:2.0, optimalMax:8.0 }, female:{ referenceMin:1.8, referenceMax:153, optimalMin:2.0, optimalMax:10 } } },
  { id:"prolactin", name:"Prolactina", category:"hormones", aliases:["prolactina","prolactin","prl"], unit:"ng/mL", bySex:{ male:{ referenceMin:2.1, referenceMax:17.7, optimalMin:2.1, optimalMax:12.0 }, female:{ referenceMin:2.8, referenceMax:29.2, optimalMin:2.8, optimalMax:20.0 } } },
  { id:"amh", name:"AMH (Hormônio Antimülleriano)", category:"hormones", aliases:["amh","hormônio antimülleriano","anti-müllerian hormone"], unit:"ng/mL", bySex:{ male:{ referenceMin:0.7, referenceMax:19, optimalMin:2.0, optimalMax:15 }, female:{ referenceMin:0.9, referenceMax:9.5, optimalMin:1.5, optimalMax:7.0 } } },
  { id:"pth", name:"PTH (Paratormônio)", category:"hormones", aliases:["pth","paratormônio","parathyroid hormone","pth intacto","ipth"], unit:"pg/mL", referenceMin:15, referenceMax:65, optimalMin:20, optimalMax:45 },
  { id:"aldosterone", name:"Aldosterona", category:"hormones", aliases:["aldosterona","aldosterone","aldosterona plasmática"], unit:"ng/dL", referenceMin:3, referenceMax:35, optimalMin:5, optimalMax:25 },
  // ── NUTRIÇÃO & VITAMINAS
  { id:"vitamin_d", name:"Vitamina D (25-OH)", category:"nutrition", aliases:["vitamina d","vitamina d3","25-oh vitamina d","25-hidroxivitamina d","25(oh)d","vit d","25-hydroxyvitamin d","calcifediol"], unit:"ng/mL", referenceMin:20, referenceMax:100, optimalMin:50, optimalMax:80 },
  { id:"vitamin_b12", name:"Vitamina B12", category:"nutrition", aliases:["vitamina b12","cobalamina","vit b12","b12","cyanocobalamin"], unit:"pg/mL", referenceMin:200, referenceMax:900, optimalMin:500, optimalMax:900 },
  { id:"folate", name:"Ácido Fólico (B9)", category:"nutrition", aliases:["ácido fólico","folato","vitamina b9","folic acid","folate","folato sérico"], unit:"ng/mL", referenceMin:3.0, referenceMax:20.0, optimalMin:10.0, optimalMax:20.0 },
  { id:"vitamin_b6", name:"Vitamina B6 (Piridoxina)", category:"nutrition", aliases:["vitamina b6","piridoxina","pyridoxine","vit b6","b6"], unit:"ng/mL", referenceMin:5, referenceMax:50, optimalMin:15, optimalMax:40 },
  { id:"vitamin_b1", name:"Vitamina B1 (Tiamina)", category:"nutrition", aliases:["vitamina b1","tiamina","thiamine","b1"], unit:"nmol/L", referenceMin:70, referenceMax:180, optimalMin:100, optimalMax:180 },
  { id:"vitamin_a", name:"Vitamina A (Retinol)", category:"nutrition", aliases:["vitamina a","retinol","vit a","retinol sérico"], unit:"µg/dL", referenceMin:30, referenceMax:80, optimalMin:45, optimalMax:75 },
  { id:"vitamin_e", name:"Vitamina E", category:"nutrition", aliases:["vitamina e","tocoferol","alfa-tocoferol","vit e","alpha-tocopherol"], unit:"mg/L", referenceMin:5.0, referenceMax:18.0, optimalMin:9.0, optimalMax:16.0 },
  { id:"vitamin_k", name:"Vitamina K1", category:"nutrition", aliases:["vitamina k","vitamina k1","filoquinona","phylloquinone","vit k"], unit:"ng/mL", referenceMin:0.1, referenceMax:2.2, optimalMin:0.5, optimalMax:2.0 },
  { id:"iron", name:"Ferro Sérico", category:"nutrition", aliases:["ferro","ferro sérico","iron","fe sérico","fe"], unit:"µg/dL", bySex:{ male:{ referenceMin:65, referenceMax:175, optimalMin:80, optimalMax:150 }, female:{ referenceMin:50, referenceMax:170, optimalMin:70, optimalMax:140 } } },
  { id:"ferritin", name:"Ferritina", category:"nutrition", aliases:["ferritina","ferritin","ferritina sérica"], unit:"ng/mL", bySex:{ male:{ referenceMin:30, referenceMax:400, optimalMin:70, optimalMax:200 }, female:{ referenceMin:13, referenceMax:150, optimalMin:50, optimalMax:120 } } },
  { id:"transferrin", name:"Transferrina", category:"nutrition", aliases:["transferrina","transferrin","transferrina sérica"], unit:"mg/dL", referenceMin:200, referenceMax:360, optimalMin:220, optimalMax:340 },
  { id:"transferrin_sat", name:"Saturação de Transferrina", category:"nutrition", aliases:["saturação de transferrina","saturação da transferrina","transferrin saturation","sat. transferrina"], unit:"%", referenceMin:20, referenceMax:50, optimalMin:25, optimalMax:40 },
  { id:"tibc", name:"CTLF (TIBC)", category:"nutrition", aliases:["ctlf","capacidade total de ligação do ferro","tibc","total iron binding capacity"], unit:"µg/dL", referenceMin:250, referenceMax:370, optimalMin:260, optimalMax:340 },
  { id:"zinc", name:"Zinco", category:"nutrition", aliases:["zinco","zinc","zinco sérico","zn sérico","zn"], unit:"µg/dL", referenceMin:70, referenceMax:120, optimalMin:85, optimalMax:115 },
  { id:"magnesium", name:"Magnésio", category:"nutrition", aliases:["magnésio","magnesium","mg sérico","magnésio sérico"], unit:"mg/dL", referenceMin:1.7, referenceMax:2.4, optimalMin:2.0, optimalMax:2.4 },
  { id:"selenium", name:"Selênio", category:"nutrition", aliases:["selênio","selenium","selênio sérico","se"], unit:"µg/L", referenceMin:70, referenceMax:150, optimalMin:100, optimalMax:140 },
  { id:"copper", name:"Cobre", category:"nutrition", aliases:["cobre","copper","cobre sérico","cu sérico","cu"], unit:"µg/dL", bySex:{ male:{ referenceMin:70, referenceMax:140, optimalMin:80, optimalMax:120 }, female:{ referenceMin:80, referenceMax:155, optimalMin:90, optimalMax:130 } } },
  { id:"calcium", name:"Cálcio Total", category:"nutrition", aliases:["cálcio","cálcio total","calcium","ca total","cálcio sérico"], unit:"mg/dL", referenceMin:8.5, referenceMax:10.5, optimalMin:9.2, optimalMax:10.0 },
  { id:"phosphorus", name:"Fósforo", category:"nutrition", aliases:["fósforo","phosphorus","phosphate","fosfato","p sérico"], unit:"mg/dL", referenceMin:2.5, referenceMax:4.5, optimalMin:3.0, optimalMax:4.0 },
  { id:"mma", name:"Ácido Metilmalônico (MMA)", category:"nutrition", aliases:["ácido metilmalônico","mma","methylmalonic acid","ac. metilmalônico"], unit:"nmol/L", referenceMin:0, referenceMax:376, optimalMin:0, optimalMax:250 },
  // ── INFLAMAÇÃO & IMUNIDADE
  { id:"crp", name:"PCR (Proteína C Reativa)", category:"inflammation", aliases:["pcr","proteína c reativa","c-reactive protein","crp","proteina c reativa"], unit:"mg/L", referenceMin:0, referenceMax:5.0, optimalMin:0, optimalMax:1.0 },
  { id:"crp_us", name:"PCR Ultrassensível (hs-CRP)", category:"inflammation", aliases:["pcr ultrassensível","pcr-us","hs-crp","high sensitivity crp","pcr altamente sensível","hsPCR","pcr us"], unit:"mg/L", referenceMin:0, referenceMax:3.0, optimalMin:0, optimalMax:0.5 },
  { id:"homocysteine", name:"Homocisteína", category:"inflammation", aliases:["homocisteína","homocysteine","hcy","homocisteína plasmática"], unit:"µmol/L", referenceMin:0, referenceMax:15, optimalMin:0, optimalMax:9 },
  { id:"esr", name:"VHS", category:"inflammation", aliases:["vhs","velocidade de hemossedimentação","esr","erythrocyte sedimentation rate","hemossedimentação"], unit:"mm/h", bySex:{ male:{ referenceMin:0, referenceMax:15, optimalMin:0, optimalMax:10 }, female:{ referenceMin:0, referenceMax:20, optimalMin:0, optimalMax:12 } } },
  { id:"rheumatoid_factor", name:"Fator Reumatoide", category:"inflammation", aliases:["fator reumatoide","fr","rheumatoid factor","rf","waaler-rose","látex"], unit:"UI/mL", referenceMin:0, referenceMax:14, optimalMin:0, optimalMax:8 },
  { id:"fibrinogen", name:"Fibrinogênio", category:"inflammation", aliases:["fibrinogênio","fibrinogen","fibrinogênio plasmático"], unit:"mg/dL", referenceMin:200, referenceMax:400, optimalMin:200, optimalMax:300 },
  { id:"il6", name:"Interleucina-6 (IL-6)", category:"inflammation", aliases:["il-6","interleucina-6","il6","interleukin 6"], unit:"pg/mL", referenceMin:0, referenceMax:7.0, optimalMin:0, optimalMax:1.5 },
  // ── HEMOGRAMA COMPLETO
  { id:"hemoglobin", name:"Hemoglobina", category:"blood", aliases:["hemoglobina","hb","hemoglobin","hgb"], unit:"g/dL", bySex:{ male:{ referenceMin:13.5, referenceMax:17.5, optimalMin:14.5, optimalMax:16.5 }, female:{ referenceMin:12.0, referenceMax:16.0, optimalMin:13.0, optimalMax:15.5 } } },
  { id:"hematocrit", name:"Hematócrito", category:"blood", aliases:["hematócrito","hto","ht","hematocrit","hct"], unit:"%", bySex:{ male:{ referenceMin:41, referenceMax:53, optimalMin:43, optimalMax:50 }, female:{ referenceMin:36, referenceMax:46, optimalMin:38, optimalMax:44 } } },
  { id:"rbc", name:"Eritrócitos (Hemácias)", category:"blood", aliases:["eritrócitos","hemácias","rbc","red blood cells","glóbulos vermelhos"], unit:"milhões/mm³", bySex:{ male:{ referenceMin:4.5, referenceMax:5.9, optimalMin:4.7, optimalMax:5.5 }, female:{ referenceMin:4.0, referenceMax:5.2, optimalMin:4.2, optimalMax:5.0 } } },
  { id:"mcv", name:"VCM (Volume Corpuscular Médio)", category:"blood", aliases:["vcm","volume corpuscular médio","mcv","mean corpuscular volume"], unit:"fL", referenceMin:80, referenceMax:100, optimalMin:82, optimalMax:95 },
  { id:"mchc", name:"CHCM", category:"blood", aliases:["chcm","concentração de hemoglobina corpuscular média","mchc"], unit:"g/dL", referenceMin:32, referenceMax:36, optimalMin:33, optimalMax:35.5 },
  { id:"rdw", name:"RDW", category:"blood", aliases:["rdw","amplitude de distribuição","rdw-cv","red cell distribution width"], unit:"%", referenceMin:11.5, referenceMax:14.5, optimalMin:11.5, optimalMax:13.0 },
  { id:"platelets", name:"Plaquetas", category:"blood", aliases:["plaquetas","platelets","trombócitos","plt"], unit:"mil/mm³", referenceMin:150, referenceMax:400, optimalMin:170, optimalMax:350 },
  { id:"wbc", name:"Leucócitos Totais", category:"blood", aliases:["leucócitos","glóbulos brancos","wbc","white blood cells","leucócito total"], unit:"mil/mm³", referenceMin:4.0, referenceMax:10.0, optimalMin:4.5, optimalMax:7.5 },
  { id:"neutrophils", name:"Neutrófilos", category:"blood", aliases:["neutrófilos","neutrophils","segmentados+bastonetes"], unit:"%", referenceMin:45, referenceMax:75, optimalMin:50, optimalMax:70 },
  { id:"lymphocytes", name:"Linfócitos", category:"blood", aliases:["linfócitos","lymphocytes","linfócito"], unit:"%", referenceMin:20, referenceMax:45, optimalMin:25, optimalMax:40 },
  { id:"monocytes", name:"Monócitos", category:"blood", aliases:["monócitos","monocytes","monócito"], unit:"%", referenceMin:2, referenceMax:10, optimalMin:3, optimalMax:8 },
  { id:"eosinophils", name:"Eosinófilos", category:"blood", aliases:["eosinófilos","eosinophils","eosinófilo"], unit:"%", referenceMin:1, referenceMax:5, optimalMin:1, optimalMax:3 },
  // ── FUNÇÃO ORGÂNICA (FÍGADO, RIM)
  { id:"ast", name:"AST (TGO)", category:"organ", aliases:["ast","tgo","aspartato aminotransferase","aspartate aminotransferase","ast/tgo","tgo (ast)"], unit:"U/L", bySex:{ male:{ referenceMin:10, referenceMax:40, optimalMin:10, optimalMax:30 }, female:{ referenceMin:10, referenceMax:32, optimalMin:10, optimalMax:25 } } },
  { id:"alt", name:"ALT (TGP)", category:"organ", aliases:["alt","tgp","alanina aminotransferase","alanine aminotransferase","alt/tgp","tgp (alt)"], unit:"U/L", bySex:{ male:{ referenceMin:7, referenceMax:56, optimalMin:7, optimalMax:30 }, female:{ referenceMin:7, referenceMax:35, optimalMin:7, optimalMax:22 } } },
  { id:"ggt", name:"GGT", category:"organ", aliases:["ggt","gama-glutamiltransferase","gamma-gt","gama glutamil transferase","γ-gt"], unit:"U/L", bySex:{ male:{ referenceMin:8, referenceMax:61, optimalMin:8, optimalMax:30 }, female:{ referenceMin:5, referenceMax:36, optimalMin:5, optimalMax:20 } } },
  { id:"alp", name:"Fosfatase Alcalina", category:"organ", aliases:["fosfatase alcalina","fa","alkaline phosphatase","alp"], unit:"U/L", referenceMin:44, referenceMax:147, optimalMin:50, optimalMax:100 },
  { id:"bilirubin_total", name:"Bilirrubina Total", category:"organ", aliases:["bilirrubina total","total bilirubin","bt","bilirrubinas totais"], unit:"mg/dL", referenceMin:0.2, referenceMax:1.2, optimalMin:0.3, optimalMax:1.0 },
  { id:"bilirubin_direct", name:"Bilirrubina Direta", category:"organ", aliases:["bilirrubina direta","direct bilirubin","bd","bilirrubina conjugada"], unit:"mg/dL", referenceMin:0, referenceMax:0.3, optimalMin:0, optimalMax:0.2 },
  { id:"albumin", name:"Albumina", category:"organ", aliases:["albumina","albumin","albumina sérica"], unit:"g/dL", referenceMin:3.5, referenceMax:5.5, optimalMin:4.0, optimalMax:5.2 },
  { id:"total_protein", name:"Proteínas Totais", category:"organ", aliases:["proteínas totais","total protein","proteínas séricas"], unit:"g/dL", referenceMin:6.0, referenceMax:8.3, optimalMin:6.5, optimalMax:8.0 },
  { id:"urea", name:"Ureia", category:"organ", aliases:["ureia","urea","ureia sérica","nitrogenio ureico","bun"], unit:"mg/dL", referenceMin:15, referenceMax:45, optimalMin:18, optimalMax:38 },
  { id:"creatinine", name:"Creatinina", category:"organ", aliases:["creatinina","creatinine","creatinina sérica"], unit:"mg/dL", bySex:{ male:{ referenceMin:0.7, referenceMax:1.2, optimalMin:0.8, optimalMax:1.1 }, female:{ referenceMin:0.5, referenceMax:0.9, optimalMin:0.6, optimalMax:0.9 } } },
  { id:"egfr", name:"TFG Estimada (CKD-EPI)", category:"organ", aliases:["tfg","taxa de filtração glomerular","egfr","ckd-epi","mdrd","filtração glomerular"], unit:"mL/min/1.73m²", referenceMin:60, referenceMax:999, optimalMin:90, optimalMax:999 },
  { id:"cystatin_c", name:"Cistatina C", category:"organ", aliases:["cistatina c","cystatin c","cistatina-c"], unit:"mg/L", referenceMin:0.5, referenceMax:1.0, optimalMin:0.5, optimalMax:0.85 },
  { id:"sodium", name:"Sódio", category:"organ", aliases:["sódio","sodium","na","natremia"], unit:"mEq/L", referenceMin:136, referenceMax:145, optimalMin:138, optimalMax:143 },
  { id:"potassium", name:"Potássio", category:"organ", aliases:["potássio","potassium","k","potassemia"], unit:"mEq/L", referenceMin:3.5, referenceMax:5.0, optimalMin:4.0, optimalMax:4.8 },
  { id:"ldh", name:"LDH", category:"organ", aliases:["ldh","desidrogenase lática","lactate dehydrogenase","dhl"], unit:"U/L", referenceMin:120, referenceMax:246, optimalMin:130, optimalMax:200 },
  { id:"lipase", name:"Lipase", category:"organ", aliases:["lipase","lipase sérica","lipase pancreática"], unit:"U/L", referenceMin:7, referenceMax:60, optimalMin:10, optimalMax:50 },
  { id:"amylase", name:"Amilase", category:"organ", aliases:["amilase","amylase","amilase sérica"], unit:"U/L", referenceMin:25, referenceMax:125, optimalMin:30, optimalMax:100 },
  // ── ENVELHECIMENTO & LONGEVIDADE
  { id:"coq10", name:"Coenzima Q10", category:"aging", aliases:["coenzima q10","coq10","ubiquinol","ubiquinona","coenzyme q10"], unit:"µg/mL", referenceMin:0.4, referenceMax:1.9, optimalMin:1.0, optimalMax:1.8 },
  { id:"glutathione", name:"Glutationa (GSH)", category:"aging", aliases:["glutationa","glutathione","gsh","glutationa reduzida"], unit:"µmol/L", referenceMin:500, referenceMax:1500, optimalMin:900, optimalMax:1500 },
  { id:"nad_plus", name:"NAD+", category:"aging", aliases:["nad+","nad","nicotinamida adenina dinucleotídeo"], unit:"µmol/L", referenceMin:20, referenceMax:80, optimalMin:40, optimalMax:80 },
  // ── URINA
  { id:"urine_protein", name:"Proteína na Urina", category:"urine", aliases:["proteína na urina","proteinúria","urine protein","microalbuminúria","albumina urinária"], unit:"mg/dL", referenceMin:0, referenceMax:20, optimalMin:0, optimalMax:10 },
  { id:"microalbumin_creatinine", name:"Relação Albumina/Creatinina Urinária", category:"urine", aliases:["relação albumina/creatinina","albumina/creatinina","acr","microalbuminúria/creatinina"], unit:"mg/g", referenceMin:0, referenceMax:30, optimalMin:0, optimalMax:15 },
  { id:"urine_glucose", name:"Glicose na Urina", category:"urine", aliases:["glicose na urina","glicosúria","urine glucose"], unit:"mg/dL", referenceMin:0, referenceMax:15, optimalMin:0, optimalMax:0 },
];

Use a tool extract_biomarkers para retornar os dados estruturados.`;

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
          { role: "system", content: SYSTEM_PROMPT },
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
                  lab: { type: "string", description: "Nome do laboratório identificado no laudo" },
                  patientName: { type: "string", description: "Nome do paciente se disponível" },
                  examDate: { type: "string", description: "Data do exame se disponível (DD/MM/AAAA)" },
                  biomarkers: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", description: "ID padronizado do registry (ex: glucose, hba1c)" },
                        name: { type: "string", description: "Nome normalizado do biomarcador" },
                        value: { type: "number", description: "Valor numérico do resultado" },
                        unit: { type: "string", description: "Unidade de medida" },
                        referenceMin: { type: "number", description: "Valor mínimo de referência" },
                        referenceMax: { type: "number", description: "Valor máximo de referência" },
                        optimalMin: { type: "number", description: "Valor mínimo ótimo para longevidade" },
                        optimalMax: { type: "number", description: "Valor máximo ótimo para longevidade" },
                        status_clinical: {
                          type: "string",
                          enum: ["Alto", "Baixo", "Normal"],
                          description: "Classificação comparada à faixa de referência",
                        },
                        status_optimal: {
                          type: "string",
                          enum: ["Otimizado", "Atenção", "Alerta"],
                          description: "Classificação comparada à faixa ótima",
                        },
                        what_is: { type: "string", description: "Explicação acessível com analogia sobre o que é este biomarcador (2-3 frases)" },
                        why_matters: { type: "string", description: "Por que este resultado importa para a saúde, com analogia (2-3 frases)" },
                        what_to_do: {
                          type: "array",
                          items: { type: "string" },
                          description: "Lista de 2-4 ações práticas que a pessoa pode tomar",
                        },
                      },
                      required: ["id", "name", "value", "unit", "referenceMin", "referenceMax", "optimalMin", "optimalMax", "status_clinical", "status_optimal", "what_is", "why_matters", "what_to_do"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["biomarkers"],
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

    const parsed = JSON.parse(toolCall.function.arguments);
    // Support both old format (markers) and new format (biomarkers)
    const markers = parsed.biomarkers || parsed.markers || [];

    // Save exam record
    const { data: examData, error: examError } = await supabase
      .from("exams")
      .insert({
        user_id: userId,
        lab_name: parsed.lab || lab_name || "Laboratório",
        biomarkers: markers.map((m: any) => ({
          id: m.id,
          name: m.name,
          value: m.value,
          unit: m.unit,
          status: m.status_clinical === "Normal" ? "green" : m.status_clinical === "Alto" ? "red" : "yellow",
          status_optimal: m.status_optimal,
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
        marker_id: m.id || null,
        value: m.value,
        unit: m.unit,
        reference_min: m.referenceMin ?? m.reference_min ?? null,
        reference_max: m.referenceMax ?? m.reference_max ?? null,
        optimal_min: m.optimalMin ?? null,
        optimal_max: m.optimalMax ?? null,
        status: m.status_clinical || m.status || null,
        what_is: m.what_is ?? null,
        why_matters: m.why_matters ?? null,
        what_to_do: m.what_to_do ?? null,
      }));

      const { error: markersError } = await supabase
        .from("health_markers")
        .insert(markersToInsert);

      if (markersError) {
        console.error("Markers insert error:", markersError);
      }
    }

    // Return markers in old format for ExamResultCards compatibility
    const responseMarkers = markers.map((m: any) => ({
      name: m.name,
      value: m.value,
      unit: m.unit,
      reference_min: m.referenceMin ?? m.reference_min,
      reference_max: m.referenceMax ?? m.reference_max,
      status: m.status_clinical || m.status,
    }));

    return new Response(JSON.stringify({ markers: responseMarkers, exam_id: examData?.id }), {
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
