import { NextRequest, NextResponse } from 'next/server'

const PDF_API_BASE = process.env.PDF_API_URL || 'http://20.65.208.119:5656/api/v1'

export async function GET() {
    try {
        console.log('🔍 [API] Listando PDFs da API:', `${PDF_API_BASE}/Pdfs`)
        
        const response = await fetch(`${PDF_API_BASE}/Pdfs`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(30000) // 30 segundos
        })

        console.log('📡 [API] Resposta da API externa:', response.status, response.statusText)

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log('✅ [API] PDFs retornados:', data.length)
        return NextResponse.json(data)
    } catch (error) {
        console.error('Erro ao listar PDFs:', error)
        
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao conectar com o servidor de PDFs'
        }, { status: 503 })
    }
}
