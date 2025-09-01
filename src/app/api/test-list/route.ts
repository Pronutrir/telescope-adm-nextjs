import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  console.log('🧪 [TEST-LIST] Rota de teste de listagem acessada')
  
  // Fazer requisição direta para API SharePoint
  try {
    const url = `http://localhost:5000/api/Pdfs`
    console.log('🧪 [TEST-LIST] URL de destino:', url)
    
    const response = await fetch(url)
    console.log('🧪 [TEST-LIST] Status da resposta:', response.status)
    
    if (!response.ok) {
      return NextResponse.json({
        error: 'Erro na API SharePoint',
        status: response.status,
        statusText: response.statusText
      }, { status: response.status })
    }
    
    const data = await response.json()
    console.log('🧪 [TEST-LIST] Dados recebidos:', typeof data, 'items:', data.length || 'N/A')
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('🧪 [TEST-LIST] Erro:', error)
    return NextResponse.json({
      error: 'Erro interno',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
