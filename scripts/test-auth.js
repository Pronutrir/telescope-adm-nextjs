/**
 * 🧪 TESTE API SERVER-SIDE
 */

async function testServerSideAuth() {
    const baseURL = 'http://localhost:3000'

    console.log('🔐 Testando API Server-Side Authentication...\n')

    try {
        // Teste 1: Login com email válido
        console.log('📋 Teste 1: Login com email válido')
        const loginResponse = await fetch(`${baseURL}/api/auth/session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'admin@telescope.com',
                password: '123456'
            })
        })

        const loginData = await loginResponse.json()
        console.log('Status:', loginResponse.status)
        console.log('Response:', loginData)

        // Verificar se recebeu cookies
        const cookies = loginResponse.headers.get('set-cookie')
        console.log('Cookies recebidos:', cookies || 'Nenhum')

        if (loginResponse.ok && loginData.success) {
            console.log('✅ Login bem-sucedido!\n')

            // Teste 2: Verificar se middleware funciona
            console.log('📋 Teste 2: Verificando proteção de rota')
            // Note: Este teste precisa ser feito no browser pois precisamos dos cookies
            console.log('ℹ️  Teste de middleware deve ser feito no browser\n')

        } else {
            console.log('❌ Login falhou')
            console.log('Motivo:', loginData.message || 'Erro desconhecido')
        }

        // Teste 3: Login com username string
        console.log('📋 Teste 3: Login com username (string livre)')
        const usernameResponse = await fetch(`${baseURL}/api/auth/session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'usuario123',  // ✅ String livre, não precisa ser email
                password: 'senha123'
            })
        })

        const usernameData = await usernameResponse.json()
        console.log('Status:', usernameResponse.status)
        console.log('Response:', usernameData)

        if (usernameResponse.ok && usernameData.success) {
            console.log('✅ Login com username string funcionando!\n')
        } else {
            console.log('ℹ️ Username string rejeitado (esperado se não estiver no modo teste)\n')
        }

        // Teste 4: Login com credenciais inválidas
        console.log('📋 Teste 4: Login com credenciais inválidas')
        const invalidResponse = await fetch(`${baseURL}/api/auth/session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'invalid@test.com',
                password: 'wrong'
            })
        })

        const invalidData = await invalidResponse.json()
        console.log('Status:', invalidResponse.status)
        console.log('Response:', invalidData)

        if (invalidResponse.status === 401) {
            console.log('✅ Rejeição de credenciais inválidas funcionando!\n')
        } else {
            console.log('⚠️ Esperava status 401 para credenciais inválidas\n')
        }

        // Teste 5: Strings vazias ou inválidas
        console.log('📋 Teste 5: Validação de strings vazias')
        const emptyResponse = await fetch(`${baseURL}/api/auth/session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: '   ',  // String vazia com espaços
                password: ''   // String vazia
            })
        })

        const emptyData = await emptyResponse.json()
        console.log('Status:', emptyResponse.status)
        console.log('Response:', emptyData)

        if (emptyResponse.status === 400) {
            console.log('✅ Validação de strings vazias funcionando!\n')
        } else {
            console.log('⚠️ Esperava status 400 para strings vazias\n')
        }

    } catch (error) {
        console.error('❌ Erro no teste:', error.message)
    }
}

// Executar apenas se for chamado diretamente
if (typeof window === 'undefined') {
    testServerSideAuth()
}
