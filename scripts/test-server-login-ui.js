/**
 * 🧪 TESTE UI SERVER-SIDE LOGIN
 * 
 * Script para testar a interface de login server-side
 */

async function testServerLoginUI() {
    const baseURL = 'http://localhost:3000'

    console.log('🎨 Testando Interface Server-Side Login...\n')

    try {
        // Teste 1: Verificar se a página carrega
        console.log('📋 Teste 1: Verificando se a página carrega')
        const pageResponse = await fetch(`${baseURL}/auth/server-login`)
        console.log('Status da página:', pageResponse.status)

        if (pageResponse.ok) {
            console.log('✅ Página server-login carregando corretamente!')
            console.log('🌐 Acesse: http://localhost:3000/auth/server-login')
        } else {
            console.log('❌ Erro ao carregar página')
        }

        console.log('\n📋 Teste 2: Testando login via interface')
        console.log('ℹ️  Para testar a interface:')
        console.log('   1. Acesse: http://localhost:3000/auth/server-login')
        console.log('   2. Use as credenciais:')
        console.log('      • Admin: admin@telescope.com + qualquer senha')
        console.log('      • User: usuario123 + qualquer senha')
        console.log('      • Email: test@telescope.com + qualquer senha')
        console.log('   3. Verifique se o design é igual ao login original')
        console.log('   4. Teste notificações de erro e sucesso\n')

        console.log('✅ Interface disponível para teste manual!')

    } catch (error) {
        console.error('❌ Erro no teste:', error.message)
    }
}

// Executar apenas se for chamado diretamente
if (typeof window === 'undefined') {
    testServerLoginUI()
}
