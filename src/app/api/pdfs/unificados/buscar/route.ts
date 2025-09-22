import { NextRequest, NextResponse } from 'next/server'
import { requirePdfApiBaseUrl } from '@/config/env'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        
        // Construir URL da API real com os mesmos parâmetros
    const baseUrl = requirePdfApiBaseUrl('internal')
    const apiUrl = new URL(`${baseUrl}/Pdfs/unificados`)
        // NOTA: A API de unificados não possui busca paginada na documentação
        // Usando endpoint base e implementando filtro local se necessário
        const caminho = searchParams.get('caminho')
        if (caminho) {
            apiUrl.searchParams.set('caminho', caminho)
        }

        // Fazer proxy para a API real
        const response = await fetch(apiUrl.toString(), {
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
        
        return NextResponse.json(data)
    } catch (error) {
        logger.error('❌ [PDFs] Erro ao buscar unificados:', error)
        
        return NextResponse.json({
            success: false,
            data: [],
            pagination: {
                currentPage: 1,
                totalPages: 0,
                totalItems: 0,
                itemsPerPage: 12
            },
            message: error instanceof Error ? error.message : 'Erro ao conectar com o servidor de PDFs'
        }, { status: 503 })
    }
}
