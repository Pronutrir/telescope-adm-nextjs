#!/usr/bin/env tsx

import { loadEnvironmentConfig, logEnvironmentSummary } from '../src/config/environment'
import { RedisValidator } from '../src/tests/redis-validator'
import { redisEnvironments, getAllEnvironments, getEnvironment } from '../src/config/redis-environments'

// Carrega as configurações de ambiente no início
loadEnvironmentConfig()

async function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'both'

  console.log('🚀 Iniciando testes Redis...\n')

  const validator = new RedisValidator()
  let results

  try {
    switch (command.toLowerCase()) {
      case 'local':
        console.log('🎯 Testando apenas ambiente LOCAL\n')
        results = [await validator.validateEnvironment(redisEnvironments.local)]
        break

      case 'production':
      case 'prod':
        console.log('🎯 Testando apenas ambiente PRODUÇÃO\n')
        results = [await validator.validateEnvironment(redisEnvironments.production)]
        break

      case 'both':
      case 'all':
        console.log('🎯 Testando TODOS os ambientes\n')
        results = await validator.validateMultipleEnvironments(getAllEnvironments())
        break

      default:
        console.log('❌ Comando inválido. Use: local, production, ou both')
        process.exit(1)
    }

    // Gerar e exibir relatório
    const report = validator.generateReport(results)
    console.log(report)

    // Exit code baseado nos resultados
    const allSuccess = results.every(r => r.overall)
    process.exit(allSuccess ? 0 : 1)

  } catch (error) {
    console.error('❌ Erro durante os testes:', error)
    process.exit(1)
  }
}

// Verificar se está sendo executado diretamente
if (require.main === module) {
  main().catch(console.error)
}

export { main }