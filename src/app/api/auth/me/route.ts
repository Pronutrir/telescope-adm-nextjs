/**
 * 🔐 API ROUTE: GET USER DATA
 * 
 * Retorna dados do usuário autenticado baseado no session_id do cookie
 */

import { NextRequest, NextResponse } from 'next/server'
import { sessionManager } from '@/lib/session'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    // 🐛 DEBUG - Verificar todos os cookies recebidos
    const allCookies = request.cookies.getAll()
    console.log('🍪 [Auth/Me] Cookies recebidos:', allCookies.map(c => c.name).join(', '))
    
    // ✅ Obter session_id do cookie
    const sessionId = request.cookies.get('session_id')?.value

    console.log('🔍 [Auth/Me] SessionId extraído:', sessionId ? `${sessionId.substring(0, 30)}...` : 'NULO')

    if (!sessionId) {
      logger.warn('❌ [Auth/Me] Sem session_id no cookie')
      return NextResponse.json(
        { message: 'Não autenticado' },
        { status: 401 }
      )
    }

    // ✅ Buscar sessão no Redis
    console.log('🔍 [Auth/Me] Buscando sessão no Redis...')
    const sessionData = await sessionManager.getSession(sessionId)

    if (!sessionData) {
      logger.warn(`❌ [Auth/Me] Sessão não encontrada ou expirada: ${sessionId}`)
      return NextResponse.json(
        { message: 'Sessão inválida ou expirada' },
        { status: 401 }
      )
    }

    // ✅ Retornar dados do usuário
    console.log(`✅ [Auth/Me] Sessão válida encontrada para: ${sessionData.email}`)
    logger.debug(`✅ [Auth/Me] Dados retornados para: ${sessionData.email}`)
    
    // ✅ Usar perfis completos se disponíveis, senão transformar permissions
    const perfis = sessionData.perfis && sessionData.perfis.length > 0
      ? sessionData.perfis  // Retorna objetos completos com id, statusPerfil, dataRegistro, etc.
      : (sessionData.permissions || []).map((permissionName: string) => ({
          nomePerfil: permissionName
        }))
    
    console.log(`📦 [Auth/Me] ${sessionData.perfis ? 'Perfis completos' : 'Perfis básicos'} retornados:`, perfis.length)
    
    return NextResponse.json({
      id: sessionData.userId,
      nomeCompleto: sessionData.name,
      email: sessionData.email,
      roles: sessionData.permissions || [],  // Mantém por compatibilidade
      permissions: sessionData.permissions || [],  // Mantém por compatibilidade
      perfis: perfis,  // ✅ NOVO: Array completo com metadata (id, statusPerfil, dataRegistro, dataAtualizacao, usuario, roleId)
      requiresPasswordChange: sessionData.requiresPasswordChange || false,  // 🔐 Flag de alteração obrigatória
      preferredHomePage: sessionData.preferredHomePage || '/admin/dashboard'  // 🏠 Página inicial preferida
    })

  } catch (error) {
    logger.error('❌ [Auth/Me] Erro interno:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
