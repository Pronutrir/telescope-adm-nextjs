import { NextRequest, NextResponse } from 'next/server'

/**
 * API Route: GET /api/pdfs/unificados/search
 * Buscar PDFs unificados com filtro
 * Proxy para: http://20.65.208.119:5656/api/v1/Pdfs/unified/search
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const searchTerm = searchParams.get('searchTerm') || ''
    const page = searchParams.get('page') || '1'
    const pageSize = searchParams.get('pageSize') || '10'

    console.log('🔍 [API Unificados Search] Iniciando busca de PDFs unificados:', {
      searchTerm,
      page,
      pageSize
    })

    // URL da API Real (.NET)
    const baseUrl = process.env.APITASY_URL || 'http://20.65.208.119:5656'
    const apiUrl = `${baseUrl}/api/v1/Pdfs/unified/search?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&pageSize=${pageSize}`

    console.log('📡 [API Unificados Search] URL da requisição:', apiUrl)

    // Fazer requisição para a API Real
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error('❌ [API Unificados Search] Erro HTTP:', response.status, response.statusText)
      
      return NextResponse.json(
        { 
          error: 'Erro ao buscar PDFs unificados',
          message: `HTTP ${response.status}: ${response.statusText}`,
          items: []
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    console.log('✅ [API Unificados Search] PDFs encontrados:', {
      total: Array.isArray(data) ? data.length : data.items?.length || 0
    })

    return NextResponse.json(data)

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('❌ [API Unificados Search] Timeout na requisição')
      return NextResponse.json(
        { 
          error: 'Timeout',
          message: 'A requisição excedeu o tempo limite de 30 segundos',
          items: []
        },
        { status: 504 }
      )
    }

    console.error('❌ [API Unificados Search] Erro ao buscar PDFs unificados:', error)
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        items: []
      },
      { status: 500 }
    )
  }
}
