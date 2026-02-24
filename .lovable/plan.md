

## Plano: Gemini gerar "O que é", "Por que importa" e "O que fazer" para todos os biomarcadores

### Problema atual
Quando o Gemini analisa um exame, ele extrai apenas nome, valor, unidade, referência e status. As informações educativas ("O que é", "Por que importa", "O que fazer") vêm de uma lista estática com apenas 10 biomarcadores pré-definidos. Qualquer biomarcador fora dessa lista fica sem explicações no painel de insights.

### Solução
Fazer o Gemini gerar essas 3 informações educativas para **cada** biomarcador extraído, usando linguagem simples com analogias. Salvar no banco de dados e exibir no dashboard.

---

### Mudanças necessárias

**1. Migração de banco de dados** — Adicionar 3 colunas à tabela `health_markers`:
- `what_is` (text, nullable)
- `why_matters` (text, nullable)
- `what_to_do` (text[], nullable)

**2. Edge function `analyze-exam-gemini/index.ts`** — Duas alterações:
- Atualizar o **prompt do sistema** para instruir o Gemini a gerar, para cada biomarcador, explicações em linguagem acessível usando analogias do dia a dia (ex: "A ferritina é como o estoque de combustível do seu corpo...")
- Adicionar os campos `what_is`, `why_matters` e `what_to_do` (array de strings) na **tool definition** do `extract_biomarkers`
- Salvar esses campos ao inserir na tabela `health_markers`

**3. Hook `useHealthMarkers.ts`** — Usar os dados do banco em vez da lista estática:
- Ler `what_is`, `why_matters`, `what_to_do` das colunas do banco
- Usar fallback para a lista estática apenas se os campos do banco estiverem vazios

**4. Nenhuma mudança no `InsightPanel`** — Ele já consome `whatIs`, `whyMatters` e `whatToDo` do tipo `Biomarker`, então funcionará automaticamente.

---

### Detalhes técnicos

**Prompt atualizado (trecho):**
```
Para cada biomarcador, além dos dados numéricos, gere:
- what_is: Explique O QUE É esse biomarcador usando uma analogia simples. Linguagem que qualquer pessoa entenda, como se explicasse para um amigo. (2-3 frases)
- why_matters: Explique POR QUE esse biomarcador IMPORTA para a saúde da pessoa, com base no valor encontrado. Use analogias. (2-3 frases)  
- what_to_do: Lista de 2-4 ações práticas que a pessoa pode tomar. Linguagem direta e acessível.
```

**SQL da migração:**
```sql
ALTER TABLE health_markers
  ADD COLUMN what_is text,
  ADD COLUMN why_matters text,
  ADD COLUMN what_to_do text[];
```

