# Contexto para Agentes AI - Telescope ADM Next.js

## 🎯 PRINCÍPIO FUNDAMENTAL

**PRESERVAR SEMPRE as características de layout dos componentes originais.**
**ADAPTAR APENAS o tema para o sistema de design da aplicação.**

Quando trabalhar com HTML/CSS existente:
1. ✅ **MANTER** toda a estrutura HTML e classes de layout
2. ✅ **PRESERVAR** funcionalidades, animações e comportamentos
3. ✅ **SUBSTITUIR** apenas classes de cores/tema por contextos React
4. ✅ **ADAPTAR** para suporte dark/light mode usando `useTheme()`
5. ✅ **ADICIONAR** responsividade usando `useLayout()`

## OVERVIEW DA APLICAÇÃO

A **Telescope ADM** é uma aplicação Next.js 13+ com App Router que utiliza TypeScript, Tailwind CSS e um sistema de design unificado com suporte completo a temas light/dark. A aplicação segue uma arquitetura baseada em contextos React para gerenciamento de estado global.

## ESTRUTURA DE ARQUIVOS

```
telescope-adm-nextjs/
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   ├── components/
│   │   ├── ui/                 # 🎯 BIBLIOTECA DE COMPONENTES (FOCO PRINCIPAL)
│   │   ├── examples/           # Páginas de demonstração
│   │   ├── layout/             # Componentes de layout
│   │   └── [outras pastas]/
│   ├── contexts/               # 🎯 CONTEXTOS GLOBAIS (OBRIGATÓRIO)
│   │   ├── ThemeContext.tsx    # Gerenciamento de tema
│   │   ├── LayoutContext.tsx   # Estados de layout
│   │   └── [outros contextos]/
│   ├── styles/
│   │   └── globals.css         # CSS global com variáveis de tema
│   └── types/                  # Definições TypeScript
```

## REGRAS OBRIGATÓRIAS PARA PRESERVAÇÃO DE LAYOUT

### 🏗️ PRESERVAR ESTRUTURA E LAYOUT

**Ao adaptar componentes existentes:**

```tsx
// ✅ EXEMPLO: Adaptando dropdown mantendo estrutura original
// HTML ORIGINAL:
// <div class="dropdown relative inline-flex">
//   <button class="dropdown-toggle btn btn-primary">...</button>
//   <ul class="dropdown-menu hidden min-w-60">...</ul>
// </div>

// ✅ ADAPTAÇÃO CORRETA - Preserva layout, adapta tema:
const { isDark } = useTheme()

<div className="relative inline-flex"> {/* Mantém layout */}
    <button className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg 
        border transition-colors min-w-60
        ${isDark 
            ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
            : 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'
        }
    `}>
        {/* Mantém toda funcionalidade original */}
    </button>
    <ul className={`
        absolute z-50 min-w-60 rounded-lg border shadow-lg
        ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}
    `}>
        {/* Lista de itens preservando comportamento */}
    </ul>
</div>
```

**NUNCA faça:**
```tsx
// ❌ INCORRETO - Mudança de estrutura
<div className="flex flex-col"> {/* Estrutura diferente */}
    <div className="w-full"> {/* Layout alterado */}
        {/* Comportamento perdido */}
    </div>
</div>
```

### 1. USO DE CONTEXTOS (SEMPRE OBRIGATÓRIO)

**SEMPRE use os contextos existentes:**

```tsx
// ✅ CORRETO - SEMPRE use os contextos
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'

const MeuComponente = () => {
    const { theme, isDark, toggleTheme } = useTheme()
    const { isMobile, sidebarOpen, mounted } = useLayout()
    
    // Resto do componente...
}
```

```tsx
// ❌ INCORRETO - NUNCA implemente detecção manual
const [isDark, setIsDark] = useState(false) // ❌ NÃO FAZER
useEffect(() => {
    // ❌ Detecção manual de tema
    setIsDark(document.documentElement.classList.contains('dark'))
}, [])
```

### 2. BIBLIOTECA DE COMPONENTES

**TODOS os componentes reutilizáveis devem estar em `src/components/ui/`:**

```tsx
// Estrutura padrão de um componente UI:
'use client'

import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import { twMerge } from 'tailwind-merge'
import { LucideIcon } from 'lucide-react'

interface MeuComponenteProps {
    variant?: 'default' | 'primary' | 'secondary'
    size?: 'sm' | 'md' | 'lg'
    className?: string
    children: React.ReactNode
}

export const MeuComponente: React.FC<MeuComponenteProps> = ({
    variant = 'default',
    size = 'md',
    className,
    children,
    ...props
}) => {
    const { isDark } = useTheme()
    const { isMobile } = useLayout()
    
    const baseClasses = "..."
    const variantClasses = {
        default: isDark ? 'dark-classes' : 'light-classes',
        primary: isDark ? 'dark-primary' : 'light-primary'
    }
    
    return (
        <div 
            className={twMerge(baseClasses, variantClasses[variant], className)}
            {...props}
        >
            {children}
        </div>
    )
}
```

### 3. PADRÕES DE ADAPTAÇÃO DE TEMA

**METODOLOGIA: Preservar + Adaptar**

```tsx
// 🎯 PROCESSO DE ADAPTAÇÃO:
// 1. Identifique classes de LAYOUT (preservar)
// 2. Identifique classes de TEMA (adaptar)
// 3. Use contextos para tema dinâmico

// EXEMPLO: Adaptando um card
// HTML Original:
// <div class="card bg-white border border-gray-300 p-4 rounded-lg shadow">

// ✅ ADAPTAÇÃO CORRETA:
const { isDark } = useTheme()

<div className={`
    p-4 rounded-lg shadow transition-colors  // ← Layout preservado
    ${isDark 
        ? 'bg-gray-800 border-gray-700 text-white'    // ← Tema adaptado
        : 'bg-white border-gray-300 text-gray-900'    // ← Tema adaptado
    }
    border                                            // ← Layout preservado
`}>
```

**REGRAS DE ADAPTAÇÃO:**

1. **Classes de Layout (PRESERVAR)**:
   - Posicionamento: `relative`, `absolute`, `fixed`, `static`
   - Display: `flex`, `grid`, `block`, `inline-flex`
   - Dimensões: `w-*`, `h-*`, `min-w-*`, `max-w-*`
   - Spacing: `p-*`, `m-*`, `gap-*`
   - Estrutura: `rounded-*`, `shadow-*`

2. **Classes de Tema (ADAPTAR)**:
   - Backgrounds: `bg-*` → usar contexto
   - Borders: `border-*-color` → usar contexto  
   - Text: `text-*-color` → usar contexto
   - Hover/Focus states → usar contexto

**Exemplo de mapeamento:**

```tsx
// ✅ MAPEAMENTO CORRETO de cores
const themeClasses = {
    // Backgrounds
    'bg-white': isDark ? 'bg-gray-800' : 'bg-white',
    'bg-gray-50': isDark ? 'bg-gray-900' : 'bg-gray-50',
    'bg-blue-500': isDark ? 'bg-blue-600' : 'bg-blue-500',
    
    // Borders  
    'border-gray-300': isDark ? 'border-gray-700' : 'border-gray-300',
    'border-blue-400': isDark ? 'border-blue-500' : 'border-blue-400',
    
    // Text
    'text-gray-900': isDark ? 'text-white' : 'text-gray-900',
    'text-gray-600': isDark ? 'text-gray-300' : 'text-gray-600',
}
```

**Classes de tema padrão da aplicação:**
- **Backgrounds:** `bg-white dark:bg-gray-800`, `bg-gray-50 dark:bg-gray-900`
- **Borders:** `border-gray-200 dark:border-gray-700`
- **Text:** `text-gray-900 dark:text-white`, `text-gray-600 dark:text-gray-300`
- **Cards:** `bg-card text-card-foreground border border-border`

## COMPONENTES EXISTENTES NA BIBLIOTECA

### Componentes Disponíveis em `src/components/ui/`:

1. **Button.tsx** - Botões com múltiplas variantes
2. **StatsCard.tsx** - Cards de estatísticas
3. **Select.tsx** - Dropdown de seleção
4. **ProgressStat.tsx** - Estatísticas com barra de progresso
5. **SortableProgressStats.tsx** - Estatísticas sortable com drag & drop
6. **Card.tsx** - Card básico
7. **Input.tsx** - Campo de entrada
8. **Textarea.tsx** - Área de texto
9. **ThemeToggle.tsx** - Alternador de tema

### Exemplo de Uso dos Componentes:

```tsx
import { Button } from '@/components/ui/Button'
import { StatsCard } from '@/components/ui/StatsCard'
import { Select } from '@/components/ui/Select'

const MinhaPage = () => {
    const { isDark } = useTheme()
    
    return (
        <div className="space-y-6">
            <Button variant="primary" size="md">
                Ação Principal
            </Button>
            
            <StatsCard
                title="Usuários Ativos"
                value="1,234"
                icon={Users}
                iconColor="primary"
                variant="telescope"
                isDark={isDark}
            />
        </div>
    )
}
```

## FLUXO DE TRABALHO PARA AGENTES

### 1. ADAPTANDO COMPONENTES DE HTML/CSS EXISTENTE

**PROCESSO OBRIGATÓRIO:**

**Passo 1: ANÁLISE** 📋
```tsx
// 1. Identifique o HTML/CSS original
// 2. Separe classes de LAYOUT vs TEMA
// 3. Analise funcionalidades (animações, estados, etc.)

// EXEMPLO: HTML original
// <div class="dropdown relative inline-flex">
//   <button class="btn btn-primary">Dropdown</button>
//   <ul class="dropdown-menu hidden min-w-60">...</ul>
// </div>
```

**Passo 2: PRESERVAÇÃO** 🏗️
```tsx
// Mantenha TODA estrutura e layout:
// ✅ relative inline-flex (posicionamento)
// ✅ min-w-60 (dimensões)  
// ✅ hidden (estados)
// ✅ Funcionalidades (dropdown behavior)

const { isDark } = useTheme()
const { isMobile } = useLayout()

return (
    <div className="relative inline-flex"> {/* Layout preservado */}
        <button className={`/* tema adaptado */`}>
        <ul className={`min-w-60 ${isOpen ? 'opacity-100' : 'hidden'}`}>
)
```

**Passo 3: ADAPTAÇÃO** 🎨
```tsx
// Adapte APENAS cores e temas:
const variantClasses = {
    primary: isDark 
        ? 'bg-blue-600 hover:bg-blue-700 text-white'  // Dark theme
        : 'bg-blue-500 hover:bg-blue-600 text-white'  // Light theme
}
```

### 2. CRIANDO NOVOS COMPONENTES DO ZERO

**Passo 1:** Criar componente em `src/components/ui/`
```tsx
// src/components/ui/NovoComponente.tsx
'use client'

import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'

export const NovoComponente: React.FC<Props> = (props) => {
    const { isDark } = useTheme()
    const { isMobile } = useLayout()
    
    // Implementação com suporte a tema
}
```

**Passo 2:** Exportar no index
```tsx
// src/components/ui/index.ts
export { NovoComponente } from './NovoComponente'
```

**Passo 3:** Criar exemplo na página de demonstração
```tsx
// src/components/examples/FlyonCardExamples.tsx
import { NovoComponente } from '@/components/ui/NovoComponente'

// Adicionar seção demonstrando o componente
```

### 3. REFATORANDO COMPONENTES EXISTENTES

**CHECKLIST DE PRESERVAÇÃO:**

1. **Layout e Estrutura** 🏗️
   - ✅ Classes de posicionamento mantidas? (`relative`, `absolute`, `flex`)
   - ✅ Dimensões preservadas? (`w-*`, `h-*`, `min-w-*`)
   - ✅ Espaçamentos mantidos? (`p-*`, `m-*`, `gap-*`)
   - ✅ Bordas e sombras preservadas? (`rounded-*`, `shadow-*`)

2. **Funcionalidades** ⚙️
   - ✅ Estados de interação mantidos? (hover, focus, active)
   - ✅ Animações preservadas? (`transition-*`, `transform`)
   - ✅ Comportamentos JavaScript mantidos?
   - ✅ Acessibilidade preservada? (aria-*, role)

3. **Adaptação de Tema** 🎨
   - ✅ Usa `useTheme()` e `useLayout()`?
   - ✅ Suporta dark/light mode?
   - ✅ Classes de cor adaptadas ao contexto?
   - ✅ É responsivo com `isMobile`?

4. **Padrões da Aplicação** 📐
   - ✅ Está em `src/components/ui/`?
   - ✅ Tem props consistentes (variant, size, className)?
   - ✅ Exportado no `index.ts`?
   - ✅ Exemplo adicionado à página de demonstração?

**EXEMPLO DE REFATORAÇÃO CORRETA:**
```tsx
// ❌ ANTES (sem contextos)
const Dropdown = () => (
    <div className="dropdown relative inline-flex">
        <button className="btn btn-primary bg-blue-500">
            Dropdown
        </button>
    </div>
)

// ✅ DEPOIS (com contextos, layout preservado)
const Dropdown = () => {
    const { isDark } = useTheme()
    const { isMobile } = useLayout()
    
    return (
        <div className="relative inline-flex"> {/* Layout mantido */}
            <button className={`
                btn px-4 py-2 rounded-lg transition-colors  // Layout mantido
                ${isDark 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'   // Tema adaptado
                    : 'bg-blue-500 hover:bg-blue-600 text-white'   // Tema adaptado
                }
                ${isMobile ? 'touch-manipulation' : ''}           // Responsivo
            `}>
                Dropdown
            </button>
        </div>
    )
}
```

## 🔧 DIRETRIZES ESPECÍFICAS DE PRESERVAÇÃO

### COMPONENTES BASEADOS EM FRAMEWORKS EXTERNOS

Quando adaptar componentes de **FlyonUI**, **DaisyUI**, **Bootstrap**, ou similares:

#### 1. **MANTER Classes Funcionais**
```tsx
// ✅ PRESERVAR funcionalidades específicas do framework
// Exemplo: DaisyUI dropdown
<div className="dropdown relative inline-flex"> {/* Comportamento dropdown */}
    <button className="dropdown-toggle"> {/* Trigger funcional */}
    <ul className="dropdown-menu dropdown-open:opacity-100"> {/* Estados CSS */}
```

#### 2. **ADAPTAR Apenas Appearance**
```tsx
// ✅ Substituir apenas classes visuais
// ANTES: class="btn btn-primary"
// DEPOIS: className={`btn ${variantClasses[variant]}`}

const variantClasses = {
    primary: isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
}
```

#### 3. **PRESERVAR Estados CSS**
```tsx
// ✅ MANTER estados específicos do framework
className="dropdown-open:rotate-180" // Rotação do ícone
className="dropdown-open:opacity-100" // Visibilidade do menu
className="btn-active:scale-95"       // Estado ativo
```

#### 4. **MANTER Estrutura Hierárquica**
```tsx
// ✅ PRESERVAR hierarquia exata do HTML
<div className="dropdown">           {/* Container */}
    <button className="dropdown-toggle"> {/* Trigger */}
    <ul className="dropdown-menu">      {/* Menu */}
        <li className="dropdown-header"> {/* Header */}
        <li className="dropdown-item">   {/* Items */}
        <li className="dropdown-footer"> {/* Footer */}
```

### PRESERVAÇÃO DE ANIMAÇÕES E TRANSIÇÕES

```tsx
// ✅ MANTER todas as transições e animações
className="transition-all duration-200"           // Transições
className="transform scale-100"                   // Transformações  
className="dropdown-open:rotate-180"              // Animações de estado
className="hover:bg-opacity-80"                   // Estados hover
className="focus:ring-2 focus:ring-offset-2"      // Estados focus
```

### ACESSIBILIDADE (NUNCA REMOVER)

```tsx
// ✅ PRESERVAR TODOS os atributos de acessibilidade
aria-haspopup="menu"
aria-expanded={isOpen}
aria-label="Dropdown menu"
role="menu"
role="menuitem"
tabIndex={0}
```

## VARIANTES E TAMANHOS PADRÃO

### Variantes Obrigatórias:
- `default` - Estilo padrão
- `primary` - Ação principal
- `secondary` - Ação secundária
- `success` - Sucesso/positivo
- `warning` - Aviso
- `error` - Erro/negativo
- `info` - Informativo

### Tamanhos Obrigatórios:
- `sm` - Pequeno
- `md` - Médio (padrão)
- `lg` - Grande
- `xl` - Extra grande (opcional)

## EXEMPLOS DE IMPLEMENTAÇÃO

### Componente Complexo com Contextos:

```tsx
'use client'

import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import { twMerge } from 'tailwind-merge'
import { LucideIcon } from 'lucide-react'

interface DashboardCardProps {
    title: string
    value: string
    icon: LucideIcon
    trend?: {
        value: number
        isPositive: boolean
    }
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
    title,
    value,
    icon: Icon,
    trend,
    variant = 'default',
    size = 'md',
    className
}) => {
    const { isDark } = useTheme()
    const { isMobile } = useLayout()
    
    const baseClasses = `
        rounded-xl border transition-all duration-300 
        ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        hover:shadow-lg
    `
    
    const sizeClasses = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    }
    
    const variantClasses = {
        default: isDark ? 'text-white' : 'text-gray-900',
        primary: 'text-blue-600 dark:text-blue-400',
        success: 'text-green-600 dark:text-green-400',
        warning: 'text-yellow-600 dark:text-yellow-400',
        error: 'text-red-600 dark:text-red-400'
    }
    
    return (
        <div className={twMerge(
            baseClasses,
            sizeClasses[size],
            className
        )}>
            <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${
                    isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                    <Icon className={`w-6 h-6 ${variantClasses[variant]}`} />
                </div>
                
                {trend && (
                    <div className={`text-sm ${
                        trend.isPositive 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                    }`}>
                        {trend.isPositive ? '↗' : '↘'} {trend.value}%
                    </div>
                )}
            </div>
            
            <div className="mt-4">
                <h3 className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                }`}>
                    {value}
                </h3>
                <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                    {title}
                </p>
            </div>
        </div>
    )
}
```

## VALIDAÇÃO E TESTES

### Checklist Obrigatório:
1. ✅ Componente usa `useTheme()` e `useLayout()`
2. ✅ Suporta tema dark/light corretamente
3. ✅ É responsivo (funciona em mobile)
4. ✅ Está documentado com exemplos
5. ✅ Segue padrões de naming (PascalCase)
6. ✅ Tem TypeScript tipado corretamente
7. ✅ Usa Tailwind CSS consistentemente
8. ✅ Está exportado no index da biblioteca

### Comando para Testar:
```bash
npm run dev
# Navegar para /admin/flyon-cards para ver exemplos
```

## RESTRIÇÕES IMPORTANTES

### ❌ NÃO PERMITIDO:
- Implementar detecção manual de tema
- Criar componentes fora de `src/components/ui/`
- Usar CSS-in-JS ou styled-components
- Ignorar os contextos de tema/layout
- Criar estados locais para tema ou layout
- Usar hardcoded colors (sempre usar classes Tailwind)

### ✅ SEMPRE OBRIGATÓRIO:
- Usar contextos `useTheme()` e `useLayout()`
- Colocar componentes em `src/components/ui/`
- Suportar variantes e tamanhos
- Ser responsivo e acessível
- Documentar com exemplos
- Seguir padrões de design existentes

## CONTEXTOS DISPONÍVEIS

### ThemeContext:
```tsx
const { theme, isDark, toggleTheme, mounted } = useTheme()
```

### LayoutContext:
```tsx
const { 
    isMobile, 
    sidebarOpen, 
    sidebarCollapsed,
    mounted,
    toggleSidebar,
    searchOpen,
    notificationsOpen 
} = useLayout()
```

---

**⚠️ RESTRIÇÕES IMPORTANTES PARA PRESERVAÇÃO:**

**LAYOUT E ESTRUTURA:**
- ❌ NUNCA alterar estrutura HTML existente
- ❌ NUNCA remover classes de layout funcionais
- ❌ NUNCA quebrar hierarquia de componentes
- ❌ NUNCA remover animações ou transições existentes
- ❌ NUNCA remover atributos de acessibilidade

**TEMA E CONTEXTOS:**
- ❌ NUNCA criar componentes fora de `src/components/ui/`
- ❌ NUNCA ignorar os contextos de tema e layout
- ❌ NUNCA usar detecção manual de tema
- ✅ SEMPRE preservar layout, adaptar apenas cores
- ✅ SEMPRE usar TypeScript e Tailwind CSS
- ✅ SEMPRE seguir os padrões de nomenclatura estabelecidos

**FUNCIONALIDADES:**
- ❌ NUNCA remover comportamentos JavaScript existentes
- ❌ NUNCA alterar estados CSS específicos de frameworks
- ✅ SEMPRE manter funcionalidades originais
- ✅ SEMPRE preservar interações e animações

**🔗 DOCUMENTAÇÃO ADICIONAL:**
- **AGENT-WORKFLOWS.md** - Cenários práticos detalhados e workflows step-by-step
- **README.md** - Documentação geral do projeto  
- **FLYON-CARD-INTEGRATION.md** - Exemplo completo de integração

**🎯 OBJETIVO:** Componentes que mantêm TODA funcionalidade original, apenas adaptados ao tema da aplicação Telescope ADM.
