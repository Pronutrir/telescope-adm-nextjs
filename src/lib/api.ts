import axios from "axios"
import { SERVICES_CONFIG } from '@/config/env'

// Extrair path de SERVICES_CONFIG.APITASY para uso client-side
const apitasyPath = new URL(SERVICES_CONFIG.APITASY).pathname

export const Api = axios.create({
  baseURL: apitasyPath,
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
    const status = error.response?.status

    // Se token expirado, limpar storage e redirecionar para login
    if (status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/auth/server-login'
      }
    } else if (status !== 404) {
      console.error("API Error:", error)
    }

    return Promise.reject(error)
  }
)

ApiNotify.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    // Se token expirado, limpar storage e redirecionar para login
    if (status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/auth/server-login'
      }
    } else if (status !== 404) {
      console.error("Notify API Error:", error)
    }

    return Promise.reject(error)
  }
)
