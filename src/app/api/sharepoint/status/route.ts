import { NextResponse } from 'next/server'
import { requirePdfApiBaseUrl } from '@/config/env'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    logger.info('🔍 [SharePoint] Verificando status...')
    const baseUrl = requirePdfApiBaseUrl()

    const response = await fetch(`${baseUrl}/Pdfs/status-aprovacao-pdf`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    logger.info('✅ [SharePoint] Status obtido com sucesso')
    return NextResponse.json(data)
    
  } catch (error) {
    logger.error('❌ [SharePoint] Erro ao verificar status:', error)
    return NextResponse.json(
      { isConnected: false, message: 'SharePoint API não disponível', error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 503 }
    )
  }
}
