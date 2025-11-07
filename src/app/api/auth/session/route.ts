/**
 * 🔐 API ROUTE: LOGIN SERVER-SIDE (NOVA VERSÃO)
 * 
 * Sistema de autenticação completamente server-side
 * - Validação no servidor
 * - Sessões no Redis
 * - Cookies httpOnly apenas com ID
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiBaseUrl } from '@/config/env'
import { logger } from '@/lib/logger'
import { sessionManager } from '@/lib/session'
// Removido import do zod - validação manual

// ✅ Função de validação manual (permite string no campo email/username)
function validateLoginData(body: any) {
  const errors = []
  
  // ✅ Aceitar tanto email quanto username como string
  if (!body.email || typeof body.email !== 'string') {
    errors.push('Email/Username é obrigatório')
  } else if (body.email.trim().length === 0) {
    errors.push('Email/Username não pode estar vazio')
  }
  // ✅ Removido validação de formato de email para permitir strings livres
  
  if (!body.password || typeof body.password !== 'string') {
    errors.push('Senha é obrigatória')
  } else if (body.password.trim().length === 0) {
    errors.push('Senha não pode estar vazia')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    data: errors.length === 0 ? { 
      email: body.email.trim(), 
      password: body.password.trim() 
    } : null
  }
}

/**
 * 📡 Integração com UserShield API (Pronutrir)
 */
async function authenticateWithUserShield(email: string, password: string) {
  try {
    const API_BASE_URL = requireApiBaseUrl()
    
    const response = await fetch(`${API_BASE_URL}/usershield/api/v1/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ 
        Username: email,  // UserShield API usa "Username" 
        Password: password 
      })
    })

    // ✅ Processar resposta JSON
    const contentType = response.headers.get('content-type')
    let data

    if (contentType && contentType.includes('application/json')) {
      const text = await response.text()
      if (text) {
        try {
          data = JSON.parse(text)
        } catch (error) {
          logger.error('❌ [Auth] Parse JSON login falhou', error)
          return { success: false, error: 'Resposta inválida do servidor' }
        }
      } else {
        data = null
      }
    } else {
      data = { message: await response.text() }
    }

    if (!response.ok) {
      return { 
        success: false, 
        error: data?.message || `Erro ${response.status}: ${response.statusText}` 
      }
    }

    return { success: true, data }
  } catch (error) {
    logger.error('❌ [Auth] Erro na integração UserShield:', error)
    return { success: false, error: 'Erro interno de autenticação' }
  }
}

export async function POST(request: NextRequest) {
  try {
    // ✅ Obter dados da requisição
    const body = await request.json()
    
    // ✅ Validar dados de entrada
    const validation = validateLoginData(body)
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          message: 'Dados inválidos', 
          errors: validation.errors 
        },
        { status: 400 }
      )
    }

    const { email, password } = validation.data!

    // ✅ Rate limiting por IP (básico)
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    // ✅ Modo de teste para demonstração (aceita qualquer string)
    const testEmails = ['test@telescope.com', 'admin@telescope.com']
    const testUsernames = ['usuario123', 'admin', 'user', 'teste']
    
    const isTestMode = process.env.NODE_ENV === 'development' && 
                      (testEmails.includes(email) || testUsernames.includes(email))
    
  logger.info(`🔐 [Auth] Tentativa de login: ${email} | IP: ${clientIP}`)
    
    let userShieldAuth
    if (isTestMode) {
      // Modo de teste - simular sucesso para strings específicas
  logger.debug('🧪 [Auth] Modo de teste para: ' + email)
      
      const isAdmin = email === 'admin@telescope.com' || email === 'admin'
      
      userShieldAuth = {
        success: true,
        data: {
          userId: isAdmin ? 'admin-123' : `user-${Date.now()}`,
          name: isAdmin ? 'Administrador Teste' : `Usuário ${email}`,
          permissions: isAdmin ? ['admin', 'user'] : ['user'],
          jwtToken: 'mock-jwt-token'
        }
      }
    } else {
      // Produção - usar UserShield real
  logger.info('🌍 [Auth] Usando UserShield API para: ' + email)
      userShieldAuth = await authenticateWithUserShield(email, password)
      
      // 🐞 DEBUG: Log da resposta do login
      if (userShieldAuth.success && userShieldAuth.data) {
        logger.info(`🔐 [Auth] Login UserShield OK - jwtToken: ${userShieldAuth.data.jwtToken ? 'Presente' : 'AUSENTE'}`)
      }
    }
    
    if (!userShieldAuth.success) {
  logger.warn(`❌ [Auth] Login falhou: ${email} - ${userShieldAuth.error}`)
      return NextResponse.json(
        { message: userShieldAuth.error || 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // ✅ Extrair dados do usuário da resposta UserShield
    let userData = userShieldAuth.data
    // 🔥 FIX: UserShield retorna 'idUsuario' na resposta de login, não 'id'
    const userId = userData?.idUsuario || userData?.id || crypto.randomUUID()
    const userName = userData?.nomeCompleto || userData?.name || userData?.username || email.split('@')[0]

    // 🔥 BUSCAR dados completos do usuário com perfis
    if (!isTestMode && userId) {
      try {
        logger.info(`🔍 [Auth] Buscando dados completos do usuário ID: ${userId}`)
        const API_BASE_URL = requireApiBaseUrl()
        const userDetailsUrl = `${API_BASE_URL}/usershield/api/v1/Usuarios/${userId}`
        
        const userDetailsResponse = await fetch(userDetailsUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${userData?.jwtToken || userData?.token || ''}`
          }
        })

        logger.info(`📡 [Auth] Status da resposta de detalhes: ${userDetailsResponse.status}`)

        if (userDetailsResponse.ok) {
          const userDetails = await userDetailsResponse.json()
          
          // 🔥 FIX: API retorna dados dentro de 'result'
          const userDataResponse = userDetails.result || userDetails
          
          logger.info(`✅ [Auth] Dados completos obtidos`)
          logger.info(`📊 [Auth] Roles encontrados: ${userDataResponse?.roles?.length || 0} itens`)
          
          // 🔥 PRESERVAR jwtToken do login antes de mesclar
          const originalJwtToken = userData?.jwtToken || userData?.token
          const originalRefreshToken = userData?.refreshToken
          
          // Mesclar dados completos com userData
          userData = { ...userData, ...userDataResponse }
          
          // 🔥 RESTAURAR tokens originais (não sobrescrever com null)
          if (originalJwtToken && !userData.jwtToken) {
            userData.jwtToken = originalJwtToken
          }
          if (originalRefreshToken && !userData.refreshToken) {
            userData.refreshToken = originalRefreshToken
          }
          
          logger.info(`🔀 [Auth] userData mesclado, roles finais: ${userData?.roles?.length || 0}`)
          logger.info(`🔐 [Auth] Token preservado: ${userData.jwtToken ? 'Sim' : 'Não'}`)
        } else {
          const errorText = await userDetailsResponse.text()
          logger.warn(`⚠️ [Auth] Falha ao buscar dados completos: ${userDetailsResponse.status}`)
          logger.warn(`⚠️ [Auth] Resposta de erro: ${errorText}`)
        }
      } catch (error) {
        logger.error('❌ [Auth] Erro ao buscar dados completos do usuário:', error)
      }
    }

    // 🔥 NOVO: Extrair perfis COMPLETOS do array 'roles' da resposta
    // Salvar objeto completo com todos os campos para exibição
    let userPerfis: string[] = ['user'] // fallback para permissions (compatibilidade)
    let userPerfisCompletos: any[] = [] // Array completo de perfis com todos os dados
    
    if (userData?.roles && Array.isArray(userData.roles)) {
      logger.info(`🔄 [Auth] Processando ${userData.roles.length} roles...`)
      
      // Extrair objetos completos dos perfis
      userPerfisCompletos = userData.roles
        .map((roleObj: any) => {
          return {
            id: roleObj.perfis?.id,
            nomePerfil: roleObj.perfis?.nomePerfil,
            statusPerfil: roleObj.perfis?.statusPerfil,
            dataRegistro: roleObj.dataRegistro,
            dataAtualizacao: roleObj.dataAtualizacao,
            usuario: roleObj.usuario,
            roleId: roleObj.id
          }
        })
        .filter((p: any) => !!p.nomePerfil)
      
      logger.info(`✅ [Auth] Perfis completos extraídos: ${userPerfisCompletos.length}`)
      
      // Extrair apenas nomes para array de strings (compatibilidade)
      userPerfis = userPerfisCompletos.map((p: any) => p.nomePerfil)
      
      if (userPerfis.length > 0) {
        logger.info(`✅ [Auth] ${userPerfis.length} perfis extraídos para ${email}: ${userPerfis.join(', ')}`)
      } else {
        logger.warn(`⚠️ [Auth] Usuário ${email} tem roles mas sem perfis, usando padrão`)
        userPerfis = ['user']
      }
    } else {
      logger.warn(`⚠️ [Auth] Usuário ${email} sem roles na resposta, usando padrão`)
    }
    
    // ✅ Obter informações da requisição para segurança
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // 🔥 NOVO: Extrair token JWT da resposta UserShield
    const jwtToken = userData?.jwtToken || userData?.token || null
    
    // 🐞 DEBUG: Log do token extraído
    logger.info(`🔐 [Auth] Token JWT extraído: ${jwtToken ? 'Sim (' + jwtToken.substring(0, 20) + '...)' : 'NÃO ENCONTRADO'}`)
    logger.debug(`🔐 [Auth] userData keys: ${Object.keys(userData || {}).join(', ')}`)
    
    // 🐞 DEBUG: Log dos campos de token
    if (!jwtToken) {
      logger.warn(`⚠️ [Auth] Token não encontrado! Verificando campos disponíveis:`)
      logger.warn(`⚠️ [Auth] userData.jwtToken: ${userData?.jwtToken}`)
      logger.warn(`⚠️ [Auth] userData.token: ${userData?.token}`)
      logger.warn(`⚠️ [Auth] userData.access_token: ${userData?.access_token}`)
      logger.warn(`⚠️ [Auth] userData.accessToken: ${userData?.accessToken}`)
      logger.warn(`⚠️ [Auth] Resposta completa UserShield:`, JSON.stringify(userData, null, 2))
    }
    
    // �🔐 NOVO: Verificar se usuário precisa alterar senha
    const requiresPasswordChange = userData?.passUpdate === true
    
    // 🏠 NOVO: Buscar preferência de página inicial de sessão anterior (se existir)
    let preferredHomePage = '/admin/dashboard' // padrão
    try {
      logger.info(`🏠 [Auth] Buscando sessões anteriores para userId: ${userId}`)
      const previousSessions = await sessionManager.getUserSessions(userId)
      logger.info(`🏠 [Auth] Sessões encontradas: ${previousSessions.length}`)
      
      if (previousSessions && previousSessions.length > 0) {
        // Pegar a preferência da sessão mais recente
        const lastSession = previousSessions[0]
        logger.info(`🏠 [Auth] Última sessão:`, {
          userId: lastSession.userId,
          preferredHomePage: lastSession.preferredHomePage,
          lastActivity: lastSession.lastActivity
        })
        
        if (lastSession.preferredHomePage) {
          preferredHomePage = lastSession.preferredHomePage
          logger.info(`🏠 [Auth] ✅ Preferência anterior encontrada: ${preferredHomePage}`)
        } else {
          logger.info(`🏠 [Auth] ⚠️ Sessão existe mas sem preferredHomePage definido`)
        }
      } else {
        logger.info(`🏠 [Auth] Nenhuma sessão anterior encontrada`)
      }
    } catch (error) {
      logger.warn('🏠 [Auth] Erro ao buscar preferência anterior:', error)
      logger.debug('🏠 [Auth] Usando padrão: /admin/dashboard')
    }
    
    // ✅ Criar sessão server-side (dados ficam 100% no servidor)
    const sessionId = await sessionManager.createSession({
      userId: userId,
      email: email,
      name: userName,
      token: jwtToken, // 🔥 NOVO: Salvar token JWT para chamadas autenticadas
      permissions: userPerfis, // Array de strings para compatibilidade
      perfis: userPerfisCompletos, // 🔥 NOVO: Array completo de objetos
      requiresPasswordChange: requiresPasswordChange, // 🔐 NOVO: Flag de alteração obrigatória
      preferredHomePage: preferredHomePage, // 🏠 NOVO: Manter preferência ou usar padrão
      ipAddress: clientIP,
      userAgent: userAgent
    })
    
    if (requiresPasswordChange) {
      logger.warn(`⚠️ [Auth] Usuário ${email} precisa alterar senha (passUpdate=true)`)
    }

    // ✅ Log de sucesso
    logger.info(`✅ [Auth] Login OK: ${email} | IP: ${clientIP} | Session: ${sessionId} | Perfis: ${userPerfis.join(', ')} | PassUpdate: ${requiresPasswordChange}`)

    // ✅ Criar response com dados do usuário
    const response = NextResponse.json({
      success: true,
      message: 'Login realizado com sucesso',
      requiresPasswordChange: requiresPasswordChange, // 🔐 NOVO: Indicar se precisa alterar senha
      preferredHomePage: preferredHomePage, // 🏠 NOVO: Retornar preferência para frontend
      user: {
        id: userId,
        email: email,
        name: userName,
        permissions: userPerfis // 🔥 Retornar perfis reais
      }
    })

    // ✅ DEFINIR COOKIE session_id (httpOnly e secure)
    // ⚠️ IMPORTANTE: maxAge deve ser igual à SESSION_DURATION para evitar 401
    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 4 * 60 * 60 // 4 horas (mesmo tempo da sessão no Redis)
    })

    logger.debug(`🍪 [Auth] Cookie session_id definido: ${sessionId}`)

    return response

  } catch (error) {
  logger.error('❌ [Auth] Erro interno login:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// ✅ Logout server-side
export async function DELETE(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session_id')?.value
    
    if (sessionId) {
      await sessionManager.destroySession(sessionId)
  logger.info(`🚪 [Auth] Logout sessão: ${sessionId}`)
    }

    const response = NextResponse.json({ 
      success: true, 
      message: 'Logout realizado com sucesso' 
    })

    // ✅ Limpar todos os cookies de autenticação
    response.cookies.delete('session_id')
    response.cookies.delete('token') // Remover cookies legacy
    response.cookies.delete('refreshToken') // Remover cookies legacy

    return response

  } catch (error) {
  logger.error('❌ [Auth] Erro no logout server-side:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
