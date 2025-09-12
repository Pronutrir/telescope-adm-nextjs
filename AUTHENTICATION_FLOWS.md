# 🔄 FLUXOGRAMAS TÉCNICOS DO SISTEMA DE AUTENTICAÇÃO

## 🔐 FLUXO COMPLETO DE AUTENTICAÇÃO

```mermaid
flowchart TD
    Start([👤 Usuário Inicia Login]) --> Form[📝 Preenche Formulário]
    
    Form --> Validate{✅ Validação Client-Side?}
    Validate -->|❌ Erro| ShowError[🚫 Exibir Erro de Validação]
    ShowError --> Form
    
    Validate -->|✅ OK| AuthContext[🔐 AuthContext.login()]
    
    AuthContext --> SetLoading[⏳ dispatch SET_LOADING: true]
    SetLoading --> ClearError[🧹 dispatch CLEAR_ERROR]
    ClearError --> CallService[📡 authService.login()]
    
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
    
    CheckResponse -->|✅ 200 + Token| SaveTokens[💾 tokenStorage.saveTokens()]
    
    SaveTokens --> LocalStorage[💽 localStorage.setItem('token')]
    SaveTokens --> SetCookies[🍪 document.cookie = 'token=...']
    SaveTokens --> AxiosHeaders[🔗 axiosConfig.setAuthToken()]
    
    AxiosHeaders --> GetUser[👤 authService.getUser()]
    GetUser --> UserResponse{📋 Dados do Usuário?}
    
    UserResponse -->|❌ Erro| ErrorGetUser[❌ Erro ao Obter Usuário]
    ErrorGetUser --> Cleanup[🧹 Limpar Tokens e Headers]
    Cleanup --> LogoutState[🚪 dispatch LOGOUT]
    LogoutState --> End
    
    UserResponse -->|✅ Sucesso| SetUser[👤 dispatch SET_USER]
    SetUser --> SuccessNotification[✅ Notificação de Sucesso]
    SuccessNotification --> RedirectDashboard[🏠 window.location.href = '/admin/gerenciador-pdfs']
    
    RedirectDashboard --> Middleware[🛡️ Middleware Verification]
    Middleware --> CheckToken{🎫 Token nos Cookies?}
    
    CheckToken -->|❌ Não| RedirectLogin[🔄 Redirect /auth/login]
    RedirectLogin --> End
    
    CheckToken -->|✅ Sim| AllowAccess[✅ Permitir Acesso]
    AllowAccess --> Dashboard([🎯 Dashboard Carregado])
```

---

## 🚪 FLUXO DE LOGOUT

```mermaid
flowchart TD
    LogoutStart([🚪 Usuário Clica Logout]) --> AuthLogout[🔐 AuthContext.logout()]
    
    AuthLogout --> CallLogoutAPI[📡 authService.logout()]
    CallLogoutAPI --> APILogout{🌍 API Logout}
    
    APILogout -->|✅ Sucesso| ClearTokensStorage[💾 tokenStorage.clearTokens()]
    APILogout -->|❌ Erro| ContinueCleanup[⚠️ Continuar Limpeza]
    
    ContinueCleanup --> ClearTokensStorage
    ClearTokensStorage --> RemoveLocalStorage[💽 localStorage.removeItem()]
    ClearTokensStorage --> ClearSessionStorage[🗂️ sessionStorage.clear()]
    ClearTokensStorage --> RemoveCookies[🍪 Limpar Cookies]
    
    RemoveCookies --> ClearAxiosHeaders[🔗 axiosConfig.clearAuthToken()]
    ClearAxiosHeaders --> CompleteCleanup[🧹 cleanupService.clearAuthData()]
    
    CompleteCleanup --> LogoutDispatch[🚪 dispatch LOGOUT]
    LogoutDispatch --> CheckRemaining{🔍 Dados Remanescentes?}
    
    CheckRemaining -->|✅ Sim| DeepCleanup[🧽 cleanupService.performCompleteCleanup()]
    DeepCleanup --> ClearCache[🗄️ Limpar Cache]
    ClearCache --> ClearIndexedDB[🏪 Limpar IndexedDB]
    ClearIndexedDB --> ClearWebSQL[🗃️ Limpar WebSQL]
    
    CheckRemaining -->|❌ Não| FinalRedirect[🔄 window.location.replace('/auth/login')]
    ClearWebSQL --> FinalRedirect
    
    FinalRedirect --> LoginPage([📋 Página de Login])
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

## 📱 FLUXO DE RESPOSTA DA API

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

*Fluxogramas técnicos gerados em: 12 de Setembro de 2025*
