import { NextResponse } from 'next/server'
import { requirePdfApiBaseUrl } from '@/config/env'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    logger.info('📄 [SharePoint] Listando PDFs...')
    const baseUrl = requirePdfApiBaseUrl()
    
        const response = await fetch(`${baseUrl}/Pdfs/pesquisar-pasta-sharepoint`, {
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
    
    logger.info(`✅ [SharePoint] ${data.length} PDFs carregados`)
    return NextResponse.json(data)
    
  } catch (error) {
    logger.error('❌ [SharePoint] Erro ao listar PDFs:', error)
    return NextResponse.json(
      { error: 'Falha ao carregar PDFs', message: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}
