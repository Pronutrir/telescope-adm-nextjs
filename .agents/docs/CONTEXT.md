# 🔭 Telescope ADM - Contexto Completo da Arquitetura

## 🏗️ STACK TECNOLÓGICA

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Next.js | 15+ | Framework (App Router) |
| React | 19 | UI Library |
| TypeScript | 5+ | Linguagem |
| Tailwind CSS | 3+ | Estilização |
| Axios | 1+ | HTTP Client |
| React Query | 5+ (@tanstack) | Cache e estado servidor |
| Formik + Yup | - | Formulários e validação |
| Lucide React | - | Ícones |
| Framer Motion | - | Animações |
| Jest + RTL | 29+ | Testes unitários |
| Redis (ioredis) | - | Cache e sessões |
| SignalR | - | WebSocket/real-time |

---

## 📁 ESTRUTURA COMPLETA DO PROJETO

```
telescope-adm-nextjs/
├── .github/
│   └── copilot-instructions.md   # Regras para o Copilot
├── .vscode/
│   ├── settings.json             # Configurações do editor
│   └── prompts/                  # Prompts reutilizáveis
├── src/
│   ├── app/                      # App Router (Next.js 15)
│   │   ├── auth/                 # Rotas de autenticação
│   │   │   ├── server-login/     # Página de login principal
│   │   │   ├── recovery/         # Recuperação de senha
│   │   │   ├── alterar-senha/    # Alteração obrigatória de senha
│   │   │   └── no-access/        # Acesso negado
│   │   ├── admin/                # Área administrativa protegida
│   │   │   ├── layout.tsx        # Layout admin (usa AdminAuthGuard)
│   │   │   ├── page.tsx          # Dashboard principal
│   │   │   ├── loading.tsx       # Suspense automático
│   │   │   ├── error.tsx         # Error Boundary automático
│   │   │   ├── usuarios/         # Gestão de usuários
│   │   │   ├── gerenciador-pdfs/ # Gerenciador de PDFs
│   │   │   ├── powerbi/          # Relatórios PowerBI
│   │   │   ├── evolucao-paciente/ # Evolução de paciente
│   │   │   ├── profile/           # Perfil do usuário
│   │   │   ├── dashboard/        # Dashboard principal
│   │   │   ├── nps/              # NPS Pesquisa de Satisfação
│   │   │   │   ├── page.tsx      # Redirect → /admin/nps/consultas
│   │   │   │   └── consultas/
│   │   │   │       └── page.tsx  # Página NPS Consultas (Server Component)
│   │   │   └── biblioteca-componentes/ # Biblioteca de exemplos
│   │   ├── webhook-monitor/      # Monitor de webhooks
│   │   ├── api/                  # Route Handlers (Next.js API)
│   │   │   ├── auth/             # Autenticação
│   │   │   │   ├── session/      # POST: login (cria sessão Redis com JWT)
│   │   │   │   ├── me/           # GET: dados do usuário + token JWT da sessão
│   │   │   │   ├── logout/       # POST: encerra sessão
│   │   │   │   ├── login/        # POST: login alternativo
│   │   │   │   ├── refresh/      # POST: refresh de sessão
│   │   │   │   ├── user/         # GET: dados do usuário
│   │   │   │   ├── update-password/ # PUT: atualizar senha
│   │   │   │   └── update-home-page/ # PUT: página inicial preferida
│   │   │   ├── sharepoint/       # Integração SharePoint (PDFs)
│   │   │   │   ├── search/       # Busca
│   │   │   │   ├── pdfs/         # Listagem
│   │   │   │   ├── download/     # Download
│   │   │   │   ├── edit/         # Edição
│   │   │   │   ├── rename-pdf/   # Renomear
│   │   │   │   ├── status/       # Status
│   │   │   │   └── [...path]/    # Catch-all proxy
│   │   │   ├── tasy/             # API Tasy
│   │   │   │   ├── conta-paciente/
│   │   │   │   ├── conta-paciente-raw/
│   │   │   │   ├── enviar-pdf/
│   │   │   │   └── numero-guia/
│   │   │   ├── proxy/[...path]/  # Proxy catch-all
│   │   │   ├── pdf/              # Download de PDFs
│   │   │   ├── health/           # Health check
│   │   │   ├── initial-data/     # Dados iniciais
│   │   │   └── usershield/       # Proxy UserShield
│   │   ├── actions/              # Server Actions ('use server')
│   │   │   ├── tasy/             # Ações da API Tasy
│   │   │   │   ├── texto-padrao/  # Textos padrão
│   │   │   │   ├── evolucao-paciente/ # Evolução paciente (criar, actions)
│   │   │   │   └── pessoa-fisica/ # Busca pessoa física
│   │   │   ├── pdfs/             # Ações de PDFs (nas-status)
│   │   │   └── powerbi/          # Ações PowerBI (embed)
│   │   ├── globals.css
│   │   ├── layout.tsx            # Root Layout
│   │   ├── page.tsx              # Home (redirect por auth)
│   │   └── providers.tsx         # Client Providers (QueryClient, Auth, Theme, Layout)
│   ├── components/
│   │   ├── auth/                 # Componentes exclusivos das páginas de autenticação
│   │   │   ├── ServerLoginForm/  # Formulário de login
│   │   │   │   ├── index.ts
│   │   │   │   ├── ServerLoginForm.tsx
│   │   │   │   ├── ServerLoginForm.test.tsx
│   │   │   │   ├── useServerLoginForm.ts
│   │   │   │   ├── LoginBackground.tsx
│   │   │   │   ├── LoginFormFields.tsx
│   │   │   │   └── LoginHeader.tsx
│   │   │   ├── RecoveryForm/     # Formulário de recuperação de senha
│   │   │   │   ├── index.ts
│   │   │   │   ├── RecoveryForm.tsx
│   │   │   │   ├── RecoveryForm.test.tsx
│   │   │   │   ├── useRecoveryForm.ts
│   │   │   │   ├── RecoveryFormFields.tsx
│   │   │   │   └── PasswordRequirements.tsx
│   │   │   ├── AlterarSenhaForm/ # Alteração de senha obrigatória
│   │   │   │   ├── index.ts
│   │   │   │   ├── AlterarSenhaForm.tsx
│   │   │   │   ├── AlterarSenhaForm.test.tsx
│   │   │   │   ├── useAlterarSenhaForm.ts
│   │   │   │   ├── PasswordField.tsx
│   │   │   │   └── PasswordStrengthBar.tsx
│   │   │   ├── NoAccessPage/     # Página de acesso negado
│   │   │   │   ├── index.ts
│   │   │   │   ├── NoAccessPage.tsx
│   │   │   │   ├── NoAccessPage.test.tsx
│   │   │   │   └── useNoAccessPage.ts
│   │   │   └── Notification.tsx  # Notificação inline (usada nos forms de auth)
│   │   ├── admin/                # Componentes exclusivos da área admin
│   │   │   └── AdminAuthGuard/   # Guard de autenticação do layout admin
│   │   ├── layout/               # Componentes do layout principal
│   │   │   ├── MainLayout.tsx    # Wrapper que envolve todas as páginas
│   │   │   ├── Navbar.tsx        # Barra superior
│   │   │   ├── NavbarDropdown.tsx # Menu do usuário na navbar
│   │   │   ├── Sidebar.tsx       # Menu lateral
│   │   │   ├── useSidebar.ts     # Lógica do sidebar (rotas, menus, toggle)
│   │   │   ├── MenuVisibilityModal.tsx # Config de visibilidade dos menus
│   │   │   ├── PageWrapper.tsx   # Wrapper de página
│   │   │   └── ClientOnly.tsx    # Renderização client-only
│   │   ├── dashboard/            # Componentes da área de dashboard (~10 arquivos)
│   │   │   ├── DashboardPage.tsx     # Página principal do dashboard
│   │   │   ├── useDashboard.ts       # Hook de lógica do dashboard
│   │   │   ├── DashboardHeader.tsx   # Header do dashboard
│   │   │   ├── DashboardControls.tsx # Controles do dashboard
│   │   │   ├── MetricasSection.tsx   # Seção de métricas
│   │   │   ├── StatusSection.tsx     # Seção de status
│   │   │   ├── QuickActionsSection.tsx # Seção de ações rápidas
│   │   │   ├── TrafficMetricsSection.tsx # Seção de métricas de tráfego
│   │   │   ├── LineChart.tsx          # Gráfico de linha
│   │   │   └── TrafficTable.tsx       # Tabela de tráfego
│   │   ├── usuarios/             # Componentes da gestão de usuários
│   │   │   ├── index.ts
│   │   │   ├── UsuarioCard.tsx
│   │   │   ├── UsuariosHeader.tsx
│   │   │   ├── UsuariosList.tsx
│   │   │   ├── UsuariosModais.tsx
│   │   │   ├── UsuariosToolbar.tsx
│   │   │   ├── useUsuariosPage.ts
│   │   │   ├── AddUserModal.tsx
│   │   │   ├── EditUserModal.tsx
│   │   │   ├── DeleteUserModal.tsx
│   │   │   └── ResetPasswordModal.tsx
│   │   ├── pdf/                  # Componentes do gerenciador de PDFs (~32 arquivos)
│   │   │   ├── index.ts              # Export central
│   │   │   ├── GerenciadorPDFsClient.tsx # Orquestrador 'use client'
│   │   │   ├── useGerenciadorPDFs.ts # Hook principal (state, queries, PDFs)
│   │   │   ├── PDFPageHeader.tsx     # Header da página de PDFs
│   │   │   ├── PDFSearchToolbar.tsx  # Toolbar de busca
│   │   │   ├── PDFContentArea.tsx    # Área de conteúdo principal
│   │   │   ├── PDFSelectionPanel.tsx # Painel de seleção
│   │   │   ├── PDFCard.tsx           # Card de PDF individual
│   │   │   ├── PDFSortableCard.tsx   # Card sortável
│   │   │   ├── TelescopePDFCard.tsx  # Card PDF estilo Telescope
│   │   │   ├── SortablePDFGrid.tsx   # Grid sortável
│   │   │   ├── SortablePDFList.tsx   # Lista sortável
│   │   │   ├── SortableTelescopePDFList.tsx # Lista Telescope sortável
│   │   │   ├── SortablePdfCards.tsx  # Cards sortáveis (legado)
│   │   │   ├── PDFEditModal.tsx      # Modal de edição
│   │   │   ├── PDFMergeModal.tsx     # Modal de merge
│   │   │   ├── PDFViewerModal.tsx    # Modal de visualização
│   │   │   ├── MergeProgressBanner.tsx # Banner progresso merge
│   │   │   ├── EditPageGrid.tsx      # Grid de edição de páginas
│   │   │   ├── InlinePDFViewer.tsx   # Viewer inline
│   │   │   ├── AutocompletePessoa.tsx # Autocomplete de paciente
│   │   │   ├── SearchPDF.tsx         # Busca de PDFs
│   │   │   ├── UploadZone.tsx        # Zona de upload
│   │   │   ├── usePDFEdit.ts         # Hook de edição
│   │   │   ├── usePDFMerge.ts        # Hook de merge
│   │   │   └── usePDFSelection.ts    # Hook de seleção
│   │   ├── powerbi/              # Componentes de relatórios PowerBI
│   │   │   └── PowerBIReport.tsx
│   │   ├── evolucao-paciente/    # Componentes da evolução de paciente
│   │   │   └── NovaEvolucaoModal.tsx
│   │   ├── webhook-monitor/      # Componentes do monitor de webhooks
│   │   │   └── ConnectionStatus.tsx
│   │   ├── notifications/        # Sistema de notificações
│   │   │   ├── NotificationContainer.tsx
│   │   │   └── index.ts
│   │   ├── library/              # Componentes da biblioteca de exemplos (~13 arquivos)
│   │   │   ├── BibliotecaComponentesPage.tsx # Página principal
│   │   │   ├── useBibliotecaComponentes.ts # Hook de lógica
│   │   │   ├── ComponentLibrary.tsx  # Grid de componentes
│   │   │   ├── Button.tsx            # Exemplo de botão
│   │   │   ├── ContextInfoSection.tsx # Seção info de contextos
│   │   │   ├── ModalExamplesSection.tsx # Seção exemplos de modal
│   │   │   ├── ProgressStatSection.tsx # Seção progress stat
│   │   │   ├── SortableProgressSection.tsx # Seção sortable progress
│   │   │   ├── StatsCardSection.tsx  # Seção stats card
│   │   │   ├── TelescopePDFSection.tsx # Seção PDF Telescope
│   │   │   ├── SortableProgressStats.tsx # Componente sortável
│   │   │   ├── ProgressStat.tsx      # Componente progress stat
│   │   │   └── DropdownTest.tsx      # Teste de dropdown
│   │   ├── analytics/            # Google Analytics
│   │   │   └── GoogleAnalyticsLoader.tsx
│   │   ├── nps/                  # Componentes de NPS Consultas (~27 arquivos)
│   │   │   ├── npsHelpers.ts             # Constantes (UNIDADES, CLASSIFICATION_MAP) + render helpers
│   │   │   ├── NpsCard/                  # Compound component (6 arquivos)
│   │   │   │   ├── index.ts
│   │   │   │   ├── NpsCardRoot.tsx       # ⚠️ prop themeColor depreciado — usa dark: Tailwind nativo
│   │   │   │   ├── NpsCardIcon.tsx
│   │   │   │   ├── NpsCardTotalText.tsx
│   │   │   │   ├── NpsCardLegend.tsx
│   │   │   │   └── NpsCardWrapper.tsx
│   │   │   ├── NpsTable/                 # Tabela genérica NPS (6 arquivos)
│   │   │   │   ├── index.ts
│   │   │   │   ├── NpsTable.tsx
│   │   │   │   ├── NpsTableHeader.tsx
│   │   │   │   ├── NpsTableBody.tsx
│   │   │   │   ├── NpsTableFooter.tsx
│   │   │   │   └── useNpsTable.ts
│   │   │   ├── NpsFilterMenu.tsx         # Filtro avançado com sub-menus
│   │   │   ├── SubclassificationFilter.tsx # Filtro 13 subclassificações
│   │   │   ├── useCustomMessageModal.ts  # Hook modal mensagem/classificação
│   │   │   ├── CustomMessageModal.tsx    # Modal 3 modos (24h, 72h, classificação)
│   │   │   ├── useAnswersList.ts         # Hook listagem (state, queries, mutations)
│   │   │   ├── useAnswersListColumns.tsx # Definição de 20 colunas
│   │   │   ├── AnswersListCards.tsx      # 5 cards resumo
│   │   │   ├── AnswersList.tsx           # Orquestrador aba Listagem
│   │   │   ├── useAnswersDashboard.ts    # Hook dashboard (Formik, queries, export)
│   │   │   ├── DashboardCards.tsx        # 8 cards métricas
│   │   │   ├── SubclassificationGrid.tsx # Grid 13 ícones subclassificação
│   │   │   ├── AnswersDashboard.tsx      # Orquestrador aba Dashboard
│   │   │   └── AbasAnswers.tsx           # Navegação de abas (Listagem + Dashboard)
│   │   ├── profile/              # Componentes de perfil do usuário
│   │   │   ├── index.ts          # Export central
│   │   │   ├── ProfilePageClient.tsx  # Orquestrador 'use client'
│   │   │   ├── useProfilePage.ts      # Hook de lógica da página (abas, activities)
│   │   │   ├── ProfileTabs.tsx        # Navegação por abas
│   │   │   ├── UserProfileForm.tsx    # Formulário de edição do perfil
│   │   │   ├── useProfileForm.ts      # Hook Formik + Yup do formulário
│   │   │   ├── ProfileFormNotification.tsx # Banner de notificação do form
│   │   │   ├── UserInfoSection.tsx    # Seção de dados pessoais (8 campos)
│   │   │   ├── ContactSection.tsx     # Seção de contato (6 campos)
│   │   │   ├── UserPermissionsCard.tsx # Card de permissões do usuário
│   │   │   ├── PermissionCard.tsx     # Card individual de permissão
│   │   │   ├── PermissionsModal.tsx   # Modal com lista completa de permissões
│   │   │   ├── UserSecuritySettings.tsx # Configurações de segurança
│   │   │   ├── useSecurityForm.ts     # Hook Formik + Yup de segurança
│   │   │   ├── PasswordField.tsx      # Input de senha com toggle show/hide
│   │   │   ├── PasswordStrengthBar.tsx # Barra de força da senha
│   │   │   ├── PasswordRequirements.tsx # Lista de requisitos de senha
│   │   │   ├── UserInfoCard.tsx       # Card resumo do usuário
│   │   │   ├── ProfileInfoRow.tsx     # Linha label:valor reutilizável
│   │   │   ├── UserAvatarUpload.tsx   # Upload de avatar
│   │   │   ├── useAvatarUpload.ts     # Hook de upload (initials, file handlers)
│   │   │   ├── AvatarPreview.tsx      # Preview circular com overlay
│   │   │   ├── HomePageSelector.tsx   # Seletor de página inicial
│   │   │   ├── useHomePageSelector.ts # Hook do seletor (save, load, routes)
│   │   │   ├── UserActivityLog.tsx    # Log de atividades do usuário
│   │   │   └── UserProfileHeader.tsx  # Header do perfil
│   │   ├── debug/                # Componentes de depuração (somente dev)
│   │   │   └── ThemeDebug.tsx
│   │   ├── examples/             # Galeria de exemplos interativos
│   │   │   ├── FlyonCardExamples.tsx
│   │   │   └── index.ts
│   │   └── ui/                   # SOMENTE primitivos genéricos reutilizáveis
│   │       ├── Button.tsx        # Botão com variantes (cva)
│   │       ├── Card.tsx          # Card genérico
│   │       ├── StatsCard.tsx     # Card de estatística genérico
│   │       ├── MetricCard.tsx    # Card de métrica
│   │       ├── Input.tsx         # Input genérico
│   │       ├── Modal.tsx         # Modal genérico
│   │       ├── Select.tsx        # Select com busca
│   │       ├── SelectSimple.tsx  # Select simples
│   │       ├── Textarea.tsx      # Textarea genérico
│   │       ├── Dropdown.tsx      # Dropdown genérico
│   │       ├── DropdownWithTitle.tsx # Dropdown com título de seção
│   │       ├── ConfirmDialog.tsx # Dialog de confirmação
│   │       ├── Container.tsx     # Container de layout genérico
│   │       ├── DivHeader.tsx     # Header de seção genérico
│   │       ├── Sidebar.tsx       # Sidebar genérico
│   │       ├── SidebarToggle.tsx # Toggle do sidebar
│   │       ├── ThemeToggle.tsx   # Toggle dark/light
│   │       ├── FlyonCard.tsx     # Card base FlyonUI
│   │       ├── FlyonSidebar.tsx  # Sidebar base FlyonUI
│   │       ├── Layout.tsx        # Grid de layout genérico
│   │       ├── RichTextEditor.tsx
│   │       ├── TelescopeLogo.tsx
│   │       └── index.ts          # Export central (somente primitivos genéricos)
│   ├── contexts/
│   │   ├── ThemeContext.tsx       # dark/light mode
│   │   ├── LayoutContext.tsx      # sidebar, mobile, search, notificações
│   │   ├── AuthContext.tsx        # autenticação do usuário
│   │   ├── NotificationContext.tsx # notificações in-app
│   │   ├── MenuVisibilityContext.tsx # visibilidade dos menus
│   │   ├── PDFContext.tsx         # estado do gerenciador de PDFs
│   │   └── TelescopeContext.tsx   # dados globais do sistema
│   ├── hooks/                    # Hooks compartilhados
│   │   ├── useConfirmDialog.ts
│   │   ├── useDashboardData.ts
│   │   ├── useDebounce.ts
│   │   ├── useGoogleAnalytics.ts
│   │   ├── useIsClient.ts
│   │   ├── usePacientes.ts
│   │   ├── usePDFManager.ts
│   │   ├── usePDFUpload.ts
│   │   ├── useThemeClasses.ts
│   │   ├── useTrafficMetrics.ts
│   │   ├── useUnifiedPDFs.ts
│   │   ├── useUserProfile.ts
│   │   └── useUserShield.ts
│   ├── services/                 # Chamadas API via Axios
│   │   ├── auth.ts               # ApiAuth — autenticação (interceptor 401 → redirect login)
│   │   ├── authHelpers.ts        # Helpers de autenticação (requireAuth, getSessionUser, etc.)
│   │   ├── cleanup.ts            # Limpeza de sessão/cleanup
│   │   ├── redis.ts              # Inicialização do Redis (cliente ioredis + mock para testes)
│   │   ├── session.ts            # SessionManager (Redis) — SessionData com token JWT
│   │   ├── token.ts              # tokenStorage — gerenciamento de tokens (cookies)
│   │   ├── userProfileService.ts # Operações de perfil de usuário
│   │   ├── userShieldService.ts  # Serviço UserShield (permissões)
│   │   ├── npsConsultaService.ts # NPS: 11 funções API (listagem, mensagens, classificação, dashboard)
│   │   ├── pdf/                  # Módulos de serviço PDF
│   │   └── pdfManager/           # Serviços gerenciamento de PDFs
│   ├── types/                    # Interfaces globais TypeScript
│   │   ├── auth.ts              # Tipos de autenticação (SessionData, UserData, etc.)
│   │   ├── nps.ts               # NPS: 20+ interfaces (IRating, IDashboardValues, TFilter, etc.)
│   │   ├── user.ts              # Tipos de usuário/perfil
│   │   ├── tasy.ts              # Tipos API Tasy
│   │   ├── layout.ts            # Tipos de layout
│   │   ├── pdf/                 # Tipos de PDF (diretório)
│   │   ├── gapi.ts              # Tipos Google API
│   │   ├── global.d.ts          # Declarações globais
│   │   ├── google-analytics.d.ts # Tipos GA
│   │   └── svg.d.ts             # Declarações SVG
│   ├── lib/
│   │   ├── utils.ts              # cn(), helpers
│   │   ├── api.ts                # Axios instances (Api, ApiNotify, axiosConfig) + token em memória (setApiToken/getApiToken)
│   │   ├── debug.ts              # Utilitários de debug
│   │   ├── logger.ts             # Serviço de logging
│   │   ├── theme-script.ts       # Script de injeção de tema
│   │   └── types.ts              # Tipos gerais
│   ├── utils/                    # Funções utilitárias
│   │   ├── responsive.ts        # Helpers de responsividade
│   │   └── routeUtils.ts        # Utilitários de rotas
│   └── config/
│       ├── env.ts
│       ├── routes.ts             # Definição de rotas e permissões
│       ├── environment.ts
│       ├── redis-environments.ts # Configurações de ambiente Redis
│       └── ga4/                  # Configuração Google Analytics 4
├── tests/
│   ├── unit/
│   ├── integration/
│   └── infrastructure/
├── .agents/                      # Documentação para agentes de IA
│   ├── docs/
│   │   ├── README.md             # Índice principal
│   │   ├── CONTEXT.md            # Este arquivo
│   │   ├── WORKFLOWS.md          # Workflows práticos
│   │   └── INSTRUCTIONS.md       # Instruções de codificação
│   └── skills/                   # Skills customizados
└── package.json
```

---

## 🔑 CONTEXTOS PRINCIPAIS

### ThemeContext
```tsx
// src/contexts/ThemeContext.tsx
// O que expõe:
const { theme, isDark, toggleTheme, setTheme } = useTheme()

// Tipos:
type Theme = 'light' | 'dark'

// Uso em Client Components:
isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
```

### LayoutContext
```tsx
// src/contexts/LayoutContext.tsx
// O que expõe:
const {
  // Sidebar
  sidebarOpen, sidebarCollapsed, toggleSidebar, collapseSidebar,
  // Mobile
  isMobile, mounted,
  // Search
  searchOpen, searchQuery, setSearchOpen, setSearchQuery, toggleSearch,
  // Notificações
  notificationsOpen, notificationsCount, toggleNotifications,
} = useLayout()

// Uso:
isMobile ? 'text-sm px-2' : 'text-base px-4'
```

> ⚠️ Sempre checar `mounted` antes de usar valores do LayoutContext para evitar hidration mismatch.

---

## 🧩 ANATOMIA DE UM COMPONENTE

> **Onde criar — regra de ouro:**
> - Componente exclusivo de páginas de auth? → `src/components/auth/NomeComponente/`
> - Componente exclusivo de uma área/página específica (dashboard, usuarios, pdf, powerbi…)? → `src/components/<nome-da-area>/NomeComponente/`
> - Componente primitivo/genérico usado em 3+ áreas diferentes? → `src/components/ui/NomeComponente/`
>
> **`components/ui/` é SOMENTE para primitivos sem domínio:** Button, Input, Select, Modal, Card, Dropdown, ThemeToggle, etc.  
> **Nunca colocar em `ui/`:** componentes que fazem sentido apenas em uma área específica do sistema.

```
# Exemplos de destino correto:
components/auth/ServerLoginForm/       ← exclusivo da página de login
components/admin/AdminAuthGuard/       ← exclusivo do layout admin
components/layout/NavbarDropdown/      ← exclusivo da Navbar
components/usuarios/UsuariosPage/      ← exclusivo da página de usuários
components/pdf/AutocompletePessoa/     ← exclusivo do gerenciador de PDFs
components/powerbi/PowerBIReport/      ← exclusivo da área de PowerBI
components/ui/Button/                  ← genérico: usado em todo o sistema
components/ui/Modal/                   ← genérico: modal reutilizável
```

### Estrutura de pasta (padrão para qualquer destino)
```
components/<area>/NomeComponente/
├── index.ts              → Export público (único ponto de entrada)
├── NomeComponente.tsx    → UI apenas (< 150 linhas)
├── NomeComponente.test.tsx → Testes unitários
└── useNomeComponente.ts  → Lógica, estados, handlers
```

### `index.ts` - Padrão
```ts
export { NomeComponente } from './NomeComponente'
export type { NomeComponenteProps } from './NomeComponente'
```

### `NomeComponente.tsx` - Client Component
```tsx
'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import { useNomeComponente } from './useNomeComponente'

export interface NomeComponenteProps {
  children?: React.ReactNode
  className?: string
}

export const NomeComponente: React.FC<NomeComponenteProps> = ({
  children,
  className,
}) => {
  const { isDark } = useTheme()
  const { isMobile } = useLayout()
  const { isOpen, handleToggle } = useNomeComponente()

  return (
    <div
      className={cn(
        'transition-colors',
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-black',
        isMobile && 'text-sm',
        className
      )}
    >
      {children}
    </div>
  )
}
```

### `useNomeComponente.ts` - Hook de Lógica
```ts
'use client'

import { useState, useCallback } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'

export const useNomeComponente = () => {
  const { isDark } = useTheme()
  const { isMobile } = useLayout()
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  return { isDark, isMobile, isOpen, handleToggle }
}
```

---

## 📡 CAMADA DE SERVIÇOS

### Instâncias Axios (src/lib/api.ts)
```ts
// 3 instâncias Axios com baseURLs diferentes:
// Api       → Tasy API (/apitasy/api/v1/)
// ApiNotify → Notify API (/notify/api/v1/)
// Ambos usam token em memória via setApiToken/getApiToken

import { Api, ApiNotify, setApiToken, getApiToken } from '@/lib/api'
```

### Padrão de serviço com instância Axios:
```ts
// src/services/telescopeAPI.ts - padrão do projeto
export const userService = {
  getAll: () => Api.get<User[]>('/users'),
  getById: (id: string) => Api.get<User>(`/users/${id}`),
  update: (id: string, data: Partial<User>) =>
    Api.put<User>(`/users/${id}`, data),
}
```

### Padrão de Error Handling em Service
```ts
export async function getUser(id: string) {
  try {
    const { data } = await api.get<User>(`/users/${id}`)
    return data
  } catch (error) {
    console.error('[getUser]', error)
    throw new Error('Falha ao buscar usuário')
  }
}
```

---

## 🌐 VARIÁVEIS DE AMBIENTE

```bash
# .env

# API Principal
NEXT_PUBLIC_API_URL=https://servicesapp.pronutrir.com.br

# API de PDFs - NAS
NEXT_PUBLIC_PDF_API_URL=http://20.65.208.119:5656/api/v1
PDF_API_URL=http://20.65.208.119:5656/api/v1

# URLs dos serviços
NEXT_PUBLIC_USERSHIELD_URL=https://servicesapp.pronutrir.com.br/usershield/api/
NEXT_PUBLIC_APITASY_URL=https://servicesapp.pronutrir.com.br/apitasy
NEXT_PUBLIC_NOTIFY_URL=https://servicesapp.pronutrir.com.br/notify/api/

# UserShield (apenas servidor)
USERSHIELD_USERNAME=           # Credenciais do UserShield
USERSHIELD_PASSWORD=           # Credenciais do UserShield

# Power BI (apenas servidor)
POWERBI_CLIENT_ID=
POWERBI_CLIENT_SECRET=
POWERBI_TENANT_ID=
POWERBI_WORKSPACE_ID=

# Google Analytics
NEXT_PUBLIC_GA_API_KEY=
NEXT_PUBLIC_GA_PROPERTY_ID=
NEXT_PUBLIC_GA_CLIENT_ID=

# Redis (apenas servidor)
REDIS_HOST=
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Session (apenas servidor)
SESSION_DURATION=14400         # 4 horas em segundos
SESSION_REFRESH_THRESHOLD=1800 # 30 minutos
MAX_SESSIONS_PER_USER=5

# Timeouts
API_TIMEOUT=10000
PDF_API_TIMEOUT=30000
```

> ⚠️ `NEXT_PUBLIC_*` → acessível no client e server
> Sem prefixo → **apenas no servidor**

---

## 🔄 FLUXO DE DADOS

```
Usuário
   ↓
Server Component (page.tsx) → fetch direto / service
   ↓ passa dados como props
Client Component (interatividade) → useQuery / useState
   ↓ mutações
Server Action ('use server') → revalidatePath / revalidateTag
   ↓ cache invalidado
Server Component (re-render automático)
```

---

## 🔐 FLUXO DE AUTENTICAÇÃO / TOKEN

### Arquitetura Completa

```
1. LOGIN
   POST /api/auth/session
     → Autentica com UserShield API
     → Recebe jwtToken do UserShield
     → Salva na sessão Redis: { token: jwtToken, user, perfis, ... }
     → Retorna session_id via cookie httpOnly

2. INICIALIZAÇÃO DO APP (AuthContext)
   GET /api/auth/me
     → Lê session_id do cookie
     → Busca SessionData do Redis
     → Retorna { id, nomeCompleto, email, perfis, token, ... }
     → AuthContext chama setApiToken(userData.token)

3. CHAMADAS API (Api / ApiNotify)
   → Request interceptor lê _authToken (em memória)
   → Injeta header: Authorization: Bearer {token}
   → Em caso de 401: apenas console.warn (sem redirect)

4. LOGOUT
   → AuthContext chama setApiToken(null)
   → POST /api/auth/logout → Remove sessão do Redis
   → Limpa estado local
```

### Arquivos Envolvidos

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/lib/api.ts` | `setApiToken()` / `getApiToken()` — token em memória, interceptors Axios, `axiosConfig` |
| `src/services/session.ts` | `SessionManager` — SessionData com token JWT no Redis |
| `src/services/redis.ts` | Cliente ioredis + mock para testes |
| `src/services/authHelpers.ts` | Helpers de autenticação (requireAuth, getSessionUser, etc.) |
| `src/types/auth.ts` | Interfaces de autenticação (SessionData, UserData, etc.) |
| `src/app/api/auth/session/route.ts` | Login: salva JWT no Redis |
| `src/app/api/auth/me/route.ts` | Retorna token da sessão Redis para o client |
| `src/contexts/AuthContext.tsx` | Gerencia ciclo de vida: init → setApiToken, logout → setApiToken(null) |
| `src/services/auth.ts` | `ApiAuth` — instância Axios para chamadas de auth |
| `src/services/token.ts` | `tokenStorage` — gerenciamento legado de tokens (cookies) |

> ⚠️ **Importante:** O token NÃO é lido de cookies/localStorage pelo client.
> O fluxo é: Redis → `/api/auth/me` → `setApiToken()` → memória JavaScript.

---

## 🧪 CONFIGURAÇÃO DE TESTES

```ts
// jest.config.js - já configurado no projeto
// Ambiente: jsdom
// Path alias: @/ → src/

// Mock padrão obrigatório em todos os testes de componentes:
jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({ isDark: false, theme: 'light', toggleTheme: jest.fn() }),
}))
jest.mock('@/contexts/LayoutContext', () => ({
  useLayout: () => ({
    isMobile: false,
    sidebarOpen: true,
    mounted: true,
  }),
}))
```

### Localização dos Testes
```
tests/
├── unit/          → Componentes, hooks, utils
├── integration/   → Fluxos entre módulos
└── infrastructure → Redis, API connections
```

---

## 📏 CONVENÇÕES

| Item | Regra |
|------|-------|
| Linhas por arquivo | Máx. **150 linhas** |
| Componentes | 1 por pasta; em `src/components/<area>/` (página ou sistema); `ui/` só para primitivos genéricos |
| Destino componentes | `auth/` = auth pages; `ui/` = primitivos genéricos; demais = `components/<nome-da-area>/` |
| Nomenclatura componentes | **PascalCase** |
| Nomenclatura hooks | **camelCase** com prefixo `use` |
| Nomenclatura services | **camelCase** com sufixo `Service` |
| Props interface | `NomeComponenteProps` |
| Types union | **PascalCase** |
| Constantes | **UPPER_SNAKE_CASE** |
| Nunca usar | `any` no TypeScript |

---

## 🚀 COMANDOS DO PROJETO

```bash
npm run dev            # Desenvolvimento (turbopack)
npm run build          # Build produção
npm run test           # Todos os testes (unit + integration)
npm run test:unit      # Apenas unitários
npm run test:watch     # Modo watch
npm run test:coverage  # Com cobertura
npm run lint           # ESLint
npm run type-check     # TypeScript check
npm run format         # Prettier
```

---

## 📖 Documentação Completa

Para workflows práticos e instruções detalhadas, consulte:
- **[WORKFLOWS.md](./WORKFLOWS.md)** - Workflows práticos passo a passo
- **[INSTRUCTIONS.md](./INSTRUCTIONS.md)** - Instruções de codificação e padrões
- **[README.md](./README.md)** - Índice principal da documentação
