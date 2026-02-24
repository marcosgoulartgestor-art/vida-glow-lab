

# 📋 Plano Geral — Bio Track Brasil MVP

## Visão Geral
Plataforma web de longevidade que transforma exames de sangue em um painel interativo de saúde. O usuário visualiza biomarcadores em "Zonas de Otimização" e recebe insights mockados em português.

A implementação será feita **etapa por etapa**, conforme os prompts do usuário.

---

## Etapas Previstas

### 1. 🔐 Autenticação e Perfil
- Login e cadastro com e-mail/senha via Supabase Auth
- Tabela `profiles` com nome e dados básicos, criada automaticamente no cadastro
- Design limpo com identidade visual "Bio Track Brasil"
- Redirecionamento pós-login para o Dashboard

### 2. 🧭 Layout e Navegação
- Sidebar de navegação com os itens: Dashboard, Enviar Exame, Histórico (em breve), Configurações (em breve), Perfil/Logout
- Layout responsivo com sidebar colapsável
- Ícones Lucide para cada item

### 3. 📊 Dashboard — "Meu Painel de Saúde"
- Header com nome do usuário, data do último exame e **BioScore** (0–100)
- Cards de categoria em grade: Hormonal, Metabólico, Nutricional, Cardíaco, Inflamatório
- Lista de biomarcadores por categoria com:
  - Nome em PT-BR, valor com unidade
  - Barra de gradiente com 3 zonas (🔴 Alerta / 🟡 Normal / 🟢 Otimizado)
  - Badge de status
- Dados mock pré-definidos (Vitamina D, Glicose, Testosterona, PCR, Colesterol LDL, Ferritina)

### 4. 🤖 Painel de IA Insight (Sidebar Direita)
- Abre ao clicar em um biomarcador
- Exibe: descrição do marcador, significado para longevidade, sugestão de ação
- Aviso: "Consulte seu médico para decisões clínicas"
- Textos estáticos/mockados por marcador (sem integração com IA real)

### 5. 📤 Página de Upload de Exame
- Área de Drag & Drop para PDF
- Animação de "processando exame..." com loading
- Redirecionamento para o Dashboard com dados mockados
- Sem parsing real de PDF no MVP

### 6. 📄 Páginas Placeholder
- Histórico: tela com mensagem "Em breve"
- Configurações: tela com mensagem "Em breve"

---

## Design e UX
- Identidade visual clean e moderna, inspirada no Function Health
- Paleta de cores com tons de verde/azul (saúde e longevidade)
- Todo o conteúdo em português brasileiro
- Interface responsiva

## Tecnologias
- React + Vite + Tailwind CSS + Shadcn/UI
- Lucide-react para ícones
- Supabase para Auth + Database (tabela profiles)
- Recharts para visualizações de dados
- Dados mockados para biomarcadores e insights

