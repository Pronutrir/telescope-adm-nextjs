import { NextResponse } from 'next/server'
import { requireApiBaseUrl } from '@/config/env'
import { logger } from '@/lib/logger'

// Função para obter token de autenticação usando credenciais do servidor
async function getAuthToken(): Promise<string | null> {
    const username = process.env.USERSHIELD_USERNAME
    const password = process.env.USERSHIELD_PASSWORD

    if (!username || !password) {
        logger.error('USERSHIELD_USERNAME ou USERSHIELD_PASSWORD não configurados')
        return null
    }

    try {
        const API_BASE_URL = requireApiBaseUrl()
        const response = await fetch(`${API_BASE_URL}/usershield/api/v1/Auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                userName: username,
                password: password,
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            logger.error('Erro ao obter token:', response.status, response.statusText, 'Detalhes:', errorText)
            return null
        }

        const data = await response.json()
        const token = data?.token || data?.jwtToken

        if (token) {
            logger.info('Token obtido com sucesso via servidor')
            return token
        } else {
            logger.error('Token não encontrado na resposta da API', 'Resposta:', data)
            return null
        }

    } catch (error: any) {
        logger.error('Erro ao obter token de autenticação:', error.message)
        return null
    }
}

export async function GET() {
    try {
        // Permitir TLS inseguro somente em desenvolvimento quando explicitamente habilitado
        if (process.env.NODE_ENV === 'development' && process.env.DEV_ALLOW_INSECURE_TLS === '1') {
            if (process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0') {
                process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
                logger.warn('DEV TLS: NODE_TLS_REJECT_UNAUTHORIZED=0 habilitado para desenvolvimento')
            }
        }
        
        logger.info('Obtendo token para buscar dados iniciais...')
        
        // Obter token de autenticação
        const token = await getAuthToken()
        
        if (!token) {
            return NextResponse.json({
                success: false,
                error: 'Falha na autenticação: configure USERSHIELD_USERNAME e USERSHIELD_PASSWORD',
                type: 'auth_error',
                timestamp: new Date().toISOString()
            }, { status: 401 })
        }

        logger.info('Token obtido, buscando dados da API...')

        // Buscar dados da API externa - URL específica para sinais vitais
        const sinaisVitaisUrl = process.env.NODE_ENV === 'development' 
            ? process.env.DEV_SINAIS_VITAIS_URL
            : `${requireApiBaseUrl()}/apitasy/api/v1/SinaisVitaisMonitoracaoGeral/GetAlertaSinaisVitaisPaciente`
        
        if (!sinaisVitaisUrl) {
            throw new Error('DEV_SINAIS_VITAIS_URL não configurada para ambiente de desenvolvimento. Configure no .env.local')
        }
        
        logger.info(`Fazendo request para: ${sinaisVitaisUrl}`)
        
        const response = await fetch(sinaisVitaisUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'User-Agent': 'Telescope-ADM/1.0',
            },
            // Configurações adicionais
            cache: 'no-store', // Não usar cache
        })

        logger.debug('API Response Status:', response.status, response.statusText)
        
        if (!response.ok) {
            // Log mais detalhado para debug
            const errorText = await response.text().catch(() => 'Sem detalhes do erro')
            logger.error('API Error Details:', { status: response.status, statusText: response.statusText, headers: Object.fromEntries(response.headers.entries()), body: errorText })

            return NextResponse.json({
                success: false,
                error: `Erro na API externa: ${response.status} ${response.statusText}`,
                details: errorText,
                timestamp: new Date().toISOString()
            }, { status: response.status })
        }

        const data = await response.json()
        logger.info('API Success: Recebidos registros', { count: Array.isArray(data) ? data.length : 'N/A' })

        return NextResponse.json({
            success: true,
            data,
            timestamp: new Date().toISOString()
        })

    } catch (error: any) {
        logger.error('Erro interno ao buscar dados:', { message: error.message, stack: error.stack, cause: error.cause })
        
        return NextResponse.json({
            success: false,
            error: `Erro interno: ${error.message}`,
            type: 'internal_error',
            timestamp: new Date().toISOString()
        }, { status: 500 })
    }
}