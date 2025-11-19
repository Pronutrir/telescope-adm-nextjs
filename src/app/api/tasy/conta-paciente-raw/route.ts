import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { getServiceUrl } from '@/config/env'

const TASY_API_BASE = getServiceUrl('APITASY')

/**
 * API Route que retorna os dados RAW (sem processamento) da API TASY
 * Usado para buscar informações completas da conta do paciente
 */
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

        logger.info(`🔍 [TASY RAW] Buscando dados completos para atendimento: ${numeroAtendimento}`)

        // Criar AbortController para timeout manual
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos

        try {
            const url = `${TASY_API_BASE}/api/v2/ContaPaciente/GetContaPaciente?Numero_Atendimento=${numeroAtendimento}`
            logger.info(`🌐 [TASY RAW] URL completa: ${url}`)
            
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
                logger.error('❌ [TASY RAW] Erro API:', response.status, response.statusText)
                return NextResponse.json(
                    { error: 'Erro ao buscar dados da conta' },
                    { status: response.status }
                )
            }

            const data = await response.json()
            logger.info('✅ [TASY RAW] Resposta recebida:', data)

            // Retornar os dados RAW da API externa
            return NextResponse.json(data)
        
        } catch (fetchError) {
            // Limpar timeout em caso de erro
            clearTimeout(timeoutId)
            
            if (fetchError instanceof Error && fetchError.name === 'AbortError') {
                logger.error('❌ [TASY RAW] Timeout na API')
                return NextResponse.json(
                    { error: 'Timeout ao buscar dados da conta' },
                    { status: 408 }
                )
            }
            
            throw fetchError // Re-throw para ser capturado pelo catch externo
        }

    } catch (error) {
        logger.error('❌ [TASY RAW] Erro ao buscar dados da conta:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
