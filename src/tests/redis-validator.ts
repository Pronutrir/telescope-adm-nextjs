import Redis from 'ioredis'

export interface RedisConfig {
  host: string
  port: number
  password?: string
  db?: number
  name?: string
}

export interface TestResult {
  success: boolean
  error?: string
  latency?: number
  operation?: string
}

export interface ValidationResult {
  environment: string
  config: RedisConfig
  connection: TestResult
  operations: {
    set: TestResult
    get: TestResult
    delete: TestResult
    ttl: TestResult
  }
  performance: {
    average: number
    min: number
    max: number
  }
  overall: boolean
}

export class RedisValidator {
  private redis: Redis | null = null

  async validateEnvironment(config: RedisConfig): Promise<ValidationResult> {
    const result: ValidationResult = {
      environment: config.name || 'unknown',
      config,
      connection: { success: false },
      operations: {
        set: { success: false },
        get: { success: false },
        delete: { success: false },
        ttl: { success: false }
      },
      performance: { average: 0, min: 0, max: 0 },
      overall: false
    }

    try {
      // 1. Teste de Conexão
      console.log(`🔍 Testando Redis - ${config.name?.toUpperCase()} (${config.host}:${config.port})`)
      
      const connectionStart = Date.now()
      this.redis = new Redis({
        host: config.host,
        port: config.port,
        password: config.password || undefined,
        db: config.db || 0,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true
      })

      await this.redis.connect()
      const connectionTime = Date.now() - connectionStart
      
      result.connection = { 
        success: true, 
        latency: connectionTime,
        operation: 'connection'
      }
      console.log(`✅ Conexão estabelecida com sucesso - Latência: ${connectionTime}ms`)

      // 2. Teste de Operações
      const latencies: number[] = []
      const testKey = `test:redis:${Date.now()}`
      const testValue = `test-value-${Math.random()}`

      // Teste SET
      const setStart = Date.now()
      await this.redis.set(testKey, testValue, 'EX', 60)
      const setTime = Date.now() - setStart
      latencies.push(setTime)
      result.operations.set = { 
        success: true, 
        latency: setTime,
        operation: 'set'
      }
      console.log(`✅ Operação SET realizada - Latência: ${setTime}ms`)

      // Teste GET
      const getStart = Date.now()
      const getValue = await this.redis.get(testKey)
      const getTime = Date.now() - getStart
      latencies.push(getTime)
      
      if (getValue === testValue) {
        result.operations.get = { 
          success: true, 
          latency: getTime,
          operation: 'get'
        }
        console.log(`✅ Operação GET realizada - Latência: ${getTime}ms`)
      } else {
        result.operations.get = { 
          success: false, 
          error: 'Valor retornado não confere',
          operation: 'get'
        }
        console.log(`❌ Operação GET falhou - Valor não confere`)
      }

      // Teste TTL
      const ttlStart = Date.now()
      const ttl = await this.redis.ttl(testKey)
      const ttlTime = Date.now() - ttlStart
      latencies.push(ttlTime)
      
      if (ttl > 0 && ttl <= 60) {
        result.operations.ttl = { 
          success: true, 
          latency: ttlTime,
          operation: 'ttl'
        }
        console.log(`✅ TTL configurado corretamente - Tempo restante: ${ttl}s`)
      } else {
        result.operations.ttl = { 
          success: false, 
          error: `TTL inválido: ${ttl}`,
          operation: 'ttl'
        }
        console.log(`❌ TTL incorreto: ${ttl}`)
      }

      // Teste DELETE
      const delStart = Date.now()
      const deleted = await this.redis.del(testKey)
      const delTime = Date.now() - delStart
      latencies.push(delTime)
      
      if (deleted === 1) {
        result.operations.delete = { 
          success: true, 
          latency: delTime,
          operation: 'delete'
        }
        console.log(`✅ Operação DELETE realizada - Latência: ${delTime}ms`)
      } else {
        result.operations.delete = { 
          success: false, 
          error: 'Chave não foi deletada',
          operation: 'delete'
        }
        console.log(`❌ Operação DELETE falhou`)
      }

      // Cálculo de Performance
      if (latencies.length > 0) {
        result.performance = {
          average: Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length),
          min: Math.min(...latencies),
          max: Math.max(...latencies)
        }
        console.log(`📊 Performance: Média ${result.performance.average}ms | Min: ${result.performance.min}ms | Max: ${result.performance.max}ms`)
      }

      // Verificação geral
      result.overall = result.connection.success && 
                      result.operations.set.success && 
                      result.operations.get.success && 
                      result.operations.ttl.success && 
                      result.operations.delete.success

      if (result.overall) {
        console.log(`🎉 Todos os testes passaram para ${config.name}!`)
      } else {
        console.log(`❌ Alguns testes falharam para ${config.name}`)
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      result.connection = { 
        success: false, 
        error: errorMessage,
        operation: 'connection'
      }
      console.log(`❌ Falha na conexão com ${config.name}: ${errorMessage}`)
    } finally {
      if (this.redis) {
        await this.redis.disconnect()
        this.redis = null
      }
    }

    console.log('') // Linha em branco para separar
    return result
  }

  async validateMultipleEnvironments(configs: RedisConfig[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = []
    
    for (const config of configs) {
      const result = await this.validateEnvironment(config)
      results.push(result)
    }

    return results
  }

  generateReport(results: ValidationResult[]): string {
    let report = '\n📋 RELATÓRIO DE TESTES REDIS\n'
    report += '='.repeat(50) + '\n\n'

    results.forEach((result, index) => {
      report += `${index + 1}. ${result.environment.toUpperCase()}\n`
      report += `   Host: ${result.config.host}:${result.config.port}\n`
      report += `   Status: ${result.overall ? '✅ SUCESSO' : '❌ FALHOU'}\n`
      
      if (result.connection.success) {
        report += `   Conexão: ✅ ${result.connection.latency}ms\n`
      } else {
        report += `   Conexão: ❌ ${result.connection.error}\n`
      }

      if (result.overall) {
        report += `   Performance: Média ${result.performance.average}ms (${result.performance.min}-${result.performance.max}ms)\n`
      }
      
      report += '\n'
    })

    const totalSuccess = results.filter(r => r.overall).length
    const totalTests = results.length
    
    report += `📊 RESUMO: ${totalSuccess}/${totalTests} ambientes funcionando\n`
    
    if (totalSuccess === totalTests) {
      report += '🎉 Todos os ambientes Redis estão funcionando perfeitamente!\n'
    } else {
      report += '⚠️  Alguns ambientes precisam de atenção.\n'
    }

    return report
  }
}