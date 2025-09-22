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
  const USERSHIELD_BASE_URL = `${getServiceUrl('USERSHIELD')}/api/`
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
      role: user.roles?.[0]?.perfis?.nomePerfil || user.tipoUsuario || 'Usuário',
      status: user.ativo ? 'Ativo' : 'Inativo',
      lastLogin: user.dataAtualizacao?.split('T')[0] || new Date().toISOString().split('T')[0],
      department: user.estabelecimento ? `Estabelecimento ${user.estabelecimento}` : 'N/A',
      perfis: user.roles?.map((role: any) => ({
        id: role.perfis.id.toString(),
        nomePerfil: role.perfis.nomePerfil
      })) || []
    })) || []

    return NextResponse.json({
      success: true,
      result: usuarios,
      message: `${usuarios.length} usuários reais encontrados via UserShield API`,
      cached: true, // Indica que usa cache Redis
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    logger.error('Erro na API UserShield:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

/**
 * Realiza login na UserShield API e armazena token no cache Redis
 */
async function performLogin(loginUrl: string): Promise<string | null> {
  try {
    logger.info('Fazendo login na UserShield API...')
    
    const loginResponse = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        Username: process.env.USERSHIELD_USERNAME,
        Password: process.env.USERSHIELD_PASSWORD
      })
    })

    if (!loginResponse.ok) {
      logger.error('Login falhou:', loginResponse.status)
      return null
    }

    const loginData = await loginResponse.json()
    const token = loginData.jwtToken

    if (!token) {
      logger.error('Token não encontrado na resposta do login')
      return null
    }

    // Armazenar token no cache Redis por 55 minutos
    await tokenCacheService.setToken(token, 'usershield', process.env.USERSHIELD_USERNAME!)
    logger.info('Login realizado e token armazenado no cache Redis')
    
    return token
  } catch (error) {
    logger.error('Erro no login:', error)
    return null
  }
}

/**
 * Endpoint para estatísticas do cache Redis (útil para debugging)
 */
export async function HEAD() {
  try {
    const stats = await tokenCacheService.getCacheStats()
    
    return new NextResponse(null, {
      status: 200,
      headers: {
        'X-Cache-Stats': JSON.stringify(stats),
        'X-Cache-Redis-Available': stats.isRedisAvailable.toString(),
        'X-Cache-Tokens-Count': stats.cachedTokensCount.toString()
      }
    })
  } catch {
    return new NextResponse(null, { status: 500 })
  }
}