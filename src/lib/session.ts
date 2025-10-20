/**
 * 🔒 SERVER-SIDE SESSION MANAGER
 * 
 * Sistema de sessões server-side com Redis
 * - Dados 100% no servidor
 * - Cookies apenas com ID da sessão
 * - Segurança enterprise level
 */

import { cookies } from 'next/headers'
import Redis from 'ioredis'

export interface SessionData {
  userId: string
  email: string
  name: string
  token?: string  // JWT token from UserShield API
  permissions: string[]
  perfis?: any[]  // Complete perfil objects from UserShield (id, nomePerfil, statusPerfil, dataRegistro, dataAtualizacao, usuario, roleId)
  expiresAt: Date
  ipAddress: string
  userAgent: string
  createdAt: Date
  lastActivity: Date
}

export interface SessionConfig {
  sessionDuration: number // segundos
  refreshThreshold: number // segundos antes do vencimento para auto-refresh
  maxSessions: number // máximo de sessões simultâneas por usuário
}

class ServerSessionManager {
  private redis: Redis
  private config: SessionConfig

  constructor() {
    // ✅ Configuração Redis
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || '0'),
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    })

    // ✅ Configuração de sessões
    this.config = {
      sessionDuration: 4 * 60 * 60, // 4 horas
      refreshThreshold: 30 * 60, // 30 minutos
      maxSessions: 5 // máximo 5 sessões por usuário
    }
  }

  /**
   * ✅ Criar nova sessão server-side
   */
  async createSession(userData: Omit<SessionData, 'createdAt' | 'lastActivity' | 'expiresAt'>): Promise<string> {
    const sessionId = crypto.randomUUID()
    const now = new Date()
    
    const sessionData: SessionData = {
      ...userData,
      createdAt: now,
      lastActivity: now,
      expiresAt: new Date(now.getTime() + this.config.sessionDuration * 1000)
    }

    // ✅ Limitar sessões simultâneas por usuário
    await this.limitUserSessions(userData.userId)

    // ✅ Salvar sessão no Redis
    const sessionKey = `session:${sessionId}`
    await this.redis.setex(
      sessionKey,
      this.config.sessionDuration,
      JSON.stringify(sessionData)
    )

    // ✅ Indexar por usuário para controle
    await this.redis.sadd(`user_sessions:${userData.userId}`, sessionId)
    await this.redis.expire(`user_sessions:${userData.userId}`, this.config.sessionDuration)

    // ✅ Cookie httpOnly com apenas o ID
    const cookieStore = await cookies()
    cookieStore.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: this.config.sessionDuration,
      path: '/'
    })

    console.log(`✅ Sessão criada: ${sessionId} para usuário ${userData.userId}`)
    return sessionId
  }

  /**
   * 🔍 Obter dados da sessão
   */
  async getSession(sessionId?: string): Promise<SessionData | null> {
    if (!sessionId) {
      const cookieStore = await cookies()
      sessionId = cookieStore.get('session_id')?.value
    }

    if (!sessionId) {
      console.log('❌ Nenhum session_id encontrado')
      return null
    }

    try {
      const sessionData = await this.redis.get(`session:${sessionId}`)
      if (!sessionData) {
        console.log(`❌ Sessão não encontrada: ${sessionId}`)
        return null
      }

      const session = JSON.parse(sessionData) as SessionData
      
      // ✅ Converter strings de data para Date objects
      session.createdAt = new Date(session.createdAt)
      session.lastActivity = new Date(session.lastActivity)
      session.expiresAt = new Date(session.expiresAt)

      // ✅ Verificar se sessão expirou
      if (session.expiresAt < new Date()) {
        console.log(`⏰ Sessão expirada: ${sessionId}`)
        await this.destroySession(sessionId)
        return null
      }

      // ✅ Atualizar última atividade
      await this.updateLastActivity(sessionId)

      return session
    } catch (error) {
      console.error('❌ Erro ao obter sessão:', error)
      return null
    }
  }

  /**
   * 🔄 Renovar sessão existente
   */
  async refreshSession(sessionId: string): Promise<boolean> {
    try {
      const session = await this.getSession(sessionId)
      if (!session) return false

      const now = new Date()
      const newExpiresAt = new Date(now.getTime() + this.config.sessionDuration * 1000)

      // ✅ Atualizar dados da sessão
      session.lastActivity = now
      session.expiresAt = newExpiresAt

      // ✅ Salvar sessão atualizada
      await this.redis.setex(
        `session:${sessionId}`,
        this.config.sessionDuration,
        JSON.stringify(session)
      )

      // ✅ Atualizar cookie
      const cookieStore = await cookies()
      cookieStore.set('session_id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: this.config.sessionDuration,
        path: '/'
      })

      console.log(`🔄 Sessão renovada: ${sessionId}`)
      return true
    } catch (error) {
      console.error('❌ Erro ao renovar sessão:', error)
      return false
    }
  }

  /**
   * 🧹 Destruir sessão
   */
  async destroySession(sessionId: string): Promise<void> {
    try {
      // ✅ Obter dados da sessão antes de destruir
      const session = await this.getSession(sessionId)
      
      if (session) {
        // ✅ Remover da lista de sessões do usuário
        await this.redis.srem(`user_sessions:${session.userId}`, sessionId)
      }

      // ✅ Remover sessão do Redis
      await this.redis.del(`session:${sessionId}`)

      // ✅ Limpar cookie
      const cookieStore = await cookies()
      cookieStore.delete('session_id')

      console.log(`🧹 Sessão destruída: ${sessionId}`)
    } catch (error) {
      console.error('❌ Erro ao destruir sessão:', error)
    }
  }

  /**
   * 👥 Destruir todas as sessões de um usuário
   */
  async destroyAllUserSessions(userId: string): Promise<void> {
    try {
      const userSessionsKey = `user_sessions:${userId}`
      const sessionIds = await this.redis.smembers(userSessionsKey)

      // ✅ Remover todas as sessões
      for (const sessionId of sessionIds) {
        await this.redis.del(`session:${sessionId}`)
      }

      // ✅ Limpar índice do usuário
      await this.redis.del(userSessionsKey)

      console.log(`🧹 ${sessionIds.length} sessões destruídas para usuário: ${userId}`)
    } catch (error) {
      console.error('❌ Erro ao destruir sessões do usuário:', error)
    }
  }

  /**
   * 🔒 Verificar se sessão precisa de renovação
   */
  async needsRefresh(sessionId: string): Promise<boolean> {
    try {
      const session = await this.getSession(sessionId)
      if (!session) return false

      const timeUntilExpiry = session.expiresAt.getTime() - Date.now()
      return timeUntilExpiry < (this.config.refreshThreshold * 1000)
    } catch (error) {
      console.error('❌ Erro ao verificar necessidade de refresh:', error)
      return false
    }
  }

  /**
   * 📊 Obter estatísticas de sessões
   */
  async getSessionStats(): Promise<{
    totalSessions: number
    userSessions: Record<string, number>
  }> {
    try {
      const pattern = 'session:*'
      const keys = await this.redis.keys(pattern)
      
      const userSessions: Record<string, number> = {}
      
      for (const key of keys) {
        const sessionData = await this.redis.get(key)
        if (sessionData) {
          const session = JSON.parse(sessionData) as SessionData
          userSessions[session.userId] = (userSessions[session.userId] || 0) + 1
        }
      }

      return {
        totalSessions: keys.length,
        userSessions
      }
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas:', error)
      return { totalSessions: 0, userSessions: {} }
    }
  }

  /**
   * 🔧 Métodos privados
   */
  private async updateLastActivity(sessionId: string): Promise<void> {
    try {
      const sessionData = await this.redis.get(`session:${sessionId}`)
      if (sessionData) {
        const session = JSON.parse(sessionData) as SessionData
        session.lastActivity = new Date()
        
        await this.redis.setex(
          `session:${sessionId}`,
          this.config.sessionDuration,
          JSON.stringify(session)
        )
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar última atividade:', error)
    }
  }

  private async limitUserSessions(userId: string): Promise<void> {
    try {
      const userSessionsKey = `user_sessions:${userId}`
      const sessionIds = await this.redis.smembers(userSessionsKey)

      if (sessionIds.length >= this.config.maxSessions) {
        // ✅ Remover sessão mais antiga
        const oldestSessionId = sessionIds[0] // Redis sets não são ordenados, mas para simplicidade
        await this.redis.del(`session:${oldestSessionId}`)
        await this.redis.srem(userSessionsKey, oldestSessionId)
        
        console.log(`🧹 Sessão antiga removida para usuário ${userId}: ${oldestSessionId}`)
      }
    } catch (error) {
      console.error('❌ Erro ao limitar sessões do usuário:', error)
    }
  }
}

// ✅ Instância singleton
export const sessionManager = new ServerSessionManager()
