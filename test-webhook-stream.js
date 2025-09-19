// Script para testar a API webhook-stream diretamente
const dotenv = require('dotenv')

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' })

async function testWebhookStream() {
    console.log('🧪 Testando webhook-stream API...')

    try {
        console.log('📡 Fazendo requisição para /api/webhook-stream...')

        const response = await fetch('http://localhost:3000/api/webhook-stream', {
            method: 'GET',
            headers: {
                'Accept': 'text/event-stream',
                'Cache-Control': 'no-cache',
            },
        })

        console.log(`📊 Status: ${response.status} ${response.statusText}`)
        console.log('📋 Headers:', Object.fromEntries(response.headers.entries()))

        if (!response.ok) {
            const errorText = await response.text()
            console.error('❌ Erro na API webhook-stream:')
            console.error(errorText)
            return
        }

        if (!response.body) {
            console.error('❌ Resposta não contém body stream')
            return
        }

        console.log('✅ Conexão estabelecida! Aguardando mensagens...')

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        let messageCount = 0
        const maxMessages = 10 // Limitar para não ficar infinito

        while (messageCount < maxMessages) {
            const { value, done } = await reader.read()

            if (done) {
                console.log('🏁 Stream finalizado')
                break
            }

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.substring(6))
                        messageCount++

                        console.log(`📨 [${messageCount}] ${new Date().toLocaleTimeString()}:`)
                        console.log(`   Tipo: ${data.type}`)
                        console.log(`   Status: ${data.status || 'N/A'}`)
                        console.log(`   Mensagem: ${data.message}`)

                        if (data.error) {
                            console.log(`   ❌ Erro: ${data.error}`)
                        }

                        if (data.connectionId) {
                            console.log(`   🔗 ID: ${data.connectionId}`)
                        }

                        console.log()

                    } catch (error) {
                        console.error('❌ Erro ao parsear JSON:', error.message)
                        console.error('Raw data:', line)
                    }
                }
            }
        }

        reader.releaseLock()
        console.log(`✅ Teste concluído - ${messageCount} mensagens processadas`)

    } catch (error) {
        console.error('❌ Erro no teste:', error.message)
    }
}

console.log('🚀 Iniciando teste do webhook-stream...')
console.log('Certifique-se de que o servidor Next.js está rodando em http://localhost:3000')
console.log()

testWebhookStream().catch(error => {
    console.error('❌ Erro fatal no teste:', error)
})