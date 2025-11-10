import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { getServiceUrl } from '@/config/env'

const TASY_API_BASE = getServiceUrl('APITASY') // Já inclui /api/ no final

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const numeroAtendimento = searchParams.get('numeroAtendimento')

        if (!numeroAtendimento) {
            return NextResponse.json(
                { error: 'Número de atendimento é obrigatório' },
                { status: 400 }
            )
        }

        logger.info(`🔍 [TASY] Buscando número da guia para atendimento: ${numeroAtendimento}`)

        // Criar AbortController para timeout manual
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos

        try {
            const url = `${TASY_API_BASE}/v2/ContaPaciente/GetAtendimentoCategoriaConvenio?Numero_Atendimento=${numeroAtendimento}`
            logger.info(`🌐 [TASY] URL completa: ${url}`)
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                },
                signal: controller.signal
            })

            // Limpar timeout se a requisição foi bem-sucedida
            clearTimeout(timeoutId)

            if (!response.ok) {
                logger.error('❌ [TASY] Erro API:', response.status, response.statusText)
                return NextResponse.json(
                    { error: 'Erro ao buscar número da guia' },
                    { status: response.status }
                )
            }

            const data = await response.json() // A API retorna um objeto ou array

            logger.info('✅ [TASY] Resposta recebida:', data)

            // Verificar se é um array e pegar o primeiro item, ou se é um objeto direto
            let guiaInfo = null
            
            if (Array.isArray(data) && data.length > 0) {
                guiaInfo = data[0]
            } else if (data && typeof data === 'object' && !Array.isArray(data)) {
                guiaInfo = data
            }

            if (guiaInfo) {
                const numeroGuia = guiaInfo.nR_DOC_CONVENIO

                if (!numeroGuia) {
                    logger.warn('⚠️ [TASY] nR_DOC_CONVENIO não encontrado na resposta')
                    logger.warn('⚠️ [TASY] Campos disponíveis:', Object.keys(guiaInfo))
                    return NextResponse.json(
                        { error: 'Número da guia não encontrado' },
                        { status: 404 }
                    )
                }

                return NextResponse.json({
                    numeroAtendimento,
                    numeroGuia: String(numeroGuia),
                })
            }

            // Se não houver resultados
            logger.warn('⚠️ [TASY] Nenhuma guia encontrada para o atendimento')
            return NextResponse.json(
                { error: 'Guia não encontrada' },
                { status: 404 }
            )
            
        } catch (fetchError) {
            // Limpar timeout em caso de erro
            clearTimeout(timeoutId)
            
            if (fetchError instanceof Error && fetchError.name === 'AbortError') {
                logger.error('❌ [TASY] Timeout na API')
                return NextResponse.json(
                    { error: 'Timeout ao buscar número da guia' },
                    { status: 408 }
                )
            }
            
            throw fetchError // Re-throw para ser capturado pelo catch externo
        }

    } catch (error) {
        logger.error('❌ [TASY] Erro ao buscar número da guia:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
