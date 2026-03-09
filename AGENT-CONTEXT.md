# 🔭 Telescope ADM - Contexto do Agente de IA

## 🤖 Qual Agente Está Sendo Usado?

Este projeto utiliza o **GitHub Copilot Coding Agent** (modelo Claude Sonnet) como assistente de desenvolvimento.  
As instruções de comportamento do agente ficam em `.github/copilot-instructions.md`.

---

## 📋 Visão Geral do Projeto

**Telescope ADM** é um sistema administrativo moderno construído com:

- **Next.js 15** (App Router + Server Actions)
- **React 19**
- **Tailwind CSS** (design glassmorphism)
- **TypeScript** (tipagem completa)
- **Redis** (gerenciamento de sessão)
- **JWT + Refresh Token** (autenticação)

---

## 🗂️ Estrutura de Diretórios

```
src/
├── app/                        # Next.js 15 App Router
│   ├── admin/                  # Rotas protegidas do admin
│   │   ├── page.tsx            # Dashboard admin
│   │   ├── dashboard/          # Página de analytics
│   │   ├── profile/            # Perfil do usuário
│   │   ├── usuarios/           # Gerenciamento de usuários
│   │   ├── powerbi/            # Integração Power BI
│   │   ├── gerenciador-pdfs/   # Gerenciador de PDFs
│   │   └── biblioteca-componentes/ # Biblioteca de componentes
│   ├── auth/                   # Páginas de autenticação (públicas)
│   │   ├── login/              # Login
│   │   ├── alterar-senha/      # Alterar senha
│   │   ├── recovery/           # Recuperação de senha
│   │   └── no-access/          # Acesso negado
│   ├── api/                    # API Routes (server-side)
│   │   ├── auth/               # Endpoints de autenticação
│   │   ├── pdfs/               # Operações com PDFs
│   │   ├── tasy/               # Integração TASY
│   │   ├── usershield/         # Autenticação UserShield
│   │   └── sharepoint/         # Integração SharePoint
│   ├── layout.tsx              # Root layout com providers
│   ├── page.tsx                # Página inicial
│   └── providers.tsx           # Inicialização dos providers
│
├── components/
│   ├── ui/                     # ⭐ ÚNICO local para componentes UI
│   │   ├── index.ts            # Exportações centralizadas
│   │   ├── FlyonCard.tsx       # Sistema de cards
│   │   ├── FlyonSidebar.tsx    # Sidebar responsiva
│   │   ├── Layout.tsx          # Layout principal
│   │   ├── Button.tsx          # Botões
│   │   ├── Input.tsx           # Inputs de formulário
│   │   ├── Modal.tsx           # Modais
│   │   ├── Card.tsx            # Cards básicos
│   │   ├── Dropdown.tsx        # Dropdowns
│   │   ├── ThemeToggle.tsx     # Toggle de tema
│   │   └── ...outros
│   ├── analytics/              # Componentes de analytics
│   ├── auth/                   # Componentes de autenticação
│   ├── dashboard/              # Componentes do dashboard
│   ├── examples/               # Exemplos de uso
│   │   └── FlyonCardExamples.tsx
│   └── layout/                 # Componentes de layout
│
├── contexts/                   # Contextos React
│   ├── ThemeContext.tsx         # ⭐ Tema (light/dark)
│   ├── LayoutContext.tsx        # ⭐ Layout e sidebar
│   ├── AuthContext.tsx          # Autenticação
│   ├── NotificationContext.tsx  # Notificações
│   ├── MenuVisibilityContext.tsx # Visibilidade do menu
│   ├── PDFContext.tsx           # Contexto de PDFs
│   └── TelescopeContext.tsx     # Contexto global
│
├── services/                   # Clientes de API
├── lib/                        # Utilitários e session management
├── hooks/                      # Custom React hooks
├── types/                      # Interfaces TypeScript
├── styles/                     # CSS global
└── middleware.ts               # Proteção de rotas
```

---

## 🎨 Contextos Obrigatórios

### `useTheme()` — ThemeContext

```tsx
import { useTheme } from '@/contexts/ThemeContext'

const { theme, isDark, toggleTheme, setTheme } = useTheme()
// theme: 'light' | 'dark'
// isDark: boolean
// toggleTheme: () => void
// setTheme: (theme: 'light' | 'dark') => void
```

**Comportamento:**
- Tema padrão: **dark**
- Persistência via `localStorage` (chave: `'telescope-theme'`)
- Respeita `prefers-color-scheme` do sistema
- Classes aplicadas em `document.documentElement`

### `useLayout()` — LayoutContext

```tsx
import { useLayout } from '@/contexts/LayoutContext'

const {
    sidebarOpen, sidebarCollapsed, toggleSidebar, setSidebarOpen,
    collapseSidebar, toggleMobileSidebar,
    isMobile, mounted,
    searchOpen, searchQuery, setSearchOpen, setSearchQuery, toggleSearch,
    notificationsOpen, notificationsCount, setNotificationsOpen,
    setNotificationsCount, toggleNotifications
} = useLayout()
```

**Comportamento:**
- `isMobile`: `true` quando `window.width < 1024px` (breakpoint `lg`)
- Previne hydration mismatch com estado `mounted`
- Listener de resize com cleanup no unmount

---

## 🧩 Padrão de Componente UI

Todo componente em `src/components/ui/` deve seguir este padrão:

```tsx
'use client'

import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'

interface MeuComponenteProps {
    // props tipadas aqui
    children?: React.ReactNode
    className?: string
}

export const MeuComponente: React.FC<MeuComponenteProps> = ({ children, className }) => {
    const { isDark } = useTheme()
    const { isMobile } = useLayout()

    return (
        <div className={`transition-colors duration-200 ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        } ${isMobile ? 'p-2' : 'p-4'} ${className ?? ''}`}>
            {children}
        </div>
    )
}
```

### Regras Obrigatórias

| Regra | Descrição |
|-------|-----------|
| ✅ `'use client'` | Sempre no topo do arquivo |
| ✅ `useTheme()` | Para variantes dark/light |
| ✅ `useLayout()` | Para responsividade mobile/desktop |
| ✅ TypeScript | Props com interfaces tipadas |
| ✅ Tailwind CSS | Sem CSS inline ou arquivos CSS separados |
| ✅ Exportar em `index.ts` | Sempre re-exportar no arquivo de barrel |
| ❌ CSS inline | Nunca usar `style={{}}` para estilos visuais |
| ❌ `window.innerWidth` manual | Usar `isMobile` do contexto |
| ❌ `localStorage` de tema manual | Usar `useTheme()` |

---

## 🔐 Arquitetura de Autenticação

```
Cliente → Middleware → API Route (server-side) → Backend externo
             ↓
         Proteção de rota
         Verificação de sessão Redis
         Refresh automático de token
```

**Fluxo de login:**
1. `POST /api/auth/login` → valida credenciais com backend
2. Sessão criada no Redis com TTL
3. Cookie `session_id` setado (httpOnly, secure)
4. Middleware verifica sessão Redis em cada request protegido
5. Token JWT gerenciado server-side (sem exposição ao cliente)

**Rotas protegidas:** `/admin/*`  
**Rotas públicas:** `/auth/*`, `/api/health`

---

## 🎨 Design System

**Paleta de cores principal:**
- Primária: `blue-600`, `blue-700`
- Secundária: `purple-600`, `indigo-600`
- Dark bg: `gray-900`, `gray-800`, `gray-700`
- Light bg: `white`, `gray-50`, `gray-100`

**Efeitos visuais:**
- Glassmorphism: `backdrop-blur-sm`, `bg-opacity-*`
- Transições: `transition-colors duration-200`
- Sombras: `shadow-md`, `shadow-lg`, `shadow-xl`

**Fontes:** Montserrat, Rubik (configuradas no `layout.tsx`)

---

## 🛠️ Scripts Disponíveis

```bash
npm run dev              # Servidor de desenvolvimento (Turbopack)
npm run build            # Build de produção
npm run start            # Servidor de produção
npm run lint             # ESLint
npm run type-check       # TypeScript check
npm run test:unit        # Testes unitários
npm run test:integration # Testes de integração
```

---

## 📦 Principais Dependências

| Pacote | Versão | Uso |
|--------|--------|-----|
| `next` | 15.x | Framework |
| `react` | 19.x | UI |
| `tailwindcss` | 3.4 | Estilos |
| `typescript` | 5.x | Tipagem |
| `axios` | 1.x | HTTP client |
| `ioredis` | 5.x | Redis (sessões) |
| `formik` + `yup` | latest | Formulários |
| `lucide-react` | latest | Ícones |
| `framer-motion` | 12.x | Animações |
| `recharts` | 3.x | Gráficos |
| `pdf-lib` | 1.x | Manipulação de PDFs |
| `powerbi-client` | 2.x | Power BI embed |
| `jest` | 29.x | Testes |

---

## 📖 Documentação Adicional

| Arquivo | Conteúdo |
|---------|----------|
| `docs/00-COMECE-AQUI.md` | Ponto de entrada com diagrama de fluxo |
| `docs/AUTHENTICATION_README.md` | Arquitetura técnica de autenticação |
| `docs/MIDDLEWARE.md` | Proteção de rotas com middleware |
| `docs/README_TESTES.md` | Setup e execução de testes |
| `docs/REDIS_TESTING.md` | Configuração e testes do Redis |
| `docs/WEBHOOK_MONITOR_README.md` | Sistema de monitoramento de webhooks |
| `AGENT-WORKFLOWS.md` | Workflows práticos para o agente |
