import { NextRequest, NextResponse } from 'next/server'

console.log('🧪 [Test Route] Rota de teste /api/test-nas carregada')

export async function POST(request: NextRequest) {
  console.log('🧪 [Test Route] POST recebido em /api/test-nas')
  
  return NextResponse.json({
    success: true,
    message: 'Rota de teste funcionando!',
    timestamp: new Date().toISOString()
  })
}

export async function GET(request: NextRequest) {
  console.log('🧪 [Test Route] GET recebido em /api/test-nas')
  
  return NextResponse.json({
    success: true,
    message: 'Rota de teste GET funcionando!',
    timestamp: new Date().toISOString()
  })
}
