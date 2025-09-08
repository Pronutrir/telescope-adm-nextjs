import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://servicesapp.pronutrir.com.br'

export async function POST(request: NextRequest) {
  try {
    // Obter token do cookie
    const token = request.cookies.get('token')?.value

    if (token) {
      // Fazer logout no servidor remoto
      try {
        await fetch(`${API_BASE_URL}/usershield/api/v1/Auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })
      } catch (error) {
        console.error('Erro ao fazer logout no servidor remoto:', error)
        // Continuar mesmo se houver erro no logout remoto
      }
    }

    // Remover cookie independentemente do resultado
    const response = NextResponse.json({ message: 'Logout realizado com sucesso' })
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Remove o cookie
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Erro na API de logout:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
