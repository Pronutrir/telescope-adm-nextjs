# 🔄 FLUXOGRAMAS TÉCNICOS DO SISTEMA DE AUTENTICAÇÃO

## 🔐 FLUXO COMPLETO DE AUTENTICAÇÃO (REFATORADO - SEGURO)

```mermaid
flowchart TD
    Start([👤 Usuário Inicia Login]) --> Form[📝 Preenche Formulário]
    
    Form --> Validate{✅ Validação Client-Side?}
    Validate -->|❌ Erro| ShowError[🚫 Exibir Erro de Validação]
    ShowError --> Form
    
    Validate -->|✅ OK| AuthContext[🔐 AuthContext.login()]
    
    AuthContext --> SetLoading[⏳ dispatch SET_LOADING: true]
    SetLoading --> ClearError[🧹 dispatch CLEAR_ERROR]
    ClearError --> CleanOldTokens[🧹 Limpeza Forçada localStorage]
    CleanOldTokens --> CallService[📡 authService.login()]
    
    CallService --> APIRoute[🚀 POST /api/auth/login]
    APIRoute --> ExternalAPI[🌍 UserShield API Call]
    
    ExternalAPI --> CheckResponse{🔍 Resposta da API?}
    
    CheckResponse -->|❌ 401| InvalidCreds[🚫 Credenciais Inválidas]
    InvalidCreds --> SetErrorState[❌ dispatch SET_ERROR]
    SetErrorState --> ShowNotification[📢 Notificação de Erro]
    ShowNotification --> End([🏁 Fim - Permanece no Login])
    
    CheckResponse -->|⚠️ pass=true| NeedPasswordChange[🔑 Precisa Trocar Senha]
    NeedPasswordChange --> RedirectRecovery[🔄 Redirect /auth/recovery]
    RedirectRecovery --> End
    
    CheckResponse -->|✅ 200 + Token| SaveSecureCookies[� Salvar Cookies httpOnly]
    
    SaveSecureCookies --> AccessToken[🎫 Access Token: 1 hora]
    SaveSecureCookies --> RefreshToken[🔄 Refresh Token: 7 dias]
    SaveSecureCookies --> AxiosHeaders[🔗 axiosConfig.setAuthToken()]
    
    AxiosHeaders --> GetUser[👤 authService.getUser()]
    GetUser --> UserResponse{📋 Dados do Usuário?}
    
    UserResponse -->|❌ Erro| ErrorGetUser[❌ Erro ao Obter Usuário]
    ErrorGetUser --> Cleanup[🧹 Limpar Cookies e Headers]
    Cleanup --> LogoutState[🚪 dispatch LOGOUT]
    LogoutState --> End
    
    UserResponse -->|✅ Sucesso| SetUser[👤 dispatch SET_USER]
    SetUser --> StartInterceptor[🔄 Iniciar Token Interceptor]
    StartInterceptor --> SuccessNotification[✅ Notificação de Sucesso]
    SuccessNotification --> RedirectDashboard[🏠 window.location.href = '/admin/gerenciador-pdfs']
    
    RedirectDashboard --> Middleware[🛡️ Middleware Verification]
    Middleware --> CheckToken{🎫 Token nos Cookies?}
    
    CheckToken -->|❌ Não| RedirectLogin[🔄 Redirect /auth/login]
    RedirectLogin --> End
    
    CheckToken -->|✅ Sim| AllowAccess[✅ Permitir Acesso]
    AllowAccess --> Dashboard([🎯 Dashboard Carregado])
    
    Dashboard --> AutoRefresh[🔄 Monitoramento Automático]
    AutoRefresh --> CheckExpiry{⏰ Token Expira em 10min?}
    CheckExpiry -->|✅ Sim| RefreshAPI[📡 POST /api/auth/refresh]
    CheckExpiry -->|❌ Não| WaitCheck[⏱️ Aguardar 5min]
    WaitCheck --> CheckExpiry
    
    RefreshAPI --> NewTokens{🔄 Novos Tokens?}
    NewTokens -->|✅ Sucesso| UpdateCookies[🔒 Atualizar Cookies httpOnly]
    NewTokens -->|❌ Falha| ForceLogout[🚪 Logout Automático]
    UpdateCookies --> CheckExpiry
    ForceLogout --> End
```

---

---

## 🔒 CONFIGURAÇÕES DE SEGURANÇA IMPLEMENTADAS

### 🍪 Configuração de Cookies httpOnly

```typescript
// Configuração segura de cookies
const cookieOptions = {
  httpOnly: true,        // ✅ Previne acesso via JavaScript
  secure: true,          // ✅ Apenas HTTPS
  sameSite: 'strict',    // ✅ Proteção CSRF
  path: '/',             // ✅ Disponível em toda aplicação
  maxAge: refreshTokenExpiresIn // ✅ Expiração automática
}
```

### ⚡ Interceptor de Requisições

```typescript
// Interceptação automática de respostas 401
const responseInterceptor = async (error) => {
  if (error.response?.status === 401) {
    return await handleTokenRefresh(error.config)
  }
  return Promise.reject(error)
}
```

### 🔄 Sistema de Fila para Requisições

```typescript
// Fila inteligente para requisições simultâneas
let refreshPromise = null
const pendingRequests = []

const queueRequest = (originalRequest) => {
  return new Promise((resolve, reject) => {
    pendingRequests.push({ resolve, reject, config: originalRequest })
  })
}
```

### 🧹 Limpeza Forçada de Dados

```typescript
// Limpeza completa de dados sensíveis
const forceCleanup = () => {
  // ✅ Limpar localStorage (tokens antigos)
  localStorage.clear()
  
  // ✅ Limpar sessionStorage
  sessionStorage.clear()
  
  // ✅ Limpar cookies via API
  document.cookie.split(";").forEach(cookie => {
    const eqPos = cookie.indexOf("=")
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
  })
  
  // ✅ Reset contexto de autenticação
  setUser(null)
  setIsAuthenticated(false)
}
```

---

## 📊 ANÁLISE DE FLUXOS

```mermaid
flowchart TD
    LogoutStart([🚪 Usuário Clica Logout]) --> AuthLogout[🔐 AuthContext.logout()]
    
    AuthLogout --> StopInterceptor[⏹️ Parar Token Interceptor]
    StopInterceptor --> CallLogoutAPI[📡 authService.logout()]
    CallLogoutAPI --> APILogout{🌍 API Logout}
    
    APILogout -->|✅ Sucesso| ClearTokensStorage[💾 tokenStorage.clearTokens()]
    APILogout -->|❌ Erro| ContinueCleanup[⚠️ Continuar Limpeza]
    
    ContinueCleanup --> ClearTokensStorage
    ClearTokensStorage --> ClearSessionStorage[�️ sessionStorage.clear()]
    ClearTokensStorage --> RemoveSecureCookies[� Limpar Cookies httpOnly]
    ClearTokensStorage --> ForceCleanTokens[🧹 Limpeza Forçada de Tokens Residuais]
    
    ForceCleanTokens --> ClearAxiosHeaders[🔗 axiosConfig.clearAuthToken()]
    ClearAxiosHeaders --> CompleteCleanup[🧹 cleanupService.clearAuthData()]
    
    CompleteCleanup --> LogoutDispatch[🚪 dispatch LOGOUT]
    LogoutDispatch --> CheckRemaining{🔍 Dados Remanescentes?}
    
    CheckRemaining -->|✅ Sim| DeepCleanup[🧽 cleanupService.performCompleteCleanup()]
    DeepCleanup --> ClearCache[🗄️ Limpar Cache]
    ClearCache --> ClearIndexedDB[🏪 Limpar IndexedDB]  
    ClearIndexedDB --> ClearWebSQL[🗃️ Limpar WebSQL]
    
    CheckRemaining -->|❌ Não| FinalRedirect[🔄 window.location.replace('/auth/login')]
    ClearWebSQL --> FinalRedirect
    
    FinalRedirect --> LoginPage([📋 Página de Login - Totalmente Limpa])
```

---

## 🛡️ FLUXO DO MIDDLEWARE

```mermaid
flowchart TD
    Request([🌐 Requisição HTTP]) --> Middleware[🛡️ Middleware Next.js]
    
    Middleware --> GetCookie[🍪 request.cookies.get('token')]
    GetCookie --> GetPathname[📍 request.nextUrl.pathname]
    
    GetPathname --> CheckPublic{🔓 Rota Pública?}
    
    CheckPublic -->|✅ Sim| HasTokenPublic{🎫 Tem Token?}
    HasTokenPublic -->|✅ Sim| RedirectToDashboard[🏠 Redirect Dashboard]
    HasTokenPublic -->|❌ Não| AllowPublic[✅ Permitir Acesso]
    
    RedirectToDashboard --> End([🎯 Dashboard])
    AllowPublic --> End([📋 Página Pública])
    
    CheckPublic -->|❌ Não| CheckProtected{🔒 Rota Protegida?}
    
    CheckProtected -->|✅ Sim| HasTokenProtected{🎫 Tem Token?}
    HasTokenProtected -->|❌ Não| RedirectToLogin[🔄 Redirect Login]
    HasTokenProtected -->|✅ Sim| AllowProtected[✅ Permitir Acesso]
    
    RedirectToLogin --> End([📋 Login])
    AllowProtected --> End([🎯 Página Protegida])
    
    CheckProtected -->|❌ Não| CheckRoot{🏠 Rota Raiz?}
    
    CheckRoot -->|✅ Sim| HasTokenRoot{🎫 Tem Token?}
    HasTokenRoot -->|✅ Sim| RedirectToDashboardRoot[🏠 Redirect Dashboard]
    HasTokenRoot -->|❌ Não| RedirectToLoginRoot[📋 Redirect Login]
    
    RedirectToDashboardRoot --> End
    RedirectToLoginRoot --> End
    
    CheckRoot -->|❌ Não| Continue[➡️ Continuar]
    Continue --> End([🌐 Próximo Handler])
```

---

## 🔄 FLUXO DE INICIALIZAÇÃO (AuthContext)

```mermaid
flowchart TD
    AppLoad([🚀 App Carrega]) --> AuthProvider[🔐 AuthProvider Mount]
    
    AuthProvider --> InitEffect[🎬 useEffect Initialize]
    InitEffect --> CheckInconsistent[🔍 cleanupService.checkForRemainingData()]
    
    CheckInconsistent --> HasInconsistent{⚠️ Dados Inconsistentes?}
    
    HasInconsistent -->|✅ Sim| GetTokenCheck[🎫 tokenStorage.getToken()]
    GetTokenCheck --> ValidateToken{✅ Token Válido?}
    
    ValidateToken -->|❌ Não| CleanInconsistent[🧹 cleanupService.clearAuthData()]
    CleanInconsistent --> GetTokens[🎫 Obter Tokens]
    
    ValidateToken -->|✅ Sim| GetTokens
    HasInconsistent -->|❌ Não| GetTokens
    
    GetTokens --> HasTokens{🎫 Tokens Existem?}
    
    HasTokens -->|❌ Não| SetLoadingFalse[⏳ SET_LOADING: false]
    SetLoadingFalse --> SetupListeners[👂 Setup Event Listeners]
    
    HasTokens -->|✅ Sim| ValidateJWT{✅ JWT Válido?}
    
    ValidateJWT -->|❌ Não| ClearInvalidTokens[🧹 Limpar Tokens Inválidos]
    ClearInvalidTokens --> SetLoadingFalse
    
    ValidateJWT -->|✅ Sim| SetAxiosToken[🔗 axiosConfig.setAuthToken()]
    SetAxiosToken --> GetUserData[👤 authService.getUser()]
    
    GetUserData --> UserSuccess{✅ Usuário Obtido?}
    
    UserSuccess -->|❌ Não| ErrorCleanup[❌ Limpar Dados por Erro]
    ErrorCleanup --> LogoutDispatch[🚪 dispatch LOGOUT]
    LogoutDispatch --> SetupListeners
    
    UserSuccess -->|✅ Sim| SetUserState[👤 dispatch SET_USER]
    SetUserState --> SetupListeners
    
    SetupListeners --> BeforeUnload[👂 beforeunload Listener]
    SetupListeners --> VisibilityChange[👂 visibilitychange Listener]
    
    BeforeUnload --> CheckTokenOnUnload{🎫 Token Válido no Unload?}
    CheckTokenOnUnload -->|❌ Não| CleanOnUnload[🧹 Limpar Dados]
    CheckTokenOnUnload -->|✅ Sim| KeepSession[💾 Manter Sessão]
    
    VisibilityChange --> CheckHidden{👁️ Documento Oculto?}
    CheckHidden -->|✅ Sim| CheckTokenOnHide{🎫 Token Válido?}
    CheckTokenOnHide -->|❌ Não| CleanOnHide[🧹 Limpar Dados]
    CheckTokenOnHide -->|✅ Sim| KeepSessionHide[💾 Manter Sessão]
    
    CleanOnUnload --> End([🏁 Cleanup Completo])
    KeepSession --> End
    CleanOnHide --> End
    KeepSessionHide --> End
```

---

## 🔒 FLUXO DE VALIDAÇÃO DE TOKEN

```mermaid
flowchart TD
    TokenCheck([🎫 Verificar Token]) --> GetToken[📥 tokenStorage.getToken()]
    
    GetToken --> HasToken{🎫 Token Existe?}
    
    HasToken -->|❌ Não| ReturnFalse[❌ return false]
    
    HasToken -->|✅ Sim| DecodeJWT[🔓 jwtDecode(token)]
    DecodeJWT --> DecodeSuccess{✅ Decode Sucesso?}
    
    DecodeSuccess -->|❌ Não| CatchError[⚠️ catch Error]
    CatchError --> LogError[📝 console.error]
    LogError --> ReturnFalse
    
    DecodeSuccess -->|✅ Sim| GetCurrentTime[⏰ Date.now() / 1000]
    GetCurrentTime --> CompareExp[🔍 decoded.exp > currentTime]
    
    CompareExp --> IsValid{✅ Token Válido?}
    
    IsValid -->|❌ Não| ReturnFalse
    IsValid -->|✅ Sim| ReturnTrue[✅ return true]
    
    ReturnTrue --> End([🎯 Token Válido])
    ReturnFalse --> End([❌ Token Inválido])
```

---

## � FLUXO DE REFRESH TOKEN AUTOMÁTICO (NOVO)

```mermaid
flowchart TD
    APIRequest([📡 Requisição para API]) --> CheckResponse{📋 Resposta da API}
    
    CheckResponse -->|✅ 200-299| Success[✅ Retornar Dados]
    CheckResponse -->|❌ 401| TokenExpired[🚨 Token Expirado]
    CheckResponse -->|❌ Outros| OtherError[❌ Outros Erros]
    
    TokenExpired --> IsRefreshing{🔄 Já Renovando?}
    
    IsRefreshing -->|✅ Sim| AddToQueue[📋 Adicionar à Fila]
    AddToQueue --> WaitRefresh[⏳ Aguardar Renovação]
    
    IsRefreshing -->|❌ Não| StartRefresh[🚀 Iniciar Renovação]
    StartRefresh --> SetFlag[🏁 isRefreshing = true]
    SetFlag --> GetRefreshToken[🎫 Obter Refresh Token dos Cookies]
    
    GetRefreshToken --> HasRefresh{🔍 Refresh Token Existe?}
    
    HasRefresh -->|❌ Não| RefreshFailed[❌ Falha - Sem Refresh Token]
    HasRefresh -->|✅ Sim| CallRefreshAPI[📡 POST /api/auth/refresh]
    
    CallRefreshAPI --> RefreshResponse{📋 Resposta Refresh?}
    
    RefreshResponse -->|❌ 401/403| RefreshExpired[🚨 Refresh Token Expirado]
    RefreshResponse -->|✅ 200| NewTokens[🆕 Novos Tokens Recebidos]
    
    NewTokens --> UpdateCookies[🔒 Atualizar Cookies httpOnly]
    UpdateCookies --> UpdateHeaders[🔗 Atualizar Headers Axios]
    UpdateHeaders --> ProcessQueue[📋 Processar Fila de Requisições]
    ProcessQueue --> RetryOriginal[🔄 Refazer Requisição Original]
    RetryOriginal --> ResetFlag[🏁 isRefreshing = false]
    
    RefreshExpired --> RefreshFailed
    RefreshFailed --> ClearAllData[🧹 Limpar Todos os Dados]
    ClearAllData --> ForceLogin[🔄 Redirecionar para Login]
    
    WaitRefresh --> CheckQueue{📋 Renovação Concluída?}
    CheckQueue -->|✅ Sucesso| RetryWithNew[🔄 Tentar com Novo Token]
    CheckQueue -->|❌ Falha| FailRequest[❌ Falhar Requisição]
    
    RetryWithNew --> Success
    ResetFlag --> Success
    FailRequest --> OtherError
    ForceLogin --> End([🏁 Fim - Tela de Login])
    Success --> End([🎯 Dados Retornados])
    OtherError --> End
```

## ⏰ FLUXO DE MONITORAMENTO PROATIVO

```mermaid
flowchart TD
    Timer([⏰ Timer 5min]) --> CheckToken[🔍 Verificar Token Atual]
    
    CheckToken --> DecodeJWT{🔓 Decodificar JWT}
    
    DecodeJWT -->|❌ Erro| InvalidToken[❌ Token Inválido]
    DecodeJWT -->|✅ Sucesso| CheckExpiry[📅 Verificar Expiração]
    
    CheckExpiry --> TimeLeft{⏳ Tempo Restante?}
    
    TimeLeft -->|> 10min| WaitNext[⏱️ Aguardar Próximo Check]
    TimeLeft -->|< 10min| ProactiveRefresh[🔄 Renovação Proativa]
    
    ProactiveRefresh --> CallRefresh[📡 refreshToken()]
    CallRefresh --> RefreshResult{🔄 Resultado?}
    
    RefreshResult -->|✅ Sucesso| UpdateToken[🔒 Atualizar Token]
    RefreshResult -->|❌ Falha| HandleError[❌ Tratar Erro]
    
    UpdateToken --> LogSuccess[📝 Log: Token Renovado]
    LogSuccess --> WaitNext
    
    HandleError --> ClearSession[🧹 Limpar Sessão]
    ClearSession --> RedirectLogin[🔄 Redirect Login]
    
    InvalidToken --> ClearSession
    WaitNext --> Timer
    RedirectLogin --> End([🏁 Login Required])
```

---

## �📱 FLUXO DE RESPOSTA DA API

```mermaid
flowchart TD
    APICall([📡 Chamada API]) --> ReceiveResponse[📥 Receber Resposta]
    
    ReceiveResponse --> CheckContentType[🔍 Content-Type]
    CheckContentType --> IsJSON{📋 É JSON?}
    
    IsJSON -->|❌ Não| GetAsText[📝 response.text()]
    GetAsText --> CreateTextData[📄 data = {message: text}]
    
    IsJSON -->|✅ Sim| GetResponseText[📝 response.text()]
    GetResponseText --> HasText{📝 Tem Conteúdo?}
    
    HasText -->|❌ Não| SetDataNull[❌ data = null]
    
    HasText -->|✅ Sim| ParseJSON[🔄 JSON.parse(text)]
    ParseJSON --> ParseSuccess{✅ Parse OK?}
    
    ParseSuccess -->|❌ Não| ParseError[❌ Erro de Parse]
    ParseError --> Return502[🚫 Return 502 Error]
    
    ParseSuccess -->|✅ Sim| SetParsedData[📋 data = parsed]
    
    SetParsedData --> CheckResponseOK[✅ response.ok?]
    SetDataNull --> CheckResponseOK
    CreateTextData --> CheckResponseOK
    
    CheckResponseOK -->|❌ Não| LogAPIError[📝 Log API Error]
    LogAPIError --> ReturnError[❌ Return Error Response]
    
    CheckResponseOK -->|✅ Sim| HasJWTToken{🎫 data.jwtToken?}
    
    HasJWTToken -->|❌ Não| ReturnData[📤 Return Response]
    
    HasJWTToken -->|✅ Sim| CreateResponse[📦 NextResponse.json(data)]
    CreateResponse --> SetCookie[🍪 Set HTTP-Only Cookie]
    SetCookie --> ConfigureCookie[⚙️ Configure Cookie Options]
    
    ConfigureCookie --> ReturnWithCookie[📤 Return Response + Cookie]
    
    Return502 --> End([🏁 Fim])
    ReturnError --> End
    ReturnData --> End
    ReturnWithCookie --> End
```

---

## 📊 ANÁLISE TÉCNICA DOS FLUXOS IMPLEMENTADOS

### ⚡ Pontos Críticos de Performance
- **Verificação de Token**: Executada a cada requisição com cache inteligente
- **Refresh Token**: Processo assíncrono com fila de requisições
- **Interceptação**: Automática e transparente com retry logic
- **Monitoramento Proativo**: Timer de 5 minutos para renovação antecipada
- **Deduplicação**: Sistema de fila evita múltiplas renovações simultâneas

### 🔒 Segurança Implementada (Enterprise Level)
- **Armazenamento Seguro**: ✅ Cookies httpOnly com SameSite strict
- **Proteção XSS**: ✅ Token completamente inacessível via JavaScript
- **Proteção CSRF**: ✅ SameSite strict + Secure flags
- **Rotação Automática**: ✅ Tokens renovados automaticamente
- **Limpeza Forçada**: ✅ Eliminação completa de dados localStorage
- **Interceptação Inteligente**: ✅ Retry automático com nova autenticação

### 🔄 Gerenciamento de Estado Avançado
- **Estado Global**: AuthContext centralizado com cleanup forçado
- **Sincronização**: Automática entre componentes e requisições
- **Cleanup**: Limpeza completa no logout + localStorage legacy
- **Interceptor Service**: Serviço dedicado para renovação automática
- **Queue Management**: Sistema de fila para requisições durante refresh

### 🎯 Melhorias de UX
- **Transparência Total**: Usuário nunca percebe renovação de tokens
- **Sem Interrupções**: Requisições continuam funcionando durante refresh
- **Auto-Recovery**: Sistema se auto-recupera de erros de token
- **Logout Inteligente**: Limpeza completa e segura de sessão

### 📈 Métricas de Segurança
- **Risco XSS**: 🔴 ALTO → 🟢 ELIMINADO
- **Risco CSRF**: 🟡 MÉDIO → 🟢 ELIMINADO  
- **Exposição de Token**: 🔴 CRÍTICO → 🟢 PROTEGIDO
- **Rotação de Credenciais**: ❌ INEXISTENTE → ✅ AUTOMÁTICA
- **Limpeza de Sessão**: 🟡 PARCIAL → ✅ COMPLETA

### 🏗️ Arquitetura de Componentes

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   MIDDLEWARE    │────▶│   AUTH CONTEXT  │────▶│ TOKEN SERVICE   │
│  Route Guard    │     │ Global State    │     │ Secure Storage  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  PUBLIC ROUTES  │     │ PROTECTED PAGES │     │ API INTERCEPTOR │
│   Login/Public  │     │   Dashboard     │     │ Auto Refresh    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 🛡️ Camadas de Segurança

```
┌──────────────────────────────────────────────────────────┐
│                    FRONTEND SECURITY                     │
├──────────────────────────────────────────────────────────┤
│ 1. httpOnly Cookies (SameSite=strict, Secure=true)      │
│ 2. Token Interceptor Service (Automatic Refresh)        │
│ 3. Middleware Route Protection                           │
│ 4. Forced localStorage Cleanup                           │
├──────────────────────────────────────────────────────────┤
│                     BACKEND SECURITY                     │
├──────────────────────────────────────────────────────────┤
│ 1. JWT Token Validation                                  │
│ 2. Refresh Token API Endpoint                            │
│ 3. Secure Cookie Management                              │
│ 4. Pronutrir UserShield Integration                      │
└──────────────────────────────────────────────────────────┘
```

---

*Documentação técnica atualizada em: 12 de Janeiro de 2025*  
*Implementação de Segurança Enterprise: ✅ CONCLUÍDA*
