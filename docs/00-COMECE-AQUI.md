# 🚀 COMECE AQUI - Fluxo Inicial da Aplicação

> **📌 Este é o primeiro arquivo que você deve ler para entender como a aplicação funciona!**

## 🎯 Visão Geral

Esta aplicação Next.js 15 usa uma arquitetura de **autenticação server-side** com middleware que protege todas as rotas antes mesmo do React ser executado.

---

## 📋 Índice Rápido

1. [Fluxo de Execução](#-fluxo-de-execução)
2. [Arquivos Chave](#-arquivos-chave-em-ordem-de-execução)
3. [Processo de Autenticação](#-processo-de-autenticação)
4. [Primeira Requisição](#-primeira-requisição-o-que-acontece)
5. [Redirecionamentos](#-lógica-de-redirecionamentos)
6. [Debug e Logs](#-como-debuggar-o-fluxo)

---

## 🔄 Fluxo de Execução

```
┌─────────────────────────────────────────────────────────────┐
│  USUÁRIO ACESSA URL (ex: /admin/profile)                    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  1️⃣  MIDDLEWARE (src/middleware.ts)                          │
│     ✓ Executa ANTES de tudo (< 10ms)                        │
│     ✓ Verifica cookie session_id                            │
│     ✓ Decide: continuar, redirecionar ou bloquear           │
└─────────────────────────────────────────────────────────────┘
                           ↓
              ┌────────────┴────────────┐
              │                         │
        [SEM SESSION]            [COM SESSION]
              │                         │
              ↓                         ↓
    ┌─────────────────┐      ┌──────────────────┐
    │ Redireciona     │      │ Permite Acesso   │
    │ → /auth/login   │      │ → Continua ➜     │
    └─────────────────┘      └──────────────────┘
                                      ↓
                    ┌─────────────────────────────────────┐
                    │  2️⃣  ROOT LAYOUT (src/app/layout.tsx) │
                    │     ✓ Carrega Providers              │
                    │     ✓ Inicializa Contextos           │
                    │     ✓ Configura ThemeProvider        │
                    └─────────────────────────────────────┘
                                      ↓
                    ┌─────────────────────────────────────┐
                    │  3️⃣  PROVIDERS (src/app/providers.tsx)│
                    │     ✓ AuthContext                    │
                    │     ✓ ThemeContext                   │
                    │     ✓ LayoutContext                  │
                    │     ✓ MenuVisibilityContext          │
                    └─────────────────────────────────────┘
                                      ↓
                    ┌─────────────────────────────────────┐
                    │  4️⃣  AUTH CONTEXT                     │
                    │     (src/contexts/AuthContext.tsx)   │
                    │     ✓ Busca dados do usuário na API  │
                    │     ✓ Valida sessão                  │
                    │     ✓ Disponibiliza { user, logout } │
                    └─────────────────────────────────────┘
                                      ↓
                    ┌─────────────────────────────────────┐
                    │  5️⃣  ADMIN LAYOUT                     │
                    │     (src/app/admin/layout.tsx)       │
                    │     ✓ Renderiza Sidebar              │
                    │     ✓ Renderiza TopBar               │
                    │     ✓ Define estrutura da página     │
                    └─────────────────────────────────────┘
                                      ↓
                    ┌─────────────────────────────────────┐
                    │  6️⃣  PÁGINA SOLICITADA                │
                    │     (ex: src/app/admin/profile)      │
                    │     ✓ Renderiza conteúdo específico  │
                    │     ✓ Usa useAuth() para dados       │
                    │     ✓ Usa useTheme() para tema       │
                    └─────────────────────────────────────┘
```

---

## 📁 Arquivos Chave (em ordem de execução)

### 1️⃣ **`src/middleware.ts`** - O GUARDIÃO

**Executa:** Primeiro de tudo (Edge Runtime - Server Side)

**Responsabilidade:**
- 🔐 Verificar se existe cookie `session_id`
- 🚦 Decidir se permite acesso ou redireciona
- 🛡️ Proteger rotas `/admin/*` e `/api/*`

**Exemplo de Código:**
```typescript
export async function middleware(req: NextRequest) {
  const sessionId = req.cookies.get('session_id')?.value
  
  // Rota protegida sem sessão → redireciona para login
  if (isProtectedRoute && !sessionId) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }
  
  // Já logado tentando acessar login → redireciona para admin
  if (isAuthRoute && sessionId) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }
  
  return NextResponse.next()
}
```

**📖 Documentação completa:** `docs/MIDDLEWARE.md`

---

### 2️⃣ **`src/app/layout.tsx`** - LAYOUT RAIZ

**Executa:** Depois do middleware (Server Component)

**Responsabilidade:**
- 🎨 Define estrutura HTML básica
- 🔌 Carrega Providers (contextos globais)
- 🌐 Configura metadados da página

**Exemplo de Código:**
```typescript
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

---

### 3️⃣ **`src/app/providers.tsx`** - CONTEXTOS GLOBAIS

**Executa:** Dentro do layout raiz (Client Component)

**Responsabilidade:**
- 🔐 **AuthContext** - Estado de autenticação
- 🎨 **ThemeContext** - Tema claro/escuro
- 📱 **LayoutContext** - Responsividade (mobile/desktop)
- 📋 **MenuVisibilityContext** - Estado do menu lateral

**Exemplo de Código:**
```typescript
'use client'

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <LayoutProvider>
        <MenuVisibilityProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </MenuVisibilityProvider>
      </LayoutProvider>
    </ThemeProvider>
  )
}
```

---

### 4️⃣ **`src/contexts/AuthContext.tsx`** - AUTENTICAÇÃO

**Executa:** Após Providers serem montados (Client Component)

**Responsabilidade:**
- 🔍 Buscar dados do usuário autenticado via API
- 💾 Armazenar estado do usuário em memória
- 🚪 Fornecer função `logout()`
- ✅ Validar sessão periodicamente

**Exemplo de Código:**
```typescript
'use client'

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Busca dados do usuário logado
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setUser(data))
      .finally(() => setLoading(false))
  }, [])
  
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    window.location.href = '/auth/login'
  }
  
  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
```

**Como usar em componentes:**
```typescript
'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function MinhaPage() {
  const { user, loading, logout } = useAuth()
  
  if (loading) return <div>Carregando...</div>
  
  return <div>Bem-vindo, {user?.name}!</div>
}
```

---

### 5️⃣ **`src/app/admin/layout.tsx`** - LAYOUT ADMIN

**Executa:** Após AuthContext estar pronto (Client Component)

**Responsabilidade:**
- 📊 Renderizar estrutura da área admin
- 🧭 Sidebar com menu de navegação
- 🔝 TopBar com perfil e logout
- 📱 Adaptar layout para mobile/desktop

**Estrutura:**
```typescript
'use client'

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <TopBar />
        <main>{children}</main>
      </div>
    </div>
  )
}
```

---

## 🔐 Processo de Autenticação

### Etapa 1: Login (Página Pública)

**Arquivo:** `src/app/auth/server-login/page.tsx`

```typescript
// Usuário preenche formulário
const handleLogin = async (email, password) => {
  const response = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  
  // API define cookie httpOnly: session_id=abc123
  if (response.ok) {
    window.location.href = '/admin/gerenciador-pdfs'
  }
}
```

### Etapa 2: API de Login

**Arquivo:** `src/app/api/auth/session/route.ts`

```typescript
export async function POST(req: Request) {
  const { email, password } = await req.json()
  
  // 1. Autentica com UserShield API (backend Pronutrir)
  const userShieldAuth = await authenticateWithUserShield(email, password)
  
  if (!userShieldAuth.success) {
    return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 })
  }
  
  // 2. Cria sessão no Redis (server-side)
  const sessionId = await sessionManager.createSession({
    userId: userData.userId,
    email: email,
    name: userData.name,
    permissions: userData.permissions,
    ipAddress: clientIP,
    userAgent: userAgent
  })
  
  // 3. Define cookie httpOnly (JavaScript não pode acessar)
  const response = NextResponse.json({ 
    success: true, 
    user: { id, email, name, permissions }
  })
  
  response.cookies.set('session_id', sessionId, {
    httpOnly: true,  // ✅ Protegido contra XSS
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',  // ✅ Permite redirects
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 dias
  })
  
  return response
}
```

### Etapa 3: AuthContext Busca Dados do Usuário

**Arquivo:** `src/contexts/AuthContext.tsx`

```typescript
useEffect(() => {
  async function initializeAuth() {
    try {
      // ⚠️ IMPORTANTE: session_id é httpOnly, não aparece em document.cookie!
      // Por isso SEMPRE tentamos buscar do servidor
      const response = await fetch('/api/auth/me', {
        credentials: 'include'  // ✅ Envia cookie automaticamente
      })
      
      if (!response.ok) {
        throw new Error('Sessão inválida')
      }
      
      const userData = await response.json()
      dispatch({ type: 'SET_USER', payload: userData })
      
    } catch (error) {
      // Sem sessão válida - usuário não está logado
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }
  
  initializeAuth()
}, [])
```

### Etapa 4: API /auth/me Valida Sessão

**Arquivo:** `src/app/api/auth/me/route.ts`

```typescript
export async function GET(request: NextRequest) {
  // 1. Extrai session_id do cookie (httpOnly)
  const sessionId = request.cookies.get('session_id')?.value
  
  if (!sessionId) {
    return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })
  }
  
  // 2. Busca sessão no Redis
  const sessionData = await sessionManager.getSession(sessionId)
  
  if (!sessionData) {
    return NextResponse.json({ message: 'Sessão expirada' }, { status: 401 })
  }
  
  // 3. Retorna dados do usuário
  return NextResponse.json({
    id: sessionData.userId,
    nomeCompleto: sessionData.name,
    email: sessionData.email,
    roles: sessionData.permissions,
    permissions: sessionData.permissions
  })
}
```

### Etapa 5: Redirecionamento Automático

Após login:
1. ✅ Cookie `session_id` é definido no navegador (httpOnly)
2. ✅ Sessão é salva no Redis server-side
3. 🔄 Usuário é redirecionado para `/admin/gerenciador-pdfs`
4. 🛡️ Middleware detecta cookie e permite acesso
5. 📊 AuthContext busca dados via `/api/auth/me`
6. ✨ Aplicação carrega com usuário autenticado

---

## 🎬 Primeira Requisição: O que acontece?

### Cenário 1: Usuário NÃO está logado

```
1. Acessa: https://app.com/admin/gerenciador-pdfs
2. Middleware: Não encontra session_id
3. Middleware: Redireciona → /auth/server-login
4. Login Page: Renderiza formulário
5. Usuário: Preenche e envia
6. API /auth/session: Valida com UserShield e cria sessão no Redis
7. Cookie: session_id=abc123 é definido (httpOnly)
8. Redirect: → /admin/gerenciador-pdfs
9. Middleware: Agora encontra session_id ✅
10. Layout: Carrega providers
11. AuthContext: Chama /api/auth/me (cookie enviado automaticamente)
12. API /auth/me: Valida sessão no Redis e retorna dados do usuário
13. Admin Layout: Renderiza sidebar + topbar com nome do usuário
14. Page: Renderiza conteúdo da página
```

### Cenário 2: Usuário JÁ está logado

```
1. Acessa: https://app.com/admin/gerenciador-pdfs
2. Middleware: Encontra session_id no cookie ✅
3. Middleware: Permite acesso
4. Layout: Carrega providers
5. AuthContext: Chama /api/auth/me (cookie enviado automaticamente)
6. API /auth/me: Valida sessão no Redis (cache)
7. Admin Layout: Renderiza sidebar + topbar instantaneamente
8. Page: Renderiza conteúdo imediatamente
```

### Cenário 3: Sessão expirou

```
1. Acessa: https://app.com/admin/gerenciador-pdfs
2. Middleware: Encontra session_id no cookie ✅
3. Middleware: Permite acesso (ainda não validou no Redis)
4. AuthContext: Chama /api/auth/me
5. API /auth/me: Busca no Redis → sessão não encontrada ou expirada
6. API /auth/me: Retorna 401 (sessão inválida)
7. AuthContext: Detecta erro e chama logout()
8. Logout: Remove cookie session_id via /api/auth/logout
9. Redirect: → /auth/server-login
```

---

## 🔀 Lógica de Redirecionamentos

### Rotas Públicas (Sem Autenticação)

```typescript
const publicRoutes = [
  '/auth/login',
  '/auth/server-login',  // ✅ Página de login atual
  '/auth/recovery',
  '/test-pdf',
  '/webhook-monitor'
]

// Middleware: Sempre permite acesso
// MAS se já estiver logado e tentar acessar /auth/login 
// → redireciona para /admin/gerenciador-pdfs
```

### Rotas Protegidas (Requer Autenticação)

```typescript
const protectedRoutes = [
  '/admin',
  '/admin/gerenciador-pdfs',  // ✅ Página principal
  '/admin/usuarios',
  '/admin/profile',
  '/admin/*'
]

// Middleware: Verifica session_id
// Se não tiver → redireciona para /auth/server-login
```

### Rota Raiz `/`

```typescript
// Middleware sempre redireciona:
// - SEM sessão → /auth/server-login
// - COM sessão → /admin/gerenciador-pdfs

// Por isso src/app/page.tsx é apenas um fallback
```

---

## 🐛 Como Debuggar o Fluxo

### 1. Logs do Middleware

**Adicione no `src/middleware.ts`:**
```typescript
export async function middleware(req: NextRequest) {
  console.log('🔍 [MIDDLEWARE] URL:', req.nextUrl.pathname)
  console.log('🔍 [MIDDLEWARE] Session:', req.cookies.get('session_id')?.value)
  
  // ... resto do código
  
  console.log('✅ [MIDDLEWARE] Ação:', 'PERMITIR' | 'REDIRECIONAR')
}
```

**Onde ver:** Terminal onde `npm run dev` está rodando

---

### 2. Logs do AuthContext

**Adicione no `src/contexts/AuthContext.tsx`:**
```typescript
useEffect(() => {
  console.log('🔐 [AUTH] Buscando usuário...')
  
  fetch('/api/auth/me')
    .then(res => {
      console.log('🔐 [AUTH] Status:', res.status)
      return res.json()
    })
    .then(data => {
      console.log('🔐 [AUTH] Usuário:', data)
      setUser(data)
    })
}, [])
```

**Onde ver:** Console do navegador (F12 → Console)

---

### 3. DevTools do Navegador

**Chrome DevTools (F12):**

1. **Application → Cookies**
   - Verifique se `session_id` existe
   - Veja data de expiração
   - Confira flags: `HttpOnly`, `Secure`, `SameSite`

2. **Network → Fetch/XHR**
   - Monitore chamadas para `/api/auth/login`
   - Veja resposta de `/api/auth/me`
   - Confirme que cookie é enviado automaticamente

3. **Console**
   - Veja logs do AuthContext
   - Erros de autenticação aparecem aqui

---

### 4. Breakpoints no Middleware

**⚠️ IMPORTANTE:** Middleware roda no servidor (Edge Runtime)

Use `console.log` ao invés de `debugger`:
```typescript
export async function middleware(req: NextRequest) {
  const sessionId = req.cookies.get('session_id')?.value
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📍 Rota acessada:', req.nextUrl.pathname)
  console.log('🍪 Session ID:', sessionId || 'NENHUM')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  
  // ... resto do código
}
```

---

## 📚 Próximos Passos

Agora que você entendeu o fluxo inicial, explore:

1. 📖 **[docs/MIDDLEWARE.md](./docs/MIDDLEWARE.md)** - Detalhes técnicos do middleware
2. 🔐 **[docs/AUTHENTICATION_README.md](./docs/AUTHENTICATION_README.md)** - Sistema de autenticação
3. 🎨 **[THEME_SYSTEM.md](./THEME_SYSTEM.md)** - Sistema de temas
4. 🧩 **[src/components/ui/](./src/components/ui/)** - Componentes reutilizáveis
5. 🔧 **[.github/copilot-instructions.md](./.github/copilot-instructions.md)** - Padrões de código

---

## ⚡ Comandos Úteis

```bash
# Iniciar aplicação em modo dev
npm run dev

# Verificar configuração de debug
node scripts/debug-check.js

# Verificar problemas com breakpoints
node scripts/debug-breakpoints.js

# Rodar testes
npm test

# Build de produção
npm run build
```

---

## 🆘 Problemas Comuns

### ❌ "Redirecionando infinitamente"
**Causa:** Middleware não reconhece a rota como pública  
**Solução:** Adicione a rota em `publicRoutes` no `middleware.ts`

### ❌ "Cannot read properties of null (reading 'name')"
**Causa:** Componente tentando acessar `user` antes do AuthContext carregar  
**Solução:** Adicione verificação:
```typescript
const { user, loading } = useAuth()
if (loading) return <div>Carregando...</div>
if (!user) return null
```

### ❌ "Session_id não está sendo enviado"
**Causa:** Cookie httpOnly não é acessível via JavaScript  
**Solução:** Isso é CORRETO e SEGURO! ✅  
- O cookie é enviado AUTOMATICAMENTE pelo navegador em cada requisição
- Verifique no DevTools → Application → Cookies → `session_id`
- O cookie deve ter flags: `HttpOnly: ✓`, `SameSite: Lax`
- JavaScript NÃO consegue ler `document.cookie` para ver esse cookie (proteção contra XSS)

### ❌ "AuthContext não encontra usuário após login"
**Causa:** Cookie não está sendo enviado nas requisições fetch  
**Solução:** Adicione `credentials: 'include'` no fetch:
```typescript
fetch('/api/auth/me', {
  credentials: 'include'  // ✅ Força envio de cookies
})
```

### ❌ "/api/auth/* retorna dados errados"
**Causa:** `next.config.js` está fazendo proxy para API externa  
**Solução:** Verifique se `/api/auth/*` está EXCLUÍDO dos rewrites:
```javascript
// next.config.js - NÃO fazer proxy de rotas de autenticação locais
async rewrites() {
  return [
    // ✅ Proxy apenas de rotas específicas (não /api/:path*)
    { source: '/api/pacientes/:path*', destination: '...' },
    { source: '/usershield/:path*', destination: '...' },
    // ❌ NÃO adicionar: { source: '/api/:path*', destination: '...' }
  ]
}
```

### ❌ "Middleware não está executando"
**Causa:** Arquivo não está na raiz de `src/`  
**Solução:** Confirme que o arquivo está em `src/middleware.ts` (não em subpasta)

---

## 🔄 Mudanças Recentes (Outubro 2025)

### ✅ Migração para Autenticação 100% Server-Side

O sistema foi migrado de **JWT tokens client-side** para **sessões server-side no Redis**:

**Antes (Sistema Antigo):**
- ❌ Tokens JWT armazenados em cookies acessíveis via JavaScript
- ❌ Client-side tinha acesso aos tokens
- ❌ `tokenStorage.getToken()` retornava o token
- ❌ `tokenInterceptor` renovava tokens automaticamente

**Agora (Sistema Novo):**
- ✅ Session IDs armazenados em cookies **httpOnly** (JavaScript não acessa)
- ✅ Dados da sessão ficam 100% no servidor (Redis)
- ✅ `AuthContext` busca dados via `/api/auth/me` (sem verificar cookie via JS)
- ✅ Mais seguro contra ataques XSS e CSRF

### 🔧 Componentes Modificados

1. **`next.config.js`**
   - Rewrites modificados para NÃO fazer proxy de `/api/auth/*`
   - Rotas de autenticação agora são tratadas localmente

2. **`src/services/tokenInterceptor.ts`**
   - **DESABILITADO** temporariamente (sistema JWT legado)
   - Constructor comentado para não interceptar requisições

3. **`src/contexts/AuthContext.tsx`**
   - Removido `tokenStorage.getSessionId()` (cookie httpOnly não é visível)
   - **SEMPRE** tenta buscar de `/api/auth/me` (cookie enviado automaticamente)
   - Usa `credentials: 'include'` para garantir envio de cookies

4. **`src/app/api/auth/session/route.ts`**
   - Endpoint de login criado do zero
   - Integra com UserShield API (Pronutrir backend)
   - Cria sessão no Redis via `sessionManager.createSession()`
   - Define cookie `session_id` com flags de segurança

5. **`src/app/api/auth/me/route.ts`**
   - Novo endpoint para retornar dados do usuário
   - Lê `session_id` do cookie httpOnly
   - Valida sessão no Redis
   - Retorna dados do usuário ou 401

### 📊 Fluxo Atualizado

```
Login → API cria sessão no Redis → Define cookie httpOnly 
  → Redirect para /admin → Middleware valida cookie 
  → AuthContext chama /api/auth/me → API valida no Redis 
  → Retorna dados do usuário → App renderiza autenticado
```

### ⚠️ Importante para Desenvolvedores

- **NÃO tente acessar** `session_id` via `document.cookie` (é httpOnly)
- **SEMPRE use** `fetch('/api/auth/me')` para verificar autenticação
- **NÃO confie** em `tokenStorage.getToken()` (sistema legado)
- **Lembre-se:** Cookies httpOnly são enviados AUTOMATICAMENTE pelo navegador

---

## 🎯 Checklist para Novos Desenvolvedores

- [ ] Li este arquivo completo
- [ ] Entendo que middleware executa ANTES de tudo
- [ ] Sei que autenticação é 100% server-side (cookies httpOnly + Redis)
- [ ] Compreendo a ordem: middleware → layout → providers → page
- [ ] Conheço os contextos principais: Auth, Theme, Layout
- [ ] Sei como usar `useAuth()` em componentes
- [ ] Entendo que cookies httpOnly NÃO aparecem em `document.cookie`
- [ ] Sei que `/api/auth/session` é o endpoint de login (não `/api/auth/login`)
- [ ] Entendo onde adicionar logs para debug (servidor vs navegador)
- [ ] Li a documentação do middleware (`docs/MIDDLEWARE.md`)
- [ ] Li a seção "Mudanças Recentes" deste documento
- [ ] Testei login/logout localmente
- [ ] Verifiquei o cookie `session_id` no DevTools → Application
- [ ] Conheço os comandos básicos do projeto

---

## 👥 Suporte

Dúvidas? Consulte:
- 📖 Documentação técnica em `docs/`
- 💬 Equipe de desenvolvimento
- 🐛 Issues no GitHub

---

**✨ Bem-vindo ao Telescope ADM! Boa codificação! 🚀**
