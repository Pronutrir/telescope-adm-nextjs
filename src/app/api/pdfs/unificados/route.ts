import { NextRequest, NextResponse } from 'next/server'

const PDF_API_BASE = process.env.PDF_API_URL || 'http://20.65.208.119:5656/api/v1'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        
        // Construir URL com parâmetros opcionais
        const apiUrl = new URL(`${PDF_API_BASE}/Pdfs/unified`)
        const caminho = searchParams.get('caminho')
        if (caminho) {
            apiUrl.searchParams.set('caminho', caminho)
        }

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
        console.error('Erro ao listar PDFs unificados:', error)
        
        return NextResponse.json({
            success: false,
            data: [],
            message: error instanceof Error ? error.message : 'Erro ao conectar com o servidor de PDFs'
        }, { status: 503 })
    }
}
