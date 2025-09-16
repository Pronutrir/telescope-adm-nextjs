/**
 * API Route OTIMIZADA para UserShield com cache seguro de tokens
 * GET /api/usershield/usuarios-cached
 * 
 * Features:
 * - Cache de tokens via Redis (55 minutos TTL)
 * - Login automático apenas quando necessário
 * - Renovação proativa de tokens próximos ao vencimento
 * - Fallback robusto para cache em memória
 */
import { NextRequest, NextResponse } from 'next/server'
import { tokenCacheService } from '@/services/tokenCacheService'

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 API UserShield CACHED: Iniciada')
    
    // Verificar se há token válido no cache
    let token = await tokenCacheService.getToken('usershield')
    
    if (!token) {
      console.log('🔐 Nenhum token no cache, fazendo login...')
      token = await performLogin()
      
      if (!token) {
        throw new Error('Falha na autenticação')
      }
    } else {
      console.log('✅ Token encontrado no cache')
      
      // Verificar se o token está próximo do vencimento
      const isNearExpiry = await tokenCacheService.isTokenNearExpiry('usershield')
      if (isNearExpiry) {
        console.log('⏰ Token próximo do vencimento, renovando...')
        const newToken = await performLogin()
        if (newToken) {
          token = newToken
        }
      }
    }

    // Buscar usuários com o token
    console.log('👥 Buscando usuários...')
    const usuariosResponse = await fetch('https://servicesapp.pronutrir.com.br/usershield/api/v1/Usuarios', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    // Se token inválido (401), tentar novo login
    if (usuariosResponse.status === 401) {
      console.log('🔄 Token inválido (401), removendo do cache e fazendo novo login...')
      await tokenCacheService.removeToken('usershield')
      
      const newToken = await performLogin()
      if (!newToken) {
        throw new Error('Falha na reautenticação')
      }

      // Nova tentativa com token fresco
      const retryResponse = await fetch('https://servicesapp.pronutrir.com.br/usershield/api/v1/Usuarios', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${newToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!retryResponse.ok) {
        throw new Error(`Falha na busca de usuários após reautenticação: ${retryResponse.status}`)
      }

      const retryData = await retryResponse.json()
      return formatUsersResponse(retryData)
    }

    if (!usuariosResponse.ok) {
      throw new Error(`Falha na busca de usuários: ${usuariosResponse.status}`)
    }

    const usuariosData = await usuariosResponse.json()
    return formatUsersResponse(usuariosData)

  } catch (error) {
    console.error('❌ Erro na API UserShield CACHED:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

/**
 * Realiza login na UserShield API e armazena token no cache
 */
async function performLogin(): Promise<string | null> {
  try {
    console.log('🔐 Fazendo login na UserShield API...')
    
    const loginResponse = await fetch('https://servicesapp.pronutrir.com.br/usershield/api/v1/Auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        Username: 'williame',
        Password: 'P.*R)CbU%csjy{4]-b'
      })
    })

    if (!loginResponse.ok) {
      console.error('❌ Login falhou:', loginResponse.status)
      return null
    }

    const loginData = await loginResponse.json()
    const token = loginData.jwtToken

    if (!token) {
      console.error('❌ Token não encontrado na resposta do login')
      return null
    }

    // Armazenar token no cache por 55 minutos
    await tokenCacheService.setToken(token, 'usershield', 'williame')
    console.log('✅ Login realizado e token armazenado no cache')
    
    return token
  } catch (error) {
    console.error('❌ Erro no login:', error)
    return null
  }
}

/**
 * Formata a resposta dos usuários para o formato esperado pela aplicação
 */
function formatUsersResponse(usuariosData: any): NextResponse {
  try {
    const usuarios = usuariosData.result?.map((user: any) => ({
      id: user.id.toString(),
      name: user.nomeCompleto || user.username,
      email: user.email || `${user.username}@pronutrir.com.br`,
      userName: user.username,
      role: user.roles?.[0]?.perfis?.nomePerfil || user.tipoUsuario || 'Usuário',
      status: user.ativo ? 'Ativo' : 'Inativo',
      lastLogin: user.dataAtualizacao?.split('T')[0] || new Date().toISOString().split('T')[0],
      department: user.estabelecimento ? `Estabelecimento ${user.estabelecimento}` : 'N/A',
      perfis: user.roles?.map((role: any) => ({
        id: role.perfis.id.toString(),
        nomePerfil: role.perfis.nomePerfil
      })) || []
    })) || []

    console.log('✅ Usuários formatados:', usuarios.length)

    return NextResponse.json({
      success: true,
      result: usuarios,
      message: `${usuarios.length} usuários encontrados`,
      cached: true, // Indica que usa cache
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Erro ao formatar usuários:', error)
    throw error
  }
}

/**
 * Endpoint para estatísticas do cache (útil para debugging)
 */
export async function HEAD(request: NextRequest) {
  try {
    const stats = await tokenCacheService.getCacheStats()
    
    return new NextResponse(null, {
      status: 200,
      headers: {
        'X-Cache-Stats': JSON.stringify(stats),
        'X-Cache-Redis-Available': stats.isRedisAvailable.toString(),
        'X-Cache-Tokens-Count': stats.cachedTokensCount.toString()
      }
    })
  } catch (error) {
    return new NextResponse(null, { status: 500 })
  }
}
