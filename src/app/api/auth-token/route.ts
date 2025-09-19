import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://servicesapp.pronutrir.com.br'

export async function POST(request: NextRequest) {
    try {
        const username = process.env.USERSHIELD_USERNAME
        const password = process.env.USERSHIELD_PASSWORD

        if (!username || !password) {
            return NextResponse.json({
                success: false,
                error: 'Credenciais não configuradas no servidor',
                type: 'config_error',
                timestamp: new Date().toISOString()
            }, { status: 500 })
        }

        console.log('🔐 Obtendo token para SignalR...')

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
            
            return NextResponse.json({
                success: false,
                error: `Erro de autenticação: ${response.status} ${response.statusText}`,
                details: errorText,
                timestamp: new Date().toISOString()
            }, { status: response.status })
        }

        const data = await response.json()
        const token = data?.token || data?.jwtToken

        if (token) {
            console.log('✅ Token para SignalR obtido com sucesso')
            return NextResponse.json({
                success: true,
                token,
                message: data.mensagem,
                timestamp: new Date().toISOString()
            })
        } else {
            console.error('❌ Token não encontrado na resposta')
            console.error('Resposta:', data)
            
            return NextResponse.json({
                success: false,
                error: 'Token não encontrado na resposta da API',
                details: data,
                timestamp: new Date().toISOString()
            }, { status: 502 })
        }

    } catch (error: any) {
        console.error('❌ Erro interno ao obter token:', {
            message: error.message,
            stack: error.stack
        })
        
        return NextResponse.json({
            success: false,
            error: `Erro interno: ${error.message}`,
            type: 'internal_error',
            timestamp: new Date().toISOString()
        }, { status: 500 })
    }
}