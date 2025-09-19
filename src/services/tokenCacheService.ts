/**
 * Serviço para cache seguro de tokens JWT da UserShield API
 * Utiliza Redis para armazenamento server-side com TTL automático
 */

interface TokenCacheData {
  token: string
  expiresAt: number
  userId?: string
}

class TokenCacheService {
  private redis: any = null
  private isRedisAvailable = false

  constructor() {
    this.initRedis()
  }

  private async initRedis() {
    try {
      // Verifica se o Redis está disponível
      if (typeof window === 'undefined') {
        // Apenas no server-side
        const { Redis } = await import('ioredis')
        this.redis = new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          password: process.env.REDIS_PASSWORD,
          maxRetriesPerRequest: 3,
          lazyConnect: true
        })

        await this.redis.ping()
        this.isRedisAvailable = true
        console.log('✅ Redis conectado para cache de tokens')
      }
    } catch (error) {
      console.warn('⚠️ Redis não disponível, usando cache em memória:', error)
      this.isRedisAvailable = false
    }
  }

  private getTokenKey(identifier: string = 'usershield'): string {
    return `token:usershield:${identifier}`
  }

  /**
   * Armazena token no cache com TTL de 55 minutos
   */
  async setToken(token: string, identifier: string = 'usershield', userId?: string): Promise<void> {
    try {
      const expiresAt = Date.now() + (55 * 60 * 1000) // 55 minutos
      const tokenData: TokenCacheData = {
        token,
        expiresAt,
        userId
      }

      const key = this.getTokenKey(identifier)

      if (this.isRedisAvailable && this.redis) {
        // Armazena no Redis com TTL de 55 minutos
        await this.redis.setex(key, 55 * 60, JSON.stringify(tokenData))
        console.log(`🔐 Token armazenado no Redis para ${identifier}`)
      } else {
        // Fallback: armazena em memória
        this.memoryCache.set(key, tokenData)
        console.log(`🔐 Token armazenado em memória para ${identifier}`)
      }
    } catch (error) {
      console.error('❌ Erro ao armazenar token:', error)
    }
  }

  /**
   * Recupera token do cache se ainda válido
   */
  async getToken(identifier: string = 'usershield'): Promise<string | null> {
    try {
      const key = this.getTokenKey(identifier)
      let tokenData: TokenCacheData | null = null

      if (this.isRedisAvailable && this.redis) {
        // Busca no Redis
        const cached = await this.redis.get(key)
        if (cached) {
          tokenData = JSON.parse(cached)
        }
      } else {
        // Fallback: busca em memória
        tokenData = this.memoryCache.get(key) || null
      }

      if (tokenData) {
        // Verifica se o token ainda está válido (com margem de 5 minutos)
        if (Date.now() < (tokenData.expiresAt - 5 * 60 * 1000)) {
          console.log(`✅ Token válido encontrado no cache para ${identifier}`)
          return tokenData.token
        } else {
          // Token próximo do vencimento, remove do cache
          await this.removeToken(identifier)
          console.log(`⏰ Token expirado removido do cache para ${identifier}`)
        }
      }

      return null
    } catch (error) {
      console.error('❌ Erro ao recuperar token:', error)
      return null
    }
  }

  /**
   * Remove token do cache
   */
  async removeToken(identifier: string = 'usershield'): Promise<void> {
    try {
      const key = this.getTokenKey(identifier)

      if (this.isRedisAvailable && this.redis) {
        await this.redis.del(key)
        console.log(`🗑️ Token removido do Redis para ${identifier}`)
      } else {
        this.memoryCache.delete(key)
        console.log(`🗑️ Token removido da memória para ${identifier}`)
      }
    } catch (error) {
      console.error('❌ Erro ao remover token:', error)
    }
  }

  /**
   * Verifica se o token está próximo do vencimento (últimos 10 minutos)
   */
  async isTokenNearExpiry(identifier: string = 'usershield'): Promise<boolean> {
    try {
      const key = this.getTokenKey(identifier)
      let tokenData: TokenCacheData | null = null

      if (this.isRedisAvailable && this.redis) {
        const cached = await this.redis.get(key)
        if (cached) {
          tokenData = JSON.parse(cached)
        }
      } else {
        tokenData = this.memoryCache.get(key) || null
      }

      if (tokenData) {
        // Considera próximo do vencimento se restam menos de 10 minutos
        return Date.now() > (tokenData.expiresAt - 10 * 60 * 1000)
      }

      return true // Se não há token, considera que precisa renovar
    } catch (error) {
      console.error('❌ Erro ao verificar expiração do token:', error)
      return true
    }
  }

  /**
   * Limpa todos os tokens expirados (para manutenção)
   */
  async cleanExpiredTokens(): Promise<void> {
    try {
      if (this.isRedisAvailable && this.redis) {
        const keys = await this.redis.keys('token:usershield:*')
        for (const key of keys) {
          const cached = await this.redis.get(key)
          if (cached) {
            const tokenData: TokenCacheData = JSON.parse(cached)
            if (Date.now() >= tokenData.expiresAt) {
              await this.redis.del(key)
              console.log(`🧹 Token expirado removido: ${key}`)
            }
          }
        }
      } else {
        // Limpa cache em memória
        for (const [key, tokenData] of this.memoryCache.entries()) {
          if (key.startsWith('token:usershield:') && Date.now() >= tokenData.expiresAt) {
            this.memoryCache.delete(key)
            console.log(`🧹 Token expirado removido da memória: ${key}`)
          }
        }
      }
    } catch (error) {
      console.error('❌ Erro ao limpar tokens expirados:', error)
    }
  }

  /**
   * Cache em memória como fallback
   */
  private memoryCache = new Map<string, TokenCacheData>()

  /**
   * Estatísticas do cache
   */
  async getCacheStats(): Promise<{
    isRedisAvailable: boolean
    cachedTokensCount: number
    memoryTokensCount: number
  }> {
    try {
      let cachedTokensCount = 0
      const memoryTokensCount = this.memoryCache.size

      if (this.isRedisAvailable && this.redis) {
        const keys = await this.redis.keys('token:usershield:*')
        cachedTokensCount = keys.length
      }

      return {
        isRedisAvailable: this.isRedisAvailable,
        cachedTokensCount,
        memoryTokensCount
      }
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas do cache:', error)
      return {
        isRedisAvailable: false,
        cachedTokensCount: 0,
        memoryTokensCount: 0
      }
    }
  }
}

// Singleton instance
export const tokenCacheService = new TokenCacheService()
export default tokenCacheService
