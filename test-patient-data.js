/**
 * Script de teste para enviar dados no novo formato para webhook-monitor
 * Simula dados de paciente com sinais vitais
 */
const { HubConnectionBuilder } = require('@microsoft/signalr')

const dadosExemplo = {
    cD_PACIENTE: '208439',
    nM_PACIENTE: 'sicrano teste 02',
    comparacaoDtos: [
        {
            nR_SEQUENCIA: 166144,
            dT_SINAL_VITAL: '2023-05-11T15:33:54',
            qT_SATURACAO_O2: 80,
            qT_TEMP: 36.9,
            qT_PESO: 109.6,
            qT_ALTURA_CM: 160,
            diferencaPercentual: 0,
            alteracaoMaior10: false
        },
        {
            nR_SEQUENCIA: 233015,
            dT_SINAL_VITAL: '2024-08-14T09:52:47',
            qT_SATURACAO_O2: 83,
            qT_TEMP: 37.5,
            qT_PESO: 113.3,
            qT_ALTURA_CM: 160,
            diferencaPercentual: 3.375912408759124,
            alteracaoMaior10: false
        },
        {
            nR_SEQUENCIA: 276285,
            dT_SINAL_VITAL: new Date().toISOString(), // Data atual para simular dado recente
            qT_SATURACAO_O2: 88,
            qT_TEMP: 38.5,
            qT_PESO: 105,
            qT_ALTURA_CM: 160,
            diferencaPercentual: 15.5, // Alta diferença percentual
            alteracaoMaior10: true // Alteração crítica
        }
    ]
}

async function testarWebhookMonitor() {
    console.log('🩺 Testando Monitor de Sinais Vitais')
    console.log('='.repeat(60))
    console.log(`📋 Paciente: ${dadosExemplo.nM_PACIENTE}`)
    console.log(`🆔 ID: ${dadosExemplo.cD_PACIENTE}`)
    console.log(`📊 Sinais vitais: ${dadosExemplo.comparacaoDtos.length}`)
    console.log('')

    const connection = new HubConnectionBuilder()
        .withUrl('https://servicesapp.pronutrir.com.br/apitasy/notify-hub')
        .withAutomaticReconnect()
        .build()

    try {
        console.log('🔌 Conectando ao SignalR Hub...')
        await connection.start()
        console.log('✅ Conectado!')
        console.log(`🆔 Connection ID: ${connection.connectionId}`)

        // Configurar listener para verificar se as mensagens estão sendo recebidas
        connection.on('ReceiveMessage', (data) => {
            console.log('📨 Confirmação de recebimento:', typeof data === 'string' ? data.substring(0, 100) : 'Objeto recebido')
        })

        console.log('\n📤 Enviando dados do paciente...')

        // Testar diferentes métodos de envio
        const metodosParaTestar = [
            'SendMessage',
            'PatientData',
            'SinaisVitais',
            'MonitorData'
        ]

        let sucesso = false

        for (const metodo of metodosParaTestar) {
            try {
                console.log(`\n🧪 Testando método: ${metodo}`)

                await connection.invoke(metodo, dadosExemplo)
                console.log(`✅ ${metodo} - Dados enviados com sucesso!`)
                sucesso = true

                // Aguardar um pouco entre os envios
                await new Promise(resolve => setTimeout(resolve, 2000))

            } catch (error) {
                console.log(`❌ ${metodo} - ERRO: ${error.message}`)
            }
        }

        if (sucesso) {
            console.log('\n🎉 Pelo menos um método funcionou!')
            console.log('💡 Verifique a página: http://localhost:3000/webhook-monitor')
        } else {
            console.log('\n⚠️ Nenhum método de envio funcionou')
            console.log('💡 O hub pode não ter métodos de envio configurados')
        }

        console.log('\n⏰ Mantendo conexão ativa por 30 segundos para monitorar...')
        console.log('   Use Ctrl+C para interromper')

        await new Promise(resolve => setTimeout(resolve, 30000))

    } catch (error) {
        console.error('❌ Erro na conexão:', error.message)
    } finally {
        try {
            await connection.stop()
            console.log('\n🔚 Conexão encerrada')
        } catch (stopError) {
            console.error('❌ Erro ao fechar conexão:', stopError.message)
        }
    }
}

// Interceptar Ctrl+C
process.on('SIGINT', () => {
    console.log('\n🛑 Teste interrompido pelo usuário')
    process.exit(0)
})

console.log('💡 Instruções para teste:')
console.log('1. Abra http://localhost:3000/webhook-monitor no navegador')
console.log('2. Execute este script para enviar dados de teste')
console.log('3. Observe os dados sendo exibidos em tempo real na página')
console.log('4. Verifique os diferentes níveis de criticidade dos sinais')
console.log('')
console.log('🚨 Dados incluem:')
console.log('   - Saturação O2 baixa (80-88%) - Crítico')
console.log('   - Temperatura elevada (38.5°C) - Alerta')
console.log('   - Alteração >10% detectada - Crítico')
console.log('')
console.log('🚀 Iniciando teste em 3 segundos...')

setTimeout(() => {
    testarWebhookMonitor()
}, 3000)
