/**
 * API Route para UserShield - Perfis
 * GET /api/usershield/perfis
 * 
 * Features:
 * - Cache de tokens via Redis (55 minutos TTL)
 * - Login automático quando necessário
 * - Renovação proativa de tokens
 */
import { NextResponse } from 'next/server'
import { tokenCacheService } from '@/services/tokenCacheService'
import { logger } from '@/lib/logger'
import { getServiceUrl } from '@/config/env'

async function performLogin(loginUrl: string): Promise<string | null> {
  try {
    const loginResponse = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Username: process.env.USERSHIELD_USERNAME,
        Password: process.env.USERSHIELD_PASSWORD
      })
    })

    if (!loginResponse.ok) {
      logger.error(`Erro no login: ${loginResponse.status} ${loginResponse.statusText}`)
      return null
    }

    const loginData = await loginResponse.json()
    const token = loginData.token || loginData.jwtToken

    if (token) {
      // Armazenar no cache Redis com TTL de 55 minutos
      await tokenCacheService.setToken(token, 'usershield')
      logger.info('Token armazenado no cache Redis')
      return token
    }

    return null
  } catch (error) {
    logger.error('Erro ao fazer login:', error)
    return null
  }
}

export async function GET() {
  const USERSHIELD_BASE_URL = `${getServiceUrl('USERSHIELD')}`
  const USERSHIELD_LOGIN_URL = `${USERSHIELD_BASE_URL}/api/v1/Auth/login`
  const USERSHIELD_PERFIS_URL = `${USERSHIELD_BASE_URL}/api/v1/Perfis`
  
  try {
    logger.info('API Route UserShield Perfis: Iniciada')
    
    // Validar credenciais
    if (!process.env.USERSHIELD_USERNAME || !process.env.USERSHIELD_PASSWORD) {
      throw new Error('Credenciais UserShield não configuradas')
    }
    
    // Verificar token no cache
    let jwtToken = await tokenCacheService.getToken('usershield')
    
    if (!jwtToken) {
      logger.info('Nenhum token no cache, fazendo login...')
      jwtToken = await performLogin(USERSHIELD_LOGIN_URL)
      
      if (!jwtToken) {
        throw new Error('Falha na autenticação')
      }
    } else {
      logger.debug('Token encontrado no cache')
      
      // Renovação proativa se próximo do vencimento
      const isNearExpiry = await tokenCacheService.isTokenNearExpiry('usershield')
      if (isNearExpiry) {
        logger.info('Token próximo do vencimento, renovando...')
        const newToken = await performLogin(USERSHIELD_LOGIN_URL)
        if (newToken) {
          jwtToken = newToken
        }
      }
    }

    // Buscar perfis
    logger.debug('Buscando perfis...')
    let perfisResponse = await fetch(USERSHIELD_PERFIS_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      }
    })

    // Se token inválido, tentar novo login
    if (perfisResponse.status === 401) {
      logger.warn('Token inválido (401), fazendo novo login...')
      await tokenCacheService.removeToken('usershield')
      
      const newToken = await performLogin(USERSHIELD_LOGIN_URL)
      if (!newToken) {
        throw new Error('Falha na reautenticação')
      }

      // Nova tentativa
      perfisResponse = await fetch(USERSHIELD_PERFIS_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${newToken}`,
          'Content-Type': 'application/json'
        }
      })
    }

    if (!perfisResponse.ok) {
      logger.error(`Erro ao buscar perfis: ${perfisResponse.status}`)
      return NextResponse.json(
        { success: false, message: 'Erro ao buscar perfis' },
        { status: perfisResponse.status }
      )
    }

    const perfisData = await perfisResponse.json()
    logger.info(`Perfis obtidos: ${perfisData.result?.length || 0}`)

    return NextResponse.json({
      success: true,
      result: perfisData.result || []
    })

  } catch (error: any) {
    logger.error('Erro na API Route Perfis:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Erro ao buscar perfis',
        error: error.toString()
      },
      { status: 500 }
    )
  }
}
