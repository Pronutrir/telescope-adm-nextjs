import { RedisConfig } from '../tests/redis-validator'
import { getEnvVar, getEnvNumber, loadEnvironmentConfig } from './environment'

// Carrega as configurações de ambiente
loadEnvironmentConfig()

export const redisEnvironments: Record<string, RedisConfig> = {
  local: {
    name: 'LOCAL',
    host: getEnvVar('REDIS_LOCAL_HOST', '13.65.197.121'),
    port: getEnvNumber('REDIS_LOCAL_PORT', 6379),
    password: getEnvVar('REDIS_LOCAL_PASSWORD', ''),
    db: getEnvNumber('REDIS_LOCAL_DB', 0)
  },
  production: {
    name: 'PRODUÇÃO',
    host: getEnvVar('REDIS_PROD_HOST', '10.0.0.7'),
    port: getEnvNumber('REDIS_PROD_PORT', 6379),
    password: getEnvVar('REDIS_PROD_PASSWORD', ''),
    db: getEnvNumber('REDIS_PROD_DB', 0)
  }
}

export const getAllEnvironments = (): RedisConfig[] => {
  return Object.values(redisEnvironments)
}

export const getEnvironment = (name: string): RedisConfig | undefined => {
  return redisEnvironments[name]
}

export const getEnvironmentFromEnv = (): RedisConfig => {
  return {
    name: process.env.NODE_ENV || 'development',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB || '0')
  }
}