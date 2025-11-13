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

        logger.info(`🔍 [TASY] Buscando conta para atendimento: ${numeroAtendimento}`)

        // Criar AbortController para timeout manual
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos

        try {
            const url = `${TASY_API_BASE}/v2/ContaPaciente/GetContaPaciente?Numero_Atendimento=${numeroAtendimento}`
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
                    { error: 'Erro ao buscar conta do paciente' },
                    { status: response.status }
                )
            }

            const data = await response.json() // A API retorna um array de objetos

            logger.info('✅ [TASY] Resposta recebida:', data)

            // Verificar se é um array com resultados
            if (Array.isArray(data) && data.length > 0) {
                // Extrair todas as contas do array
                const contas = data
                    .map((item: any) => item.numerO_CONTA)
                    .filter((conta: any) => conta !== null && conta !== undefined)
                    .map(String)

                if (contas.length === 0) {
                    logger.warn('⚠️ [TASY] Nenhuma conta válida encontrada na resposta')
                    return NextResponse.json(
                        { error: 'Conta não encontrada' },
                        { status: 404 }
                    )
                }

                logger.info(`✅ [TASY] ${contas.length} conta(s) encontrada(s):`, contas)

                // Retornar array de contas
                return NextResponse.json({
                    numeroAtendimento,
                    contasPaciente: contas,
                })
            }

            // Se não houver resultados
            logger.warn('⚠️ [TASY] Nenhuma conta encontrada para o atendimento')
            return NextResponse.json(
                { error: 'Conta não encontrada' },
                { status: 404 }
            )
        
        } catch (fetchError) {
            // Limpar timeout em caso de erro
            clearTimeout(timeoutId)
            
            if (fetchError instanceof Error && fetchError.name === 'AbortError') {
                logger.error('❌ [TASY] Timeout na API')
                return NextResponse.json(
                    { error: 'Timeout ao buscar conta do paciente' },
                    { status: 408 }
                )
            }
            
            throw fetchError // Re-throw para ser capturado pelo catch externo
        }

    } catch (error) {
    logger.error('❌ [TASY] Erro ao buscar conta paciente:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
