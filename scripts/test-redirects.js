/**
 * 🧪 TESTE REDIRECIONAMENTOS SERVER-SIDE
 * 
 * Script para testar todos os redirecionamentos para server-login
 */

async function testRedirects() {
    const baseURL = 'http://localhost:3000'

    console.log('🔄 Testando Redirecionamentos Server-Side...\n')

    try {
        // Teste 1: Rota raiz sem autenticação
        console.log('📋 Teste 1: Acessando rota raiz (/) sem autenticação')
        const rootResponse = await fetch(`${baseURL}/`, {
            method: 'GET',
            redirect: 'manual' // Não seguir redirecionamentos automaticamente
        })

        console.log('Status:', rootResponse.status)
        if (rootResponse.status === 302 || rootResponse.status === 307) {
            const location = rootResponse.headers.get('location')
            console.log('Redirecionado para:', location)

            if (location?.includes('/auth/server-login')) {
                console.log('✅ Rota raiz redirecionando corretamente para server-login!')
            } else {
                console.log('❌ Rota raiz não está redirecionando para server-login')
            }
        }

        console.log('\n📋 Teste 2: Acessando rota protegida (/admin) sem autenticação')
        const adminResponse = await fetch(`${baseURL}/admin`, {
            method: 'GET',
            redirect: 'manual'
        })

        console.log('Status:', adminResponse.status)
        if (adminResponse.status === 302 || adminResponse.status === 307) {
            const location = adminResponse.headers.get('location')
            console.log('Redirecionado para:', location)

            if (location?.includes('/auth/server-login')) {
                console.log('✅ Rota /admin redirecionando corretamente para server-login!')
            } else {
                console.log('❌ Rota /admin não está redirecionando para server-login')
            }
        }

        console.log('\n📋 Teste 3: Verificando se server-login está acessível')
        const serverLoginResponse = await fetch(`${baseURL}/auth/server-login`)
        console.log('Server-login Status:', serverLoginResponse.status)

        if (serverLoginResponse.ok) {
            console.log('✅ Página server-login acessível!')
        } else {
            console.log('❌ Página server-login com problemas')
        }

        console.log('\n📋 Teste 4: Verificando se login original ainda funciona')
        const originalLoginResponse = await fetch(`${baseURL}/auth/login`)
        console.log('Login original Status:', originalLoginResponse.status)

        if (originalLoginResponse.ok) {
            console.log('✅ Página login original ainda funciona!')
        } else {
            console.log('❌ Página login original com problemas')
        }

        console.log('\n✅ Testes de redirecionamento concluídos!')
        console.log('\nℹ️  Para teste completo:')
        console.log('   1. Acesse: http://localhost:3000/')
        console.log('   2. Deve redirecionar automaticamente para: http://localhost:3000/auth/server-login')
        console.log('   3. Faça login e teste o logout pelo navbar')

    } catch (error) {
        console.error('❌ Erro no teste:', error.message)
    }
}

// Executar apenas se for chamado diretamente
if (typeof window === 'undefined') {
    testRedirects()
}
