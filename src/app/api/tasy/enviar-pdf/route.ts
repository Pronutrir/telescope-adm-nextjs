import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { getServiceUrl } from '@/config/env'

const TASY_API_BASE = getServiceUrl('APITASY') // Já inclui /api/ no final

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { contaPaciente, textoAnexo, nomeArquivo } = body

        if (!contaPaciente) {
            return NextResponse.json(
                { error: 'Número da conta do paciente é obrigatório' },
                { status: 400 }
            )
        }

        if (!textoAnexo) {
            return NextResponse.json(
                { error: 'Texto do anexo é obrigatório' },
                { status: 400 }
            )
        }

        // Limpar e converter contaPaciente para número inteiro
        const numeroContaLimpo = String(contaPaciente)
            .replace(/[\[\]]/g, '') // Remove colchetes
            .replace(/[^\d]/g, '')   // Remove caracteres não numéricos
            .trim()

        if (!numeroContaLimpo) {
            return NextResponse.json(
                { error: 'Número da conta do paciente inválido' },
                { status: 400 }
            )
        }

        const numeroContaInt = parseInt(numeroContaLimpo)
        if (isNaN(numeroContaInt)) {
            return NextResponse.json(
                { error: 'Número da conta do paciente deve ser um número válido' },
                { status: 400 }
            )
        }

        logger.info(`📤 [TASY] Enviando PDF - Conta: ${numeroContaInt}, Arquivo: ${nomeArquivo}`)

        // Criar AbortController para timeout manual
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 segundos

        try {
            const url = `${TASY_API_BASE}v2/ContaPaciente/UploadAnexoContaPaciente`
            logger.info(`🌐 [TASY] URL de envio: ${url}`)
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json-patch+json; x-api-version=2.0',
                },
                body: JSON.stringify({
                    numero_Conta_Paciente: numeroContaInt,
                    textoAnexo: textoAnexo
                }),
                signal: controller.signal
            })

            // Limpar timeout se a requisição foi bem-sucedida
            clearTimeout(timeoutId)

        if (!response.ok) {
            const errorText = await response.text()
            logger.error('❌ [TASY] Erro API:', response.status, response.statusText, errorText)
            return NextResponse.json(
                { 
                    error: 'Erro ao enviar PDF para o TASY',
                    details: errorText,
                    status: response.status
                },
                { status: response.status }
            )
        }

        const result = await response.text()
    logger.info(`✅ [TASY] PDF enviado - Conta: ${contaPaciente}`)

        return NextResponse.json({
            success: true,
            message: 'PDF enviado com sucesso para o TASY',
            contaPaciente: numeroContaInt,
            nomeArquivo,
            tasyResponse: result
        })

        } catch (fetchError) {
            // Limpar timeout em caso de erro
            clearTimeout(timeoutId)
            
            if (fetchError instanceof Error && fetchError.name === 'AbortError') {
                logger.error('❌ [TASY] Timeout na API')
                return NextResponse.json(
                    { error: 'Timeout ao enviar PDF para o TASY' },
                    { status: 408 }
                )
            }
            
            throw fetchError // Re-throw para ser capturado pelo catch externo
        }

    } catch (error) {
    logger.error('❌ [TASY] Erro ao enviar PDF:', error)
        
        if (error instanceof Error && error.name === 'AbortError') {
            return NextResponse.json(
                { error: 'Timeout ao enviar PDF para o TASY. Tente novamente.' },
                { status: 408 }
            )
        }

        return NextResponse.json(
            { error: 'Erro interno do servidor ao enviar PDF' },
            { status: 500 }
        )
    }
}
