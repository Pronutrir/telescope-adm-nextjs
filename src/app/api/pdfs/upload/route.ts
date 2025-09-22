import { NextRequest, NextResponse } from 'next/server'
import { requirePdfApiBaseUrl } from '@/config/env'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        
    logger.info('📤 [PDFs] Iniciando upload...')
    const baseUrl = requirePdfApiBaseUrl('internal')
    logger.debug('🌐 [PDFs] Base URL:', baseUrl)
        
        // Verificar se o arquivo foi enviado com o nome correto
        const file = formData.get('arquivo') || formData.get('file')
        if (!file) {
            logger.warn('❌ [PDFs] Arquivo não encontrado no FormData')
            logger.debug('📋 [PDFs] Campos disponíveis:', Array.from(formData.keys()))
            return NextResponse.json({
                success: false,
                message: 'Arquivo não encontrado. Use o campo "arquivo" para enviar o PDF.'
            }, { status: 400 })
        }
        
        // Criar novo FormData com o nome correto esperado pela API
        const apiFormData = new FormData()
        apiFormData.append('arquivo', file)
        
        // Verificar se existe nomePersonalizado
        const nomePersonalizado = formData.get('nomePersonalizado')
    let uploadUrl = `${baseUrl}/Pdfs/upload`
        
        if (nomePersonalizado && typeof nomePersonalizado === 'string') {
            uploadUrl += `?nomePersonalizado=${encodeURIComponent(nomePersonalizado)}`
            logger.debug('📝 [PDFs] Nome personalizado:', nomePersonalizado)
        }
        
    logger.info('📤 [PDFs] Enviando arquivo para:', uploadUrl)
        
        // Fazer proxy do upload para a API real
        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: apiFormData,
            signal: AbortSignal.timeout(30000) // 30 segundos para upload
        })

    logger.debug('📡 [PDFs] Resposta:', response.status, response.statusText)

        if (!response.ok) {
            let errorMessage = `API Error: ${response.status} ${response.statusText}`
            
            // Tentar obter detalhes do erro da API
            try {
                const errorData = await response.text()
                logger.warn('❌ [PDFs] Detalhes do erro da API:', errorData)
                
                // Tentar fazer parse do JSON se possível
                try {
                    const errorJson = JSON.parse(errorData)
                    errorMessage = errorJson.mensagem || errorMessage
                } catch {
                    errorMessage = errorData || errorMessage
                }
            } catch {
                logger.warn('⚠️ [PDFs] Não foi possível parsear o erro da API')
            }
            
            throw new Error(errorMessage)
        }

    const data = await response.json()
    logger.info('✅ [PDFs] Upload concluído')
        
        return NextResponse.json(data)
    } catch (error) {
        logger.error('❌ [PDFs] Erro ao fazer upload:', error)
        
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao conectar com o servidor de PDFs'
        }, { status: 503 })
    }
}
