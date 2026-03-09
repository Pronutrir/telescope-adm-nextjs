import axios from "axios"
import { SERVICES_CONFIG } from '@/config/env'
import { ApiAuth } from '@/services/auth'

// Extrair path de SERVICES_CONFIG.APITASY e garantir sufixo /api/v1/
const apitasyRaw = new URL(SERVICES_CONFIG.APITASY).pathname.replace(/\/+$/, '')
const apitasyBase = apitasyRaw.replace(/\/api(\/v1)?$/, '')
const apitasyPath = `${apitasyBase}/api/v1`

// Token JWT em memória — preenchido pelo AuthContext após buscar da sessão Redis
let _authToken: string | null = null

export function setApiToken(token: string | null) {
  _authToken = token
}

export function getApiToken(): string | null {
  return _authToken
}

export const Api = axios.create({
  baseURL: `${apitasyPath}/`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

export const ApiNotify = axios.create({
  baseURL: '/notify/api/v1/',
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para adicionar token automaticamente nas requisições
Api.interceptors.request.use(
  (config) => {
    if (_authToken) {
      config.headers.Authorization = `Bearer ${_authToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

ApiNotify.interceptors.request.use(
  (config) => {
    if (_authToken) {
      config.headers.Authorization = `Bearer ${_authToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptors para tratamento de erro global
// NÃO fazem hard redirect em 401 — o AuthContext gerencia sessão/redirect via /api/auth/me
// React Query trata os erros de API graciosamente (retry, error state)
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('[Api] 401 — token possivelmente expirado')
    }
    return Promise.reject(error)
  }
)

ApiNotify.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('[ApiNotify] 401 — token possivelmente expirado')
    }
    return Promise.reject(error)
  }
)

// Helpers para aplicar/remover token em todas as instâncias Axios
// (migrado de axios-config.ts — mantido aqui para evitar dependência circular)
export const axiosConfig = {
  setAuthToken(token: string): void {
    const authHeader = `Bearer ${token}`
    Api.defaults.headers.common['Authorization'] = authHeader
    ApiAuth.defaults.headers.common['Authorization'] = authHeader
    ApiNotify.defaults.headers.common['Authorization'] = authHeader
    console.log('🔑 Token aplicado a todas as instâncias do Axios')
  },

  clearAuthToken(): void {
    delete Api.defaults.headers.common['Authorization']
    delete ApiAuth.defaults.headers.common['Authorization']
    delete ApiNotify.defaults.headers.common['Authorization']
    console.log('🔓 Token removido de todas as instâncias do Axios')
  },

  hasAuthToken(): boolean {
    return !!(Api.defaults.headers.common['Authorization'])
  }
}
