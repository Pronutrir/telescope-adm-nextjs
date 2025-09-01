import { NextRequest, NextResponse } from 'next/server'

const PDF_API_BASE = process.env.PDF_API_URL || 'http://localhost:5000/api'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        
        console.log('📡 Buscando detalhes do PDF:', id)
        
        const response = await fetch(`${PDF_API_BASE}/Pdfs/${id}/details`, {
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
        console.log('📄 Detalhes do PDF obtidos:', {
            id: data.id,
            name: data.name,
            pageCount: data.pageCount,
            size: data.formattedSize
        })
        
        return NextResponse.json(data)
    } catch (error) {
        console.error('❌ Erro ao buscar detalhes do PDF:', error)
        
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao conectar com o servidor de PDFs'
        }, { status: 503 })
    }
}
