# 🔄 Telescope ADM - Workflows Práticos

## ➕ WORKFLOW: CRIAR NOVO COMPONENTE

### Passo a Passo

**1. Criar pasta e arquivos**
```bash
src/components/ui/NomeComponente/
├── index.ts
├── NomeComponente.tsx
├── NomeComponente.test.tsx
└── useNomeComponente.ts
```

**2. Implementar o hook de lógica**
```ts
// useNomeComponente.ts
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

**3. Implementar o componente (UI apenas)**
```tsx
// NomeComponente.tsx
'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useNomeComponente } from './useNomeComponente'

export interface NomeComponenteProps {
  title: string
  className?: string
}

export const NomeComponente: React.FC<NomeComponenteProps> = ({
  title,
  className,
}) => {
  const { isDark, isMobile, isOpen, handleToggle } = useNomeComponente()

  return (
    <div
      className={cn(
        'rounded-lg p-4 transition-colors',
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900',
        isMobile && 'p-2 text-sm',
        className
      )}
    >
      <button
        aria-label={`Expandir ${title}`}
        onClick={handleToggle}
        className="focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        {title}
      </button>
      {isOpen && <div className="mt-2">Conteúdo expandido</div>}
    </div>
  )
}
```

**4. Criar o export público**
```ts
// index.ts
export { NomeComponente } from './NomeComponente'
export type { NomeComponenteProps } from './NomeComponente'
```

**5. Registrar no export central**
```ts
// src/components/ui/index.ts
export * from './NomeComponente'
```

**6. Criar testes**
```tsx
// NomeComponente.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { NomeComponente } from './NomeComponente'

const mockUseTheme = { isDark: false, theme: 'light' as const, toggleTheme: jest.fn(), setTheme: jest.fn() }
const mockUseLayout = { isMobile: false, sidebarOpen: true, mounted: true }

jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => mockUseTheme,
}))
jest.mock('@/contexts/LayoutContext', () => ({
  useLayout: () => mockUseLayout,
}))

describe('NomeComponente', () => {
  it('renderiza o título corretamente', () => {
    render(<NomeComponente title="Meu Título" />)
    expect(screen.getByRole('button', { name: /expandir meu título/i })).toBeInTheDocument()
  })

  it('expande ao clicar', () => {
    render(<NomeComponente title="Meu Título" />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Conteúdo expandido')).toBeInTheDocument()
  })

  it('aplica classes dark mode', () => {
    mockUseTheme.isDark = true
    const { container } = render(<NomeComponente title="Test" />)
    expect(container.firstChild).toHaveClass('bg-gray-800')
  })

  it('aplica classes mobile', () => {
    Object.assign(mockUseLayout, { isMobile: true })
    const { container } = render(<NomeComponente title="Test" />)
    expect(container.firstChild).toHaveClass('text-sm')
  })
})
```

---

## 🔌 WORKFLOW: CRIAR SERVER ACTION

```ts
// src/app/actions/nomeActions.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function criarItem(formData: FormData) {
  const nome = formData.get('nome') as string

  // 1. Validar
  if (!nome?.trim()) throw new Error('Nome é obrigatório')

  // 2. Chamar serviço/DB
  await api.post('/items', { nome })

  // 3. Revalidar cache da rota
  revalidatePath('/dashboard')
}
```

```tsx
// Uso em componente (pode ser Server Component)
import { criarItem } from '@/app/actions/nomeActions'

export function FormularioItem() {
  return (
    <form action={criarItem} className="flex flex-col gap-4">
      <input
        name="nome"
        placeholder="Nome do item"
        className="border rounded px-3 py-2"
        required
      />
      <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">
        Salvar
      </button>
    </form>
  )
}
```

---

## 📡 WORKFLOW: CRIAR SERVIÇO DE API

```ts
// src/services/itemService.ts
import api from '@/lib/api'

export interface Item {
  id: string
  nome: string
  criadoEm: string
}

export const itemService = {
  listar: async (): Promise<Item[]> => {
    const { data } = await api.get<Item[]>('/items')
    return data
  },

  buscar: async (id: string): Promise<Item> => {
    const { data } = await api.get<Item>(`/items/${id}`)
    return data
  },

  criar: async (payload: Omit<Item, 'id' | 'criadoEm'>): Promise<Item> => {
    const { data } = await api.post<Item>('/items', payload)
    return data
  },

  atualizar: async (id: string, payload: Partial<Item>): Promise<Item> => {
    const { data } = await api.put<Item>(`/items/${id}`, payload)
    return data
  },

  deletar: async (id: string): Promise<void> => {
    await api.delete(`/items/${id}`)
  },
}
```

---

## 🔄 WORKFLOW: DATA FETCHING COM REACT QUERY

```tsx
// hooks/useItems.ts
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { itemService } from '@/services/itemService'

const QUERY_KEY = ['items'] as const

export const useItems = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: itemService.listar,
    staleTime: 1000 * 60, // 1 minuto
  })
}

export const useCreateItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: itemService.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}
```

```tsx
// Uso no componente
'use client'

import { useItems, useCreateItem } from '@/hooks/useItems'

export const ListaItens = () => {
  const { data: items, isLoading, error } = useItems()
  const { mutate: criar, isPending } = useCreateItem()

  if (isLoading) return <div>Carregando...</div>
  if (error) return <div>Erro ao carregar</div>

  return (
    <ul>
      {items?.map(item => (
        <li key={item.id}>{item.nome}</li>
      ))}
    </ul>
  )
}
```

---

## 🛣️ WORKFLOW: CRIAR NOVA ROTA (APP ROUTER)

```
src/app/(dashboard)/nova-rota/
├── page.tsx          # Server Component (busca dados)
├── loading.tsx       # Skeleton automático
└── error.tsx         # Error boundary automático
```

```tsx
// page.tsx - Server Component
import { Suspense } from 'react'
import { itemService } from '@/services/itemService'
import { ListaItens } from '@/components/ui/ListaItens'

export default async function NovaRotaPage() {
  const items = await itemService.listar()

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Nova Rota</h1>
      <ListaItens initialData={items} />
    </main>
  )
}
```

```tsx
// loading.tsx - Skeleton automático
export default function Loading() {
  return (
    <div className="p-6 space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      ))}
    </div>
  )
}
```

```tsx
// error.tsx - Error boundary
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
      <p className="text-red-500">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Tentar novamente
      </button>
    </div>
  )
}
```

---

## ♻️ WORKFLOW: REFATORAR COMPONENTE LEGADO

**Checklist de refatoração:**

```
1. [ ] Identificar se é Server ou Client Component
2. [ ] Extrair lógica para useNomeComponente.ts
3. [ ] Adicionar useTheme() - se Client Component
4. [ ] Adicionar useLayout() - se Client Component
5. [ ] Substituir estilos manuais por classes Tailwind
6. [ ] Usar cn() para classes condicionais
7. [ ] Adicionar interface Props com TypeScript
8. [ ] Remover 'any' do TypeScript
9. [ ] Criar pasta ComponentName/ com index.ts
10. [ ] Criar testes unitários
11. [ ] Registrar no export central
```

---

## 🐛 WORKFLOW: CORRIGIR BUG

```
1. Identificar o arquivo → referenciá-lo no chat com #arquivo
2. Verificar se usa useTheme() e useLayout()
3. Não remover suporte a dark mode ao corrigir
4. Testar nos dois temas (isDark: true e false)
5. Verificar hidration mismatch com mounted do LayoutContext
```

---

## 🧪 WORKFLOW: EXECUTAR TESTES

```bash
# Rodar todos os testes
npm run test

# Apenas unitários
npm run test:unit

# Modo watch (desenvolvimento)
npm run test:watch

# Ver cobertura
npm run test:coverage

# Arquivo específico
npx jest src/components/ui/NomeComponente/NomeComponente.test.tsx
```

---

## 💡 PROMPTS RECOMENDADOS PARA O COPILOT

```
# Criar componente
Leia #.agents/docs/CONTEXT.md e crie o componente [Nome] em
src/components/ui/ com useTheme, useLayout, TypeScript,
Tailwind, hook separado, testes e export no index.ts

# Criar serviço
Crie o service [Nome]Service em src/services/ seguindo
o padrão do projeto com axios, TypeScript e error handling

# Criar rota
Crie a rota /[nome] com page.tsx (Server Component),
loading.tsx e error.tsx seguindo os padrões do projeto

# Refatorar
Refatore #arquivo.tsx extraindo a lógica para um hook,
adicionando useTheme e useLayout sem alterar o comportamento

# Criar testes
Crie testes unitários para #arquivo.tsx com mocks de
useTheme e useLayout, cobrindo render, dark mode e interações
```

---

## 📖 Documentação Completa

Para arquitetura completa e mais detalhes, consulte:
- **[CONTEXT.md](./CONTEXT.md)** - Arquitetura completa do projeto
- **[INSTRUCTIONS.md](./INSTRUCTIONS.md)** - Instruções de codificação e padrões
- **[README.md](./README.md)** - Índice principal da documentação
