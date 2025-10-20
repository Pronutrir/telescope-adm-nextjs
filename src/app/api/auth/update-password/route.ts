import { NextRequest, NextResponse } from 'next/server'
import { sessionManager } from '@/lib/session'

/**
 * Rota para alteração de senha do usuário
 * Chama API Externa via proxy: PUT /api/usershield/Usuarios/RecoveryPass/{idUsuario}
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticação via cookie session_id
    const sessionId = request.cookies.get('session_id')?.value
    
    if (!sessionId) {
      console.error('❌ [UpdatePassword] Session ID não encontrado')
      return NextResponse.json(
        { success: false, message: 'Não autenticado. Faça login novamente.' },
        { status: 401 }
      )
    }

    // 2. Obter sessão do Redis
    const session = await sessionManager.getSession(sessionId)
    
    if (!session) {
      console.error('❌ [UpdatePassword] Sessão não encontrada no Redis')
      return NextResponse.json(
        { success: false, message: 'Sessão inválida. Faça login novamente.' },
        { status: 401 }
      )
    }

    // 3. Obter dados do body
    const body = await request.json()
    const { idUsuario, password, newPassword } = body

    console.log('📥 [UpdatePassword] Dados recebidos:', { 
      idUsuario, 
      hasPassword: !!password, 
      hasNewPassword: !!newPassword 
    })

    // 4. Validar parâmetros obrigatórios
    if (!idUsuario || !password || !newPassword) {
      console.error('❌ [UpdatePassword] Parâmetros faltando:', { 
        idUsuario: !!idUsuario, 
        password: !!password, 
        newPassword: !!newPassword 
      })
      return NextResponse.json(
        { 
          success: false, 
          message: 'Todos os campos são obrigatórios.' 
        },
        { status: 400 }
      )
    }

    // 5. Validar tipo de idUsuario
    const userId = typeof idUsuario === 'string' ? parseInt(idUsuario) : idUsuario
    if (isNaN(userId)) {
      console.error('❌ [UpdatePassword] ID usuário inválido:', idUsuario)
      return NextResponse.json(
        { success: false, message: 'ID do usuário inválido.' },
        { status: 400 }
      )
    }

    // 6. Validar força da senha
    if (newPassword.length < 8) {
      console.error('❌ [UpdatePassword] Senha fraca')
      return NextResponse.json(
        { success: false, message: 'A nova senha deve ter pelo menos 8 caracteres.' },
        { status: 400 }
      )
    }

    console.log('🔐 [UpdatePassword] Alterando senha para usuário:', userId)
    console.log('📧 [UpdatePassword] Email do usuário:', session.email)

    // 7. Chamar API UserShield via PROXY INTERNO (autenticação automática)
    // IMPORTANTE: UserShield API requer username, password e newPassword no body
    const apiUrl = new URL(`/api/usershield/usuarios/recovery-pass/${userId}`, request.url).toString()
    console.log('🌐 [UpdatePassword] Chamando proxy:', apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: session.email, // Email do usuário logado
        password, // Senha atual
        newPassword // Nova senha
      })
    })

    console.log('📡 [UpdatePassword] Status da resposta:', response.status)
    console.log('📡 [UpdatePassword] Headers:', Object.fromEntries(response.headers.entries()))
    
    // Ler o corpo da resposta uma única vez
    const responseContentType = response.headers.get('content-type')
    let responseData
    
    if (responseContentType && responseContentType.includes('application/json')) {
      responseData = await response.json()
    } else {
      const textResponse = await response.text()
      responseData = { message: textResponse }
    }
    
    console.log('📦 [UpdatePassword] Resposta completa:', responseData)

    // 8. Processar resposta
    if (!response.ok) {
      console.error('❌ [UpdatePassword] Erro da API:', response.status, responseData)
      
      // Mapear erros comuns
      if (response.status === 401) {
        return NextResponse.json(
          { success: false, message: 'Senha atual incorreta' },
          { status: 401 }
        )
      }
      
      if (response.status === 400) {
        return NextResponse.json(
          { success: false, message: responseData.message || 'Dados inválidos' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { success: false, message: responseData.message || 'Erro ao alterar senha. Tente novamente.' },
        { status: 500 }
      )
    }

    // 9. Retornar sucesso
    console.log('✅ [UpdatePassword] Senha alterada com sucesso')

    return NextResponse.json({
      success: true,
      message: 'Senha alterada com sucesso!'
    })

  } catch (error: any) {
    console.error('❌ [UpdatePassword] Erro interno:', error)
    console.error('❌ [UpdatePassword] Stack:', error.stack)
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Erro interno do servidor' 
      },
      { status: 500 }
    )
  }
}
