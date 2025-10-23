import { NextRequest, NextResponse } from 'next/server'
import { requirePdfApiBaseUrl } from '@/config/env'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        
        // Mapear parâmetros do frontend para a API
        const baseUrl = requirePdfApiBaseUrl('internal')
        const apiUrl = new URL(`${baseUrl}/Pdfs/search`)
        const query = searchParams.get('query') || searchParams.get('termo') || ''
        const page = searchParams.get('page') || '1'
        const limit = searchParams.get('limit') || '10'
        
        // A API usa searchTerm, page e pageSize
        if (query) apiUrl.searchParams.set('searchTerm', query)
        apiUrl.searchParams.set('page', page)
        apiUrl.searchParams.set('pageSize', limit)

        logger.info(`🔍 [PDFs] Buscando PDFs: ${apiUrl.toString()}`)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000)

        const response = await fetch(apiUrl.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            logger.error(`❌ [PDFs] Erro na API: ${response.status} ${response.statusText}`)
            throw new Error(`API Error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        logger.info(`✅ [PDFs] Busca concluída: ${data.totalItems} itens encontrados`)
        return NextResponse.json(data)
    } catch (error) {
        logger.error('❌ [PDFs] Erro na busca:', error)
        
        return NextResponse.json({
            items: [],
            currentPage: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 0,
            hasPreviousPage: false,
            hasNextPage: false,
            searchTerm: null,
            message: error instanceof Error ? error.message : 'Erro ao conectar com o servidor de PDFs'
        }, { status: 503 })
    }
}
