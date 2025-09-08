import { NextRequest, NextResponse } from 'next/server'

const SHAREPOINT_API_BASE = process.env.NEXT_PUBLIC_PDF_API_URL || 'http://20.65.208.119:5656/api/v1'

export async function GET() {
  try {
    console.log('📄 [API] Listando PDFs do SharePoint...')
    
        const response = await fetch(`${SHAREPOINT_API_BASE}/Pdfs/pesquisar-pasta-sharepoint`, {
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
    
    console.log(`✅ [API] ${data.length} PDFs carregados do SharePoint`)
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('❌ [API] Erro ao listar PDFs:', error)
    return NextResponse.json(
      { error: 'Falha ao carregar PDFs', message: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}
