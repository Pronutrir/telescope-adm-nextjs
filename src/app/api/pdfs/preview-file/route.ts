import { NextRequest, NextResponse } from 'next/server'

const PDF_API_BASE = process.env.PDF_API_URL || 'http://20.65.208.119:5656/api/v1'

export async function GET(request: NextRequest) {
    try {
        // Obter o filename do query parameter
        const { searchParams } = new URL(request.url)
        const filename = searchParams.get('file')
        
        if (!filename) {
            return NextResponse.json({
                sucesso: false,
                mensagem: 'Parâmetro file é obrigatório'
            }, { status: 400 })
        }

        console.log(`🔍 Preview solicitado para: ${filename}`)

        // Fazer proxy para a API real - usar download/{nomePdf}
        const apiUrl = `${PDF_API_BASE}/Pdfs/download/${filename}`
        console.log(`📡 Fazendo requisição para: ${apiUrl}`)
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(15000)
        })

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`)
        }

        // Se a API retorna o PDF como blob, converter para base64
        if (response.headers.get('content-type')?.includes('application/pdf')) {
            const arrayBuffer = await response.arrayBuffer()
            const base64 = Buffer.from(arrayBuffer).toString('base64')
            
            return NextResponse.json({
                sucesso: true,
                nomeArquivo: filename,
                conteudoBase64: `data:application/pdf;base64,${base64}`,
                mensagem: 'PDF carregado com sucesso'
            })
        } else {
            // Se a API retorna JSON com o base64, transformar para formato esperado
            const data = await response.json()
            
            // Verificar se é formato antigo e transformar
            if (data.success !== undefined) {
                return NextResponse.json({
                    sucesso: data.success,
                    nomeArquivo: filename,
                    conteudoBase64: data.data?.base64 ? `data:application/pdf;base64,${data.data.base64}` : data.conteudoBase64,
                    mensagem: data.message || data.mensagem
                })
            }
            
            // Se já está no formato correto mas sem prefixo, adicionar
            const base64Content = data.conteudoBase64 || data.base64 || ''
            const finalBase64 = base64Content.startsWith('data:') 
                ? base64Content 
                : `data:application/pdf;base64,${base64Content}`
            
            return NextResponse.json({
                ...data,
                conteudoBase64: finalBase64
            })
        }
    } catch (error) {
        console.error('Erro ao carregar PDF:', error)
        
        return NextResponse.json({
            sucesso: false,
            mensagem: error instanceof Error ? error.message : 'Erro ao conectar com o servidor de PDFs'
        }, { status: 503 })
    }
}
