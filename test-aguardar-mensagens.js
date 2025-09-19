/**
 * Teste Simples: Apenas conectar e aguardar mensagens
 */
const { HubConnectionBuilder, LogLevel } = require('@microsoft/signalr')

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0

async function aguardarMensagens() {
    console.log('🔗 Conectando ao SignalR Hub...')

    const connection = new HubConnectionBuilder()
        .withUrl('https://localhost:44326/notify-hub')
        .configureLogging(LogLevel.Debug)  // Logs detalhados
        .withAutomaticReconnect()
        .build()

    // Mostrar todos os logs
    connection.onclose((error) => {
        console.log('🔌 Conexão fechada:', error?.message || 'Normal')
    })

    try {
        // Conectar
        console.log('🚀 Iniciando conexão...')
        await connection.start()
        console.log('✅ CONECTADO!')
        console.log('🆔 Connection ID:', connection.connectionId)
        console.log('👂 Aguardando mensagens...')
        console.log('⏰ Pressione Ctrl+C para sair\n')

        // Registrar TODOS os possíveis métodos que o servidor pode chamar
        const metodosParaTestar = [
            'ReceiveMessage',
            'receivemessage',
            'receiveMessage',
            'receive_message',
            'onMessage',
            'OnMessage',
            'message',
            'Message',
            'notify',
            'Notify',
            'alert',
            'Alert'
        ]

        metodosParaTestar.forEach(metodo => {
            connection.on(metodo, (data) => {
                const timestamp = new Date().toLocaleString()
                console.log(`\n📨 [${timestamp}] Mensagem recebida via '${metodo}':`)
                console.log('📋 Dados:', typeof data === 'string' ? data : JSON.stringify(data, null, 2))
                console.log('─'.repeat(50))
            })
        })

        // Eventos de conexão
        connection.onreconnecting(() => {
            console.log('🔄 Reconectando...')
        })

        connection.onreconnected(() => {
            console.log('✅ Reconectado!')
        })

        connection.onclose((error) => {
            if (error) {
                console.log('❌ Conexão fechada com erro:', error.message)
            } else {
                console.log('🔌 Conexão fechada')
            }
            process.exit(0)
        })

        // Testar envio se possível
        try {
            await connection.invoke('SendMessage', 'teste', 'Mensagem de teste')
            console.log('📤 Mensagem enviada!')
        } catch (e) {
            console.log('⚠️ SendMessage não disponível:', e.message)
        }

        // Aguardar mensagens
        connection.on('ReceiveMessage', (data) => {
            console.log('📨 RECEBIDO:', data)
        })

        // Manter o processo rodando
        process.stdin.resume()

    } catch (error) {
        console.error('❌ Erro ao conectar:', error.message)
        console.log('🔍 Possíveis causas:')
        console.log('   - Servidor .NET não está rodando na porta 44326')
        console.log('   - Hub path incorreto (/notify-hub)')
        console.log('   - Problema de CORS')
        console.log('   - Certificado SSL inválido')
        process.exit(1)
    }
}

// Interceptar Ctrl+C para fechar graciosamente
process.on('SIGINT', () => {
    console.log('\n🔌 Encerrando conexão...')
    process.exit(0)
})

aguardarMensagens()
