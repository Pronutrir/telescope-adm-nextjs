import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://servicesapp.pronutrir.com.br'

export async function GET(request: NextRequest) {
  try {
    // Obter token do cookie
    const token = request.cookies.get('token')?.value

    if (!token) {
      console.log('❌ Token não encontrado nos cookies')
      return NextResponse.json(
        { message: 'Token não encontrado' },
        { status: 401 }
      )
    }

    console.log('🔑 Token encontrado, fazendo requisição para:', `${API_BASE_URL}/usershield/api/v1/Usuarios/getUser`)
    console.log('🔑 Token (primeiros 20 chars):', token.substring(0, 20) + '...')

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
          console.error('Erro ao fazer parse do JSON:', error)
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

    if (!response.ok) {
      console.error('Erro na resposta da API:', {
        status: response.status,
        statusText: response.statusText,
        data
      })
      
      return NextResponse.json(
        { message: data?.message || `Erro ${response.status}: ${response.statusText}` },
        { status: response.status }
      )
    }

    console.log('✅ Resposta bem-sucedida da API:', {
      status: response.status,
      hasData: !!data
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ Erro na API de usuário:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
