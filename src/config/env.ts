/**
 * Configurações centralizadas de ambiente
 * Este arquivo centraliza todas as variáveis de ambiente do projeto
 */

// (removido) helper requireEnv não utilizado

// Configurações da API principal
// API_URL (private) é lida em runtime no servidor; NEXT_PUBLIC_API_URL é baked in no build
export const API_CONFIG = {
  BASE_URL: 'https://servicesapp.pronutrir.com.br',
  TIMEOUT: parseInt(process.env.API_TIMEOUT || '10000'),
} as const

// Configurações da API de PDFs
export const PDF_API_CONFIG = {
  BASE_URL: 'http://20.65.208.119:5656/api/v1',
  PUBLIC_URL: 'http://20.65.208.119:5656/api/v1',
  TIMEOUT: parseInt(process.env.PDF_API_TIMEOUT || '30000'),
} as const

// URLs dos serviços específicos
// As variáveis NEXT_PUBLIC_* são baked in no build; as privadas (sem prefixo) são lidas em runtime
export const SERVICES_CONFIG = {
  USERSHIELD: 'https://servicesapp.pronutrir.com.br/usershield/api/',
  APITASY: 'https://servicesapp.pronutrir.com.br/apitasy',
  NOTIFY: 'https://servicesapp.pronutrir.com.br/notify/api/',
} as const

// Configurações do Google Analytics
export const GA_CONFIG = {
  API_KEY: process.env.NEXT_PUBLIC_GA_API_KEY || '',
  PROPERTY_ID: process.env.NEXT_PUBLIC_GA_PROPERTY_ID || '',
  CLIENT_ID: process.env.NEXT_PUBLIC_GA_CLIENT_ID || '',
} as const

// Configurações de desenvolvimento
export const DEV_CONFIG = {
  NODE_TLS_REJECT_UNAUTHORIZED: (process.env.NODE_ENV === 'development' && process.env.DEV_ALLOW_INSECURE_TLS === '1') ? '0' : '1',
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

// Helpers que validam a presença das URLs quando forem necessárias
export function requireApiBaseUrl(): string {
  const url = API_CONFIG.BASE_URL
  if (!url) throw new Error('API_URL não configurada. Defina NEXT_PUBLIC_API_URL no ambiente de produção.')
  return url
}

export function requireApitasyBaseUrl(): string {
  const url = SERVICES_CONFIG.APITASY
  if (!url) throw new Error('APITASY_URL não configurada. Defina NEXT_PUBLIC_APITASY_URL no ambiente de produção.')
  // Retornar apenas o domínio + path base (ex: https://servicesapp.pronutrir.com.br/apitasy)
  // Remove /api/ do final se existir
  return url.replace(/\/api\/?$/, '')
}

export function requirePdfApiBaseUrl(kind: 'public' | 'internal' = 'public'): string {
  const url = kind === 'public' ? PDF_API_CONFIG.PUBLIC_URL : PDF_API_CONFIG.BASE_URL
  if (!url) throw new Error('PDF_API_URL não configurada. Defina PDF_API_URL/NEXT_PUBLIC_PDF_API_URL no ambiente de produção.')
  return url
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

// Validação deve ser chamada explicitamente pelos consumidores quando necessário
