# Workflows Práticos - Telescope ADM Component Library

## 🎯 CENÁRIOS PRÁTICOS DE USO

### Cenário 1: "Crie um componente de Modal"

**Input do usuário:** *"Preciso de um modal para confirmação de ações"*

**Workflow do agente:**

1. **Criar o componente** em `src/components/ui/Modal.tsx`:
```tsx
'use client'

import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import { X } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl'
    variant?: 'default' | 'danger' | 'success'
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    variant = 'default'
}) => {
    const { isDark } = useTheme()
    const { isMobile } = useLayout()
    
    if (!isOpen) return null
    
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl'
    }
    
    const variantClasses = {
        default: '',
        danger: 'border-red-500/20',
        success: 'border-green-500/20'
    }
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 transition-opacity ${
                    isDark ? 'bg-black/50' : 'bg-black/30'
                }`}
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className={`
                relative w-full ${sizeClasses[size]} 
                rounded-xl border shadow-xl transition-all
                ${isDark 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }
                ${variantClasses[variant]}
                ${isMobile ? 'mx-4' : ''}
            `}>
                {/* Header */}
                <div className={`
                    flex items-center justify-between p-6 
                    border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}
                `}>
                    <h2 className={`text-lg font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                        {title}
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        icon={X}
                    />
                </div>
                
                {/* Content */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    )
}
```

2. **Adicionar ao index** `src/components/ui/index.ts`:
```tsx
export { Modal } from './Modal'
```

3. **Criar exemplo** na página de demonstração:
```tsx
// Em FlyonCardExamples.tsx, adicionar seção:
<div className="mb-12">
    <h2>Modal Component</h2>
    <Button onClick={() => setModalOpen(true)}>
        Abrir Modal
    </Button>
    
    <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirmar Ação"
        variant="danger"
    >
        <p>Tem certeza que deseja excluir este item?</p>
        <div className="flex gap-2 mt-4">
            <Button variant="error">Excluir</Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancelar
            </Button>
        </div>
    </Modal>
</div>
```

### Cenário 2: "Refatorar componente existente"

**Input do usuário:** *"O botão não está seguindo o tema corretamente"*

**Workflow do agente:**

1. **Verificar** se usa contextos:
```tsx
// ❌ ANTES (incorreto)
const Button = ({ children }) => {
    return <button className="bg-blue-500">{children}</button>
}

// ✅ DEPOIS (correto)
const Button = ({ children, variant = 'primary' }) => {
    const { isDark } = useTheme()
    
    const variantClasses = {
        primary: isDark 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
    }
    
    return (
        <button className={`transition-colors ${variantClasses[variant]}`}>
            {children}
        </button>
    )
}
```

### Cenário 3: "Criar nova página"

**Input do usuário:** *"Crie uma página de relatórios"*

**Workflow do agente:**

1. **Criar página** usando apenas componentes da biblioteca:
```tsx
'use client'

import React, { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import { 
    Button, 
    Card, 
    StatsCard, 
    Select,
    Modal 
} from '@/components/ui'
import { FileText, Download, Filter } from 'lucide-react'

const RelatoriosPage = () => {
    const { isDark } = useTheme()
    const { isMobile } = useLayout()
    const [filterOpen, setFilterOpen] = useState(false)
    
    return (
        <div className={`min-h-screen p-6 transition-colors ${
            isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
            {/* Header */}
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                }`}>
                    Relatórios
                </h1>
                
                <div className="flex gap-4 mt-4">
                    <Button variant="primary" icon={Download}>
                        Exportar
                    </Button>
                    <Button 
                        variant="secondary" 
                        icon={Filter}
                        onClick={() => setFilterOpen(true)}
                    >
                        Filtros
                    </Button>
                </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatsCard
                    title="Relatórios Gerados"
                    value="127"
                    icon={FileText}
                    iconColor="primary"
                    variant="telescope"
                    isDark={isDark}
                />
                {/* Mais stats... */}
            </div>
            
            {/* Modal de Filtros */}
            <Modal
                isOpen={filterOpen}
                onClose={() => setFilterOpen(false)}
                title="Filtrar Relatórios"
            >
                <div className="space-y-4">
                    <Select
                        options={[
                            { value: 'all', label: 'Todos os tipos' },
                            { value: 'sales', label: 'Vendas' },
                            { value: 'finance', label: 'Financeiro' }
                        ]}
                        placeholder="Tipo de relatório..."
                        isDark={isDark}
                    />
                    
                    <div className="flex gap-2">
                        <Button variant="primary">Aplicar</Button>
                        <Button variant="secondary">Limpar</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default RelatoriosPage
```

## 🔍 CHECKLIST DE VALIDAÇÃO

### Para Novos Componentes:
- [ ] Está em `src/components/ui/`?
- [ ] Usa `useTheme()` e `useLayout()`?
- [ ] Tem props `variant`, `size`, `className`?
- [ ] Suporta tema dark/light?
- [ ] É responsivo (mobile)?
- [ ] Está tipado com TypeScript?
- [ ] Está exportado no `index.ts`?
- [ ] Tem exemplo na página de demonstração?

### Para Refatorações:
- [ ] Remove estados manuais de tema?
- [ ] Adiciona contextos obrigatórios?
- [ ] Mantém compatibilidade com props existentes?
- [ ] Atualiza exemplos de uso?

### Para Novas Páginas:
- [ ] Usa apenas componentes de `@/components/ui`?
- [ ] Implementa contextos de tema/layout?
- [ ] É responsiva?
- [ ] Segue padrões de design?

## 🚨 ERROS COMUNS E SOLUÇÕES

### Erro 1: "Component não segue tema"
```tsx
// ❌ Problema
<div className="bg-white text-black">

// ✅ Solução
const { isDark } = useTheme()
<div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
```

### Erro 2: "Componente não é responsivo"
```tsx
// ❌ Problema
<div className="grid grid-cols-4">

// ✅ Solução
const { isMobile } = useLayout()
<div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-4'}`}>
```

### Erro 3: "Detecção manual de tema"
```tsx
// ❌ Problema
const [isDark, setIsDark] = useState(false)
useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
}, [])

// ✅ Solução
const { isDark } = useTheme()
```

## 📚 BIBLIOTECA DE SNIPPETS

### Snippet 1: Componente Base
```tsx
'use client'

import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { twMerge } from 'tailwind-merge'

interface ComponenteProps {
    variant?: 'default' | 'primary'
    size?: 'sm' | 'md' | 'lg'
    className?: string
    children: React.ReactNode
}

export const Componente: React.FC<ComponenteProps> = ({
    variant = 'default',
    size = 'md',
    className,
    children,
    ...props
}) => {
    const { isDark } = useTheme()
    
    return (
        <div className={twMerge(/* classes */, className)} {...props}>
            {children}
        </div>
    )
}
```

### Snippet 2: Página Base
```tsx
'use client'

import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import { ComponentesUI } from '@/components/ui'

const MinhaPage = () => {
    const { isDark } = useTheme()
    const { isMobile } = useLayout()
    
    return (
        <div className={`min-h-screen transition-colors ${
            isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
            {/* Conteúdo usando componentes da biblioteca */}
        </div>
    )
}
```

Este guia garante que todos os componentes e páginas sigam os padrões estabelecidos da aplicação Telescope ADM.
