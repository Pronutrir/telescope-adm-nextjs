/**
 * API Route UNIFICADA para UserShield com Redis Cache
 * GET /api/usershield/usuarios
 * 
 * Features:
 * - Cache de tokens via Redis (55 minutos TTL)
 * - Login automático apenas quando necessário
 * - Renovação proativa de tokens próximos ao vencimento
 * - Fallback robusto para cache em memória
 */
import { NextResponse } from 'next/server'
import { tokenCacheService } from '@/services/tokenCacheService'
import { logger } from '@/lib/logger'
import { getServiceUrl } from '@/config/env'

export async function GET() {
  const startTime = Date.now()
  
  // URLs da UserShield API a partir de variáveis de ambiente
  const USERSHIELD_BASE_URL = `${getServiceUrl('USERSHIELD')}`
  const USERSHIELD_LOGIN_URL = `${USERSHIELD_BASE_URL}v1/Auth/login`
  const USERSHIELD_USERS_URL = `${USERSHIELD_BASE_URL}v1/Usuarios`
  
  try {
    console.log('🚀 [PERF] API Route UserShield: Iniciada')
    logger.info('🚀 [PERF] API Route UserShield: Iniciada')
    
    // Validar se as variáveis de ambiente estão definidas
    if (!process.env.USERSHIELD_USERNAME || !process.env.USERSHIELD_PASSWORD) {
      throw new Error('Credenciais UserShield não configuradas nas variáveis de ambiente')
    }
    
    // Verificar se há token válido no cache Redis primeiro
    const cacheStart = Date.now()
    let jwtToken = await tokenCacheService.getToken('usershield')
    const cacheTime = Date.now() - cacheStart
    console.log(`⏱️ [PERF] Cache check: ${cacheTime}ms`)
    logger.info(`⏱️ [PERF] Cache check: ${cacheTime}ms`)
    logger.info(`⏱️ [PERF] Cache check: ${Date.now() - cacheStart}ms`)
    
    if (!jwtToken) {
      console.log('Nenhum token no cache, fazendo login...')
      logger.info('Nenhum token no cache, fazendo login...')
      const loginStart = Date.now()
      jwtToken = await performLogin(USERSHIELD_LOGIN_URL)
      const loginTime = Date.now() - loginStart
      console.log(`⏱️ [PERF] Login: ${loginTime}ms`)
      logger.info(`⏱️ [PERF] Login: ${loginTime}ms`)
      
      if (!jwtToken) {
        throw new Error('Falha na autenticação')
      }
    } else {
      logger.debug('Token encontrado no cache Redis')
      
      // Verificar se o token está próximo do vencimento (renovação proativa)
      const isNearExpiry = await tokenCacheService.isTokenNearExpiry('usershield')
      if (isNearExpiry) {
        logger.info('Token próximo do vencimento, renovando...')
        const renewStart = Date.now()
        const newToken = await performLogin(USERSHIELD_LOGIN_URL)
        logger.info(`⏱️ [PERF] Token renewal: ${Date.now() - renewStart}ms`)
        if (newToken) {
          jwtToken = newToken
        }
      }
    }

    // Buscar usuários com o token (com timeout de 60s)
    console.log('🔍 Buscando usuários na UserShield API...')
    logger.debug('Buscando usuários...')
    const fetchStart = Date.now()
    
    // Criar AbortController para timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 60s timeout
    
    let usuariosResponse: Response
    try {
      usuariosResponse = await fetch(USERSHIELD_USERS_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      
      const fetchTime = Date.now() - fetchStart
      console.log(`⏱️ [PERF] Fetch usuarios: ${fetchTime}ms`)
      logger.info(`⏱️ [PERF] Fetch usuarios: ${fetchTime}ms`)
      
      if (fetchTime > 10000) {
        logger.warn(`⚠️ [PERF] API UserShield muito lenta! ${fetchTime}ms - Considere otimização`)
      }
    } catch (error: any) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error('Timeout: UserShield API não respondeu em 60 segundos')
      }
      throw error
    }

    // Se token inválido (401), remover do cache e tentar novo login
    if (usuariosResponse.status === 401) {
      logger.warn('Token inválido (401), removendo do cache e fazendo novo login...')
      await tokenCacheService.removeToken('usershield')
      
      const newToken = await performLogin(USERSHIELD_LOGIN_URL)
      if (!newToken) {
        throw new Error('Falha na reautenticação')
      }

      // Nova tentativa com token fresco
      usuariosResponse = await fetch(USERSHIELD_USERS_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${newToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!usuariosResponse.ok) {
        throw new Error(`Falha na busca de usuários após reautenticação: ${usuariosResponse.status}`)
      }
    }

    if (!usuariosResponse.ok) {
      throw new Error(`Falha na busca de usuários: ${usuariosResponse.status}`)
    }

  const parseStart = Date.now()
  const usuariosData = await usuariosResponse.json()
  const parseTime = Date.now() - parseStart
  console.log(`⏱️ [PERF] Parse JSON: ${parseTime}ms`)
  console.log('Usuários obtidos:', usuariosData.result?.length || 0)
  logger.info(`⏱️ [PERF] Parse JSON: ${parseTime}ms`)
  logger.info('Usuários obtidos:', usuariosData.result?.length || 0)

    // Mapear para formato esperado pela aplicação
    const mapStart = Date.now()
    const usuarios = usuariosData.result?.map((user: any) => ({
      id: user.id.toString(),
      name: user.nomeCompleto || user.username,
      email: user.email || `${user.username}@pronutrir.com.br`,
      userName: user.username,
      role: user.perfis?.[0]?.nomePerfil || 'Usuário',
      status: user.statusUsuario === 'A' ? 'Ativo' : 'Inativo',
      lastLogin: user.dataUltimoAcesso || new Date().toISOString().split('T')[0],
      department: user.departamento || 'N/A',
      perfis: user.perfis || [],
      roles: user.roles || []
    })) || []
    const mapTime = Date.now() - mapStart
    console.log(`⏱️ [PERF] Mapping: ${mapTime}ms`)
    logger.info(`⏱️ [PERF] Mapping: ${mapTime}ms`)
    
    const totalTime = Date.now() - startTime
    console.log(`🏁 [PERF] TEMPO TOTAL: ${totalTime}ms`)
    logger.info(`🏁 [PERF] TEMPO TOTAL: ${totalTime}ms`)

    return NextResponse.json({
      success: true,
      result: usuarios
    })

  } catch (error: any) {
    logger.error('Erro na API UserShield:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Erro ao buscar usuários' 
      },
      { status: 500 }
    )
  }
}

/**
 * Função auxiliar para fazer login no UserShield
 */
async function performLogin(loginUrl: string): Promise<string | null> {
  try {
    logger.debug('Fazendo login no UserShield...')
    
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Username: process.env.USERSHIELD_USERNAME,
        Password: process.env.USERSHIELD_PASSWORD
      })
    })

    if (!response.ok) {
      logger.error('Falha no login UserShield:', response.status)
      return null
    }

    const data = await response.json()
    const token = data.token || data.jwtToken // UserShield retorna "token", não "jwtToken"

    if (token) {
      // Salvar token no cache Redis com TTL de 55 minutos (API expira em 60)
      await tokenCacheService.setToken(token, 'usershield')
      logger.info('✅ Token UserShield salvo no cache (55min TTL)')
    }

    return token
  } catch (error) {
    logger.error('Erro no login UserShield:', error)
    return null
  }
}

/**
 * POST - Criar novo usuário
 */
export async function POST(request: Request) {
  const USERSHIELD_BASE_URL = `${getServiceUrl('USERSHIELD')}`
  const USERSHIELD_LOGIN_URL = `${USERSHIELD_BASE_URL}v1/Auth/login`
  const USERSHIELD_USERS_URL = `${USERSHIELD_BASE_URL}v1/Usuarios`
  
  try {
    const body = await request.json()
    const { name, userName, email, password, ativo = true, integraApi = false } = body

    // Validações
    if (!name || !userName || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Obter token
    let jwtToken = await tokenCacheService.getToken('usershield')
    
    if (!jwtToken) {
      jwtToken = await performLogin(USERSHIELD_LOGIN_URL)
      if (!jwtToken) {
        throw new Error('Falha na autenticação')
      }
    }

    // Criar usuário
    let response = await fetch(USERSHIELD_USERS_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nomeCompleto: name,
        username: userName,
        email: email,
        password: password,
        ativo: ativo,
        integraApi: integraApi,
        statusUsuario: ativo ? 'A' : 'I'
      })
    })

    // Se token inválido (401), tentar novo login
    if (response.status === 401) {
      await tokenCacheService.removeToken('usershield')
      const newToken = await performLogin(USERSHIELD_LOGIN_URL)
      
      if (!newToken) {
        throw new Error('Falha na reautenticação')
      }

      response = await fetch(USERSHIELD_USERS_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${newToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nomeCompleto: name,
          username: userName,
          email: email,
          password: password,
          ativo: ativo,
          integraApi: integraApi,
          statusUsuario: ativo ? 'A' : 'I'
        })
      })
    }

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Erro ao criar usuário')
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      result: result
    })

  } catch (error: any) {
    logger.error('Erro ao criar usuário:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Erro ao criar usuário' 
      },
      { status: 500 }
    )
  }
}
