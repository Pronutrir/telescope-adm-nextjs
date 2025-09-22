import { NextResponse } from 'next/server'
import { requirePdfApiBaseUrl } from '@/config/env'
import { logger } from '@/lib/logger'

export async function GET() {
        const tryFetch = async (baseUrl: string) => {
            const paths = ['/pdfs', '/Pdfs']
            let lastError: unknown = null

            for (const p of paths) {
                try {
                    logger.info('🔍 [PDFs] Listando PDFs:', `${baseUrl}${p}`)
                    const response = await fetch(`${baseUrl}${p}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                        signal: AbortSignal.timeout(15000),
                    })
                    logger.debug('📡 [PDFs] Resposta externa:', response.status, response.statusText)
                    if (!response.ok) {
                        lastError = new Error(`API Error: ${response.status} ${response.statusText}`)
                        continue
                    }
                    return await response.json()
                } catch (err) {
                    lastError = err
                    logger.warn('⚠️ [PDFs] Tentativa falhou para caminho:', p, String(err))
                }
            }

            throw lastError instanceof Error ? lastError : new Error('Falha ao listar PDFs')
        }

    try {
        const publicUrl = requirePdfApiBaseUrl('public')
        const data = await tryFetch(publicUrl)
        logger.info('✅ [PDFs] PDFs retornados (public):', data.length)
        return NextResponse.json(data)
    } catch (e1) {
        logger.warn('⚠️ [PDFs] Falha na URL pública, tentando interna...', e1)

        // Resolver a URL interna apenas quando necessário e tratar ausência de configuração
        let internalUrl: string | null = null
        try {
            internalUrl = requirePdfApiBaseUrl('internal')
        } catch (cfgErr) {
            logger.warn('ℹ️ [PDFs] URL interna não configurada. Pulando fallback.', cfgErr)
        }

        if (internalUrl) {
            try {
                const data = await tryFetch(internalUrl)
                logger.info('✅ [PDFs] PDFs retornados (internal):', data.length)
                return NextResponse.json(data)
            } catch (e2) {
                logger.error('❌ [PDFs] Ambas as URLs falharam:', { publicError: String(e1), internalError: String(e2) })
            }
        } else {
            logger.error('❌ [PDFs] Falha na pública e sem URL interna configurada:', String(e1))
        }

        // Responder 200 com lista vazia + cabeçalhos de diagnóstico, para UI tratar estado vazio
        const res = NextResponse.json([], { status: 200 })
        res.headers.set('X-PDF-Service-Status', internalUrl ? 'offline' : 'missing-internal-config')
        res.headers.set('X-PDF-Service-Message', internalUrl ? 'PDF API offline (public/internal)' : 'Falha na pública e sem PDF_API_URL configurada')
        return res
    }
}
