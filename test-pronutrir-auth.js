// Script de teste para verificar autenticação automática da API Pronutrir
const dotenv = require('dotenv')

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' })

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://servicesapp.pronutrir.com.br'

async function testPronutrirAuth() {
    console.log('🔐 Testando autenticação automática da API Pronutrir...')
    console.log(`📡 URL Base: ${API_BASE_URL}`)

    const username = process.env.PRONUTRIR_USERNAME
    const password = process.env.PRONUTRIR_PASSWORD

    console.log(`👤 Usuário: ${username}`)
    console.log(`🔑 Senha: ${password ? '****' : 'NÃO CONFIGURADA'}`)

    if (!username || !password) {
        console.error('❌ PRONUTRIR_USERNAME ou PRONUTRIR_PASSWORD não configurados')
        return
    }

    try {
        console.log('\n📤 Fazendo login...')

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

        console.log(`📊 Status: ${response.status} ${response.statusText}`)

        if (!response.ok) {
            const errorText = await response.text()
            console.error('❌ Erro na autenticação:')
            console.error('Resposta:', errorText)
            return
        }

        const data = await response.json()

        const token = data?.token || data?.jwtToken
        if (token) {
            console.log('✅ Login bem-sucedido!')
            console.log(`🎫 Token obtido: ${token.substring(0, 50)}...`)
            console.log(`💬 Mensagem: ${data.mensagem || 'N/A'}`)
            console.log(`👤 ID Usuário: ${data.idUsuario || 'N/A'}`)
            console.log(`⏰ Data de criação: ${new Date().toISOString()}`)

            if (data.refreshToken) {
                console.log(`🔄 Refresh token: ${data.refreshToken.substring(0, 30)}...`)
            }

            console.log('\n🧪 Testando API com token...')
            return await testAPIWithToken(token)
        } else {
            console.error('❌ Token não encontrado na resposta')
            console.log('Resposta completa:', data)
        }

    } catch (error) {
        console.error('❌ Erro ao fazer login:', error.message)
    }
}

async function testAPIWithToken(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/apitasy/api/v1/SinaisVitaisMonitoracaoGeral/GetAlertaSinaisVitaisPaciente`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'User-Agent': 'Telescope-ADM/1.0',
            },
        })

        console.log(`📊 API Status: ${response.status} ${response.statusText}`)

        if (response.ok) {
            const data = await response.json()
            console.log('✅ API funcionando!')
            console.log(`📋 Dados recebidos: ${Array.isArray(data) ? data.length : 'N/A'} registros`)

            if (Array.isArray(data) && data.length > 0) {
                console.log('👤 Primeiro paciente:', data[0].nM_PACIENTE || 'Nome não disponível')
            }
        } else {
            const errorText = await response.text()
            console.error('❌ Erro na API:')
            console.error(errorText)
        }

    } catch (error) {
        console.error('❌ Erro ao testar API:', error.message)
    }
}

// Executar teste
testPronutrirAuth().then(() => {
    console.log('\n🏁 Teste concluído')
}).catch(error => {
    console.error('❌ Erro no teste:', error)
})