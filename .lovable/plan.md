

## Plano: Upload de Exames com Análise por IA (Gemini via Lovable AI)

### Ponto importante sobre a API Key

Seu projeto ja possui o **Lovable AI** configurado, que inclui acesso nativo aos modelos Google Gemini (incluindo `google/gemini-2.5-flash` com suporte a imagens e PDFs). A chave `LOVABLE_API_KEY` ja esta disponivel como secret. **Nao e necessario configurar uma GEMINI_API_KEY separada** -- vou usar o gateway do Lovable AI que ja esta pronto.

---

### 1. Banco de Dados -- Nova tabela `health_markers`

Criar via migration:

```sql
CREATE TABLE health_markers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  marker_name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  reference_min NUMERIC,
  reference_max NUMERIC,
  status TEXT CHECK (status IN ('Alto', 'Baixo', 'Normal')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE health_markers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own markers"
  ON health_markers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own markers"
  ON health_markers FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### 2. Edge Function -- `analyze-exam-gemini`

**Arquivo:** `supabase/functions/analyze-exam-gemini/index.ts`

Fluxo:
1. Recebe arquivo (base64) + tipo MIME + user_id via POST
2. Envia ao Lovable AI Gateway (`https://ai.gateway.lovable.dev/v1/chat/completions`) usando `google/gemini-2.5-flash` (suporte nativo a imagens/PDFs)
3. Prompt instrui o modelo a atuar como especialista em analises clinicas
4. Usa **tool calling** para extrair JSON estruturado (marcador, valor, unidade, referencia, status)
5. Salva cada marcador na tabela `health_markers` e um registro na tabela `exams`
6. Retorna os resultados ao frontend

**Prompt do Gemini:**
```
Voce e um especialista em analises clinicas laboratoriais.
Analise este exame de sangue e extraia TODOS os biomarcadores encontrados.
Para cada marcador, normalize o nome, identifique o valor numerico,
a unidade, os valores de referencia (min e max) e classifique como
'Alto', 'Baixo' ou 'Normal' comparando com a faixa de referencia.
```

**Tool calling schema** para resposta estruturada:
```json
{
  "name": "extract_biomarkers",
  "parameters": {
    "markers": [{
      "name": "string",
      "value": "number",
      "unit": "string",
      "reference_min": "number",
      "reference_max": "number",
      "status": "Alto | Baixo | Normal"
    }]
  }
}
```

### 3. Frontend -- Pagina de Upload reformulada

**Arquivo:** `src/pages/Upload.tsx`

Alteracoes:
- Aceitar `.pdf`, `.jpg`, `.jpeg`, `.png` (alem de PDF, agora imagens)
- Ao selecionar arquivo, converter para base64
- Chamar a edge function `analyze-exam-gemini` via `supabase.functions.invoke()`
- Exibir spinner animado com mensagem "Gemini esta analisando seu exame..."
- Tratar erros (429 rate limit, 402 creditos, falha generica)

**Estado de sucesso -- Cards de resultado:**
- Exibir numero total de marcadores encontrados
- Grid de cards elegantes (estilo Function Health) com:
  - Nome do marcador
  - Valor + unidade
  - Badge colorido: Verde (Normal), Amarelo (Atenção), Vermelho (Alto/Baixo)
  - Faixa de referencia em texto discreto
- Botao "Ver no Dashboard" e "Enviar outro exame"

### 4. Componente de resultado -- `ExamResultCards`

**Arquivo:** `src/components/upload/ExamResultCards.tsx`

Componente que recebe o array de marcadores extraidos e renderiza cards com:
- Icone de status (checkmark verde, warning amarelo, alert vermelho)
- Nome normalizado do biomarcador
- Valor em destaque com unidade
- Barra visual indicando posicao na faixa de referencia
- Animacao `fadeIn` escalonada nos cards

### 5. Config -- `supabase/config.toml`

Adicionar entrada para a nova edge function:
```toml
[functions.analyze-exam-gemini]
verify_jwt = false
```

### Resumo dos arquivos

| Acao | Arquivo |
|------|---------|
| Migration | `health_markers` table + RLS |
| Criar | `supabase/functions/analyze-exam-gemini/index.ts` |
| Criar | `src/components/upload/ExamResultCards.tsx` |
| Editar | `src/pages/Upload.tsx` |

### Modo demo

Para usuarios demo (`mock-1`), o upload continuara simulando resultados com `biomarkersData` sem chamar a edge function, mantendo compatibilidade.

