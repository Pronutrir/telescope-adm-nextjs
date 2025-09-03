import { NextRequest, NextResponse } from 'next/server'

// Este é um handler básico para o diretório /api/Nas
// Permite que as sub-rotas sejam acessíveis

export async function GET() {
  return NextResponse.json({
    message: 'API NAS - Use as sub-rotas específicas',
    availableRoutes: [
      '/api/Nas/transferir-sharepoint-para-nas'
    ]
  })
}

export async function POST() {
  return NextResponse.json({
    message: 'Método não suportado. Use as sub-rotas específicas.',
    availableRoutes: [
      '/api/Nas/transferir-sharepoint-para-nas'
    ]
  })
}
