

## Plano: Atualizar System Prompt e Garantir Exibição de Todos os Biomarcadores

### 1. Migração de banco de dados
Adicionar 3 novas colunas na tabela `health_markers`:
- `optimal_min` (numeric, nullable) — faixa ótima mínima vinda do registry
- `optimal_max` (numeric, nullable) — faixa ótima máxima vinda do registry  
- `marker_id` (text, nullable) — id padronizado do registry (ex: "glucose", "hba1c")

### 2. Atualizar Edge Function (`supabase/functions/analyze-exam-gemini/index.ts`)
- Substituir o system prompt inteiro pelo novo fornecido (com BIOMARKER_REGISTRY completo)
- Atualizar o schema da tool `extract_biomarkers` para incluir os novos campos: `id`, `status_clinical`, `status_optimal`, `optimalMin`, `optimalMax`, `lab`, `patientName`, `examDate`
- Atualizar a lógica de inserção no banco para salvar `optimal_min`, `optimal_max`, `marker_id` e mapear `status_clinical` para o campo `status` existente

### 3. Expandir tipos (`src/types/biomarker.ts`)
- Adicionar novas categorias ao `BiomarkerCategory`: `'blood'`, `'organ'`, `'urine'`

### 4. Atualizar `useHealthMarkers` (`src/hooks/useHealthMarkers.ts`)
- Expandir `mapToCategory` com regexes para as novas categorias (blood: hemoglobina, hematócrito, plaquetas, leucócitos etc.; organ: ast, alt, ggt, creatinina, ureia etc.; urine: proteína na urina etc.)
- Usar `optimal_min`/`optimal_max` do banco quando disponíveis (em vez de calcular com range*0.2)
- Atualizar `DbMarker` interface com os novos campos

### 5. Atualizar Dashboard (`src/pages/Dashboard.tsx`)
- Adicionar as 3 novas categorias ao `categoryConfig`: Sangue (🩸), Órgãos (🫀), Urina (💧)

### 6. Atualizar `BiomarkerTable` (`src/components/dashboard/BiomarkerTable.tsx`)
- Adicionar as novas categorias ao `categoryMap`

### 7. Atualizar `InsightPanel` (`src/components/dashboard/InsightPanel.tsx`)
- Adicionar emojis para as novas categorias no `categoryEmoji`

