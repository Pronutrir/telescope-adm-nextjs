# 🛡️ Middleware - Documentação para Desenvolvedores

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Como Funciona](#como-funciona)
3. [Ordem de Execução](#ordem-de-execução)
4. [Configuração](#configuração)
5. [Rotas Protegidas](#rotas-protegidas)
6. [Exemplos Práticos](#exemplos-práticos)
7. [Debug e Logs](#debug-e-logs)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O **middleware** é o primeiro guardião da aplicação Telescope ADM. Ele executa **ANTES** de qualquer página ou componente React ser carregado, proporcionando:

- ✅ Autenticação server-side
- ✅ Proteção de rotas sensíveis
- ✅ Redirecionamentos automáticos
- ✅ Segurança enterprise-level
- ✅ Zero flash de conteúdo

### 📍 Localização
```
src/middleware.ts
```

### 🔧 Tecnologia
- **Runtime:** Edge Runtime (Next.js)
- **Execução:** Server-side (antes do React)
- **Framework:** Next.js 15.5+
- **Linguagem:** TypeScript

---

## ⚙️ Como Funciona

### Fluxo de Execução Completo

```
1. 🌐 Usuário faz requisição HTTP
   ↓
2. ⚡ Next.js Server intercepta
   ↓
3. 🛡️ middleware.ts EXECUTA PRIMEIRO
   │
   ├─→ Lê cookies (session_id)
   ├─→ Identifica pathname
   ├─→ Valida tipo de rota (pública/protegida/api)
   ├─→ Decide: permitir ou redirecionar
   │
   ↓
4. ✅ Se permitido: NextResponse.next()
   ❌ Se negado: NextResponse.redirect()
   ↓
5. Página carrega (se permitido)
```

### Código Básico

```typescript
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionId = request.cookies.get('session_id')?.value
  
  // 🔍 Log para debug
  console.log('🔧 DEBUG: Middleware executado para:', pathname)
  
  // 🔒 Protege rotas /admin
  if (pathname.startsWith('/admin')) {
    if (!sessionId) {
      console.log('🔒 Acesso negado - sem session_id:', pathname)
      return NextResponse.redirect(new URL('/auth/server-login', request.url))
    }
  }
  
  // ✅ Permite continuar
  return NextResponse.next()
}
```

---

## 🔄 Ordem de Execução

### Comparação: Com vs Sem Middleware

#### ❌ SEM Middleware (Inseguro)
```
1. Página carrega (300ms)
2. React renderiza (150ms)
3. Componente verifica auth (50ms)
4. Redireciona (100ms)
───────────────────────────────
Total: 600ms + flash de conteúdo! 🐛
```

#### ✅ COM Middleware (Seguro)
```
1. Middleware verifica auth (<10ms)
2. Redireciona imediatamente
───────────────────────────────
Total: <10ms + sem flash! 🎉
```

### Timeline Detalhada

```
┌─────────────────────────────────────────────┐
│ T=0ms    Requisição HTTP                    │
├─────────────────────────────────────────────┤
│ T=1ms    ⚡ Edge Runtime (middleware.ts)    │
│          - request.cookies.get()             │
│          - Valida rotas                      │
│          - Logs de debug                     │
├─────────────────────────────────────────────┤
│ T=5ms    Decisão tomada                      │
│          ✅ NextResponse.next()              │
│          ou                                   │
│          ❌ NextResponse.redirect()          │
├─────────────────────────────────────────────┤
│ T=10ms+  📄 Renderização (se permitido)     │
│          - layout.tsx                        │
│          - page.tsx                          │
├─────────────────────────────────────────────┤
│ T=200ms+ ⚛️ React Hydration                 │
│          - Contextos (Auth, Theme, Layout)   │
│          - Componentes client                │
└─────────────────────────────────────────────┘
```

---

## 📝 Configuração

### Matcher (Rotas Monitoradas)

```typescript
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

**O que isso faz:**
- ✅ Monitora TODAS as rotas HTML
- ❌ Ignora: APIs internas, assets estáticos, favicon
- ⚡ Performance: Não processa arquivos estáticos

### Variáveis de Ambiente

```env
# .env.local
NODE_ENV=development  # ou 'production'

# Redis (futuro - para sessões)
REDIS_URL=redis://localhost:6379
```

---

## 🔐 Rotas Protegidas

### 1️⃣ Rotas Públicas (Sem Autenticação)

```typescript
const publicRoutes = [
  '/auth/login',           // Login tradicional
  '/auth/server-login',    // Login server-side
  '/auth/recovery',        // Recuperação de senha
  '/test-pdf',            // Teste de PDFs
  '/webhook-monitor'      // Monitor de webhooks
]
```

**Características:**
- ✅ Acessíveis sem `session_id`
- ✅ Não verificam autenticação
- ✅ Usuários logados SÃO redirecionados (evita confusão)

**Comportamento:**
```typescript
if (publicRoutes.some(route => pathname.startsWith(route))) {
  // Já está logado? Redireciona para dashboard
  if (sessionId) {
    return NextResponse.redirect(new URL('/admin/gerenciador-pdfs', request.url))
  }
  // Não logado? Permite acesso
  return NextResponse.next()
}
```

### 2️⃣ Rotas Protegidas (Requerem Autenticação)

```typescript
const protectedRoutes = ['/admin']
```

**Características:**
- 🔒 Requerem `session_id` válido no cookie
- 🔒 Verificação obrigatória antes de carregar
- 🔒 Redirecionam para `/auth/server-login` se não autenticado

**Comportamento:**
```typescript
if (protectedRoutes.some(route => pathname.startsWith(route))) {
  if (!sessionId) {
    console.log('🔒 Acesso negado - sem session_id:', pathname)
    return NextResponse.redirect(new URL('/auth/server-login', request.url))
  }
  // Autenticado, permite acesso
  return NextResponse.next()
}
```

**Todas as rotas protegidas:**
- `/admin/*` (todas as sub-rotas)
  - `/admin/dashboard`
  - `/admin/profile`
  - `/admin/usuarios`
  - `/admin/gerenciador-pdfs`
  - etc.

### 3️⃣ Rotas de API (Bypass)

```typescript
const apiRoutes = [
  '/api/auth/session',
  '/api/health'
]
```

**Características:**
- ⚡ Não passam pelo middleware de autenticação
- ⚡ Processamento direto
- ⚡ Usadas para operações internas

### 4️⃣ Rota Raiz (`/`)

```typescript
if (pathname === '/') {
  if (sessionId) {
    // Logado: vai para dashboard
    return NextResponse.redirect(new URL('/admin/gerenciador-pdfs', request.url))
  }
  // Não logado: vai para login
  return NextResponse.redirect(new URL('/auth/server-login', request.url))
}
```

**Comportamento:**
- ✅ Nunca mostra a página `/` real
- ✅ Sempre redireciona automaticamente
- ✅ Melhora UX (usuário vai direto para onde precisa)

---

## 💡 Exemplos Práticos

### Exemplo 1: Adicionar Nova Rota Protegida

**Cenário:** Você criou `/admin/relatorios` e quer proteger

**Solução:** Já está protegida automaticamente! ✅

```typescript
// ✅ Qualquer rota /admin/* já está protegida
// Não precisa fazer nada!
```

### Exemplo 2: Adicionar Nova Rota Pública

**Cenário:** Você criou `/help` e quer deixar público

**Solução:** Adicione ao array `publicRoutes`

```typescript
const publicRoutes = [
  '/auth/login',
  '/auth/server-login',
  '/auth/recovery',
  '/test-pdf',
  '/webhook-monitor',
  '/help'  // ✅ Nova rota pública
]
```

### Exemplo 3: Proteger Rota Específica (Não /admin)

**Cenário:** Você quer proteger `/dashboard-externo`

**Solução:** Adicione ao array `protectedRoutes`

```typescript
const protectedRoutes = [
  '/admin',
  '/dashboard-externo'  // ✅ Nova rota protegida
]
```

### Exemplo 4: Bypass de API Custom

**Cenário:** Sua API `/api/public/status` não deve ser bloqueada

**Solução:** Adicione ao array `apiRoutes`

```typescript
const apiRoutes = [
  '/api/auth/session',
  '/api/health',
  '/api/public/status'  // ✅ Bypass
]
```

---

## 🐛 Debug e Logs

### Logs Existentes

O middleware já possui logs estratégicos:

```typescript
// Linha 16: Toda execução do middleware
console.log('🔧 DEBUG: Middleware executado para:', pathname)

// Linha 48: Acesso negado
console.log('🔒 Acesso negado - sem session_id:', pathname)
```

### Como Ativar Mais Logs

Adicione logs temporários para debug:

```typescript
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionId = request.cookies.get('session_id')?.value
  
  // 🐛 DEBUG: Log completo
  console.log('═══════════════════════════════════')
  console.log('🔍 Middleware Debug:', {
    pathname,
    hasSessionId: !!sessionId,
    cookies: request.cookies.getAll().map(c => c.name),
    timestamp: new Date().toISOString()
  })
  console.log('═══════════════════════════════════')
  
  // ...resto do código...
}
```

### Ver Logs no Terminal

```bash
# Terminal onde npm run dev está rodando
🔧 DEBUG: Middleware executado para: /admin/profile
🔒 Acesso negado - sem session_id: /admin/profile
```

### Ver Logs no Chrome DevTools

1. **Abra DevTools** (F12)
2. **Vá para Console**
3. **Filtre por**: `Middleware`

---

## 🔧 Troubleshooting

### Problema 1: Redirecionamento Infinito

**Sintoma:** Página fica carregando infinitamente

**Causa:** Rota de login também está protegida

**Solução:** Certifique-se que rotas de login estão em `publicRoutes`

```typescript
// ✅ CORRETO
const publicRoutes = ['/auth/login', '/auth/server-login']

// ❌ ERRADO (causa loop)
const protectedRoutes = ['/admin', '/auth']
```

### Problema 2: Middleware Não Executa

**Sintoma:** Logs não aparecem

**Causas possíveis:**
1. Rota está no matcher exclusion
2. Arquivo não está em `src/middleware.ts`
3. Next.js não foi reiniciado

**Solução:**
```bash
# Reinicie o servidor
Ctrl+C
npm run dev
```

### Problema 3: Session_id Não É Lido

**Sintoma:** Sempre redireciona mesmo logado

**Diagnóstico:**
```typescript
export async function middleware(request: NextRequest) {
  const sessionId = request.cookies.get('session_id')?.value
  
  // 🐛 DEBUG: Ver cookies
  console.log('Todos os cookies:', request.cookies.getAll())
  console.log('session_id:', sessionId)
  
  // ...resto do código...
}
```

**Causas possíveis:**
1. Cookie não está sendo setado no login
2. Cookie expirou
3. Domain/Path do cookie incorreto

### Problema 4: Rotas Públicas Redirecionam

**Sintoma:** `/auth/login` redireciona quando não deveria

**Diagnóstico:**
```typescript
const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
console.log('É rota pública?', isPublicRoute)
```

**Solução:** Verifique se a rota está corretamente no array `publicRoutes`

### Problema 5: Breakpoints Não Funcionam

**Sintoma:** Breakpoints no middleware não param

**Causa:** Middleware roda no servidor (Edge Runtime)

**Solução:** Use logs ou debugger:

```typescript
export async function middleware(request: NextRequest) {
  debugger // ⚠️ Só funciona no Chrome DevTools, não no VS Code
  
  // Ou use console.log
  console.log('Middleware executando')
  
  // ...resto do código...
}
```

---

## 📚 Referências Técnicas

### Next.js Middleware
- [Documentação Oficial](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Edge Runtime](https://nextjs.org/docs/app/api-reference/edge)

### Cookies e Sessões
- [NextRequest.cookies](https://nextjs.org/docs/app/api-reference/functions/next-request#cookies)
- [NextResponse](https://nextjs.org/docs/app/api-reference/functions/next-response)

### Segurança
- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [HTTP-only Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies)

---

## 🎯 Checklist para Novos Desenvolvedores

Ao trabalhar com o middleware, certifique-se de:

- [ ] Entender que middleware executa ANTES de tudo
- [ ] Saber diferenciar rotas públicas, protegidas e APIs
- [ ] Nunca fazer lógica pesada no middleware (afeta performance)
- [ ] Usar logs para debug (não breakpoints)
- [ ] Testar sempre em modo anônimo do navegador
- [ ] Verificar cookies no DevTools → Application → Cookies
- [ ] Reiniciar servidor após modificar middleware
- [ ] Documentar novas rotas protegidas neste arquivo

---

## 🚀 Próximos Passos (Roadmap)

### Melhorias Planejadas

1. **Integração Redis** (Alta Prioridade)
   - Validação de sessão no Redis
   - Verificação de IP e User-Agent
   - Auto-refresh de sessões

2. **Rate Limiting** (Média Prioridade)
   - Limitar requisições por IP
   - Proteção contra brute force

3. **Logs Estruturados** (Baixa Prioridade)
   - Winston/Pino para logs profissionais
   - Integração com monitoring tools

4. **A/B Testing** (Futuro)
   - Redirecionamentos baseados em flags
   - Experimentos controlados

---

## 📞 Suporte

**Problemas com middleware?**

1. Verifique logs no terminal
2. Verifique cookies no DevTools
3. Leia esta documentação
4. Consulte a equipe senior

**Arquivo:** `src/middleware.ts`
**Documentação:** `docs/MIDDLEWARE.md`

---

**Última atualização:** 17 de outubro de 2025
**Versão:** 1.0.0
**Autor:** Equipe Telescope ADM
