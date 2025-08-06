// Utilitário para debug melhorado
export const DEBUG = {
  // Debug para API calls
  api: (endpoint: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🌐 API Call: ${endpoint}`)
      console.log('📤 Request:', data)
      console.groupEnd()
    }
  },

  // Debug para responses
  response: (endpoint: string, status: number, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`📥 API Response: ${endpoint}`)
      console.log('Status:', status)
      console.log('Data:', data)
      console.groupEnd()
    }
  },

  // Debug para autenticação
  auth: (action: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🔐 Auth: ${action}`)
      console.log('Data:', data)
      console.groupEnd()
    }
  },

  // Debug para erros
  error: (context: string, error: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`❌ Error in ${context}`)
      console.error(error)
      console.groupEnd()
    }
  },

  // Debug para estado
  state: (component: string, state: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`📊 State: ${component}`)
      console.log(state)
      console.groupEnd()
    }
  }
}
