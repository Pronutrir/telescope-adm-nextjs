import { NextRequest, NextResponse } from 'next/server'

const SHAREPOINT_API_BASE = 'http://localhost:5000/api/Pdfs'

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

    console.log(`⬇️ [API] Baixando PDF ID: ${id}`)

    const response = await fetch(`${SHAREPOINT_API_BASE}/${id}/download`, {
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

    console.log(`✅ [API] PDF ${id} baixado com sucesso: ${filename}`)

    // Retornar o PDF como resposta
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
    
  } catch (error) {
    console.error('❌ [API] Erro ao baixar PDF:', error)
    return NextResponse.json(
      { error: 'Falha ao baixar PDF', message: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}
