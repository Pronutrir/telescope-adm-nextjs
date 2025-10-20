/**
 * 🔧 SCRIPT DE DEBUG - MENU VISIBILITY
 * 
 * Cole este código no console do navegador (F12) para diagnosticar
 * por que apenas 3 itens estão aparecendo no menu.
 */

console.log('🔍 ===== DEBUG MENU VISIBILITY =====\n')

// 1. Verificar localStorage
const savedConfig = localStorage.getItem('menuVisibility')
console.log('📦 localStorage (menuVisibility):', savedConfig)

if (savedConfig) {
    try {
        const parsed = JSON.parse(savedConfig)
        const total = Object.keys(parsed).length
        const visible = Object.values(parsed).filter(v => v === true).length
        const hidden = total - visible
        
        console.log(`\n📊 Estatísticas:`)
        console.log(`   Total: ${total} rotas`)
        console.log(`   Visíveis: ${visible}`)
        console.log(`   Ocultas: ${hidden}`)
        console.log(`   Porcentagem oculta: ${((hidden/total)*100).toFixed(1)}%`)
        
        console.log('\n📋 Configuração detalhada:')
        Object.entries(parsed).forEach(([name, visible]) => {
            console.log(`   ${visible ? '✅' : '❌'} ${name}`)
        })
    } catch (e) {
        console.error('❌ Erro ao parsear:', e)
    }
}

// 2. SOLUÇÃO: Limpar e resetar
console.log('\n🔧 Para CORRIGIR, execute um dos comandos abaixo:\n')
console.log('// Opção 1: Limpar tudo')
console.log('localStorage.removeItem("menuVisibility"); location.reload()\n')
console.log('// Opção 2: Forçar todos visíveis')
console.log(`localStorage.setItem("menuVisibility", JSON.stringify({
    'Dashboard': true,
    'Biblioteca de Componentes': true,
    'Gerenciador de PDFs': true,
    'Bloqueios': true,
    'Médicos exclusivos': true,
    'Evolução Medica': true,
    'Stopwatch H': true,
    'Pesquisas': true,
    'Consultas': true,
    'Novos Tratamentos': true,
    'Recepcionistas': true,
    'Quimio': true,
    'Médicos': true,
    'Fila Rápida': true,
    'Avaliações': true,
    'Usuários': true,
    'Seu Perfil': true
})); location.reload()`)

console.log('\n✅ Após executar, todos os itens devem aparecer!')
