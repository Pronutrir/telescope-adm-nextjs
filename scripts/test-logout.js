/**
 * 🧪 TESTE LOGOUT SERVER-SIDE
 * 
 * Script para testar o logout da API server-side
 */

async function testServerSideLogout() {
    const baseURL = 'http://localhost:3000'

    console.log('🚪 Testando Logout Server-Side...\n')

    try {
        // Passo 1: Fazer login primeiro para ter uma sessão
        console.log('📋 Passo 1: Fazendo login para criar sessão')
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
        console.log('Login Status:', loginResponse.status)

        if (!loginResponse.ok) {
            console.log('❌ Falha no login, não é possível testar logout')
            return
        }

        // Extrair session_id do cookie
        const setCookieHeader = loginResponse.headers.get('set-cookie')
        const sessionMatch = setCookieHeader?.match(/session_id=([^;]+)/)
        const sessionId = sessionMatch ? sessionMatch[1] : null

        console.log('✅ Login realizado com sucesso!')
        console.log('🍪 Session ID:', sessionId ? `${sessionId.substring(0, 10)}...` : 'Não encontrado')

        if (!sessionId) {
            console.log('❌ Session ID não encontrado no cookie')
            return
        }

        console.log('\n📋 Passo 2: Testando logout server-side')

        // Passo 2: Fazer logout com o cookie da sessão
        const logoutResponse = await fetch(`${baseURL}/api/auth/session`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `session_id=${sessionId}`
            }
        })

        console.log('Logout Status:', logoutResponse.status)

        if (logoutResponse.ok) {
            const logoutData = await logoutResponse.json()
            console.log('Logout Response:', logoutData)
            console.log('✅ Logout server-side realizado com sucesso!')

            // Verificar se o cookie foi limpo
            const logoutCookies = logoutResponse.headers.get('set-cookie')
            console.log('🍪 Cookie após logout:', logoutCookies || 'Nenhum cookie retornado')

        } else {
            const errorData = await logoutResponse.json().catch(() => ({ message: 'Erro desconhecido' }))
            console.log('❌ Erro no logout:', errorData)
        }

        console.log('\n📋 Passo 3: Testando acesso após logout (deve falhar)')

        // Passo 3: Tentar acessar endpoint protegido após logout
        const protectedResponse = await fetch(`${baseURL}/api/auth/session`, {
            method: 'GET',
            headers: {
                'Cookie': `session_id=${sessionId}`
            }
        })

        console.log('Acesso pós-logout Status:', protectedResponse.status)

        if (protectedResponse.status === 401) {
            console.log('✅ Sessão corretamente invalidada após logout!')
        } else {
            console.log('⚠️ Sessão ainda parece estar ativa após logout')
        }

    } catch (error) {
        console.error('❌ Erro no teste:', error.message)
    }
}

// Executar apenas se for chamado diretamente
if (typeof window === 'undefined') {
    testServerSideLogout()
}
