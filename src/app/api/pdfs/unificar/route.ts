import { NextRequest, NextResponse } from 'next/server'
import { requirePdfApiBaseUrl } from '@/config/env'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        if (!body.title || !body.sourceFileIds || body.sourceFileIds.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'Título e arquivos fonte são obrigatórios'
            }, { status: 400 })
        }

        if (body.sourceFileIds.length < 2) {
            return NextResponse.json({
                success: false,
                message: 'Pelo menos 2 arquivos são necessários para unificação'
            }, { status: 400 })
        }

        // Fazer proxy para a API real
    // Baseado no app_pdfs: '/api/Pdfs/unificar-especificos'
    const baseUrl = requirePdfApiBaseUrl('internal')
    const response = await fetch(`${baseUrl}/Pdfs/unificar-especificos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(30000) // 30 segundos para unificação
        })

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        
        return NextResponse.json(data)
    } catch (error) {
        logger.error('❌ [PDFs] Erro ao unificar:', error)
        
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao conectar com o servidor de PDFs'
        }, { status: 503 })
    }
}
