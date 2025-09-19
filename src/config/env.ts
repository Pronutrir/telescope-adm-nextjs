/**
 * Configurações centralizadas de ambiente
 * Este arquivo centraliza todas as variáveis de ambiente do projeto
 */

// Validação de variáveis de ambiente obrigatórias
function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória não encontrada: ${key}`)
  }
  return value
}

// Configurações da API principal
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://servicesapp.pronutrir.com.br',
  TIMEOUT: parseInt(process.env.API_TIMEOUT || '10000'),
} as const

// Configurações da API de PDFs
export const PDF_API_CONFIG = {
  BASE_URL: process.env.PDF_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5656/api/v1' : ''),
  PUBLIC_URL: process.env.NEXT_PUBLIC_PDF_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5656/api/v1' : ''),
  TIMEOUT: parseInt(process.env.PDF_API_TIMEOUT || '30000'),
} as const

// URLs dos serviços específicos
export const SERVICES_CONFIG = {
  USERSHIELD: process.env.NEXT_PUBLIC_USERSHIELD_URL || `${API_CONFIG.BASE_URL}/usershield`,
  APITASY: process.env.NEXT_PUBLIC_APITASY_URL || `${API_CONFIG.BASE_URL}/apitasy`,
  NOTIFY: process.env.NEXT_PUBLIC_NOTIFY_URL || `${API_CONFIG.BASE_URL}/notify`,
} as const

// Configurações do Google Analytics
export const GA_CONFIG = {
  API_KEY: process.env.NEXT_PUBLIC_GA_API_KEY || '',
  PROPERTY_ID: process.env.NEXT_PUBLIC_GA_PROPERTY_ID || '',
  CLIENT_ID: process.env.NEXT_PUBLIC_GA_CLIENT_ID || '',
} as const

// Configurações de desenvolvimento
export const DEV_CONFIG = {
  NODE_TLS_REJECT_UNAUTHORIZED: process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0' ? '0' : '1',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
} as const

// Função utilitária para obter URLs dos serviços
export function getServiceUrl(service: keyof typeof SERVICES_CONFIG): string {
  return SERVICES_CONFIG[service]
}

// Função utilitária para obter configurações da API
export function getApiConfig() {
  return {
    baseUrl: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  }
}

// Função utilitária para obter configurações da API de PDFs
export function getPdfApiConfig() {
  return {
    baseUrl: PDF_API_CONFIG.BASE_URL,
    publicUrl: PDF_API_CONFIG.PUBLIC_URL,
    timeout: PDF_API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  }
}

// Validação das configurações críticas
export function validateConfig() {
  const errors: string[] = []

  if (!API_CONFIG.BASE_URL) {
    errors.push('API_BASE_URL ou NEXT_PUBLIC_API_URL deve estar definida')
  }

  if (!PDF_API_CONFIG.BASE_URL) {
    errors.push('PDF_API_URL deve estar definida')
  }

  if (errors.length > 0) {
    throw new Error(`Erros de configuração:\n${errors.join('\n')}`)
  }

  console.log('✅ Configuração validada com sucesso')
}

// Log das configurações (apenas em desenvolvimento)
if (DEV_CONFIG.IS_DEVELOPMENT) {
  console.log('🔧 Configurações carregadas:', {
    API_BASE_URL: API_CONFIG.BASE_URL,
    PDF_API_BASE_URL: PDF_API_CONFIG.BASE_URL,
    SERVICES: SERVICES_CONFIG,
    NODE_ENV: process.env.NODE_ENV,
  })
}
