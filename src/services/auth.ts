import axios from 'axios'
import type { IAuthLoginResponse, IUserResponse } from '@/types/auth'

export const ApiAuth = axios.create({
  baseURL: '/api/auth',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Interceptor para refresh token (será implementado posteriormente)
ApiAuth.interceptors.request.use(
  async (req) => {
    try {
      if (ApiAuth.defaults.headers.common) {
        const { Authorization } = ApiAuth.defaults.headers.common
        if (Authorization) {
          // TODO: Implementar refresh token logic
          // const tokenUpdated = await refreshToken(Authorization)
          // if (tokenUpdated) {
          //   req.headers.Authorization = `Bearer ${tokenUpdated}`;
          // }
        }
      }
    } catch (error) {
      return Promise.reject(error)
    } finally {
      return req
    }
  }
)

// Interceptor para tratamento de erros
ApiAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Auth API Error:', error)
    
    if (error.message.includes('Network Error')) {
      return Promise.reject({
        ...error,
        message: 'Não foi possível conectar aos nossos servidores, sem conexão a internet'
      })
    }
    
    if (error.response?.status === 500) {
      return Promise.reject({
        ...error,
        message: `Ocorreu um erro inesperado, tente novamente!, erro: ${error.response.data}`
      })
    }
    
    if (error.response?.status === 400) {
      return Promise.reject({
        ...error,
        message: `erro: ${error.response.data}`
      })
    }
    
    if (error.response?.status === 401) {
      sessionStorage.clear()
      // ❌ localStorage.clear() removido - não limpar dados não-sensíveis automaticamente
      // localStorage.clear()
      
      // ✅ Limpar apenas cookies de autenticação
      const cookiesToClear = ['token', 'refreshToken', 'sessionId', 'authState']
      cookiesToClear.forEach(cookieName => {
        document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      })
      
      window.location.href = '/auth/server-login'
      return Promise.reject({
        ...error,
        message: 'Sessão expirada, faça login novamente'
      })
    }
    
    return Promise.reject(error)
  }
)

// Funções de autenticação
export const authService = {
  async login(username: string, password: string): Promise<IAuthLoginResponse> {
    const response = await ApiAuth.post<IAuthLoginResponse>('login', {
      username,
      password
    })
    return response.data
  },

  async getUser(): Promise<IUserResponse> {
    const response = await ApiAuth.get<IUserResponse>('user')
    return response.data
  },

  async logout(): Promise<void> {
    try {
      // Chamar API de logout
      await ApiAuth.post('logout')
    } catch (error) {
      // Mesmo se falhar, limpar dados locais
      console.error('Erro ao fazer logout na API:', error)
    }
    
    // ❌ Tokens não ficam mais em localStorage (segurança)
    // localStorage.removeItem('token')
    // localStorage.removeItem('refreshToken')
    
    // ✅ Limpar apenas sessionStorage (dados temporários)
    sessionStorage.clear()
    
    // ✅ Limpar apenas dados não-sensíveis da aplicação
    const appKeys = ['userPreferences', 'appSettings', 'lastActivity', 'navigationState']
    appKeys.forEach(key => {
      localStorage.removeItem(key)
    })
    
    // Limpar todos os cookies da aplicação
    const cookiesToClear = ['token', 'refreshToken', 'sessionId', 'authState', 'userSession']
    cookiesToClear.forEach(cookieName => {
      document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict`
      document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    })
    
    // Remover headers de autorização de todas as instâncias
    delete ApiAuth.defaults.headers.common['Authorization']
    
  },

  async updatePassword(username: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
    const response = await ApiAuth.post('updatePassword', {
      username,
      newPassword
    })
    return response.data
  }
}
