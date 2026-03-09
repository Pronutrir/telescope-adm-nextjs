# 🔭 Telescope ADM - Workflows do Agente de IA

## 🤖 Identificação do Agente

**Agente:** GitHub Copilot Coding Agent  
**Modelo:** Claude Sonnet (Anthropic)  
**Instruções:** `.github/copilot-instructions.md`  
**Contexto completo:** `AGENT-CONTEXT.md`

---

## 📋 Workflow 1: Criar Novo Componente UI

### Passo a Passo

**1. Verificar se o componente já existe:**
```bash
ls src/components/ui/
```

**2. Criar o arquivo em `src/components/ui/MeuComponente.tsx`:**

```tsx
'use client'

import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'

interface MeuComponenteProps {
    title: string
    children?: React.ReactNode
    className?: string
}

export const MeuComponente: React.FC<MeuComponenteProps> = ({
    title,
    children,
    className
}) => {
    const { isDark } = useTheme()
    const { isMobile } = useLayout()

    return (
        <div className={`
            rounded-lg border transition-colors duration-200
            ${isDark
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-200 text-gray-900'
            }
            ${isMobile ? 'p-3' : 'p-5'}
            ${className ?? ''}
        `}>
            <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>
                {title}
            </h3>
            {children}
        </div>
    )
}
```

**3. Exportar em `src/components/ui/index.ts`:**
```ts
export * from './MeuComponente'
```

**4. Adicionar exemplo em `src/components/examples/FlyonCardExamples.tsx`:**
```tsx
import { MeuComponente } from '@/components/ui'

// Dentro do componente de exemplos:
<MeuComponente title="Exemplo">
    Conteúdo do componente
</MeuComponente>
```

---

## 📋 Workflow 2: Adicionar Nova Página Admin

### Passo a Passo

**1. Criar a rota em `src/app/admin/nova-pagina/page.tsx`:**

```tsx
'use client'

import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'

export default function NovaPaginaPage() {
    const { isDark } = useTheme()
    const { isMobile } = useLayout()

    return (
        <main className={`
            min-h-screen transition-colors duration-200
            ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}
            ${isMobile ? 'p-4' : 'p-8'}
        `}>
            <h1 className="text-2xl font-bold mb-6">
                Nova Página
            </h1>
            {/* Conteúdo */}
        </main>
    )
}
```

**2. Se a rota usar Server Actions, criar em `src/app/actions/nova-pagina/`:**

```ts
'use server'

export async function minhaAction(data: FormData) {
    // lógica server-side
}
```

**3. A rota `/admin/*` é automaticamente protegida pelo middleware** — sem necessidade de código adicional.

---

## 📋 Workflow 3: Criar Nova API Route

### Passo a Passo

**1. Criar o arquivo em `src/app/api/meu-endpoint/route.ts`:**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/session'

export async function GET(request: NextRequest) {
    try {
        // Verificar sessão se necessário
        const session = await getServerSession(request)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Lógica do endpoint
        const data = { message: 'OK' }
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        // processar body
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
```

---

## 📋 Workflow 4: Adicionar Dark Mode a Componente Existente

Se um componente **não** usa `useTheme()`, adicionar suporte:

**Antes:**
```tsx
export const MeuCard = () => (
    <div className="bg-white text-black p-4 rounded">
        Conteúdo
    </div>
)
```

**Depois:**
```tsx
'use client'

import { useTheme } from '@/contexts/ThemeContext'

export const MeuCard = () => {
    const { isDark } = useTheme()

    return (
        <div className={`
            p-4 rounded transition-colors duration-200
            ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
        `}>
            Conteúdo
        </div>
    )
}
```

---

## 📋 Workflow 5: Escrever Testes

**Localização dos testes:** `src/tests/` ou `tests/`

**Padrão de teste para componente UI:**

```tsx
import { render, screen } from '@testing-library/react'
import { MeuComponente } from '@/components/ui/MeuComponente'

// Mock dos contextos
jest.mock('@/contexts/ThemeContext', () => ({
    useTheme: () => ({
        theme: 'light',
        isDark: false,
        toggleTheme: jest.fn(),
        setTheme: jest.fn()
    })
}))

jest.mock('@/contexts/LayoutContext', () => ({
    useLayout: () => ({
        isMobile: false,
        mounted: true,
        sidebarOpen: false,
        sidebarCollapsed: false,
        toggleSidebar: jest.fn(),
        setSidebarOpen: jest.fn(),
        collapseSidebar: jest.fn(),
        toggleMobileSidebar: jest.fn(),
        setIsMobile: jest.fn(),
        searchOpen: false,
        searchQuery: '',
        setSearchOpen: jest.fn(),
        setSearchQuery: jest.fn(),
        toggleSearch: jest.fn(),
        notificationsOpen: false,
        notificationsCount: 0,
        setNotificationsOpen: jest.fn(),
        setNotificationsCount: jest.fn(),
        toggleNotifications: jest.fn()
    })
}))

describe('MeuComponente', () => {
    it('renderiza com título correto', () => {
        render(<MeuComponente title="Teste" />)
        expect(screen.getByText('Teste')).toBeInTheDocument()
    })

    it('aplica classes de dark mode', () => {
        jest.mocked(require('@/contexts/ThemeContext').useTheme)
            .mockReturnValue({ isDark: true, theme: 'dark' })
        
        const { container } = render(<MeuComponente title="Teste" />)
        expect(container.firstChild).toHaveClass('bg-gray-800')
    })
})
```

**Executar testes:**
```bash
npm run test:unit          # Testes unitários
npm run test:integration   # Testes de integração
```

---

## 📋 Workflow 6: Adicionar Ícone Lucide

Todos os ícones vêm de `lucide-react`:

```tsx
import { Users, TrendingUp, Activity, Settings } from 'lucide-react'

// Uso
<Users className="w-5 h-5 text-blue-500" />
<TrendingUp size={20} />
```

---

## 📋 Workflow 7: Trabalhar com Formulários

Usar **Formik + Yup**:

```tsx
'use client'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useTheme } from '@/contexts/ThemeContext'

const schema = Yup.object({
    nome: Yup.string().required('Nome é obrigatório'),
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
})

export const MeuFormulario = () => {
    const { isDark } = useTheme()

    return (
        <Formik
            initialValues={{ nome: '', email: '' }}
            validationSchema={schema}
            onSubmit={async (values) => {
                // submit
            }}
        >
            {({ isSubmitting }) => (
                <Form>
                    <Field
                        name="nome"
                        className={`w-full p-2 rounded border ${
                            isDark
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    />
                    <ErrorMessage name="nome" component="p" className="text-red-500 text-sm" />
                    
                    <button type="submit" disabled={isSubmitting}>
                        Enviar
                    </button>
                </Form>
            )}
        </Formik>
    )
}
```

---

## 📋 Workflow 8: Fazer Chamada de API

**Client-side (usando axios):**
```tsx
import axios from 'axios'

const response = await axios.get('/api/meu-endpoint')
const data = response.data
```

**Com React Query:**
```tsx
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'

// Query (GET)
const { data, isLoading, error } = useQuery({
    queryKey: ['meus-dados'],
    queryFn: () => axios.get('/api/meus-dados').then(r => r.data)
})

// Mutation (POST/PUT/DELETE)
const { mutate } = useMutation({
    mutationFn: (payload: any) => axios.post('/api/criar', payload),
    onSuccess: () => {
        // invalidar cache, mostrar toast, etc.
    }
})
```

---

## ⚠️ Erros Comuns e Soluções

### ❌ "useTheme must be used within a ThemeProvider"
**Causa:** Componente renderizado fora do `ThemeProvider`.  
**Solução:** Verificar que o componente está dentro da árvore do `providers.tsx`.

### ❌ Hydration mismatch
**Causa:** Estado diferente entre server e client render.  
**Solução:** Usar `mounted` do `useLayout()` antes de renderizar conteúdo dependente de estado client.
```tsx
const { mounted } = useLayout()
if (!mounted) return null
```

### ❌ Componente fora de `src/components/ui/`
**Causa:** Componente criado em local errado.  
**Solução:** Mover para `src/components/ui/` e exportar no `index.ts`.

### ❌ Sem suporte dark/light
**Causa:** Classes Tailwind hardcoded (ex: `bg-white`).  
**Solução:** Usar `isDark` do `useTheme()` para alternar classes.

---

## 🔗 Referências Rápidas

| Recurso | Caminho |
|---------|---------|
| Componentes UI | `src/components/ui/` |
| Exemplos de componentes | `src/components/examples/FlyonCardExamples.tsx` |
| Contexto de tema | `src/contexts/ThemeContext.tsx` |
| Contexto de layout | `src/contexts/LayoutContext.tsx` |
| Páginas admin | `src/app/admin/` |
| API Routes | `src/app/api/` |
| Middleware de rota | `src/middleware.ts` |
| Documentação geral | `docs/00-COMECE-AQUI.md` |
| Contexto do agente | `AGENT-CONTEXT.md` |
