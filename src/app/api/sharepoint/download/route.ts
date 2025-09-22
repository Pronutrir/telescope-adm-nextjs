import { NextRequest, NextResponse } from 'next/server'
import { requirePdfApiBaseUrl } from '@/config/env'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID do PDF é obrigatório' },
        { status: 400 }
      )
    }

  logger.info(`⬇️ [SharePoint] Baixando PDF ID: ${id}`)
  const baseUrl = requirePdfApiBaseUrl()

        const response = await fetch(`${baseUrl}/Pdfs/download-arquivo`, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf'
      }
    })

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`)
    }

    // Obter o arquivo PDF como buffer
    const pdfBuffer = await response.arrayBuffer()
    
    // Obter o nome do arquivo do cabeçalho Content-Disposition se disponível
    const contentDisposition = response.headers.get('Content-Disposition')
    let filename = `pdf_${id}.pdf`
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '')
      }
    }

  logger.info(`✅ [SharePoint] PDF ${id} baixado: ${filename}`)

    // Retornar o PDF como resposta
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
    
  } catch (error) {
    logger.error('❌ [SharePoint] Erro ao baixar PDF:', error)
    return NextResponse.json(
      { error: 'Falha ao baixar PDF', message: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}
