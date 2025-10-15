import '@testing-library/jest-dom'

// Infrastructure Test Setup - Para testes com dependências externas

// Setup para testes de Redis e infraestrutura
// Carrega variáveis de ambiente reais para conectividade
import { config } from 'dotenv'
config({ path: '.env.test' })

// Mock environment variables apenas se não estiverem definidas
if (!process.env.REDIS_HOST_LOCAL) {
  Object.defineProperty(process.env, 'REDIS_HOST_LOCAL', { 
    value: '13.65.197.121', 
    writable: true 
  })
}

if (!process.env.REDIS_PORT_LOCAL) {
  Object.defineProperty(process.env, 'REDIS_PORT_LOCAL', { 
    value: '6379', 
    writable: true 
  })
}

if (!process.env.REDIS_HOST_PROD) {
  Object.defineProperty(process.env, 'REDIS_HOST_PROD', { 
    value: '10.0.0.7', 
    writable: true 
  })
}

if (!process.env.REDIS_PORT_PROD) {
  Object.defineProperty(process.env, 'REDIS_PORT_PROD', { 
    value: '6379', 
    writable: true 
  })
}

// Configurar timeouts mais longos para testes de infraestrutura
jest.setTimeout(60000)

// Log para debug
console.log('🏗️ Infrastructure Test Setup: Configuração carregada para testes de Redis e serviços externos')