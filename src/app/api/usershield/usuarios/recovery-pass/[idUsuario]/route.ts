/**
 * Proxy para o endpoint UserShield RecoveryPass
 * 
 * Este endpoint atua como proxy para a API UserShield, gerenciando
 * autenticação com credenciais de administrador e cache de tokens.
 */

import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { tokenCacheService } from '@/services/tokenCacheService'
import { getServiceUrl } from '@/config/env'

async function performLogin(loginUrl: string): Promise<string | null> {
  try {
    const username = process.env.USERSHIELD_USERNAME
    const password = process.env.USERSHIELD_PASSWORD

    if (!username || !password) {
      throw new Error('Credenciais do UserShield não configuradas')
    }

    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      throw new Error(`Login falhou: ${response.status}`)
    }

    const data = await response.json()
    const token = data.jwtToken || data.token

    if (token) {
      // TTL de 55 minutos em segundos (3300s) - API expira em 60min
      await tokenCacheService.setToken('usershield', token, '3300')
      return token
    }

    return null
  } catch (error) {
    logger.error('Erro no login UserShield:', error)
    return null
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ idUsuario: string }> }
) {
  try {
    const params = await context.params
    const { idUsuario } = params

    const USERSHIELD_BASE_URL = `${getServiceUrl('USERSHIELD')}`
    const USERSHIELD_LOGIN_URL = `${USERSHIELD_BASE_URL}/v1/Auth/login`
    const USERSHIELD_RECOVERY_URL = `${USERSHIELD_BASE_URL}/v1/Usuarios/RecoveryPass/${idUsuario}`

    logger.info(`[RecoveryPass Proxy] Processando request para usuário ${idUsuario}`)

    // Obtém token do cache ou faz login
    let jwtToken = await tokenCacheService.getToken('usershield')
    if (!jwtToken) {
      logger.info('[RecoveryPass Proxy] Token não encontrado no cache, fazendo login...')
      jwtToken = await performLogin(USERSHIELD_LOGIN_URL)
      
      if (!jwtToken) {
        return NextResponse.json(
          { success: false, message: 'Falha ao obter token de autenticação' },
          { status: 500 }
        )
      }
    }

    // Obter body da request
    const body = await request.json()
    logger.info('[RecoveryPass Proxy] Payload recebido:', body)

    // Fazer request para UserShield com token de admin
    let response = await fetch(USERSHIELD_RECOVERY_URL, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    // Se receber 401, token pode ter expirado - tentar refresh
    if (response.status === 401) {
      logger.warn('[RecoveryPass Proxy] Token expirado, renovando...')
      
      // Remove token inválido do cache
      await tokenCacheService.removeToken('usershield')
      
      // Faz novo login
      jwtToken = await performLogin(USERSHIELD_LOGIN_URL)
      
      if (!jwtToken) {
        return NextResponse.json(
          { success: false, message: 'Falha ao renovar token de autenticação' },
          { status: 500 }
        )
      }

      // Tenta novamente com novo token
      response = await fetch(USERSHIELD_RECOVERY_URL, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
    }

    // Processar resposta
    const contentType = response.headers.get('content-type')
    
    if (contentType?.includes('application/json')) {
      const data = await response.json()
      logger.info('[RecoveryPass Proxy] Resposta UserShield:', {
        status: response.status,
        data
      })
      
      return NextResponse.json(data, { status: response.status })
    } else {
      const text = await response.text()
      logger.info('[RecoveryPass Proxy] Resposta UserShield (text):', {
        status: response.status,
        text: text.substring(0, 200)
      })
      
      return new NextResponse(text, { 
        status: response.status,
        headers: { 'Content-Type': contentType || 'text/plain' }
      })
    }

  } catch (error) {
    logger.error('[RecoveryPass Proxy] Erro:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erro ao processar solicitação',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
