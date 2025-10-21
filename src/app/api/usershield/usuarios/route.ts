/**
 * API Route UNIFICADA para UserShield com Redis Cache
 * GET /api/usershield/usuarios
 * 
 * Features:
 * - Cache de tokens via Redis (55 minutos TTL)
 * - Login automático apenas quando necessário
 * - Renovação proativa de tokens próximos ao vencimento
 * - Fallback robusto para cache em memória
 */
import { NextResponse } from 'next/server'
import { tokenCacheService } from '@/services/tokenCacheService'
import { logger } from '@/lib/logger'
import { getServiceUrl } from '@/config/env'

export async function GET() {
  // URLs da UserShield API a partir de variáveis de ambiente
  const USERSHIELD_BASE_URL = `${getServiceUrl('USERSHIELD')}`
  const USERSHIELD_LOGIN_URL = `${USERSHIELD_BASE_URL}v1/Auth/login`
  const USERSHIELD_USERS_URL = `${USERSHIELD_BASE_URL}v1/Usuarios`
  
  try {
    logger.info('API Route UserShield UNIFICADA: Iniciada')
    
    // Validar se as variáveis de ambiente estão definidas
    if (!process.env.USERSHIELD_USERNAME || !process.env.USERSHIELD_PASSWORD) {
      throw new Error('Credenciais UserShield não configuradas nas variáveis de ambiente')
    }
    
    // Verificar se há token válido no cache Redis primeiro
    let jwtToken = await tokenCacheService.getToken('usershield')
    
    if (!jwtToken) {
      logger.info('Nenhum token no cache, fazendo login...')
      jwtToken = await performLogin(USERSHIELD_LOGIN_URL)
      
      if (!jwtToken) {
        throw new Error('Falha na autenticação')
      }
    } else {
      logger.debug('Token encontrado no cache Redis')
      
      // Verificar se o token está próximo do vencimento (renovação proativa)
      const isNearExpiry = await tokenCacheService.isTokenNearExpiry('usershield')
      if (isNearExpiry) {
        logger.info('Token próximo do vencimento, renovando...')
        const newToken = await performLogin(USERSHIELD_LOGIN_URL)
        if (newToken) {
          jwtToken = newToken
        }
      }
    }

    // Buscar usuários com o token
    logger.debug('Buscando usuários...')
    let usuariosResponse = await fetch(USERSHIELD_USERS_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      }
    })

    // Se token inválido (401), remover do cache e tentar novo login
    if (usuariosResponse.status === 401) {
      logger.warn('Token inválido (401), removendo do cache e fazendo novo login...')
      await tokenCacheService.removeToken('usershield')
      
      const newToken = await performLogin(USERSHIELD_LOGIN_URL)
      if (!newToken) {
        throw new Error('Falha na reautenticação')
      }

      // Nova tentativa com token fresco
      usuariosResponse = await fetch(USERSHIELD_USERS_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${newToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!usuariosResponse.ok) {
        throw new Error(`Falha na busca de usuários após reautenticação: ${usuariosResponse.status}`)
      }
    }

    if (!usuariosResponse.ok) {
      throw new Error(`Falha na busca de usuários: ${usuariosResponse.status}`)
    }

  const usuariosData = await usuariosResponse.json()
  logger.info('Usuários obtidos:', usuariosData.result?.length || 0)

    // Mapear para formato esperado pela aplicação
    const usuarios = usuariosData.result?.map((user: any) => ({
      id: user.id.toString(),
      name: user.nomeCompleto || user.username,
      email: user.email || `${user.username}@pronutrir.com.br`,
      userName: user.username,
      role: user.perfis?.[0]?.nomePerfil || 'Usuário',
      status: user.statusUsuario === 'A' ? 'Ativo' : 'Inativo',
      lastLogin: user.dataUltimoAcesso || new Date().toISOString().split('T')[0],
      department: user.departamento || 'N/A',
      perfis: user.perfis || [],
      roles: user.roles || []
    })) || []

    return NextResponse.json({
      success: true,
      result: usuarios
    })

  } catch (error: any) {
    logger.error('Erro na API UserShield:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Erro ao buscar usuários' 
      },
      { status: 500 }
    )
  }
}

/**
 * Função auxiliar para fazer login no UserShield
 */
async function performLogin(loginUrl: string): Promise<string | null> {
  try {
    logger.debug('Fazendo login no UserShield...')
    
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Username: process.env.USERSHIELD_USERNAME,
        Password: process.env.USERSHIELD_PASSWORD
      })
    })

    if (!response.ok) {
      logger.error('Falha no login UserShield:', response.status)
      return null
    }

    const data = await response.json()
    const token = data.jwtToken

    if (token) {
      // Salvar token no cache Redis com TTL de 55 minutos (API expira em 60)
      await tokenCacheService.setToken(token, 'usershield')
      logger.info('✅ Token UserShield salvo no cache (55min TTL)')
    }

    return token
  } catch (error) {
    logger.error('Erro no login UserShield:', error)
    return null
  }
}
