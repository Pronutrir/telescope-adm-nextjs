import { NextRequest, NextResponse } from 'next/server'
import { tokenCacheService } from '@/services/tokenCacheService'
import { SERVICES_CONFIG } from '@/config/env'

const USERSHIELD_API_URL = `${SERVICES_CONFIG.USERSHIELD}/api/v1`

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

/**
 * PUT /api/usershield/usuarios/[id]
 * Atualiza um usuário (incluindo reset de senha)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    console.log('🔄 [API] Atualizando usuário ID:', id)
    console.log('📦 Payload:', body)

    // Obter token do cache Redis
    let token = await tokenCacheService.getToken('usershield')
    
    if (!token) {
      console.warn('⚠️ Token não encontrado no cache, fazendo login...')
      
      // Fazer login para obter novo token
      const loginResponse = await fetch(`${USERSHIELD_API_URL}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Username: process.env.USERSHIELD_USERNAME,
          Password: process.env.USERSHIELD_PASSWORD
        })
      })

      if (!loginResponse.ok) {
        throw new Error('Falha ao fazer login no UserShield')
      }

      const loginData = await loginResponse.json()
      token = loginData.jwtToken

      // Salvar no cache (55 minutos)
      if (token) {
        await tokenCacheService.setToken(token, 'usershield')
      }
    }

    // Atualizar usuário
    const updateResponse = await fetch(`${USERSHIELD_API_URL}/Usuarios/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    // Se token expirou (401), tentar novamente com novo token
    if (updateResponse.status === 401) {
      console.warn('⚠️ Token expirado, renovando...')
      
      // Remover token inválido
      await tokenCacheService.removeToken('usershield')
      
      // Novo login
      const loginResponse = await fetch(`${USERSHIELD_API_URL}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Username: process.env.USERSHIELD_USERNAME,
          Password: process.env.USERSHIELD_PASSWORD
        })
      })

      if (!loginResponse.ok) {
        throw new Error('Falha ao renovar token')
      }

      const loginData = await loginResponse.json()
      token = loginData.jwtToken
      
      if (token) {
        await tokenCacheService.setToken(token, 'usershield')
      }

      // Retry da atualização
      const retryResponse = await fetch(`${USERSHIELD_API_URL}/Usuarios/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      if (!retryResponse.ok) {
        const errorText = await retryResponse.text()
        console.error('❌ Erro ao atualizar usuário (retry):', retryResponse.status, errorText)
        return NextResponse.json(
          { error: 'Erro ao atualizar usuário', details: errorText },
          { status: retryResponse.status }
        )
      }

      const data = await retryResponse.json()
      console.log('✅ Usuário atualizado com sucesso (retry)')
      return NextResponse.json(data)
    }

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      console.error('❌ Erro ao atualizar usuário:', updateResponse.status, errorText)
      return NextResponse.json(
        { error: 'Erro ao atualizar usuário', details: errorText },
        { status: updateResponse.status }
      )
    }

    const data = await updateResponse.json()
    console.log('✅ Usuário atualizado com sucesso')

    return NextResponse.json(data)

  } catch (error: any) {
    console.error('❌ [API] Erro ao atualizar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno ao atualizar usuário', message: error.message },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/usershield/usuarios/[id]
 * Exclui um usuário pelo ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now()
  
  try {
    const { id } = await params
    console.log(`🗑️ [DELETE] Excluindo usuário ID: ${id}`)

    // Obter token do cache Redis
    let token = await tokenCacheService.getToken('usershield')
    
    if (!token) {
      console.warn('⚠️ Token não encontrado no cache, fazendo login...')
      
      // Fazer login para obter novo token
      const loginResponse = await fetch(`${USERSHIELD_API_URL}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: process.env.USERSHIELD_USERNAME || 'User@ADM#0110',
          password: process.env.USERSHIELD_PASSWORD || '5sdt85f215600k008sdfbn$#sd4'
        })
      })

      if (!loginResponse.ok) {
        throw new Error('Falha ao fazer login no UserShield')
      }

      const loginData = await loginResponse.json()
      token = loginData.token || loginData.jwtToken

      if (token) {
        await tokenCacheService.setToken('usershield', token)
      }
    }

    // Fazer DELETE na API UserShield
    const deleteStart = Date.now()
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout
    
    try {
      const deleteResponse = await fetch(`${USERSHIELD_API_URL}/Usuarios/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      const deleteTime = Date.now() - deleteStart
      console.log(`⏱️ [PERF] DELETE UserShield: ${deleteTime}ms`)
      
      // Se token expirado (401), tentar com novo login
      if (deleteResponse.status === 401) {
        console.log('Token expirado, fazendo novo login...')
        
        const loginResponse = await fetch(`${USERSHIELD_API_URL}/Auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userName: process.env.USERSHIELD_USERNAME || 'User@ADM#0110',
            password: process.env.USERSHIELD_PASSWORD || '5sdt85f215600k008sdfbn$#sd4'
          })
        })

        if (!loginResponse.ok) {
          throw new Error('Falha na reautenticação')
        }

        const loginData = await loginResponse.json()
        token = loginData.token || loginData.jwtToken
        
        if (token) {
          await tokenCacheService.setToken('usershield', token)
        }
        
        // Retry delete
        const retryResponse = await fetch(`${USERSHIELD_API_URL}/Usuarios/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!retryResponse.ok) {
          const errorText = await retryResponse.text()
          console.error(`❌ Erro ao excluir usuário (retry): ${retryResponse.status}`, errorText)
          throw new Error(`Erro ao excluir usuário: ${retryResponse.status}`)
        }
        
        const totalTime = Date.now() - startTime
        console.log(`✅ [DELETE] Usuário ${id} excluído (com retry) em ${totalTime}ms`)
        
        return NextResponse.json({ 
          success: true, 
          message: 'Usuário excluído com sucesso'
        })
      }
      
      if (!deleteResponse.ok) {
        const errorText = await deleteResponse.text()
        console.error(`❌ Erro ao excluir usuário: ${deleteResponse.status}`, errorText)
        throw new Error(`Erro ao excluir usuário: ${deleteResponse.status}`)
      }
      
      const totalTime = Date.now() - startTime
      console.log(`✅ [DELETE] Usuário ${id} excluído em ${totalTime}ms`)
      
      return NextResponse.json({ 
        success: true, 
        message: 'Usuário excluído com sucesso'
      })
      
    } catch (error: any) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error('Timeout: UserShield API não respondeu em 30 segundos')
      }
      throw error
    }
    
  } catch (error: any) {
    const totalTime = Date.now() - startTime
    console.error(`❌ [DELETE] Erro ao excluir usuário após ${totalTime}ms:`, error)
    
    return NextResponse.json(
      { 
        error: error.message || 'Erro ao excluir usuário',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
