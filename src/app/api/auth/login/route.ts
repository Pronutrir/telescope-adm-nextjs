import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://servicesapp.pronutrir.com.br'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 🐛 Debug: Log do body recebido
    console.log('📥 Request body:', body)
    
    const response = await fetch(`${API_BASE_URL}/usershield/api/v1/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    })

    // 🐛 Debug: Log da resposta
    console.log('📤 Response status:', response.status)
    
    // Verificar se a resposta tem conteúdo antes de tentar fazer parse do JSON
    const contentType = response.headers.get('content-type')
    let data

    if (contentType && contentType.includes('application/json')) {
      const text = await response.text()
      if (text) {
        try {
          data = JSON.parse(text)
        } catch (error) {
          console.error('❌ Erro ao fazer parse do JSON no login:', error)
          console.error('Resposta recebida:', text)
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
    console.log('📋 Response data:', { 
      success: response.ok, 
      hasToken: !!data?.jwtToken,
      message: data?.message 
    })

    if (!response.ok) {
      console.error('❌ Erro na resposta da API de login:', {
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
    
    // Se o login foi bem-sucedido e temos um token, definir o cookie
    if (data?.jwtToken) {
      nextResponse.cookies.set('token', data.jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 dias
        path: '/',
      })
    }

    return nextResponse
  } catch (error) {
    console.error('Erro na API de login:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
