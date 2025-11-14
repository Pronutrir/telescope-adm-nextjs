import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { getServiceUrl } from '@/config/env'

const TASY_API_BASE = getServiceUrl('APITASY')

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
            const url = `${TASY_API_BASE}/api/v2/ContaPaciente/GetContaPaciente?Numero_Atendimento=${numeroAtendimento}`
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

            const data = await response.json() // A API retorna um array

            logger.info('✅ [TASY] Resposta recebida:', data)

            // Verificar se é um array com resultados
            if (Array.isArray(data) && data.length > 0) {
                const primeiraGuia = data[0]
                
                // Tentar nR_GUIA_PRINC_CONV primeiro, depois nR_GUIA_PRINC
                const numeroGuia = primeiraGuia.nR_GUIA_PRINC_CONV || primeiraGuia.nR_GUIA_PRINC
                const numeroProtocolo = primeiraGuia.numerO_PROTOCOLO

                if (!numeroGuia && !numeroProtocolo) {
                    logger.warn('⚠️ [TASY] Número da guia e protocolo não encontrados na resposta')
                    logger.warn('⚠️ [TASY] Campos disponíveis:', Object.keys(primeiraGuia))
                    return NextResponse.json(
                        { error: 'Número da guia e protocolo não encontrados' },
                        { status: 404 }
                    )
                }

                logger.info(`✅ [TASY] Dados encontrados - Guia: ${numeroGuia || 'N/A'}, Protocolo: ${numeroProtocolo || 'N/A'}`)

                return NextResponse.json({
                    numeroAtendimento,
                    numeroGuia: numeroGuia ? String(numeroGuia) : null,
                    numeroProtocolo: numeroProtocolo ? String(numeroProtocolo) : null,
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
