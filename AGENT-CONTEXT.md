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
│   │   ├── (auth)/               # Grupo: autenticação
│   │   │   └── auth/
│   │   ├── (dashboard)/          # Grupo: área logada
│   │   │   ├── admin/
│   │   │   └── webhook-monitor/
│   │   ├── actions/              # Server Actions
│   │   ├── api/                  # Route Handlers
│   │   ├── globals.css
│   │   ├── layout.tsx            # Root Layout
│   │   ├── page.tsx              # Home
│   │   └── providers.tsx         # Client Providers
│   ├── components/
│   │   └── ui/                   # ÚNICO lugar para componentes
│   │       ├── ComponentName/
│   │       │   ├── index.ts            # Export público
│   │       │   ├── ComponentName.tsx   # UI (< 150 linhas)
│   │       │   ├── ComponentName.test.tsx
│   │       │   └── useComponentName.ts # Lógica separada
│   │       └── index.ts          # Export central
│   ├── contexts/
│   │   ├── ThemeContext.tsx       # dark/light mode
│   │   ├── LayoutContext.tsx      # sidebar, mobile, search, notificações
│   │   ├── AuthContext.tsx
│   │   ├── NotificationContext.tsx
│   │   └── TelescopeContext.tsx
│   ├── hooks/                    # Hooks compartilhados
│   ├── services/                 # Chamadas API
│   │   ├── auth.ts
│   │   ├── telescopeAPI.ts
│   │   └── token.ts
│   ├── types/                    # Interfaces globais TypeScript
│   ├── lib/
│   │   ├── utils.ts              # cn(), helpers
│   │   ├── api.ts                # Axios config base
│   │   └── axios-config.ts       # Interceptors
│   └── config/
│       ├── env.ts
│       ├── routes.ts
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

```
components/ui/NomeComponente/
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
| Componentes | 1 por pasta, em `src/components/ui/` |
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
