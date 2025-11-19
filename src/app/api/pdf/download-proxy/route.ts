import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

/**
 * API Route proxy para fazer download de PDFs externos (SharePoint, etc)
 * Resolve problemas de CORS fazendo o fetch server-side
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const url = searchParams.get('url')

        if (!url) {
            return NextResponse.json(
                { error: 'URL é obrigatória' },
                { status: 400 }
            )
        }

        // Validar que é uma URL válida
        try {
            new URL(url)
        } catch {
            return NextResponse.json(
                { error: 'URL inválida' },
                { status: 400 }
            )
        }

        logger.info(`📥 [PDF PROXY] Fazendo download de: ${url}`)

        // Fazer fetch do arquivo
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        })

        if (!response.ok) {
            logger.error(`❌ [PDF PROXY] Erro ao fazer download: ${response.status} ${response.statusText}`)
            return NextResponse.json(
                { error: 'Erro ao fazer download do arquivo' },
                { status: response.status }
            )
        }

        // Obter o blob do arquivo
        const blob = await response.blob()
        
        logger.info(`✅ [PDF PROXY] Download concluído. Tamanho: ${blob.size} bytes`)

        // Retornar o blob com headers corretos
        return new NextResponse(blob, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
            }
        })

    } catch (error) {
        logger.error('❌ [PDF PROXY] Erro ao fazer download:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
