// Gerenciamento de tokens JWT (migrado do RefreshToken.js original)

import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  exp: number
  iat: number
  [key: string]: unknown
}

// Função utilitária para ler cookies do lado do cliente
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    return cookieValue || null
  }
  return null
}

export const tokenStorage = {
  // Salvar tokens (APENAS em cookies seguros - localStorage removido por segurança)
  saveTokens(token: string, refreshToken: string): void {
    // ❌ localStorage REMOVIDO por questões de segurança XSS
    // localStorage.setItem('token', token)
    // localStorage.setItem('refreshToken', refreshToken)
    
    // ✅ Salvar APENAS nos cookies seguros
    const isProduction = process.env.NODE_ENV === 'production'
    const cookieOptions = `path=/; ${isProduction ? 'secure; ' : ''}samesite=strict; max-age=${4 * 60 * 60}` // 4 horas
    
    document.cookie = `token=${token}; ${cookieOptions}`
    document.cookie = `refreshToken=${refreshToken}; ${cookieOptions}`
  },

  // Obter tokens (APENAS dos cookies seguros)
  getToken(): string | null {
    // ❌ localStorage REMOVIDO por questões de segurança
    // return localStorage.getItem('token')
    
    // ✅ Ler APENAS dos cookies seguros
    return getCookie('token')
  },

  getRefreshToken(): string | null {
    // ❌ localStorage REMOVIDO por questões de segurança  
    // return localStorage.getItem('refreshToken')
    
    // ✅ Ler APENAS dos cookies seguros
    return getCookie('refreshToken')
  },

  // Limpar tokens
  clearTokens(): void {
    // ❌ localStorage REMOVIDO - não armazenar mais tokens sensíveis aqui
    // localStorage.removeItem('token')
    // localStorage.removeItem('refreshToken')
    
    // ✅ Manter limpeza do sessionStorage (dados temporários OK)
    sessionStorage.clear()
    
    // ✅ Limpar apenas dados não-sensíveis do localStorage
    const keysToRemove = ['userPreferences', 'appSettings', 'lastActivity']
    keysToRemove.forEach(key => localStorage.removeItem(key))
    
    // ✅ Limpar cookies de autenticação com todas as combinações para garantir remoção
    const cookiesToClear = ['token', 'refreshToken', 'sessionId', 'authState']
    cookiesToClear.forEach(cookieName => {
      // Limpar com diferentes combinações de path e domain para garantir remoção completa
      document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure`
      document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict`
      document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict`
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    })
    
  },

  // Verificar se o token é válido
  isTokenValid(token: string): boolean {
    try {
      const decoded: DecodedToken = jwtDecode(token)
      const currentTime = Date.now() / 1000
      return decoded.exp > currentTime
    } catch (error) {
      console.error('Error decoding token:', error)
      return false
    }
  },

  // Verificar se o token está próximo do vencimento (5 minutos)
  isTokenExpiringSoon(token: string): boolean {
    try {
      const decoded: DecodedToken = jwtDecode(token)
      const currentTime = Date.now() / 1000
      const timeUntilExpiry = decoded.exp - currentTime
      return timeUntilExpiry < 300 // 5 minutos
    } catch (error) {
      console.error('Error decoding token:', error)
      return true
    }
  }
}

// Função para refresh do token (placeholder - será implementada posteriormente)
export async function refreshToken(): Promise<string | null> {
  try {
    // TODO: Implementar lógica de refresh token
    // const response = await ApiAuth.post('Auth/refresh', {
    //   token: currentToken,
    //   refreshToken: tokenStorage.getRefreshToken()
    // })
    // return response.data.token
    
    return null
  } catch (error) {
    console.error('Error refreshing token:', error)
    tokenStorage.clearTokens()
    return null
  }
}
