# 🔭 Telescope ADM - AI Coding Instructions

## 📋 CONTEXTO ESSENCIAL
Leia **obrigatoriamente** antes de qualquer tarefa:
- `AGENT-CONTEXT.md` - Arquitetura completa
- `AGENT-WORKFLOWS.md` - Workflows e exemplos práticos

---

## 🏗️ PRINCÍPIOS FUNDAMENTAIS

### Clean Code
- **SRP:** Um componente = Uma responsabilidade
- **DRY:** Extrair lógica repetida em hooks customizados
- **KISS:** Preferir soluções simples e legíveis
- **Máximo:** 150 linhas por arquivo → dividir se ultrapassar

### Componentização
- **Atômico:** Componentes pequenos e reutilizáveis
- **Composição:** Preferir composição à herança
- **Props:** Interfaces claras e mínimas

---

## 📁 ESTRUTURA OBRIGATÓRIA

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── (routes)/           # Grupos de rotas
│   │   ├── page.tsx        # Server Component por padrão
│   │   ├── layout.tsx      # Layout compartilhado
│   │   ├── loading.tsx     # Suspense automático
│   │   └── error.tsx       # Error Boundary automático
│   └── actions/            # Server Actions
├── components/
│   ├── auth/               # Componentes EXCLUSIVOS das páginas de autenticação
│   │   ├── ServerLoginForm/    # login (server-login/page.tsx)
│   │   ├── RecoveryForm/       # recuperação de senha (recovery/page.tsx)
│   │   ├── AlterarSenhaForm/   # alteração obrigatória (alterar-senha/page.tsx)
│   │   ├── NoAccessPage/       # acesso negado (no-access/page.tsx)
│   │   └── Notification.tsx    # notificação inline usada nos forms de auth
│   └── ui/                 # Componentes GENÉRICOS reutilizáveis em todo o sistema
│       ├── ComponentName/
│       │   ├── index.ts        # Export público
│       │   ├── ComponentName.tsx
│       │   ├── ComponentName.test.tsx
│       │   └── useComponentName.ts  # lógica separada
│       └── Button.tsx
├── hooks/                  # Hooks compartilhados (client-side)
├── contexts/               # ThemeContext, LayoutContext
├── services/               # Chamadas API (server-side preferível)
├── types/                  # Interfaces globais
└── lib/                    # Utilitários, helpers, configs
```

> **Regra:** Componente usado SOMENTE em página de auth → `components/auth/`. Componente usado em qualquer outra área → `components/ui/`.

---

## ⚡ SERVER vs CLIENT COMPONENTS (Next.js 14 App Router)

### Regra de Ouro
> **Por padrão, todo componente é Server Component.**
> Use `'use client'` APENAS quando necessário.

### ✅ Use Server Component quando:
- Buscar dados diretamente (fetch, DB, API)
- Acessar recursos do servidor (env vars, fs)
- Não precisar de interatividade
- Renderizar layout estático

```tsx
// app/(dashboard)/page.tsx - SEM 'use client'
import { DashboardStats } from '@/components/ui/DashboardStats'

async function DashboardPage() {
  const data = await fetch('https://api.exemplo.com/stats', {
    next: { revalidate: 60 } // ISR - revalida a cada 60s
  })
  const stats = await data.json()

  return <DashboardStats data={stats} />
}

export default DashboardPage
```

### ✅ Use Client Component quando:
- Precisar de `useState`, `useEffect`, `useReducer`
- Usar event handlers (`onClick`, `onChange`)
- Usar contextos (`useTheme`, `useLayout`)
- Usar Web APIs (localStorage, window, etc.)

```tsx
'use client'
// ↑ OBRIGATÓRIO apenas nestes casos
```

### 🚫 Padrão de Composição Server + Client
```tsx
// ✅ CORRETO: Server Component envolve Client Component
// ServerParent.tsx (sem 'use client')
import { ClientChild } from './ClientChild'

export async function ServerParent() {
  const data = await getData() // fetch no servidor
  return <ClientChild initialData={data} /> // passa como prop
}

// ClientChild.tsx
'use client'
export function ClientChild({ initialData }) {
  const [data, setData] = useState(initialData)
  // lógica interativa aqui
}
```

---

## 🔄 SERVER ACTIONS (Next.js 14)

### Quando usar
- Mutations (POST, PUT, DELETE)
- Formulários
- Operações que modificam dados

```ts
// src/app/actions/userActions.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function updateUser(formData: FormData) {
  const name = formData.get('name') as string

  // validação
  if (!name) throw new Error('Nome obrigatório')

  // mutação
  await db.user.update({ where: { id }, data: { name } })

  // revalidar cache da rota
  revalidatePath('/dashboard')
}
```

```tsx
// Uso no componente (pode ser Server Component)
import { updateUser } from '@/app/actions/userActions'

export function UserForm() {
  return (
    <form action={updateUser}>
      <input name="name" />
      <button type="submit">Salvar</button>
    </form>
  )
}
```

---

## 🧩 PADRÃO DE COMPONENTE

### ✅ Server Component (padrão — sem hook de tema)
```tsx
// ServerComponent.tsx - SEM 'use client'
import { cn } from '@/lib/utils'

interface Props {
  children?: React.ReactNode
  className?: string
}

export function ServerComponent({ children, className }: Props) {
  return (
    <div className={cn('transition-colors', className)}>
      {children}
    </div>
  )
}
```

### ✅ Client Component (com interatividade/tema)
```tsx
'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'

interface Props {
  children?: React.ReactNode
  className?: string
}

export const ClientComponent: React.FC<Props> = ({ children, className }) => {
  const { isDark } = useTheme()
  const { isMobile } = useLayout()

  return (
    <div
      className={cn(
        'transition-colors',
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-black',
        isMobile && 'text-sm px-2',
        className
      )}
    >
      {children}
    </div>
  )
}
```

### ✅ Separar Lógica em Hook
```ts
// useComponentName.ts → lógica separada da UI
'use client'

import { useState, useCallback } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'

export const useComponentName = () => {
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

## 📡 DATA FETCHING (Next.js 14)

### Estratégias de Cache

```tsx
// 🔄 Dynamic - sempre busca dados frescos
const data = await fetch(url, { cache: 'no-store' })

// ⚡ Static - cacheia indefinidamente (build time)
const data = await fetch(url)

// 🕐 ISR - revalida por tempo
const data = await fetch(url, { next: { revalidate: 60 } })

// 🏷️ On-demand revalidation - revalida por tag
const data = await fetch(url, { next: { tags: ['users'] } })
// Em Server Action: revalidateTag('users')
```

### Padrão com Suspense
```tsx
// app/users/page.tsx
import { Suspense } from 'react'
import { UserList } from '@/components/ui/UserList'
import { UserListSkeleton } from '@/components/ui/UserListSkeleton'

export default function UsersPage() {
  return (
    <Suspense fallback={<UserListSkeleton />}>
      <UserList /> {/* busca dados internamente */}
    </Suspense>
  )
}
```

---

## 🛡️ ERROR HANDLING

### Error Boundary automático
```tsx
// app/(dashboard)/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="text-red-500 font-semibold">Algo deu errado</h2>
      <p className="text-gray-500 text-sm">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Tentar novamente
      </button>
    </div>
  )
}
```

### Padrão de Error em Services
```ts
// src/services/userService.ts
export async function getUser(id: string) {
  try {
    const res = await fetch(`/api/users/${id}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (error) {
    console.error('[getUser]', error)
    throw new Error('Falha ao buscar usuário')
  }
}
```

---

## ♿ ACESSIBILIDADE (a11y)

```tsx
// ✅ Sempre incluir
- aria-label em botões sem texto visível
- role= quando semântica HTML não for suficiente
- tabIndex para elementos interativos customizados
- Contraste mínimo: 4.5:1 (texto normal), 3:1 (texto grande)
- focus-visible para navegação por teclado

// Exemplo
<button
  aria-label="Fechar modal"
  className="focus-visible:ring-2 focus-visible:ring-blue-500"
  onClick={onClose}
>
  <XIcon aria-hidden="true" />
</button>
```

---

## 🎨 TAILWIND - BOAS PRÁTICAS

```tsx
// ✅ Use cn() para classes condicionais (clsx + tailwind-merge)
import { cn } from '@/lib/utils'

// ✅ Variantes com cva() (class-variance-authority)
import { cva } from 'class-variance-authority'

const buttonVariants = cva('rounded font-medium transition-colors', {
  variants: {
    variant: {
      primary: 'bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    },
    size: {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-base',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})

// ✅ Dark mode via classe (não detectar manualmente)
className="bg-white dark:bg-gray-800 text-black dark:text-white"
```

---

## 🧪 TESTES UNITÁRIOS

### Padrão Obrigatório
```tsx
// ComponentName.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ComponentName } from './ComponentName'

// Mocks obrigatórios
jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({ isDark: false }),
}))
jest.mock('@/contexts/LayoutContext', () => ({
  useLayout: () => ({ isMobile: false }),
}))

describe('ComponentName', () => {
  it('renderiza corretamente', () => {
    render(<ComponentName />)
    expect(screen.getByRole('...')).toBeInTheDocument()
  })

  it('aplica classes dark mode', () => {
    jest.mocked(useTheme).mockReturnValue({ isDark: true })
    const { container } = render(<ComponentName />)
    expect(container.firstChild).toHaveClass('bg-gray-800')
  })

  it('é responsivo no mobile', () => {
    jest.mocked(useLayout).mockReturnValue({ isMobile: true })
    render(<ComponentName />)
    // assertions
  })

  it('handles user interaction', async () => {
    render(<ComponentName />)
    fireEvent.click(screen.getByRole('button'))
    // assertions
  })
})
```

### Regras de Teste
- **Testar comportamento**, não implementação
- **Mock:** Sempre mockar `useTheme()` e `useLayout()`
- **Queries:** Preferir `getByRole` > `getByText` > `getByTestId`
- **Cobertura mínima:** render + tema + mobile + interações

---

## 🔑 TYPESCRIPT - PADRÕES

```ts
// ✅ Preferir type para unions/primitivos
type Status = 'idle' | 'loading' | 'success' | 'error'

// ✅ Preferir interface para objetos/componentes
interface UserProps {
  id: string
  name: string
  onSelect: (id: string) => void
}

// ✅ Generics em funções utilitárias
async function fetchData<T>(url: string): Promise<T> {
  const res = await fetch(url)
  return res.json() as T
}

// 🚫 Nunca usar 'any'
// ✅ Usar 'unknown' quando necessário + type guard
```

---

## ✅ CHECKLIST DE QUALIDADE

Antes de finalizar qualquer código:

```
[ ] Componente em src/components/auth/ (se auth-specific) ou src/components/ui/ (se genérico)
[ ] Server Component por padrão (sem 'use client' desnecessário)
[ ] 'use client' apenas quando há interatividade/hooks
[ ] Usa useTheme() e useLayout() (somente em Client Components)
[ ] Suporte dark/light mode via Tailwind
[ ] TypeScript com interface Props (sem 'any')
[ ] Tailwind CSS com cn() para condicionais
[ ] Arquivo < 150 linhas
[ ] Lógica extraída em hook próprio
[ ] Teste unitário criado com mocks corretos
[ ] Exportado no index.ts
[ ] a11y: aria-labels e roles corretos
[ ] Error handling implementado
[ ] Adicionado exemplo no FlyonCardExamples.tsx
```

---

## 🚫 RESTRIÇÕES

| ❌ NUNCA | ✅ SEMPRE |
|----------|----------|
| Auth components em `src/components/ui/` | Auth components em `src/components/auth/` |
| Genéricos em `src/components/auth/` | Genéricos em `src/components/ui/` |
| `'use client'` sem necessidade real | Server Components por padrão |
| Ignorar `useTheme()` e `useLayout()` em Client | Usar contextos obrigatórios |
| Detecção manual de tema/mobile | Usar hooks dos contextos |
| CSS inline ou classes longas duplicadas | Tailwind + `cn()` + `cva()` |
| Componentes > 150 linhas | Dividir em sub-componentes |
| Lógica misturada com UI | Separar em hooks customizados |
| Código sem testes | Criar testes para toda feature |
| `any` no TypeScript | Tipagem explícita ou `unknown` |
| fetch sem estratégia de cache | Definir `cache` ou `revalidate` |
| Formulários sem Server Actions | Usar `action=` com Server Actions |

---

## 📖 Detalhes completos em `AGENT-CONTEXT.md`
