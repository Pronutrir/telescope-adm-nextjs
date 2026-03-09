/**
 * 🔐 AUTH HELPERS - Sistema de Autenticação para API Routes
 * 
 * Helpers para verificação de autenticação em rotas de API
 * - Validação via session_id (httpOnly cookie)
 * - Verificação de sessão no Redis
 * - Controle de acesso baseado em roles
 * - Tratamento padronizado de erros
 * 
 * @see /src/middleware.ts - Middleware que protege páginas
 * @see /src/services/session.ts - Funções de gerenciamento de sessão Redis
 */

import { NextRequest, NextResponse } from 'next/server'
import { sessionManager } from '@/services/session'

/**
 * Interface do usuário (mesma usada no AuthContext)
 */
export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'MANAGER' | 'USER'
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

/**
 * 🔐 Verificar se o usuário está autenticado
 * 
 * Valida session_id (httpOnly cookie) e verifica sessão no Redis
 * 
 * @param request - NextRequest object
 * @returns User data da sessão
 * @throws Error com código específico se não autenticado ou sessão inválida
 * 
 * @example
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   try {
 *     const user = await requireAuth(request)
 *     console.log(`Ação executada por: ${user.email}`)
 *     // ... lógica da rota
 *   } catch (error) {
 *     return handleAuthError(error)
 *   }
 * }
 * ```
 */
export async function requireAuth(request: NextRequest): Promise<User> {
  // Obter session_id do cookie httpOnly (mesmo padrão do middleware)
  const sessionId = request.cookies.get('session_id')?.value
  
  if (!sessionId) {
    throw new Error('SESSION_NOT_FOUND')
  }
  
  // Validar sessão no Redis
  const sessionData = await sessionManager.getSession(sessionId)
  
  if (!sessionData) {
    throw new Error('INVALID_SESSION')
  }
  
  // Construir objeto User a partir da SessionData
  const user: User = {
    id: sessionData.userId,
    email: sessionData.email,
    name: sessionData.name,
    role: determineRole(sessionData.permissions),
    isActive: true
  }
  
  return user
}

/**
 * 🔐 Verificar autenticação + role específica
 * 
 * Valida se o usuário está autenticado E possui uma das roles permitidas
 * 
 * @param request - NextRequest object
 * @param allowedRoles - Array de roles permitidas ['ADMIN', 'MANAGER', 'USER']
 * @returns User data da sessão
 * @throws Error se não autenticado ou role insuficiente
 * 
 * @example
 * ```typescript
 * // Apenas ADMIN
 * export async function DELETE(request: NextRequest) {
 *   try {
 *     const user = await requireRole(request, ['ADMIN'])
 *     // ... lógica de exclusão
 *   } catch (error) {
 *     return handleAuthError(error)
 *   }
 * }
 * 
 * // ADMIN ou MANAGER
 * export async function POST(request: NextRequest) {
 *   try {
 *     const user = await requireRole(request, ['ADMIN', 'MANAGER'])
 *     // ... lógica de criação
 *   } catch (error) {
 *     return handleAuthError(error)
 *   }
 * }
 * ```
 */
export async function requireRole(
  request: NextRequest, 
  allowedRoles: Array<'ADMIN' | 'MANAGER' | 'USER'>
): Promise<User> {
  // Primeiro verifica se está autenticado
  const user = await requireAuth(request)
  
  // Depois verifica se tem a role necessária
  if (!allowedRoles.includes(user.role)) {
    throw new Error('INSUFFICIENT_PERMISSIONS')
  }
  
  return user
}

/**
 * 🛡️ Converter exceções de autenticação em respostas HTTP padronizadas
 * 
 * Mapeia códigos de erro internos para respostas HTTP apropriadas
 * 
 * @param error - Error object ou unknown
 * @returns NextResponse com status e mensagem apropriados
 * 
 * @example
 * ```typescript
 * try {
 *   const user = await requireAuth(request)
 *   // ... lógica
 * } catch (error) {
 *   return handleAuthError(error)
 * }
 * ```
 */
export function handleAuthError(error: unknown): NextResponse {
  const errorMessage = error instanceof Error ? error.message : 'UNKNOWN_ERROR'
  
  // Mapeamento de códigos de erro para respostas HTTP
  const errorMap: Record<string, { status: number; message: string }> = {
    SESSION_NOT_FOUND: {
      status: 401,
      message: 'Não autorizado - Sessão não encontrada. Faça login novamente.'
    },
    INVALID_SESSION: {
      status: 401,
      message: 'Não autorizado - Sessão inválida ou expirada. Faça login novamente.'
    },
    INSUFFICIENT_PERMISSIONS: {
      status: 403,
      message: 'Acesso negado - Você não tem permissão para executar esta ação.'
    },
    UNKNOWN_ERROR: {
      status: 500,
      message: 'Erro interno ao verificar autenticação.'
    }
  }
  
  const errorInfo = errorMap[errorMessage] || errorMap.UNKNOWN_ERROR
  
  return NextResponse.json(
    { 
      error: errorInfo.message,
      code: errorMessage
    },
    { status: errorInfo.status }
  )
}

/**
 * 🔍 Verificar autenticação opcionalmente
 * 
 * Retorna User se autenticado, null se não autenticado
 * Não lança exceção - útil para rotas que funcionam com ou sem autenticação
 * 
 * @param request - NextRequest object
 * @returns User data ou null
 * 
 * @example
 * ```typescript
 * export async function GET(request: NextRequest) {
 *   const user = await getAuthUser(request)
 *   
 *   if (user) {
 *     // Usuário autenticado - retornar dados personalizados
 *     return getPersonalizedData(user.id)
 *   } else {
 *     // Visitante - retornar dados públicos
 *     return getPublicData()
 *   }
 * }
 * ```
 */
export async function getAuthUser(request: NextRequest): Promise<User | null> {
  try {
    return await requireAuth(request)
  } catch {
    return null
  }
}

/**
 * 🎯 Helper interno: Determinar role a partir de permissions
 */
function determineRole(permissions: string[]): 'ADMIN' | 'MANAGER' | 'USER' {
  // Hierarquia: ADMIN > MANAGER > USER
  if (permissions.includes('ADMIN') || permissions.includes('admin')) {
    return 'ADMIN'
  }
  if (permissions.includes('MANAGER') || permissions.includes('manager')) {
    return 'MANAGER'
  }
  return 'USER'
}
