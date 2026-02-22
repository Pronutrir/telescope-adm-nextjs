/**
 * API Route para UserShield - Perfil por ID
 * GET /api/usershield/perfis/[id]
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const USERSHIELD_BASE_URL = `${getServiceUrl('USERSHIELD')}`
  const USERSHIELD_LOGIN_URL = `${USERSHIELD_BASE_URL}/v1/Auth/login`
  
  try {
    // Await params (Next.js 15 requirement)
    const { id } = await params
    const USERSHIELD_PERFIL_URL = `${USERSHIELD_BASE_URL}/v1/Perfis/${id}`
    
    logger.info(`API Route UserShield Perfil ${id}: Iniciada`)
    
    // Validar credenciais
    if (!process.env.USERSHIELD_USERNAME || !process.env.USERSHIELD_PASSWORD) {
      throw new Error('Credenciais UserShield não configuradas')
    }
    
    // Tentar obter token do cache
    let token = await tokenCacheService.getToken('usershield')
    
    if (!token) {
      logger.info('Token não encontrado no cache, realizando login...')
      token = await performLogin(USERSHIELD_LOGIN_URL)
      
      if (!token) {
        return NextResponse.json(
          { error: 'Falha ao autenticar com UserShield' },
          { status: 401 }
        )
      }
    }
    
    // Fazer requisição para obter o perfil
    logger.info(`Buscando perfil ID ${id} na API UserShield`)
    const response = await fetch(USERSHIELD_PERFIL_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    // Se 401, tentar renovar token
    if (response.status === 401) {
      logger.info('Token expirado, renovando...')
      token = await performLogin(USERSHIELD_LOGIN_URL)
      
      if (!token) {
        return NextResponse.json(
          { error: 'Falha ao renovar autenticação' },
          { status: 401 }
        )
      }
      
      // Tentar novamente com novo token
      const retryResponse = await fetch(USERSHIELD_PERFIL_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!retryResponse.ok) {
        throw new Error(`Erro na API: ${retryResponse.status} ${retryResponse.statusText}`)
      }
      
      const data = await retryResponse.json()
      logger.info(`Perfil ${id} obtido com sucesso (após renovação)`)
      return NextResponse.json(data)
    }
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: `Perfil ${id} não encontrado` },
          { status: 404 }
        )
      }
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    logger.info(`Perfil ${id} obtido com sucesso`)
    return NextResponse.json(data)
    
  } catch (error) {
    logger.error('Erro na API Route Perfil:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao buscar perfil',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
