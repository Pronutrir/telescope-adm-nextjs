import { NextRequest, NextResponse } from 'next/server'

/**
 * Proxy para API SharePoint - Resolve problemas de CORS
 * Todas as requisições para /api/sharepoint/* são redirecionadas para localhost:5000/api/*
 */

const SHAREPOINT_API_BASE = 'http://localhost:5000/api'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const params = await context.params
    const path = params.path.join('/')
    
    // Converter 'pdfs' para 'Pdfs' para compatibilidade com API SharePoint
    const convertedPath = path.replace(/^pdfs\b/, 'Pdfs')
    
    const searchParams = new URL(request.url).searchParams
    const queryString = searchParams.toString()
    
    const targetUrl = `${SHAREPOINT_API_BASE}/${convertedPath}${queryString ? `?${queryString}` : ''}`
    
    console.log('🔄 [SharePoint Proxy] Path original:', path)
    console.log('🔄 [SharePoint Proxy] Path convertido:', convertedPath)
    console.log('🔄 [SharePoint Proxy] Query params:', queryString)
    console.log('🔄 [SharePoint Proxy] Target URL:', targetUrl)
    
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      // Remove timeout para permitir downloads grandes
    })

    if (!response.ok) {
      console.error('❌ [SharePoint Proxy] Erro:', response.status, response.statusText)
      return NextResponse.json(
        { error: `SharePoint API error: ${response.statusText}` },
        { status: response.status }
      )
    }

    // Para downloads de arquivo, repassa o stream
    if (response.headers.get('content-type')?.includes('application/pdf')) {
      return new NextResponse(response.body, {
        status: response.status,
        headers: {
          'Content-Type': response.headers.get('content-type') || 'application/pdf',
          'Content-Length': response.headers.get('content-length') || '',
          'Cache-Control': 'no-cache',
        },
      })
    }

    // Para JSON, processa normalmente
    const data = await response.json()
    console.log('✅ [SharePoint Proxy] Sucesso:', typeof data, Array.isArray(data) ? `${data.length} items` : 'single item')
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
    
  } catch (error) {
    console.error('❌ [SharePoint Proxy] Erro interno:', error)
    return NextResponse.json(
      { error: 'Internal proxy error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const params = await context.params
    const path = params.path.join('/')
    const body = await request.text()
    
    const targetUrl = `${SHAREPOINT_API_BASE}/${path}`
    
    console.log('🔄 [SharePoint Proxy] POST para:', targetUrl)
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    })

    if (!response.ok) {
      console.error('❌ [SharePoint Proxy] Erro POST:', response.status, response.statusText)
      return NextResponse.json(
        { error: `SharePoint API error: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('✅ [SharePoint Proxy] POST Sucesso')
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
    
  } catch (error) {
    console.error('❌ [SharePoint Proxy] Erro interno POST:', error)
    return NextResponse.json(
      { error: 'Internal proxy error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
