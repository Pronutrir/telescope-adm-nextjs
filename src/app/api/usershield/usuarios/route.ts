/**
 * API Route para UserShield com dados reais
 * GET /api/usershield/usuarios
 */
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 API Route UserShield: Iniciada')
    
    // Obter token do header Authorization ou cookie
    const authHeader = request.headers.get('authorization')
    let jwtToken = authHeader?.replace('Bearer ', '') || request.cookies.get('access_token')?.value
    
    // Se não há token ou se falhar, fazer login na UserShield
    if (!jwtToken) {
      console.log('🔐 Token não encontrado, fazendo login na UserShield...')
      
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
        throw new Error(`Login falhou: ${loginResponse.status}`)
      }

      const loginData = await loginResponse.json()
      jwtToken = loginData.jwtToken

      if (!jwtToken) {
        throw new Error('Token não encontrado na resposta de login')
      }
      
      console.log('✅ Login realizado, token obtido')
    } else {
      console.log('✅ Token encontrado nos headers/cookies')
    }

    // Buscar usuários
    let usuariosResponse = await fetch('https://servicesapp.pronutrir.com.br/usershield/api/v1/Usuarios', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      }
    })

    // Se o token for inválido (401), fazer login novamente
    if (usuariosResponse.status === 401) {
      console.log('🔄 Token inválido, fazendo novo login...')
      
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
        throw new Error(`Re-login falhou: ${loginResponse.status}`)
      }

      const loginData = await loginResponse.json()
      jwtToken = loginData.jwtToken

      if (!jwtToken) {
        throw new Error('Token não encontrado no re-login')
      }

      // Tentar novamente com o novo token
      usuariosResponse = await fetch('https://servicesapp.pronutrir.com.br/usershield/api/v1/Usuarios', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('✅ Novo token obtido e usado')
    }

    if (!usuariosResponse.ok) {
      console.error('❌ Busca de usuários falhou:', usuariosResponse.status)
      throw new Error(`Busca de usuários falhou: ${usuariosResponse.status}`)
    }

    const usuariosData = await usuariosResponse.json()
    console.log('✅ Usuários obtidos:', usuariosData.result?.length || 0)

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
      message: `${usuarios.length} usuários reais encontrados via UserShield API`
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