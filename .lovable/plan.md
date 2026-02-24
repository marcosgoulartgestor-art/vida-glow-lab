

## Plano: Dados em Branco para Novos Usuarios + Guia de Onboarding + Navegacao 100%

### Problema Atual

1. **Dados ficticios para usuarios reais**: Quando um novo usuario se cadastra e nao tem exames, os hooks `useHealthMarkers` e `useExamHistory` carregam dados mock (`biomarkersData` e `examHistory`). Isso confunde o usuario.

2. **Sidebar com BioScore fixo em 72**: O componente `Sidebar.tsx` tem o valor hardcoded `72` para todos os usuarios.

3. **Sem onboarding**: Nao existe nenhum guia para orientar novos usuarios sobre como usar o app.

4. **Navegacao**: Garantir que todos os botoes e links redirecionam corretamente em todas as paginas.

---

### Mudancas Planejadas

#### 1. Remover dados ficticios para usuarios reais

**Arquivos**: `src/hooks/useHealthMarkers.ts`, `src/hooks/useExamHistory.ts`

- Quando `user.id !== 'mock-1'` e nao houver dados no banco, retornar arrays vazios (`[]`) em vez dos dados mock
- Manter os dados mock APENAS para o usuario demo (`mock-1`)
- Ajustar `hasRealData` para refletir corretamente

#### 2. Empty states com CTA em todas as paginas

**Arquivos**: `src/pages/Dashboard.tsx`, `src/pages/Historico.tsx`

- Dashboard: quando `biomarkers.length === 0` e nao e demo, mostrar empty state com icone, mensagem explicativa e botao "Enviar Primeiro Exame"
- Historico: ja tem empty state mas precisa garantir que nao carrega mock para usuarios reais

#### 3. Sidebar com BioScore dinamico

**Arquivo**: `src/components/layout/Sidebar.tsx`

- Remover o valor fixo `72`
- Usar os dados reais do usuario ou mostrar `--` quando nao houver dados

#### 4. Guia de Onboarding para novos usuarios

**Novo arquivo**: `src/components/onboarding/OnboardingGuide.tsx`

Criar um componente de guia passo-a-passo que aparece para novos usuarios (sem exames). O guia tera 4 passos:

1. **Bem-vindo** - Explicacao do app e o que ele faz
2. **Enviar Exame** - Como enviar seu primeiro exame de sangue (PDF/foto)
3. **Dashboard** - Como interpretar o painel com BioScore e biomarcadores
4. **Historico** - Como acompanhar sua evolucao ao longo do tempo

O guia sera um modal/dialog com navegacao entre steps, com ilustracoes usando icones do Lucide. Aparece automaticamente no Dashboard quando o usuario nao tem dados.

**Integracao**: Adicionar ao `Dashboard.tsx` - exibir quando `!hasRealData && user?.id !== 'mock-1'`

#### 5. Navegacao 100% funcional

**Revisoes em**:
- `src/components/layout/Sidebar.tsx` - todos os links ja usam `<Link>` correto
- `src/components/layout/AppLayout.tsx` - bottom nav ja funciona
- `src/pages/Dashboard.tsx` - botao "Enviar exame" usa `navigate('/upload')`
- `src/pages/Historico.tsx` - botoes "Enviar Exame" e "Novo Exame" usam `navigate('/upload')`
- `src/pages/Upload.tsx` - botao "Ver Dashboard" apos sucesso usa `navigate('/dashboard')`

Verificar e corrigir qualquer link quebrado ou botao sem acao.

---

### Detalhes Tecnicos

```text
Fluxo do novo usuario:
  Cadastro → Login → Dashboard (vazio + Guia Onboarding)
                         ↓
                    Guia Step 1: "Bem-vindo ao Bio Track Brasil"
                    Guia Step 2: "Envie seu exame" → botao vai para /upload
                    Guia Step 3: "Seu painel de saude"
                    Guia Step 4: "Acompanhe sua evolucao"
                         ↓
                    Usuario fecha guia → ve empty state com CTA
```

**Arquivos criados**: 1 (OnboardingGuide.tsx)
**Arquivos modificados**: 5 (useHealthMarkers.ts, useExamHistory.ts, Dashboard.tsx, Historico.tsx, Sidebar.tsx)

