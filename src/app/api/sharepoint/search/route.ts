import { NextRequest, NextResponse } from 'next/server'
import { requirePdfApiBaseUrl } from '@/config/env'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const page = searchParams.get('page') || '1'
    const pageSize = searchParams.get('pageSize') || '10'

    if (!query) {
      return NextResponse.json(
        { error: 'Parâmetro query é obrigatório' },
        { status: 400 }
      )
    }

  logger.info(`🔍 [SharePoint] Busca: query="${query}", page=${page}, pageSize=${pageSize}`)

  const baseUrl = requirePdfApiBaseUrl()
  const searchUrl = `${baseUrl}/Pdfs/search?query=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`
    
    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`)
    }

  const data = await response.json()
    
  logger.info(`✅ [SharePoint] Busca OK: ${data.totalItems || data.length} resultados`)
    return NextResponse.json(data)
    
  } catch (error) {
    logger.error('❌ [SharePoint] Erro na busca de PDFs:', error)
    return NextResponse.json(
      { error: 'Falha na busca de PDFs', message: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}
