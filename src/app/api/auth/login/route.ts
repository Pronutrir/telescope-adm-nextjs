import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { requireApiBaseUrl } from '@/config/env'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 🐛 Debug: Log do body recebido
  logger.debug('📥 [Auth] Request body:', body)
    
  const API_BASE_URL = requireApiBaseUrl()
  const response = await fetch(`${API_BASE_URL}/usershield/api/v1/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    })

    // 🐛 Debug: Log da resposta
  logger.debug('📤 [Auth] Response status:', response.status)
    
    // Verificar se a resposta tem conteúdo antes de tentar fazer parse do JSON
    const contentType = response.headers.get('content-type')
    let data

    if (contentType && contentType.includes('application/json')) {
      const text = await response.text()
      if (text) {
        try {
          data = JSON.parse(text)
        } catch (error) {
          logger.error('❌ [Auth] Parse JSON login falhou:', error)
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
    
    // 🐛 Debug: Log dos dados retornados
    logger.debug('📋 [Auth] Response data:', { 
      success: response.ok, 
      hasToken: !!data?.jwtToken,
      message: data?.message 
    })

    if (!response.ok) {
      logger.error('❌ [Auth] Erro na resposta da API de login:', {
        status: response.status,
        statusText: response.statusText,
        data
      })
      
      return NextResponse.json(
        { message: data?.message || `Erro ${response.status}: ${response.statusText}` },
        { status: response.status }
      )
    }

    // Criar resposta com cookie
    const nextResponse = NextResponse.json(data)
    
    // Se o login foi bem-sucedido e temos um token, definir o cookie SEGURO
    if (data?.jwtToken) {
      nextResponse.cookies.set('token', data.jwtToken, {
        httpOnly: true,  // ✅ Proteção contra XSS
        secure: process.env.NODE_ENV === 'production',  // ✅ HTTPS em produção
        sameSite: 'strict',  // ✅ Proteção CSRF mais forte (mudança de 'lax' para 'strict')
        maxAge: 60 * 60 * 1, // ✅ 1 hora apenas (access token curto para máxima segurança)
        path: '/',
      })
      
      // Também definir refresh token se disponível
      if (data?.refreshToken) {
        nextResponse.cookies.set('refreshToken', data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7, // 7 dias para refresh token
          path: '/',
        })
      }
    }

    return nextResponse
  } catch (error) {
    logger.error('❌ [Auth] Erro na API de login:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
