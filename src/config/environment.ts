import { config } from 'dotenv'
import { join } from 'path'

/**
 * Carrega as variáveis de ambiente do arquivo correto baseado no NODE_ENV
 */
export function loadEnvironmentConfig(): void {
  const nodeEnv = process.env.NODE_ENV || 'development'
  
  // Determina qual arquivo .env carregar
  let envFile: string
  
  switch (nodeEnv) {
    case 'production':
      envFile = '.env.production'
      break
    case 'test':
      envFile = '.env.test'
      break
    case 'development':
    default:
      envFile = '.env.local'
      break
  }

  // Carrega o arquivo de ambiente
  const envPath = join(process.cwd(), envFile)
  config({ path: envPath })

  console.log(`🔧 Configuração carregada de: ${envFile}`)
}

/**
 * Obtém uma variável de ambiente como string com fallback
 */
export function getEnvVar(key: string, fallback: string = ''): string {
  return process.env[key] || fallback
}

/**
 * Obtém uma variável de ambiente como número com fallback
 */
export function getEnvNumber(key: string, fallback: number): number {
  const value = process.env[key]
  return value ? parseInt(value, 10) : fallback
}

/**
 * Obtém uma variável de ambiente como boolean com fallback
 */
export function getEnvBoolean(key: string, fallback: boolean): boolean {
  const value = process.env[key]
  if (!value) return fallback
  return value.toLowerCase() === 'true' || value === '1'
}

/**
 * Valida se todas as variáveis de ambiente obrigatórias estão definidas
 */
export function validateEnvironment(requiredVars: string[]): void {
  const missing = requiredVars.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    console.error('❌ Variáveis de ambiente obrigatórias não encontradas:')
    missing.forEach(key => console.error(`   - ${key}`))
    throw new Error(`Variáveis de ambiente obrigatórias não definidas: ${missing.join(', ')}`)
  }
}

/**
 * Exibe um resumo das configurações carregadas (sem senhas)
 */
export function logEnvironmentSummary(): void {
  console.log('📋 Resumo das Configurações:')
  console.log(`   NODE_ENV: ${process.env.NODE_ENV}`)
  console.log(`   REDIS_HOST: ${process.env.REDIS_HOST}`)
  console.log(`   REDIS_PORT: ${process.env.REDIS_PORT}`)
  console.log(`   REDIS_DB: ${process.env.REDIS_DB}`)
  console.log(`   REDIS_LOCAL_HOST: ${process.env.REDIS_LOCAL_HOST}`)
  console.log(`   REDIS_PROD_HOST: ${process.env.REDIS_PROD_HOST}`)
}