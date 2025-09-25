import { RedisValidator, RedisConfig } from '../src/tests/redis-validator'
import { redisEnvironments } from '../src/config/redis-environments'

describe('Redis Validation Tests', () => {
  let validator: RedisValidator

  beforeEach(() => {
    validator = new RedisValidator()
  })

  describe('Local Environment', () => {
    const localConfig = redisEnvironments.local

    test('should connect to local Redis', async () => {
      const result = await validator.validateEnvironment(localConfig)
      
      expect(result.environment).toBe('LOCAL')
      expect(result.connection.success).toBe(true)
      expect(result.connection.latency).toBeGreaterThan(0)
    }, 30000) // 30 segundos timeout

    test('should perform basic operations on local Redis', async () => {
      const result = await validator.validateEnvironment(localConfig)
      
      expect(result.operations.set.success).toBe(true)
      expect(result.operations.get.success).toBe(true)
      expect(result.operations.delete.success).toBe(true)
      expect(result.operations.ttl.success).toBe(true)
    }, 30000)

    test('should have acceptable performance on local Redis', async () => {
      const result = await validator.validateEnvironment(localConfig)
      
      if (result.overall) {
        expect(result.performance.average).toBeLessThan(1000) // menos de 1 segundo
        expect(result.performance.min).toBeGreaterThan(0)
        expect(result.performance.max).toBeGreaterThan(0)
      }
    }, 30000)
  })

  describe('Production Environment', () => {
    const prodConfig = redisEnvironments.production

    test('should connect to production Redis', async () => {
      const result = await validator.validateEnvironment(prodConfig)
      
      expect(result.environment).toBe('PRODUÇÃO')
      expect(result.connection.success).toBe(true)
      expect(result.connection.latency).toBeGreaterThan(0)
    }, 30000)

    test('should perform basic operations on production Redis', async () => {
      const result = await validator.validateEnvironment(prodConfig)
      
      expect(result.operations.set.success).toBe(true)
      expect(result.operations.get.success).toBe(true)
      expect(result.operations.delete.success).toBe(true)
      expect(result.operations.ttl.success).toBe(true)
    }, 30000)

    test('should have acceptable performance on production Redis', async () => {
      const result = await validator.validateEnvironment(prodConfig)
      
      if (result.overall) {
        expect(result.performance.average).toBeLessThan(5000) // menos de 5 segundos
        expect(result.performance.min).toBeGreaterThan(0)
        expect(result.performance.max).toBeGreaterThan(0)
      }
    }, 30000)
  })

  describe('Multiple Environments', () => {
    test('should validate all environments', async () => {
      const configs = Object.values(redisEnvironments)
      const results = await validator.validateMultipleEnvironments(configs)
      
      expect(results).toHaveLength(2)
      expect(results[0].environment).toBe('LOCAL')
      expect(results[1].environment).toBe('PRODUÇÃO')
    }, 60000) // 1 minuto timeout

    test('should generate comprehensive report', async () => {
      const configs = Object.values(redisEnvironments)
      const results = await validator.validateMultipleEnvironments(configs)
      const report = validator.generateReport(results)
      
      expect(report).toContain('RELATÓRIO DE TESTES REDIS')
      expect(report).toContain('LOCAL')
      expect(report).toContain('PRODUÇÃO')
      expect(report).toContain('RESUMO')
    }, 60000)
  })

  describe('Error Handling', () => {
    test('should handle invalid configuration gracefully', async () => {
      const invalidConfig: RedisConfig = {
        name: 'INVALID',
        host: 'invalid-host-that-does-not-exist',
        port: 9999,
        password: '',
        db: 0
      }

      const result = await validator.validateEnvironment(invalidConfig)
      
      expect(result.connection.success).toBe(false)
      expect(result.connection.error).toBeDefined()
      expect(result.overall).toBe(false)
    }, 30000)

    test('should handle network timeouts', async () => {
      const timeoutConfig: RedisConfig = {
        name: 'TIMEOUT',
        host: '1.2.3.4', // IP que não responde
        port: 6379,
        password: '',
        db: 0
      }

      const result = await validator.validateEnvironment(timeoutConfig)
      
      expect(result.connection.success).toBe(false)
      expect(result.overall).toBe(false)
    }, 30000)
  })
})