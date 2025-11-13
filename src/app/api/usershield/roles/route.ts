import { NextRequest, NextResponse } from 'next/server'
import { tokenCacheService } from '@/services/tokenCacheService'
import { SERVICES_CONFIG } from '@/config/env'

const USERSHIELD_API_URL = `${SERVICES_CONFIG.USERSHIELD}/api/v1`

/**
 * POST /api/usershield/roles
 * Criar novas roles (relação usuário-perfil)
 * Body: { usuarioId: number, rolesArray: [{id, nomePerfil, statusPerfil}] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('📋 [API] Criando roles:', body)

    // Obter token do cache Redis
    let token = await tokenCacheService.getToken('usershield')
    
    if (!token) {
      console.warn('⚠️ Token não encontrado no cache, fazendo login...')
      
      const loginResponse = await fetch(`${USERSHIELD_API_URL}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'User@ADM#0110',
          password: '5sdt85f215600k008sdfbn$#sd4'
        })
      })

      if (!loginResponse.ok) {
        throw new Error('Falha ao fazer login no UserShield')
      }

      const loginData = await loginResponse.json()
      token = loginData.jwtToken || loginData.result?.accessToken

      if (token) {
        await tokenCacheService.setToken(token, 'usershield')
      }
    }

    // Fazer requisição para criar roles
    const response = await fetch(`${USERSHIELD_API_URL}/Roles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    // Se token expirou (401), renovar e tentar novamente
    if (response.status === 401) {
      console.warn('⚠️ Token expirado, renovando...')
      
      const loginResponse = await fetch(`${USERSHIELD_API_URL}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'User@ADM#0110',
          password: '5sdt85f215600k008sdfbn$#sd4'
        })
      })

      if (!loginResponse.ok) {
        throw new Error('Falha ao renovar token')
      }

      const loginData = await loginResponse.json()
      token = loginData.jwtToken || loginData.result?.accessToken

      if (token) {
        await tokenCacheService.setToken(token, 'usershield')
      }

      // Tentar novamente com novo token
      const retryResponse = await fetch(`${USERSHIELD_API_URL}/Roles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      if (!retryResponse.ok) {
        const errorText = await retryResponse.text()
        console.error('❌ Erro ao criar roles (retry):', errorText)
        throw new Error(`Falha ao criar roles: ${retryResponse.status}`)
      }

      const data = await retryResponse.json()
      console.log('✅ Roles criadas com sucesso (retry)')
      return NextResponse.json(data)
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Erro ao criar roles:', errorText)
      throw new Error(`Falha ao criar roles: ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ Roles criadas com sucesso')
    return NextResponse.json(data)

  } catch (error) {
    console.error('❌ Erro no POST /roles:', error)
    return NextResponse.json(
      { error: 'Erro ao criar roles' },
      { status: 500 }
    )
  }
}
