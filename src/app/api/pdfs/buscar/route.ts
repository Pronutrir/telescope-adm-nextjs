import { NextRequest, NextResponse } from 'next/server'

const PDF_API_BASE = process.env.PDF_API_URL || 'http://20.65.208.119:5656/api/v1'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        
        // Mapear parâmetros do frontend para a API
        const apiUrl = new URL(`${PDF_API_BASE}/Pdfs/buscar-paginado`)
        const query = searchParams.get('query') || searchParams.get('termo') || ''
        const page = searchParams.get('page') || '1'
        const limit = searchParams.get('limit') || '12'
        
        if (query) apiUrl.searchParams.set('termo', query)
        apiUrl.searchParams.set('pagina', page)
        apiUrl.searchParams.set('itensPorPagina', limit)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const response = await fetch(apiUrl.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Erro ao buscar PDFs:', error)
        
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
