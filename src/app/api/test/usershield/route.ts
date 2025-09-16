/**
 * API Route de teste para debug da integração UserShield
 * GET /api/test/usershield
 */
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('🧪 Teste UserShield iniciado')
  
  try {
    // Simular dados de usuários para teste
    const mockUsuarios = [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao.silva@empresa.com',
        userName: 'joao.silva',
        role: 'Administrador',
        status: 'Ativo',
        lastLogin: '2025-09-15',
        department: 'TI',
        perfis: [{ id: '1', nomePerfil: 'Administrador' }]
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria.santos@empresa.com',
        userName: 'maria.santos',
        role: 'Usuário',
        status: 'Ativo',
        lastLogin: '2025-09-14',
        department: 'RH',
        perfis: [{ id: '2', nomePerfil: 'Usuário' }]
      },
      {
        id: '3',
        name: 'Pedro Costa',
        email: 'pedro.costa@empresa.com',
        userName: 'pedro.costa',
        role: 'Gestor',
        status: 'Inativo',
        lastLogin: '2025-09-10',
        department: 'Vendas',
        perfis: [{ id: '3', nomePerfil: 'Gestor' }]
      }
    ]

    return NextResponse.json({
      success: true,
      result: mockUsuarios,
      message: `${mockUsuarios.length} usuários de teste retornados`
    })

  } catch (error) {
    console.error('❌ Erro no teste UserShield:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno do servidor' 
      },
      { status: 500 }
    )
  }
}
