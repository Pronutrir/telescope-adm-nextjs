import { NextRequest, NextResponse } from 'next/server'
import { requireApiBaseUrl } from '@/config/env'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    // Obter o token de autenticação dos cookies
    const token = request.cookies.get('token')?.value

    if (!token) {
      logger.warn('❌ Token não encontrado nos cookies')
      return NextResponse.json(
        { message: 'Não autenticado. Faça login novamente.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { username, password, newPassword, idUsuario } = body

    // Fazer a chamada para a API externa
  const API_BASE_URL = requireApiBaseUrl()
  const apiUrl = `${API_BASE_URL}/usershield/api/v1/Usuarios/RecoveryPass/${idUsuario}`
  
  logger.info(`🔄 Chamando API RecoveryPass: ${apiUrl}`)
  logger.info(`🔑 Token presente: ${token ? 'Sim' : 'Não'}`)
  
  const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        username,
        password,
        newPassword
      })
    })

    logger.info(`📡 Resposta da API: Status ${response.status}`)

    // Tentar ler o corpo da resposta
    const text = await response.text()
    logger.info(`📄 Corpo da resposta: ${text.substring(0, 200)}`)
    
    let data: any = {}
    if (text) {
      try {
        data = JSON.parse(text)
      } catch (e) {
        logger.error('❌ Erro ao parsear JSON:', e)
        // Se não for JSON, usar o texto como mensagem
        data = { message: text }
      }
    }

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || data || 'Erro ao atualizar senha' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Senha atualizada com sucesso',
      data
    })

  } catch (error) {
    logger.error('Erro na API updatePassword:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
