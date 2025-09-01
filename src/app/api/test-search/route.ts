import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = new URL(request.url).searchParams
  const searchTerm = searchParams.get('searchTerm')
  
  console.log('🧪 [TEST] Rota de teste acessada')
  console.log('🧪 [TEST] SearchTerm:', searchTerm)
  
  // Fazer requisição direta para API SharePoint
  try {
    const url = `http://localhost:5000/api/Pdfs/search?searchTerm=${searchTerm}&page=1&pageSize=10`
    console.log('🧪 [TEST] URL de destino:', url)
    
    const response = await fetch(url)
    console.log('🧪 [TEST] Status da resposta:', response.status)
    
    if (!response.ok) {
      return NextResponse.json({
        error: 'Erro na API SharePoint',
        status: response.status,
        statusText: response.statusText
      }, { status: response.status })
    }
    
    const data = await response.json()
    console.log('🧪 [TEST] Dados recebidos:', typeof data, 'items:', data.items?.length || 'N/A')
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('🧪 [TEST] Erro:', error)
    return NextResponse.json({
      error: 'Erro interno',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
