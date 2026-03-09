# 🔭 Telescope ADM - Design System Master

## 📋 Visão Geral

Este documento define o design system completo do **Telescope ADM**, garantindo consistência visual, acessibilidade e boas práticas em toda a aplicação.

---

## 🎨 PALETA DE CORES

### Dark Mode OLED (Tema Principal)

O Telescope ADM utiliza **Dark Mode OLED** como tema principal, com cores profundas e alto contraste.

#### Cores Base
```css
Background Base:         #0F172A  /* slate-900 - bg-[#0F172A] */
Background Cards:        #1E293B  /* slate-800 - bg-[#1E293B] */
Background Elevated:     #334155  /* slate-700 */
Text Primary:            #F8FAFC  /* slate-50  - text-[#F8FAFC] */
Text Secondary:          #CBD5E1  /* slate-300 */
Text Muted:              #94A3B8  /* slate-400 */
Border:                  #334155  /* slate-700 */
```

#### Cores de Ação e Destaque
```css
Primary Action:          #06B6D4  /* cyan-500 */
Primary Action Hover:    #0891B2  /* cyan-600 */
Primary Action Active:   #0E7490  /* cyan-700 */
```

**Uso:** Botões primários, badges, indicadores ativos, links, estados de foco.

### Cores Semânticas

#### Success (Verde Moderno)
```css
Success Light:           #86EFAC  /* green-300 */
Success Base:            #22C55E  /* green-500 */
Success Dark:            #16A34A  /* green-600 */
```

#### Warning (Âmbar Elegante)
```css
Warning Light:           #FCD34D  /* amber-300 */
Warning Base:            #F59E0B  /* amber-500 */
Warning Dark:            #D97706  /* amber-600 */
```

#### Error/Destructive (Vermelho Sofisticado)
```css
Error Light:             #FCA5A5  /* red-300 */
Error Base:              #EF4444  /* red-500 */
Error Dark:              #DC2626  /* red-600 */
```

#### Info (Azul Professional)
```css
Info Light:              #7DD3FC  /* sky-300 */
Info Base:               #0EA5E9  /* sky-500 */
Info Dark:               #0284C7  /* sky-600 */
```

### Cores Específicas do Sistema

#### Variáveis CSS Customizadas
A aplicação utiliza um sistema de cores baseado em variáveis CSS (definidas em `src/styles/themes.css`):

```css
/* Cores Primárias (Azul Professional) */
--color-primary-500: 14 165 233    /* Tailwind: primary-500 */
--color-primary-600: 2 132 199     /* Tailwind: primary-600 */

/* Cores Secundárias (Cinza Neutro) */
--color-secondary-500: 100 116 139 /* Tailwind: secondary-500 */
--color-secondary-600: 71 85 105   /* Tailwind: secondary-600 */

/* Sistema */
--color-background: 248 250 252    /* Light mode */
--color-foreground: 15 23 42       /* Text */
--color-card: 255 255 255          /* Cards */
--color-border: 203 213 225        /* Borders */
```

#### Cores Neon (Dashfolio Plus)
```css
Neon Green:              #00FF88  /* rgb(0 255 136) */
Neon Blue:               #00BFFF  /* rgb(0 191 255) */
Neon Pink:               #FF3366  /* rgb(255 51 102) */
Neon Yellow:             #FFDC00  /* rgb(255 220 0) */
Neon Orange:             #FF8800  /* rgb(255 136 0) */
Neon Purple:             #9333EA  /* rgb(147 51 234) */
```

#### Cores do Sistema Original Telescope
```css
Telescope Dark:          #222233
Telescope Card:          #1b202d
Telescope Icon:          #d1d4d4
Telescope Text:          #525f7f
```

---

## 🔤 TIPOGRAFIA

### Fonte Global
**Inter** (Google Fonts) - definida em `src/app/layout.tsx`

```typescript
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
```

**⚠️ IMPORTANTE:** Nunca forçar outra fonte em componentes. A fonte Inter é aplicada globalmente no `body`.

### Escala Tipográfica

#### Títulos
```css
/* Title XL - Headings principais */
.text-title-xl {
  font-size: 2.25rem;      /* 36px */
  line-height: 2.5rem;     /* 40px */
  font-weight: 700;        /* bold */
}

/* Title LG - Headings de seção */
.text-title-lg {
  font-size: 1.875rem;     /* 30px */
  line-height: 2.25rem;    /* 36px */
  font-weight: 700;        /* bold */
}

/* Title MD - Headings de sub-seção */
.text-title-md {
  font-size: 1.5rem;       /* 24px */
  line-height: 2rem;       /* 32px */
  font-weight: 600;        /* semibold */
}

/* Title SM - Headings menores */
.text-title-sm {
  font-size: 1.25rem;      /* 20px */
  line-height: 1.75rem;    /* 28px */
  font-weight: 600;        /* semibold */
}
```

#### Corpo de Texto
```css
/* Body LG - Texto destacado */
.text-body-lg {
  font-size: 1.125rem;     /* 18px */
  line-height: 1.75rem;    /* 28px */
  font-weight: 400;        /* normal */
}

/* Body MD - Texto padrão */
.text-body-md {
  font-size: 1rem;         /* 16px */
  line-height: 1.5rem;     /* 24px */
  font-weight: 400;        /* normal */
}

/* Body SM - Texto secundário */
.text-body-sm {
  font-size: 0.875rem;     /* 14px */
  line-height: 1.25rem;    /* 20px */
  font-weight: 400;        /* normal */
}

/* Body XS - Legendas e metadados */
.text-body-xs {
  font-size: 0.75rem;      /* 12px */
  line-height: 1rem;       /* 16px */
  font-weight: 400;        /* normal */
}
```

### Pesos de Fonte (Font Weight)
```css
font-normal:     400  /* Corpo de texto */
font-medium:     500  /* Ênfase leve */
font-semibold:   600  /* Subtítulos */
font-bold:       700  /* Títulos principais */
```

---

## 📐 ESPAÇAMENTO

### Sistema de Espaçamento Padronizado

#### Padding
```css
/* Containers */
.p-container-sm:  0.75rem  /* 12px */
.p-container-md:  1.5rem   /* 24px */
.p-container-lg:  2.5rem   /* 40px */

/* Cards */
.p-card:          1.5rem   /* 24px */

/* Buttons */
.p-btn-sm:        0.5rem 1rem      /* 8px 16px */
.p-btn-md:        0.75rem 1.5rem   /* 12px 24px */
.p-btn-lg:        1rem 2rem        /* 16px 32px */
```

#### Margin
```css
/* Seções */
.mb-section:      2rem     /* 32px */
.mt-section:      2rem     /* 32px */

/* Elementos */
.mb-element:      1rem     /* 16px */
.mt-element:      1rem     /* 16px */

/* Cards */
.mb-card:         1.5rem   /* 24px */
```

### Escala Tailwind (8-point grid)
```
0:    0px
1:    0.25rem  (4px)
2:    0.5rem   (8px)
3:    0.75rem  (12px)
4:    1rem     (16px)
5:    1.25rem  (20px)
6:    1.5rem   (24px)
8:    2rem     (32px)
10:   2.5rem   (40px)
12:   3rem     (48px)
16:   4rem     (64px)
20:   5rem     (80px)
24:   6rem     (96px)
```

---

## 🎭 COMPONENTES

### Botões

#### Variantes
```tsx
/* Primary - Ação principal */
className="bg-cyan-500 hover:bg-cyan-600 text-white"

/* Secondary - Ação secundária */
className="bg-slate-700 hover:bg-slate-600 text-white"

/* Outline - Ação terciária */
className="border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white"

/* Destructive - Ação destrutiva */
className="bg-red-500 hover:bg-red-600 text-white"

/* Ghost - Ação sutil */
className="text-slate-300 hover:bg-slate-700"
```

#### Tamanhos
```tsx
/* Small */
className="text-sm px-3 py-1.5"

/* Medium (padrão) */
className="text-base px-4 py-2"

/* Large */
className="text-lg px-6 py-3"
```

#### Estados
```tsx
/* Hover */
className="transition-colors duration-200"

/* Focus (acessibilidade) */
className="focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900"

/* Disabled */
className="disabled:opacity-50 disabled:cursor-not-allowed"

/* Loading */
className="cursor-wait opacity-70"
```

### Cards

#### Base
```tsx
className="bg-[#1E293B] rounded-lg p-6 border border-slate-700"
```

#### Elevated (com sombra)
```tsx
className="bg-[#1E293B] rounded-lg p-6 border border-slate-700 shadow-lg"
```

#### Interactive (hover)
```tsx
className="bg-[#1E293B] rounded-lg p-6 border border-slate-700 hover:border-cyan-500 transition-colors duration-200 cursor-pointer"
```

### Inputs

#### Text Input
```tsx
className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
```

#### Select
```tsx
className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
```

#### Textarea
```tsx
className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
```

### Modais

#### Overlay
```tsx
className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
```

#### Container
```tsx
className="fixed inset-0 z-50 flex items-center justify-center p-4"
```

#### Content
```tsx
className="bg-[#1E293B] rounded-lg border border-slate-700 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
```

### Badges

#### Success
```tsx
className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30"
```

#### Warning
```tsx
className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30"
```

#### Error
```tsx
className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30"
```

#### Info
```tsx
className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
```

---

## 🎬 ANIMAÇÕES E TRANSIÇÕES

### Durações Padrão
```css
duration-150:  150ms  /* Micro-interações (hover de botões) */
duration-200:  200ms  /* Transições padrão (cores, opacidade) */
duration-300:  300ms  /* Animações suaves (modais, dropdowns) */
duration-500:  500ms  /* Animações complexas (carregamento) */
```

### Easing Functions
```css
ease-in:       cubic-bezier(0.4, 0, 1, 1)
ease-out:      cubic-bezier(0, 0, 0.2, 1)      /* Padrão */
ease-in-out:   cubic-bezier(0.4, 0, 0.2, 1)
```

### Transições Comuns
```tsx
/* Cores */
className="transition-colors duration-200"

/* Todas as propriedades */
className="transition-all duration-200"

/* Opacidade */
className="transition-opacity duration-200"

/* Transform */
className="transition-transform duration-200"
```

---

## 🌈 EFEITOS E SOMBRAS

### Box Shadow
```css
/* Theme Shadows (definidas em Tailwind) */
shadow-theme:    var(--shadow-theme)
shadow-theme-lg: var(--shadow-theme-lg)
shadow-theme-xl: var(--shadow-theme-xl)

/* Telescope Custom */
shadow-telescope: 0 8px 32px -8px rgba(0, 0, 0, 0.4),
                  0 4px 16px -4px rgba(0, 0, 0, 0.3)

/* Neon Effects */
shadow-neon-green:  0 0 20px rgb(0 255 136 / 0.3)
shadow-neon-blue:   0 0 20px rgb(0 191 255 / 0.3)
shadow-neon-pink:   0 0 20px rgb(255 51 102 / 0.3)
shadow-neon-yellow: 0 0 20px rgb(255 220 0 / 0.3)

/* Dashfolio */
shadow-dashfolio:    0 4px 20px -2px rgba(124 58 237 / 0.3)
shadow-dashfolio-lg: 0 8px 32px -4px rgba(124 58 237 / 0.4)
```

### Gradientes

#### Background Images
```tsx
/* Telescope Header */
className="bg-telescope-header"
/* linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(101,9,121,1) 35%, rgba(51,4,66,1) 100%) */

/* Telescope Card */
className="bg-telescope-card"

/* Dashfolio Primary */
className="bg-dashfolio-primary"

/* Dashfolio Sidebar */
className="bg-dashfolio-sidebar"
/* linear-gradient(135deg, rgb(30 27 75) 0%, rgb(15 23 42) 100%) */
```

### Backdrop Blur
```tsx
/* Light */
className="backdrop-blur-sm"  /* 4px */

/* Medium */
className="backdrop-blur-md"  /* 12px */

/* Heavy */
className="backdrop-blur-lg"  /* 16px */

/* Custom Theme */
className="backdrop-blur-theme"  /* var(--backdrop-blur) */
```

---

## ♿ ACESSIBILIDADE

### Contraste de Cores
- **Mínimo:** 4.5:1 para texto normal
- **Mínimo:** 3:1 para texto grande (18px+ ou 14px+ bold)
- **Recomendado:** 7:1 para AAA

### Estados de Foco
**OBRIGATÓRIO:** Todos os elementos interativos devem ter estado de foco visível.

```tsx
/* Foco padrão */
className="focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900"

/* Foco em inputs */
className="focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
```

### Cursor States
```tsx
/* Elementos clicáveis */
className="cursor-pointer"

/* Elementos desabilitados */
className="cursor-not-allowed"

/* Elementos de loading */
className="cursor-wait"

/* Elementos de texto editável */
className="cursor-text"
```

### ARIA Labels
```tsx
/* Botões apenas com ícones */
<button aria-label="Fechar modal">
  <XIcon />
</button>

/* Status dinâmico */
<div role="status" aria-live="polite">
  Carregando...
</div>

/* Regiões */
<nav aria-label="Menu principal">
  {/* ... */}
</nav>
```

---

## 📱 RESPONSIVIDADE

### Breakpoints Tailwind
```css
sm:   640px   /* Tablets pequenos */
md:   768px   /* Tablets */
lg:   1024px  /* Desktops */
xl:   1280px  /* Desktops grandes */
2xl:  1536px  /* Desktops extra grandes */
```

### Mobile-First Approach
```tsx
/* Base (mobile) */
className="text-sm px-2"

/* Tablet e acima */
className="text-sm md:text-base px-2 md:px-4"

/* Desktop e acima */
className="text-sm md:text-base lg:text-lg px-2 md:px-4 lg:px-6"
```

### Padrões de Layout Responsivo
```tsx
/* Grid responsivo */
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

/* Flex wrap */
className="flex flex-wrap gap-4"

/* Container com max-width */
className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"
```

---

## 🎯 ÍCONES

### Biblioteca: Lucide React
```tsx
import { Check, X, AlertCircle, Info } from 'lucide-react'
```

### Tamanhos Padrão
```tsx
/* Small - 16px */
<Icon size={16} />

/* Medium - 20px (padrão) */
<Icon size={20} />

/* Large - 24px */
<Icon size={24} />

/* XL - 32px */
<Icon size={32} />
```

### Cores
```tsx
/* Inherit do texto pai */
<Icon className="text-current" />

/* Específica */
<Icon className="text-cyan-500" />
```

### ⚠️ IMPORTANTE
**NUNCA use emojis como ícones.** Sempre use componentes de ícones da biblioteca Lucide React.

❌ **Errado:**
```tsx
<span>🔍</span>  {/* Não use emojis */}
```

✅ **Correto:**
```tsx
<Search size={20} className="text-cyan-500" />
```

---

## 🔧 UTILITÁRIOS TAILWIND

### Classes Utilitárias Personalizadas

Definidas em `src/app/globals.css`:

```css
/* Espaçamento */
.p-container-sm, .p-container-md, .p-container-lg
.p-card
.p-btn-sm, .p-btn-md, .p-btn-lg
.mb-section, .mt-section
.mb-element, .mt-element
.mb-card

/* Tipografia */
.text-title-xl, .text-title-lg, .text-title-md, .text-title-sm
.text-body-lg, .text-body-md, .text-body-sm, .text-body-xs

/* Borders */
.border-default, .border-subtle, .border-emphasis

/* Shadows */
.shadow-soft, .shadow-medium, .shadow-hard

/* Transitions */
.transition-base, .transition-fast, .transition-slow
```

---

## ✅ CHECKLIST DE QUALIDADE UI

Antes de entregar qualquer componente UI, verifique:

- [ ] **Sem emojis como ícones** - Usar apenas Lucide React
- [ ] **`cursor-pointer`** em elementos clicáveis
- [ ] **Transições** entre 150-300ms
- [ ] **Contraste mínimo** 4.5:1 (verificar em ferramenta)
- [ ] **Estados de foco visíveis** em todos os interativos
- [ ] **Responsivo** (testar em mobile, tablet, desktop)
- [ ] **Loading states** quando aplicável
- [ ] **Error states** quando aplicável
- [ ] **Disabled states** quando aplicável
- [ ] **Hover states** em elementos interativos
- [ ] **ARIA labels** quando necessário
- [ ] **Consistência** com design system

---

## 🚫 RESTRIÇÕES

### Não Fazer
- ❌ Usar emojis como ícones
- ❌ Forçar outra fonte além da Inter
- ❌ Criar cores customizadas sem documentar aqui
- ❌ Usar `!important` (exceto casos extremos documentados)
- ❌ Criar espaçamentos fora da escala de 8pt
- ❌ Ignorar estados de foco (acessibilidade)
- ❌ Usar animações longas (> 500ms)
- ❌ Texto com contraste insuficiente

### Fazer
- ✅ Usar sempre `cn()` para combinar classes
- ✅ Seguir a escala de espaçamento 8-point
- ✅ Usar variáveis CSS de cores quando possível
- ✅ Testar em diferentes tamanhos de tela
- ✅ Validar contraste de cores
- ✅ Documentar novas classes utilitárias

---

## 📖 REFERÊNCIAS

### Arquivos-Chave
- `tailwind.config.js` - Configuração Tailwind e cores
- `src/app/globals.css` - Classes utilitárias customizadas
- `src/styles/themes.css` - Variáveis CSS de temas
- `src/styles/theme-classes.css` - Classes de tema
- `src/app/layout.tsx` - Fonte Inter global

### Contextos Relacionados
- `.agents/docs/CONTEXT.md` - Arquitetura completa
- `.agents/docs/WORKFLOWS.md` - Workflows práticos
- `.agents/docs/INSTRUCTIONS.md` - Instruções de codificação

---

**Versão:** 1.0.0
**Última Atualização:** 2026-03-09
**Mantido por:** Equipe Telescope ADM
