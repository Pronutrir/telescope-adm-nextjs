// Script para testar as APIs server-side com as credenciais do USERSHIELD
const dotenv = require('dotenv')

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' })

async function testServerAPIs() {
    console.log('🧪 Testando APIs server-side com credenciais USERSHIELD...')
    console.log(`👤 Usuário: ${process.env.USERSHIELD_USERNAME}`)
    console.log(`🔑 Senha: ${process.env.USERSHIELD_PASSWORD ? '****' : 'NÃO CONFIGURADA'}`)
    console.log()

    try {
        // Teste 1: API de token para SignalR
        console.log('🔑 Testando API de token para SignalR...')
        const tokenResponse = await fetch('http://localhost:3000/api/auth-token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
        })

        console.log(`📊 Status Token API: ${tokenResponse.status} ${tokenResponse.statusText}`)

        if (tokenResponse.ok) {
            const tokenResult = await tokenResponse.json()
            if (tokenResult.success && tokenResult.token) {
                console.log('✅ Token obtido com sucesso!')
                console.log(`🎫 Token: ${tokenResult.token.substring(0, 50)}...`)
                console.log()

                // Teste 2: API de dados iniciais
                console.log('📊 Testando API de dados iniciais...')
                const dataResponse = await fetch('http://localhost:3000/api/initial-data', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                })

                console.log(`📊 Status Data API: ${dataResponse.status} ${dataResponse.statusText}`)

                if (dataResponse.ok) {
                    const dataResult = await dataResponse.json()
                    if (dataResult.success && Array.isArray(dataResult.data)) {
                        console.log('✅ Dados obtidos com sucesso!')
                        console.log(`📋 Total de pacientes: ${dataResult.data.length}`)

                        if (dataResult.data.length > 0) {
                            console.log(`👤 Primeiro paciente: ${dataResult.data[0].nM_PACIENTE}`)
                            console.log(`🩺 Sinais vitais: ${dataResult.data[0].comparacaoDtos?.length || 0}`)
                        }
                    } else {
                        console.error('❌ Dados não obtidos:', dataResult.error)
                    }
                } else {
                    const errorText = await dataResponse.text()
                    console.error('❌ Erro na API de dados:', errorText)
                }

            } else {
                console.error('❌ Token não obtido:', tokenResult.error)
            }
        } else {
            const errorText = await tokenResponse.text()
            console.error('❌ Erro na API de token:', errorText)
        }

    } catch (error) {
        console.error('❌ Erro no teste:', error.message)
    }
}

console.log('🚀 Iniciando teste das APIs server-side...')
console.log('Certifique-se de que o servidor Next.js está rodando em http://localhost:3000')
console.log()

testServerAPIs().then(() => {
    console.log('\n🏁 Teste concluído')
}).catch(error => {
    console.error('❌ Erro fatal no teste:', error)
})