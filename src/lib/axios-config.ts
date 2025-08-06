// Configuração global do Axios para gerenciamento de tokens
import { Api, ApiNotify } from '@/lib/api'
import { ApiAuth } from '@/services/auth'

export const axiosConfig = {
  // Aplicar token a todas as instâncias do Axios
  setAuthToken(token: string): void {
    const authHeader = `Bearer ${token}`
    
    // Configurar header de autorização para todas as instâncias
    Api.defaults.headers.common['Authorization'] = authHeader
    ApiAuth.defaults.headers.common['Authorization'] = authHeader
    ApiNotify.defaults.headers.common['Authorization'] = authHeader
    
    console.log('🔑 Token aplicado a todas as instâncias do Axios')
  },

  // Remover token de todas as instâncias do Axios
  clearAuthToken(): void {
    delete Api.defaults.headers.common['Authorization']
    delete ApiAuth.defaults.headers.common['Authorization']
    delete ApiNotify.defaults.headers.common['Authorization']
    
    console.log('🔓 Token removido de todas as instâncias do Axios')
  },

  // Verificar se o token está configurado
  hasAuthToken(): boolean {
    return !!(
      Api.defaults.headers.common['Authorization'] ||
      ApiAuth.defaults.headers.common['Authorization'] ||
      ApiNotify.defaults.headers.common['Authorization']
    )
  }
}
