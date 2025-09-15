/**
 * 🔧 TESTE SIMPLES DE REDIS
 */

const Redis = require('ioredis')

async function testRedis() {
    const redis = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        lazyConnect: true,
    })

    try {
        console.log('🔌 Conectando ao Redis...')
        await redis.ping()
        console.log('✅ Redis conectado com sucesso!')

        // Teste de escrita/leitura
        await redis.set('test_key', 'test_value')
        const value = await redis.get('test_key')
        console.log(`📝 Teste de escrita/leitura: ${value}`)

        // Limpar teste
        await redis.del('test_key')
        console.log('🧹 Teste limpo')

        await redis.disconnect()
        console.log('🔌 Desconectado do Redis')

        process.exit(0)
    } catch (error) {
        console.error('❌ Erro ao conectar com Redis:', error.message)
        process.exit(1)
    }
}

testRedis()
