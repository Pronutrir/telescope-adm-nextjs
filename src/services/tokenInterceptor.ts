// Serviço de interceptação automática de tokens para renovação

import { refreshToken } from './token'
import { axiosConfig } from '@/lib/axios-config'

class TokenInterceptorService {
  private isRefreshing = false
  private failedQueue: Array<{
    resolve: (token: string) => void
    reject: (error: any) => void
  }> = []

  constructor() {
    this.setupResponseInterceptor()
  }

  private setupResponseInterceptor() {
    // ✅ Interceptor de resposta para detectar tokens expirados
    if (typeof window !== 'undefined') {
      // Interceptor para fetch requests
      this.setupFetchInterceptor()
    }
  }

  private setupFetchInterceptor() {
    const originalFetch = window.fetch

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const response = await originalFetch(input, init)

      // ✅ Se receber 401, tentar renovar token
      if (response.status === 401 && !this.isRefreshing) {
        return this.handleTokenRefresh(input, init)
      }

      return response
    }
  }

  private async handleTokenRefresh(
    input: RequestInfo | URL, 
    init?: RequestInit
  ): Promise<Response> {
    if (this.isRefreshing) {
      // ✅ Se já está renovando, aguardar na fila
      return new Promise((resolve, reject) => {
        this.failedQueue.push({
          resolve: (token: string) => {
            if (init?.headers) {
              (init.headers as any)['Authorization'] = `Bearer ${token}`
            }
            resolve(window.fetch(input, init))
          },
          reject
        })
      })
    }

    this.isRefreshing = true

    try {
      const newToken = await refreshToken()

      if (newToken) {
        // ✅ Processar fila de requisições pendentes
        this.processQueue(newToken)
        
        // ✅ Aplicar novo token aos headers Axios
        axiosConfig.setAuthToken(newToken)

        // ✅ Refazer requisição original com novo token
        if (init?.headers) {
          (init.headers as any)['Authorization'] = `Bearer ${newToken}`
        }
        
        return window.fetch(input, init)
      } else {
        // ✅ Se refresh falhou, rejeitar todas as requisições
        this.processQueue(null)
        throw new Error('Token refresh failed')
      }
    } catch (error) {
      this.processQueue(null)
      throw error
    } finally {
      this.isRefreshing = false
    }
  }

  private processQueue(token: string | null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (token) {
        resolve(token)
      } else {
        reject(new Error('Token refresh failed'))
      }
    })

    this.failedQueue = []
  }

  // ✅ Método para verificar se token está próximo do vencimento
  scheduleTokenRefresh() {
    const checkInterval = 5 * 60 * 1000 // 5 minutos

    setInterval(async () => {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      if (token) {
        try {
          // ✅ Decodificar JWT para verificar expiração
          const payload = JSON.parse(atob(token.split('.')[1]))
          const currentTime = Date.now() / 1000
          const timeUntilExpiry = payload.exp - currentTime

          // ✅ Se falta menos de 10 minutos, renovar
          if (timeUntilExpiry < 600) { // 10 minutos
            console.log('🔄 Token próximo do vencimento, renovando...')
            const newToken = await refreshToken()
            
            if (newToken) {
              axiosConfig.setAuthToken(newToken)
            }
          }
        } catch (error) {
          console.error('❌ Erro ao verificar expiração do token:', error)
        }
      }
    }, checkInterval)
  }
}

// ✅ Exportar instância singleton
export const tokenInterceptor = new TokenInterceptorService()
