import { NextRequest, NextResponse } from 'next/server'

/**
 * Proxy para API SharePoint - Resolve problemas de CORS
 * Todas as requisições para /api/sharepoint/* são redirecionadas para a API v1
 */

import { requirePdfApiBaseUrl } from '@/config/env'
import { logger } from '@/lib/logger'

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
    
  const baseUrl = requirePdfApiBaseUrl()
  const targetUrl = `${baseUrl}/${convertedPath}${queryString ? `?${queryString}` : ''}`

  logger.debug('[SharePoint Proxy] Path original:', path)
  logger.debug('[SharePoint Proxy] Path convertido:', convertedPath)
  logger.debug('[SharePoint Proxy] Query params:', queryString)
  logger.info('🔄 [SharePoint Proxy] GET ->', targetUrl)
    
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      // Remove timeout para permitir downloads grandes
    })

    if (!response.ok) {
      logger.error('[SharePoint Proxy] Erro GET:', response.status, response.statusText)
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
  logger.info('✅ [SharePoint Proxy] GET Sucesso:', Array.isArray(data) ? `${data.length} items` : 'single item')
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
    
  } catch (error) {
    logger.error('❌ [SharePoint Proxy] Erro interno:', error)
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
    
  const baseUrl = requirePdfApiBaseUrl()
  const targetUrl = `${baseUrl}/${path}`

  logger.info('🔄 [SharePoint Proxy] POST ->', targetUrl)
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    })

    if (!response.ok) {
      logger.error('❌ [SharePoint Proxy] Erro POST:', response.status, response.statusText)
      return NextResponse.json(
        { error: `SharePoint API error: ${response.statusText}` },
        { status: response.status }
      )
    }

  const data = await response.json()
  logger.info('✅ [SharePoint Proxy] POST Sucesso')
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
    
  } catch (error) {
    logger.error('❌ [SharePoint Proxy] Erro interno POST:', error)
    return NextResponse.json(
      { error: 'Internal proxy error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
