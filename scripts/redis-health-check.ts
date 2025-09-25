#!/usr/bin/env tsx

import { loadEnvironmentConfig } from '../src/config/environment'
import { RedisValidator } from '../src/tests/redis-validator'
import { getAllEnvironments } from '../src/config/redis-environments'

// Carrega as configurações de ambiente no início
loadEnvironmentConfig()

class RedisHealthCheck {
  private validator: RedisValidator
  private intervalId: NodeJS.Timeout | null = null
  private isRunning: boolean = false

  constructor() {
    this.validator = new RedisValidator()
  }

  async performHealthCheck(): Promise<void> {
    const timestamp = new Date().toLocaleString('pt-BR')
    console.log(`\n🏥 Health Check Redis - ${timestamp}`)
    console.log('='.repeat(50))

    try {
      const environments = getAllEnvironments()
      const results = await this.validator.validateMultipleEnvironments(environments)
      
      let healthyCount = 0
      let totalCount = results.length

      results.forEach(result => {
        const status = result.overall ? '✅ SAUDÁVEL' : '❌ PROBLEMÁTICO'
        const performance = result.overall 
          ? `| Perf: ${result.performance.average}ms`
          : `| Erro: ${result.connection.error || 'Operações falharam'}`
        
        console.log(`${result.environment.padEnd(10)} ${status} ${performance}`)
        
        if (result.overall) healthyCount++
      })

      const healthPercentage = Math.round((healthyCount / totalCount) * 100)
      
      console.log('\n📊 RESUMO DO HEALTH CHECK:')
      console.log(`   Ambientes saudáveis: ${healthyCount}/${totalCount} (${healthPercentage}%)`)
      
      if (healthyCount === totalCount) {
        console.log('   Status Geral: 🟢 TUDO OK')
      } else if (healthyCount > 0) {
        console.log('   Status Geral: 🟡 PARCIALMENTE OK')
      } else {
        console.log('   Status Geral: 🔴 CRÍTICO')
      }

    } catch (error) {
      console.error('❌ Erro durante health check:', error)
    }
  }

  startContinuousMonitoring(intervalSeconds: number = 30): void {
    if (this.isRunning) {
      console.log('⚠️  Health check já está rodando!')
      return
    }

    console.log(`🚀 Iniciando monitoramento contínuo (intervalo: ${intervalSeconds}s)`)
    console.log('   Pressione Ctrl+C para parar...\n')

    this.isRunning = true
    
    // Executar imediatamente
    this.performHealthCheck()

    // Configurar intervalo
    this.intervalId = setInterval(() => {
      this.performHealthCheck()
    }, intervalSeconds * 1000)

    // Configurar tratamento de sinais para parada elegante
    process.on('SIGINT', () => {
      this.stop()
    })

    process.on('SIGTERM', () => {
      this.stop()
    })
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    
    this.isRunning = false
    console.log('\n👋 Health check interrompido. Até logo!')
    process.exit(0)
  }

  async runOnce(): Promise<boolean> {
    await this.performHealthCheck()
    
    const environments = getAllEnvironments()
    const results = await this.validator.validateMultipleEnvironments(environments)
    
    return results.every(result => result.overall)
  }
}

async function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'once'
  const interval = parseInt(args[1]) || 30

  const healthCheck = new RedisHealthCheck()

  try {
    switch (command.toLowerCase()) {
      case 'once':
        const isHealthy = await healthCheck.runOnce()
        process.exit(isHealthy ? 0 : 1)
        break

      case 'continuous':
      case 'monitor':
        healthCheck.startContinuousMonitoring(interval)
        break

      default:
        console.log('❌ Comando inválido.')
        console.log('Uso:')
        console.log('  npm run redis:health            # Executa uma vez')
        console.log('  npm run redis:health monitor    # Monitora continuamente (30s)')
        console.log('  npm run redis:health monitor 60 # Monitora a cada 60s')
        process.exit(1)
    }

  } catch (error) {
    console.error('❌ Erro durante health check:', error)
    process.exit(1)
  }
}

// Verificar se está sendo executado diretamente
if (require.main === module) {
  main().catch(console.error)
}

export { RedisHealthCheck, main }