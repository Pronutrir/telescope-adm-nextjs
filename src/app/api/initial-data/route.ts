import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://servicesapp.pronutrir.com.br'

// Função para obter token de autenticação usando credenciais do servidor
async function getAuthToken(): Promise<string | null> {
    const username = process.env.USERSHIELD_USERNAME
    const password = process.env.USERSHIELD_PASSWORD

    if (!username || !password) {
        console.error('❌ USERSHIELD_USERNAME ou USERSHIELD_PASSWORD não configurados')
        return null
    }

    try {
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
            console.error(`❌ Erro ao obter token: ${response.status} ${response.statusText}`)
            console.error('Detalhes:', errorText)
            return null
        }

        const data = await response.json()
        const token = data?.token || data?.jwtToken

        if (token) {
            console.log('✅ Token obtido com sucesso via servidor')
            return token
        } else {
            console.error('❌ Token não encontrado na resposta da API')
            console.error('Resposta:', data)
            return null
        }

    } catch (error: any) {
        console.error('❌ Erro ao obter token de autenticação:', error.message)
        return null
    }
}

export async function GET(request: NextRequest) {
    try {
        console.log('🔐 Obtendo token para buscar dados iniciais...')
        
        // Obter token de autenticação
        const token = await getAuthToken()
        
        if (!token) {
            return NextResponse.json({
                success: false,
                error: 'Falha na autenticação: Configure PRONUTRIR_USERNAME e PRONUTRIR_PASSWORD',
                type: 'auth_error',
                timestamp: new Date().toISOString()
            }, { status: 401 })
        }

        console.log('✅ Token obtido, buscando dados da API...')

        // Buscar dados da API externa
        const response = await fetch(`${API_BASE_URL}/apitasy/api/v1/SinaisVitaisMonitoracaoGeral/GetAlertaSinaisVitaisPaciente`, {
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

        console.log(`📊 API Response Status: ${response.status} ${response.statusText}`)
        
        if (!response.ok) {
            // Log mais detalhado para debug
            const errorText = await response.text().catch(() => 'Sem detalhes do erro')
            console.error(`❌ API Error Details:`, {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                body: errorText
            })

            return NextResponse.json({
                success: false,
                error: `Erro na API externa: ${response.status} ${response.statusText}`,
                details: errorText,
                timestamp: new Date().toISOString()
            }, { status: response.status })
        }

        const data = await response.json()
        console.log(`✅ API Success: Recebidos ${Array.isArray(data) ? data.length : 'N/A'} registros`)

        return NextResponse.json({
            success: true,
            data,
            timestamp: new Date().toISOString()
        })

    } catch (error: any) {
        console.error('❌ Erro interno ao buscar dados:', {
            message: error.message,
            stack: error.stack,
            cause: error.cause
        })
        
        return NextResponse.json({
            success: false,
            error: `Erro interno: ${error.message}`,
            type: 'internal_error',
            timestamp: new Date().toISOString()
        }, { status: 500 })
    }
}