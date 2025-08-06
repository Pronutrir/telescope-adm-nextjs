# 🔐 Quick Reference - Sistema de Autenticação

## 🚀 Comandos Rápidos

```bash
# Iniciar desenvolvimento
npm run dev

# Build de produção
npm run build

# Verificar tipos
npm run type-check

# Lint
npm run lint
```

## 📱 URLs Principais

- **Login**: `http://localhost:3000/auth/login`
- **Recovery**: `http://localhost:3000/auth/recovery`
- **Test Page**: `http://localhost:3000/test`
- **Root**: `http://localhost:3000` (redireciona automaticamente)

## 🔧 Hook de Autenticação

```typescript
import { useAuth } from '@/contexts/AuthContext'

const { 
  user,                    // Dados do usuário
  isAuthenticated,         // true/false
  isLoading,              // Estado de carregamento
  login,                  // (username, password) => Promise<void>
  logout,                 // () => void
  updatePassword,         // (username, newPassword) => Promise<void>
  notification,           // { isOpen, message, type }
  setNotification,        // Mostrar notificação
  clearNotification       // Limpar notificação
} = useAuth()
```

## 🌐 APIs Disponíveis

### Autenticação (Server-Side)
```typescript
POST /api/auth/login          // Login
GET  /api/auth/user           // Dados do usuário  
POST /api/auth/logout         // Logout
POST /api/auth/update-password // Alterar senha
```

### APIs Externas (Proxy)
```typescript
/usershield/*  → https://servicesapp.pronutrir.com.br/usershield/*
/apitasy/*     → https://servicesapp.pronutrir.com.br/apitasy/*
/notify/*      → https://servicesapp.pronutrir.com.br/notify/*
```

## 🛡️ Proteção de Rotas

### Middleware Automático
- ✅ `/test` e `/admin` = Protegidas (requer token)
- ✅ `/auth/login` e `/auth/recovery` = Públicas
- ✅ `/` = Redireciona baseado na autenticação

### Manual (Componentes)
```typescript
function ProtectedComponent() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <div>Carregando...</div>
  if (!isAuthenticated) return <Navigate to="/auth/login" />

  return <SecureContent />
}
```

## 🔐 Gerenciamento de Tokens

### Storage Automático
```typescript
// Login salva automaticamente em:
localStorage.setItem('token', jwtToken)
localStorage.setItem('refreshToken', refreshToken)
document.cookie = `token=${jwtToken}; path=/; secure; samesite=strict`
```

### Headers Automáticos
```typescript
// Interceptors aplicam automaticamente:
Authorization: Bearer ${token}
```

## 🐛 Debug Rápido

### Console Logs
```typescript
// Verificar autenticação
console.log('Auth State:', { user, isAuthenticated, isLoading })

// Verificar tokens
console.log('Tokens:', {
  localStorage: localStorage.getItem('token'),
  cookie: document.cookie
})
```

### Página de Teste
- Acesse `/test` para debug completo
- Mostra localStorage, cookies, estado e APIs

## ❌ Troubleshooting Express

| Problema | Solução |
|----------|---------|
| Token não aplica | Verificar `axiosConfig.setAuthToken()` |
| 401 nas APIs | Verificar token no localStorage |
| CORS error | Usar API routes (`/api/auth/*`) |
| Redirect loop | Limpar localStorage e cookies |
| Middleware não funciona | Verificar cookies |

### Limpeza Completa
```typescript
// No console do browser
localStorage.clear()
sessionStorage.clear()
document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
location.reload()
```

## 📦 Estrutura Essencial

```
src/
├── contexts/AuthContext.tsx     # Estado global
├── app/auth/login/page.tsx      # Página de login
├── app/test/page.tsx            # Debug page
├── services/auth.ts             # Cliente API
├── services/token.ts            # Storage
├── lib/axios-config.ts          # Headers automáticos
└── middleware.ts                # Proteção de rotas
```

## 🎨 Componentes UI

### Notification
```typescript
const { notification, setNotification } = useAuth()

// Mostrar notificação
setNotification({
  isOpen: true,
  message: 'Sucesso!',
  type: 'success' // 'success' | 'error' | 'warning' | 'info'
})
```

### Loading States
```typescript
const { isLoading } = useAuth()

{isLoading && <div>Carregando...</div>}
```

## 🔄 Fluxo Típico

1. **User login** → `/auth/login`
2. **Validate** → `Formik + Yup`
3. **POST** → `/api/auth/login`
4. **Save tokens** → `localStorage + cookies`
5. **Apply headers** → `Axios interceptors`
6. **Get user** → `/api/auth/user`
7. **Redirect** → `/test`

---

💡 **Dica**: Use a página `/test` para debug completo do sistema de autenticação!
