import { NextRequest, NextResponse } from 'next/server'
import { requireApiBaseUrl } from '@/config/env'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    // Obter token do cookie
    const token = request.cookies.get('token')?.value

    if (!token) {
      logger.warn('❌ [Auth] Token não encontrado nos cookies')
      return NextResponse.json(
        { message: 'Token não encontrado' },
        { status: 401 }
      )
    }

    const API_BASE_URL = requireApiBaseUrl()
    logger.info('🔑 [Auth] Buscando usuário em:', `${API_BASE_URL}/usershield/api/v1/Usuarios/getUser`)
    logger.debug('🔑 [Auth] Token (prefixo):', token.substring(0, 20) + '...')

    const response = await fetch(`${API_BASE_URL}/usershield/api/v1/Usuarios/getUser`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    // Verificar se a resposta tem conteúdo antes de tentar fazer parse do JSON
    const contentType = response.headers.get('content-type')
    let data

    if (contentType && contentType.includes('application/json')) {
      const text = await response.text()
      if (text) {
        try {
          data = JSON.parse(text)
        } catch (error) {
          logger.error('❌ [Auth] Parse JSON falhou', error)
          logger.debug('Resposta recebida:', text)
          return NextResponse.json(
            { message: 'Resposta inválida do servidor' },
            { status: 502 }
          )
        }
      } else {
        data = null
      }
    } else {
      // Se não é JSON, pegar como texto
      data = { message: await response.text() }
    }

    if (!response.ok) {
      logger.error('❌ [Auth] Erro na resposta da API:', {
        status: response.status,
        statusText: response.statusText,
        data
      })
      
      return NextResponse.json(
        { message: data?.message || `Erro ${response.status}: ${response.statusText}` },
        { status: response.status }
      )
    }

    logger.info('✅ [Auth] Resposta bem-sucedida:', {
      status: response.status,
      hasData: !!data
    })

    return NextResponse.json(data)
  } catch (error) {
    logger.error('❌ [Auth] Erro na API de usuário:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
