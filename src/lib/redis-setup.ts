/**
 * 🔧 SETUP REDIS - UTILITÁRIO DE CONFIGURAÇÃO
 * 
 * Script para inicializar e configurar Redis para sessões
 */

const Redis = require('ioredis')

class RedisSetup {
  private redis: Redis

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || '0'),
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    })
  }

  /**
   * 🔍 Testar conexão com Redis
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.redis.ping()
      console.log('✅ Redis conectado com sucesso!')
      return true
    } catch (error) {
      console.error('❌ Erro ao conectar com Redis:', error)
      return false
    }
  }

  /**
   * 🧹 Limpar todas as sessões (útil para desenvolvimento)
   */
  async clearAllSessions(): Promise<void> {
    try {
      const keys = await this.redis.keys('session:*')
      const userKeys = await this.redis.keys('user_sessions:*')
      
      if (keys.length > 0) {
        await this.redis.del(...keys)
        console.log(`🧹 ${keys.length} sessões removidas`)
      }
      
      if (userKeys.length > 0) {
        await this.redis.del(...userKeys)
        console.log(`🧹 ${userKeys.length} índices de usuário removidos`)
      }
      
      console.log('✅ Todas as sessões foram limpas')
    } catch (error) {
      console.error('❌ Erro ao limpar sessões:', error)
    }
  }

  /**
   * 📊 Estatísticas do Redis
   */
  async getStats(): Promise<void> {
    try {
      const info = await this.redis.info('memory')
      const sessionKeys = await this.redis.keys('session:*')
      const userKeys = await this.redis.keys('user_sessions:*')
      
      console.log('📊 Estatísticas do Redis:')
      console.log(`   Sessões ativas: ${sessionKeys.length}`)
      console.log(`   Índices de usuário: ${userKeys.length}`)
      console.log(`   Memória usada: ${info.split('\n').find(line => line.startsWith('used_memory_human:'))?.split(':')[1]?.trim() || 'N/A'}`)
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas:', error)
    }
  }

  /**
   * 🔧 Configurar Redis para produção
   */
  async setupProduction(): Promise<void> {
    try {
      // Configurações otimizadas para produção
      await this.redis.config('SET', 'maxmemory-policy', 'allkeys-lru')
      await this.redis.config('SET', 'save', '900 1 300 10 60 10000')
      
      console.log('✅ Redis configurado para produção')
    } catch (error) {
      console.error('❌ Erro ao configurar Redis:', error)
    }
  }

  /**
   * 🏁 Fechar conexão
   */
  async disconnect(): Promise<void> {
    await this.redis.disconnect()
    console.log('🔌 Desconectado do Redis')
  }
}

// 🚀 Script de linha de comando
if (require.main === module) {
  const setup = new RedisSetup()
  
  async function main() {
    const args = process.argv.slice(2)
    const command = args[0]
    
    switch (command) {
      case 'test':
        await setup.testConnection()
        break
      case 'clear':
        await setup.clearAllSessions()
        break
      case 'stats':
        await setup.getStats()
        break
      case 'setup-prod':
        await setup.setupProduction()
        break
      default:
        console.log('📋 Comandos disponíveis:')
        console.log('   npm run redis:test     - Testar conexão')
        console.log('   npm run redis:clear    - Limpar sessões')  
        console.log('   npm run redis:stats    - Ver estatísticas')
        console.log('   npm run redis:setup    - Configurar produção')
    }
    
    await setup.disconnect()
  }
  
  main().catch(console.error)
}

module.exports = { RedisSetup }
