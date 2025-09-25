#!/usr/bin/env tsx

import { loadEnvironmentConfig, logEnvironmentSummary } from '../src/config/environment'
import { redisEnvironments } from '../src/config/redis-environments'

async function main() {
  console.log('🔍 Verificando Configurações Redis\n')
  
  // Carrega configurações
  loadEnvironmentConfig()
  
  // Mostra resumo das variáveis de ambiente
  logEnvironmentSummary()
  
  console.log('\n📋 Configurações Redis Carregadas:')
  console.log('='.repeat(50))
  
  Object.entries(redisEnvironments).forEach(([key, config]) => {
    console.log(`\n${config.name}:`)
    console.log(`  HOST: ${config.host}`)
    console.log(`  PORT: ${config.port}`)
    console.log(`  DB: ${config.db}`)
    console.log(`  PASSWORD: ${config.password ? '*'.repeat(config.password.length) : '(vazio)'}`)
  })
  
  console.log('\n✅ Configurações carregadas com sucesso!')
}

// Verificar se está sendo executado diretamente
if (require.main === module) {
  main().catch(console.error)
}

export { main }