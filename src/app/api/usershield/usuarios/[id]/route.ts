import { NextRequest, NextResponse } from 'next/server'
import { tokenCacheService } from '@/services/tokenCacheService'

const USERSHIELD_API_URL = 'https://servicesapp.pronutrir.com.br/usershield/api/v1'

/**
 * GET /api/usershield/usuarios/[id]
 * Busca um usuário específico pelo ID
 * Retorna o usuário com seus roles/perfis
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('🔄 [API] Buscando usuário ID:', id)

    // Obter token do cache Redis
    let token = await tokenCacheService.getToken('usershield')
    
    if (!token) {
      console.warn('⚠️ Token não encontrado no cache, fazendo login...')
      
      // Fazer login para obter novo token
      const loginResponse = await fetch(`${USERSHIELD_API_URL}/Login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 1,
          username: 'User@ADM#0110',
          password: '5sdt85f215600k008sdfbn$#sd4',
          role: 'default_fullstackdev'
        })
      })

      if (!loginResponse.ok) {
        throw new Error('Falha ao fazer login no UserShield')
      }

      const loginData = await loginResponse.json()
      token = loginData.result.accessToken

      // Salvar no cache (55 minutos)
      if (token) {
        await tokenCacheService.setToken(token, 'usershield')
      }
    }

    // Buscar usuário específico
    const userResponse = await fetch(`${USERSHIELD_API_URL}/Usuarios/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    // Se retornar 401, token expirado - renovar
    if (userResponse.status === 401) {
      console.log('🔄 Token expirado, renovando...')
      
      const loginResponse = await fetch(`${USERSHIELD_API_URL}/Login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 1,
          username: 'User@ADM#0110',
          password: '5sdt85f215600k008sdfbn$#sd4',
          role: 'default_fullstackdev'
        })
      })

      const loginData = await loginResponse.json()
      token = loginData.result.accessToken
      
      if (token) {
        await tokenCacheService.setToken(token, 'usershield')
      }

      // Tentar novamente com novo token
      const retryResponse = await fetch(`${USERSHIELD_API_URL}/Usuarios/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!retryResponse.ok) {
        const errorText = await retryResponse.text()
        console.error('❌ Erro ao buscar usuário (retry):', retryResponse.status, errorText)
        return NextResponse.json(
          { error: 'Erro ao buscar usuário', details: errorText },
          { status: retryResponse.status }
        )
      }

      const data = await retryResponse.json()
      console.log('✅ Usuário encontrado (retry):', data.result?.id)
      return NextResponse.json(data)
    }

    if (!userResponse.ok) {
      const errorText = await userResponse.text()
      console.error('❌ Erro ao buscar usuário:', userResponse.status, errorText)
      return NextResponse.json(
        { error: 'Erro ao buscar usuário', details: errorText },
        { status: userResponse.status }
      )
    }

    const data = await userResponse.json()
    console.log('✅ Usuário encontrado:', data.result?.id)
    console.log('📋 Roles do usuário:', data.result?.roles?.length || 0)

    return NextResponse.json(data)

  } catch (error: any) {
    console.error('❌ [API] Erro ao buscar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno ao buscar usuário', message: error.message },
      { status: 500 }
    )
  }
}
