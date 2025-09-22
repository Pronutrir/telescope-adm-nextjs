import { NextRequest, NextResponse } from 'next/server'
import { requirePdfApiBaseUrl } from '@/config/env'
import { logger } from '@/lib/logger'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        
        logger.info('📡 [PDFs] Buscando detalhes:', id)
        const baseUrl = requirePdfApiBaseUrl('internal')
        
        const response = await fetch(`${baseUrl}/Pdfs/${id}/details`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(10000)
        })

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        logger.debug('📄 [PDFs] Detalhes obtidos:', {
            id: data.id,
            name: data.name,
            pageCount: data.pageCount,
            size: data.formattedSize
        })
        
        return NextResponse.json(data)
    } catch (error) {
        logger.error('❌ [PDFs] Erro em detalhes:', error)
        
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao conectar com o servidor de PDFs'
        }, { status: 503 })
    }
}
