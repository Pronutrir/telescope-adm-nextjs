import { NextRequest, NextResponse } from 'next/server'
import { tokenCacheService } from '@/services/tokenCacheService'
import { SERVICES_CONFIG } from '@/config/env'

const USERSHIELD_API_URL = `${SERVICES_CONFIG.USERSHIELD}/api/v1`

/**
 * DELETE /api/usershield/roles/[id]
 * Deletar uma role (relação usuário-perfil)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    console.log('🗑️ [API] Deletando role ID:', id)

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

    // Fazer requisição para deletar role
    const response = await fetch(`${USERSHIELD_API_URL}/Roles/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
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
      const retryResponse = await fetch(`${USERSHIELD_API_URL}/Roles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!retryResponse.ok) {
        const errorText = await retryResponse.text()
        console.error('❌ Erro ao deletar role (retry):', errorText)
        throw new Error(`Falha ao deletar role: ${retryResponse.status}`)
      }

      console.log('✅ Role deletada com sucesso (retry)')
      return NextResponse.json({ success: true })
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Erro ao deletar role:', errorText)
      throw new Error(`Falha ao deletar role: ${response.status}`)
    }

    console.log('✅ Role deletada com sucesso')
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('❌ Erro no DELETE /roles/[id]:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar role' },
      { status: 500 }
    )
  }
}
