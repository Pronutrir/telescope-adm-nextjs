import { NextRequest, NextResponse } from 'next/server'
import { requirePdfApiBaseUrl } from '@/config/env'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const caminho = searchParams.get('caminho')

    const buildUrl = (baseUrl: string, path: string) => {
        const url = new URL(`${baseUrl}${path}`)
        if (caminho) url.searchParams.set('caminho', caminho)
        return url.toString()
    }

    const tryFetch = async (baseUrl: string) => {
        const paths = ['/Pdfs/unified', '/pdfs/unified']
        let lastError: unknown = null
        for (const p of paths) {
            const target = buildUrl(baseUrl, p)
            try {
                logger.info('🔄 [PDFs] Unificados GET ->', target)
                const response = await fetch(target, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    signal: AbortSignal.timeout(15000),
                })
                if (!response.ok) {
                    lastError = new Error(`API Error: ${response.status} ${response.statusText}`)
                    continue
                }
                return await response.json()
            } catch (err) {
                lastError = err
                logger.warn('⚠️ [PDFs] Falha ao obter unificados em', target, String(err))
            }
        }
        throw lastError instanceof Error ? lastError : new Error('Falha ao obter unificados')
    }

    try {
        const publicUrl = requirePdfApiBaseUrl('public')
        const data = await tryFetch(publicUrl)
        return NextResponse.json(data)
    } catch (e1) {
        logger.warn('⚠️ [PDFs] Unificados: falha na URL pública, tentando interna...', e1)
        let internalUrl: string | null = null
        try {
            internalUrl = requirePdfApiBaseUrl('internal')
        } catch (cfgErr) {
            logger.warn('ℹ️ [PDFs] URL interna não configurada para unificados.', cfgErr)
        }

        if (internalUrl) {
            try {
                const data = await tryFetch(internalUrl)
                return NextResponse.json(data)
            } catch (e2) {
                logger.error('❌ [PDFs] Unificados: ambas as URLs falharam', { publicError: String(e1), internalError: String(e2) })
            }
        }

        const res = NextResponse.json([], { status: 200 })
        res.headers.set('X-PDF-Service-Status', internalUrl ? 'offline' : 'missing-internal-config')
        res.headers.set('X-PDF-Service-Message', internalUrl ? 'PDF unified API offline (public/internal)' : 'Falha na pública e sem PDF_API_URL configurada')
        return res
    }
}
