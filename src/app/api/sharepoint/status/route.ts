import { NextRequest, NextResponse } from 'next/server'

const SHAREPOINT_API_BASE = process.env.NEXT_PUBLIC_PDF_API_URL || 'http://20.65.208.119:5656/api/v1'

export async function GET() {
  try {
    console.log('🔍 [API] Verificando status SharePoint...')
    
    const response = await fetch(`${SHAREPOINT_API_BASE}/Pdfs/status-aprovacao-pdf`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    console.log('✅ [API] Status SharePoint obtido com sucesso')
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('❌ [API] Erro ao verificar status:', error)
    return NextResponse.json(
      { isConnected: false, message: 'SharePoint API não disponível', error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 503 }
    )
  }
}
