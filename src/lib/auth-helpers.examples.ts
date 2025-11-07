/**
 * 📚 EXEMPLOS DE USO - Auth Helpers
 * 
 * Este arquivo contém exemplos práticos de como usar os Auth Helpers
 * em diferentes cenários de API routes no projeto Telescope ADM.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, requireRole, handleAuthError, getAuthUser } from '@/lib/auth-helpers'
import { logger } from '@/lib/logger'

// ============================================================================
// EXEMPLO 1: Proteção Básica - Qualquer Usuário Autenticado
// ============================================================================

/**
 * Rota que qualquer usuário autenticado pode acessar
 * Exemplo: Buscar PDFs, Upload de arquivos, etc.
 */
export async function exampleBasicAuth(request: NextRequest) {
  try {
    // ✅ Verificar autenticação
    const user = await requireAuth(request)
    
    // ✅ Agora você tem acesso aos dados do usuário
    logger.info(`📤 Ação executada por: ${user.email} (${user.role})`)
    
    const body = await request.json()
    
    // ... sua lógica aqui ...
    
    return NextResponse.json({ 
      success: true,
      user: {
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    // ✅ Tratar erros de autenticação
    if (error instanceof Error && 
        ['SESSION_NOT_FOUND', 'INVALID_SESSION', 'INSUFFICIENT_PERMISSIONS'].includes(error.message)) {
      return handleAuthError(error)
    }

    // ✅ Outros erros da lógica de negócio
    logger.error('❌ Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}

// ============================================================================
// EXEMPLO 2: Controle por Role - Apenas ADMIN
// ============================================================================

/**
 * Rota que apenas ADMINs podem acessar
 * Exemplo: Gerenciar usuários, Configurações do sistema, etc.
 */
export async function exampleAdminOnly(request: NextRequest) {
  try {
    // ✅ Apenas ADMIN pode acessar
    const user = await requireRole(request, ['ADMIN'])
    
    logger.info(`🔐 [ADMIN] Ação executada por: ${user.email}`)
    
    // ... lógica administrativa ...
    
    return NextResponse.json({ success: true })

  } catch (error) {
    return handleAuthError(error)
  }
}

// ============================================================================
// EXEMPLO 3: Múltiplas Roles - ADMIN ou MANAGER
// ============================================================================

/**
 * Rota que ADMIN e MANAGER podem acessar
 * Exemplo: Aprovar documentos, Gerenciar equipe, etc.
 */
export async function exampleAdminOrManager(request: NextRequest) {
  try {
    // ✅ ADMIN ou MANAGER podem acessar
    const user = await requireRole(request, ['ADMIN', 'MANAGER'])
    
    logger.info(`📋 Aprovação por: ${user.email} (${user.role})`)
    
    const { documentId, status } = await request.json()
    
    // ... lógica de aprovação ...
    
    return NextResponse.json({ 
      success: true,
      approvedBy: user.email
    })

  } catch (error) {
    return handleAuthError(error)
  }
}

// ============================================================================
// EXEMPLO 4: Todas as Roles - Qualquer Usuário Autenticado
// ============================================================================

/**
 * Rota que qualquer usuário autenticado pode usar
 * Exemplo: Buscar dados, Listar recursos, etc.
 */
export async function exampleAllRoles(request: NextRequest) {
  try {
    // ✅ Qualquer role autenticada
    const user = await requireRole(request, ['ADMIN', 'MANAGER', 'USER'])
    
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    
    // ... lógica de busca ...
    
    return NextResponse.json({ results: [] })

  } catch (error) {
    return handleAuthError(error)
  }
}

// ============================================================================
// EXEMPLO 5: Autenticação Opcional
// ============================================================================

/**
 * Rota que funciona com ou sem autenticação
 * Retorna dados diferentes baseado no status de autenticação
 * Exemplo: Dados públicos vs personalizados
 */
export async function exampleOptionalAuth(request: NextRequest) {
  // ✅ Não lança erro se não autenticado
  const user = await getAuthUser(request)
  
  if (user) {
    // Usuário autenticado - retornar dados personalizados
    logger.info(`📊 Dados personalizados para: ${user.email}`)
    return NextResponse.json({
      personalized: true,
      userName: user.name,
      // ... dados personalizados ...
    })
  } else {
    // Visitante - retornar dados públicos
    logger.info(`📊 Dados públicos para visitante`)
    return NextResponse.json({
      personalized: false,
      // ... dados públicos ...
    })
  }
}

// ============================================================================
// EXEMPLO 6: Validação Condicional por Propriedade
// ============================================================================

/**
 * Usuários normais só podem ver seus próprios recursos
 * ADMINs podem ver tudo
 */
export async function exampleConditionalAccess(request: NextRequest) {
  try {
    // ✅ Verificar autenticação
    const user = await requireAuth(request)
    
    const { searchParams } = new URL(request.url)
    const resourceId = searchParams.get('id')
    
    // Buscar recurso
    const resource = await getResource(resourceId)
    
    // ✅ ADMINs podem acessar qualquer recurso
    // ✅ Outros usuários só seus próprios recursos
    if (user.role !== 'ADMIN' && resource.userId !== user.id) {
      return NextResponse.json(
        { error: 'Acesso negado - Este recurso não pertence a você' },
        { status: 403 }
      )
    }

    return NextResponse.json(resource)

  } catch (error) {
    return handleAuthError(error)
  }
}

// ============================================================================
// EXEMPLO 7: Logs de Auditoria
// ============================================================================

/**
 * Registrar ações importantes com dados do usuário
 */
export async function exampleAuditLog(request: NextRequest) {
  try {
    // ✅ Verificar autenticação
    const user = await requireAuth(request)
    
    const { action, target } = await request.json()

    // ✅ Log de auditoria detalhado
    logger.info(`📝 [AUDIT] Ação: ${action}`, {
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: action,
      target: target,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    })

    // ... executar ação ...

    return NextResponse.json({ success: true })

  } catch (error) {
    return handleAuthError(error)
  }
}

// ============================================================================
// EXEMPLO 8: Diferentes Métodos HTTP
// ============================================================================

/**
 * GET - Todos autenticados
 * POST - ADMIN e MANAGER
 * PUT - ADMIN e MANAGER
 * DELETE - Apenas ADMIN
 */

export async function exampleGET(request: NextRequest) {
  try {
    await requireAuth(request)
    // Qualquer autenticado pode listar
    return NextResponse.json({ items: [] })
  } catch (error) {
    return handleAuthError(error)
  }
}

export async function examplePOST(request: NextRequest) {
  try {
    const user = await requireRole(request, ['ADMIN', 'MANAGER'])
    // Apenas ADMIN e MANAGER podem criar
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleAuthError(error)
  }
}

export async function examplePUT(request: NextRequest) {
  try {
    const user = await requireRole(request, ['ADMIN', 'MANAGER'])
    // Apenas ADMIN e MANAGER podem editar
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleAuthError(error)
  }
}

export async function exampleDELETE(request: NextRequest) {
  try {
    const user = await requireRole(request, ['ADMIN'])
    // Apenas ADMIN pode deletar
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleAuthError(error)
  }
}

// ============================================================================
// FUNÇÕES AUXILIARES (apenas para exemplos)
// ============================================================================

async function getResource(id: string | null) {
  // Simulação - substituir pela lógica real
  return {
    id: id,
    userId: '123',
    name: 'Resource Name'
  }
}
