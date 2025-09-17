/**
 * API Route CORRIGIDA para UserShield com dados reais
 * GET /api/usershield/usuarios-fixed
 */
import { NextRequest, NextResponse } from 'next/server'
import { UserShieldUser } from '@/services/userShieldService'

export async function GET(request: NextRequest) {
  // URLs da UserShield API a partir de variáveis de ambiente
  const USERSHIELD_BASE_URL = process.env.NEXT_PUBLIC_USERSHIELD_URL || 'https://servicesapp.pronutrir.com.br/usershield/api/'
  const USERSHIELD_LOGIN_URL = `${USERSHIELD_BASE_URL}v1/Auth/login`
  const USERSHIELD_USERS_URL = `${USERSHIELD_BASE_URL}v1/Usuarios`
  try {
    console.log('🚀 API Route UserShield FIXED: Iniciada')
    
    const sessionId = request.cookies.get('session_id')?.value
    
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Sessão necessária' },
        { status: 401 }
      )
    }

    // Login na UserShield
    const loginResponse = await fetch(USERSHIELD_LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        Username: process.env.USERSHIELD_USERNAME,
        Password: process.env.USERSHIELD_PASSWORD
      })
    })

    if (!loginResponse.ok) {
      throw new Error(`Login falhou: ${loginResponse.status}`)
    }

    const loginData = await loginResponse.json()
    const userToken = loginData.jwtToken // Variável com nome diferente

    if (!userToken) {
      throw new Error('Token não encontrado')
    }

    // Buscar usuários
    const usuariosResponse = await fetch(USERSHIELD_USERS_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!usuariosResponse.ok) {
      throw new Error(`Busca de usuários falhou: ${usuariosResponse.status}`)
    }

    const usuariosData = await usuariosResponse.json()

    // Mapear para formato esperado pela aplicação
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

    return NextResponse.json({
      success: true,
      result: usuarios,
      message: `${usuarios.length} usuários encontrados (dados reais da UserShield)`
    })

  } catch (error) {
    console.error('❌ Erro na API UserShield:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      },
      { status: 500 }
    )
  }
}
