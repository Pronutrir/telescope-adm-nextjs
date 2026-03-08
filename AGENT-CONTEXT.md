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
│   │   │   ├── perfil/           # Perfil do usuário
│   │   │   ├── nps/              # NPS
│   │   │   └── biblioteca-componentes/ # Biblioteca de exemplos
│   │   ├── webhook-monitor/      # Monitor de webhooks
│   │   ├── api/                  # Route Handlers (Next.js API)
│   │   ├── actions/              # Server Actions ('use server')
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
│   │   ├── dashboard/            # Componentes da área de dashboard
│   │   │   ├── LineChart.tsx     # Gráfico de linha
│   │   │   └── TrafficTable.tsx  # Tabela de tráfego
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
│   │   ├── pdf/                  # Componentes do gerenciador de PDFs
│   │   │   ├── AutocompletePessoa.tsx
│   │   │   ├── SortablePdfCards.tsx
│   │   │   ├── PDFCard.tsx
│   │   │   ├── InlinePDFViewer.tsx
│   │   │   ├── SearchPDF.tsx
│   │   │   └── UploadZone.tsx
│   │   ├── powerbi/              # Componentes de relatórios PowerBI
│   │   │   └── PowerBIReport.tsx
│   │   ├── evolucao-paciente/    # Componentes da evolução de paciente
│   │   │   └── NovaEvolucaoModal.tsx
│   │   ├── webhook-monitor/      # Componentes do monitor de webhooks
│   │   │   └── ConnectionStatus.tsx
│   │   ├── notifications/        # Sistema de notificações
│   │   │   ├── NotificationContainer.tsx
│   │   │   └── index.ts
│   │   ├── library/              # Componentes da biblioteca de exemplos
│   │   │   ├── SortableProgressStats.tsx
│   │   │   ├── ProgressStat.tsx
│   │   │   └── DropdownTest.tsx
│   │   ├── analytics/            # Google Analytics
│   │   │   └── GoogleAnalyticsLoader.tsx
│   │   ├── nps/                  # Componentes de NPS
│   │   │   ├── AbasAnswers.tsx
│   │   │   ├── AnswersDashboard.tsx
│   │   │   └── AnswersList.tsx
│   │   ├── profile/              # Componentes de perfil do usuário
│   │   │   ├── UserInfoCard.tsx
│   │   │   ├── UserProfileForm.tsx
│   │   │   ├── UserAvatarUpload.tsx
│   │   │   ├── UserPermissionsCard.tsx
│   │   │   ├── UserSecuritySettings.tsx
│   │   │   ├── UserActivityLog.tsx
│   │   │   ├── UserProfileHeader.tsx
│   │   │   ├── HomePageSelector.tsx
│   │   │   └── index.ts
│   │   ├── debug/                # Componentes de depuração (somente dev)
│   │   │   └── ThemeDebug.tsx
│   │   ├── examples/             # Galeria de exemplos interativos
│   │   │   ├── FlyonCardExamples.tsx
│   │   │   └── index.ts
│   │   └── ui/                   # SOMENTE primitivos genéricos reutilizáveis
│   │       ├── Button.tsx        # Botão com variantes (cva)
│   │       ├── Card.tsx          # Card genérico
│   │       ├── StatsCard.tsx     # Card de estatística genérico
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
│   ├── types/                    # Interfaces globais TypeScript
│   ├── lib/
│   │   ├── utils.ts              # cn(), helpers
│   │   ├── api.ts                # Axios config base
│   │   ├── axios-config.ts       # Interceptors
│   │   ├── session.ts            # Gerenciamento de sessão
│   │   └── auth-helpers.ts       # Helpers de autenticação
│   └── config/
│       ├── env.ts
│       ├── routes.ts             # Definição de rotas e permissões
│       └── environment.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── infrastructure/
├── AGENT-CONTEXT.md              # Este arquivo
├── AGENT-WORKFLOWS.md            # Workflows práticos
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

```ts
// src/services/telescopeAPI.ts - padrão do projeto
// Usa axios (src/lib/axios-config.ts) com interceptors de token

// Padrão de serviço:
export const userService = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: string) => api.get<User>(`/users/${id}`),
  update: (id: string, data: Partial<User>) =>
    api.put<User>(`/users/${id}`, data),
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
# .env.local
NEXT_PUBLIC_API_URL=      # URL base da API (visível no client)
NEXT_PUBLIC_GA_ID=        # Google Analytics ID

# Apenas servidor
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
REDIS_URL=
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

## 📖 Workflows práticos em `AGENT-WORKFLOWS.md`
