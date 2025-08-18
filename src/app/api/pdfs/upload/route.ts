import { NextRequest, NextResponse } from 'next/server'

const PDF_API_BASE = process.env.PDF_API_URL || 'http://localhost:5000/api'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        
        // Fazer proxy do upload para a API real
        const response = await fetch(`${PDF_API_BASE}/Pdfs/upload`, {
            method: 'POST',
            body: formData,
            signal: AbortSignal.timeout(30000) // 30 segundos para upload
        })

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        
        return NextResponse.json(data)
    } catch (error) {
        console.error('Erro ao fazer upload:', error)
        
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao conectar com o servidor de PDFs'
        }, { status: 503 })
    }
}
