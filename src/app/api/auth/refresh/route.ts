import { NextRequest, NextResponse } from 'next/server'
import { requireApiBaseUrl } from '@/config/env'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
  logger.info('🔄 [Auth] Processando refresh token...')
    
    const refreshToken = request.cookies.get('refreshToken')?.value
    
    if (!refreshToken) {
  logger.warn('❌ [Auth] Refresh token não encontrado nos cookies')
      return NextResponse.json(
        { message: 'Refresh token não encontrado' },
        { status: 401 }
      )
    }

    // ✅ Chamada para API externa da Pronutrir
  const API_BASE_URL = requireApiBaseUrl()
  const response = await fetch(`${API_BASE_URL}/usershield/api/v1/Auth/refreshtoken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: refreshToken }),
    })

    const contentType = response.headers.get('content-type') || ''
    let data = null

    if (contentType.includes('application/json')) {
      const text = await response.text()
      if (text) {
        try {
          data = JSON.parse(text)
        } catch (error) {
          logger.error('❌ [Auth] Parse JSON refresh falhou', error)
          return NextResponse.json(
            { message: 'Resposta inválida do servidor' },
            { status: 502 }
          )
        }
      }
    }

    if (!response.ok) {
      logger.error('❌ [Auth] Erro na API de refresh:', response.status, data)
      return NextResponse.json(
        { message: data?.message || 'Erro ao renovar token' },
        { status: response.status }
      )
    }

    logger.info('✅ [Auth] Refresh token OK')

    const nextResponse = NextResponse.json(data)
    
    // ✅ Definir novos cookies seguros
    if (data?.jwtToken) {
      nextResponse.cookies.set('token', data.jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1, // ✅ 1 hora apenas (access token curto)
        path: '/',
      })
    }
    
    if (data?.refreshToken) {
      nextResponse.cookies.set('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // ✅ 7 dias para refresh token
        path: '/',
      })
    }

    return nextResponse
  } catch (error) {
    logger.error('❌ [Auth] Erro interno no refresh token:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
