import axios from "axios"

export const Api = axios.create({
  baseURL: '/apitasy/',
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

export const ApiNotify = axios.create({
  baseURL: '/notify/',
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para adicionar token automaticamente nas requisições
Api.interceptors.request.use(
  (config) => {
    // Buscar token do localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

ApiNotify.interceptors.request.use(
  (config) => {
    // Buscar token do localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptors para tratamento de erro global
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error)
    
    // Se token expirado, limpar storage e redirecionar para login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/auth/login'
      }
    }
    
    return Promise.reject(error)
  }
)

ApiNotify.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Notify API Error:", error)
    
    // Se token expirado, limpar storage e redirecionar para login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/auth/login'
      }
    }
    
    return Promise.reject(error)
  }
)
