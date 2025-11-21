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
            logger.error('❌ [PDF PROXY] URL não fornecida')
            return NextResponse.json(
                { error: 'URL é obrigatória' },
                { status: 400 }
            )
        }

        // Validar que é uma URL válida
        try {
            new URL(url)
        } catch (e) {
            logger.error('❌ [PDF PROXY] URL inválida:', url)
            return NextResponse.json(
                { error: 'URL inválida' },
                { status: 400 }
            )
        }

        logger.info(`📥 [PDF PROXY] Fazendo download de: ${url}`)

        // Fazer fetch do arquivo
        logger.info('🔄 [PDF PROXY] Iniciando fetch...')
        let response: Response
        try {
            response = await fetch(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            })
        } catch (fetchError) {
            logger.error('❌ [PDF PROXY] Erro no fetch:', fetchError)
            return NextResponse.json(
                { error: 'Erro ao conectar com servidor remoto', details: fetchError instanceof Error ? fetchError.message : 'Desconhecido' },
                { status: 502 }
            )
        }

        if (!response.ok) {
            logger.error(`❌ [PDF PROXY] Erro ao fazer download: ${response.status} ${response.statusText}`)
            
            // Tentar obter detalhes do erro
            let errorDetails = ''
            try {
                const errorText = await response.text()
                errorDetails = errorText.substring(0, 200) // Primeiros 200 caracteres
                logger.error(`❌ [PDF PROXY] Detalhes do erro: ${errorDetails}`)
            } catch (e) {
                logger.error('❌ [PDF PROXY] Não foi possível obter detalhes do erro')
            }
            
            return NextResponse.json(
                { error: `Erro ao fazer download do arquivo: ${response.status} ${response.statusText}`, details: errorDetails },
                { status: response.status }
            )
        }

        // Verificar content-type
        const contentType = response.headers.get('content-type')
        logger.info(`📄 [PDF PROXY] Content-Type recebido: ${contentType}`)

        // Obter o arrayBuffer do arquivo
        let arrayBuffer: ArrayBuffer
        try {
            arrayBuffer = await response.arrayBuffer()
            logger.info(`✅ [PDF PROXY] ArrayBuffer obtido. Tamanho: ${arrayBuffer.byteLength} bytes`)
        } catch (bufferError) {
            logger.error('❌ [PDF PROXY] Erro ao obter arrayBuffer:', bufferError)
            return NextResponse.json(
                { error: 'Erro ao processar arquivo', details: bufferError instanceof Error ? bufferError.message : 'Desconhecido' },
                { status: 500 }
            )
        }

        // Verificar se não está vazio
        if (arrayBuffer.byteLength === 0) {
            logger.error('❌ [PDF PROXY] Arquivo vazio recebido')
            return NextResponse.json(
                { error: 'Arquivo vazio recebido do SharePoint' },
                { status: 500 }
            )
        }

        // Retornar o arquivo com headers corretos
        return new NextResponse(arrayBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Length': arrayBuffer.byteLength.toString(),
                'Content-Disposition': 'attachment',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
            }
        })

    } catch (error) {
        logger.error('❌ [PDF PROXY] Erro ao fazer download:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Desconhecido' },
            { status: 500 }
        )
    }
}
