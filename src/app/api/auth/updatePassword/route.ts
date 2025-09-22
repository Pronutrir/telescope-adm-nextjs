import { NextRequest, NextResponse } from 'next/server'
import { requireApiBaseUrl } from '@/config/env'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, newPassword } = body

    // Fazer a chamada para a API externa
  const API_BASE_URL = requireApiBaseUrl()
  const response = await fetch(`${API_BASE_URL}/usershield/api/v1/Auth/updatePassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        newPassword
      })
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Erro ao atualizar senha' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)

  } catch (error) {
    logger.error('Erro na API updatePassword:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
