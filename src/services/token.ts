// Gerenciamento de tokens JWT (migrado do RefreshToken.js original)

import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  exp: number
  iat: number
  [key: string]: unknown
}

export const tokenStorage = {
  // Salvar tokens
  saveTokens(token: string, refreshToken: string): void {
    // Salvar no localStorage
    localStorage.setItem('token', token)
    localStorage.setItem('refreshToken', refreshToken)
    
    // Salvar também nos cookies para o middleware
    document.cookie = `token=${token}; path=/; secure; samesite=strict`
    document.cookie = `refreshToken=${refreshToken}; path=/; secure; samesite=strict`
  },

  // Obter tokens
  getToken(): string | null {
    return localStorage.getItem('token')
  },

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken')
  },

  // Limpar tokens
  clearTokens(): void {
    // Remover do localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    sessionStorage.clear()
    
    // Remover também dos cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
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
    
    console.log('Refresh token logic not implemented yet')
    return null
  } catch (error) {
    console.error('Error refreshing token:', error)
    tokenStorage.clearTokens()
    return null
  }
}
