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

            const contaPaciente = await response.text() // A API retorna apenas o número como string


        return NextResponse.json({
            numeroAtendimento,
            contaPaciente: contaPaciente.replace(/"/g, ''), // Remove aspas se houver
        })
        
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
