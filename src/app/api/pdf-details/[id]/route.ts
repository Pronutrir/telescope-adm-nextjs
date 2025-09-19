import { NextRequest, NextResponse } from 'next/server'
import { getPdfApiConfig } from '@/config/env'

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url)
        const pathSegments = url.pathname.split('/').slice(3) // Remove /api/pdf-details
        const pdfId = pathSegments[0]
        
        console.log('📡 Buscando detalhes do PDF:', pdfId)
        
    const { baseUrl: PDF_API_BASE } = getPdfApiConfig()
        const apiUrl = `${PDF_API_BASE}/Pdfs/${pdfId}/details`
        
        console.log('🔗 URL da API:', apiUrl)
        
        const response = await fetch(apiUrl, {
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
