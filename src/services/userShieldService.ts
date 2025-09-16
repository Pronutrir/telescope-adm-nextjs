/**
 * Serviço para integração com UserShield API
 * Baseado no telescopeContext.tsx da aplicação anterior
 */
import { SERVICES_CONFIG } from '@/config/env'
import { tokenStorage } from './token'

export interface UserShieldUser {
  id: string
  name: string
  email: string
  userName: string
  role: string
  status: string
  lastLogin: string
  department: string
  perfis?: {
    id: string
    nomePerfil: string
  }[]
  roles?: {
    id: string
    nomeRole: string
    perfis: {
      id: string
      nomePerfil: string
    }
  }[]
}

export interface UserShieldResponse {
  success: boolean
  result: UserShieldUser[]
  message?: string
}

export interface UserShieldProfile {
  id: string
  nomePerfil: string
  descricao?: string
}

export interface UserShieldRole {
  id: string
  nomeRole: string
  descricao?: string
  perfis: UserShieldProfile[]
}

class UserShieldService {
  private baseURL: string
  private timeout: number = 10000
  private useTestEndpoint: boolean = false // Usar API real

  constructor() {
    this.baseURL = SERVICES_CONFIG.USERSHIELD
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Escolher entre endpoint de teste ou API real
    const url = this.useTestEndpoint 
      ? `/api/test/usershield`
      : `/api/usershield/${endpoint}`
    
    // Obter token de acesso armazenado
    const accessToken = tokenStorage.getToken()
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
      ...options.headers
    }

    try {
      console.log('🔄 UserShield: Fazendo requisição para:', url)
      console.log('🔑 Token presente:', accessToken ? 'SIM' : 'NÃO')
      
      const response = await fetch(url, {
        ...options,
        headers,
        signal: AbortSignal.timeout(this.timeout)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ UserShield Error:', response.status, errorText)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ UserShield: Resposta recebida:', data)
      return data
    } catch (error) {
      console.error('❌ UserShield API Error:', error)
      throw error
    }
  }

  /**
   * Listar todos os usuários cadastrados no UserShield
   * Baseado na função listarUsuariosUserShield do telescopeContext.tsx
   */
  async listarUsuarios(): Promise<UserShieldUser[]> {
    try {
      const response = await this.request<UserShieldResponse>('usuarios')
      
      if (response.success && response.result) {
        // Mapear os dados para o formato esperado pela aplicação
        return response.result.map(user => ({
          id: user.id,
          name: user.name || user.userName,
          email: user.email,
          userName: user.userName,
          role: user.perfis?.[0]?.nomePerfil || 'Usuário',
          status: user.status || 'Ativo',
          lastLogin: user.lastLogin || new Date().toISOString().split('T')[0],
          department: user.department || 'N/A',
          perfis: user.perfis,
          roles: user.roles
        }))
      }
      
      return []
    } catch (error) {
      console.error('Erro ao listar usuários UserShield:', error)
      throw new Error('Falha ao carregar usuários do sistema')
    }
  }

  /**
   * Listar perfis disponíveis no UserShield
   * Baseado na função listarPerfisUserShield do telescopeContext.tsx
   */
  async listarPerfis(): Promise<UserShieldProfile[]> {
    try {
      const response = await this.request<{ success: boolean, result: UserShieldProfile[] }>('Perfis')
      
      if (response.success && response.result) {
        return response.result
      }
      
      return []
    } catch (error) {
      console.error('Erro ao listar perfis UserShield:', error)
      throw new Error('Falha ao carregar perfis do sistema')
    }
  }

  /**
   * Listar roles disponíveis no UserShield
   * Baseado na função listarRolesUserShield do telescopeContext.tsx
   */
  async listarRoles(userName?: string): Promise<UserShieldRole[]> {
    try {
      const endpoint = userName ? `Roles?userName=${encodeURIComponent(userName)}` : 'Roles'
      const response = await this.request<{ success: boolean, result: UserShieldRole[] }>(endpoint)
      
      if (response.success && response.result) {
        return response.result
      }
      
      return []
    } catch (error) {
      console.error('Erro ao listar roles UserShield:', error)
      throw new Error('Falha ao carregar roles do sistema')
    }
  }

  /**
   * Buscar usuários por termo de pesquisa
   */
  async buscarUsuarios(searchTerm: string): Promise<UserShieldUser[]> {
    const usuarios = await this.listarUsuarios()
    
    if (!searchTerm.trim()) {
      return usuarios
    }
    
    const term = searchTerm.toLowerCase()
    return usuarios.filter(user => 
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.userName.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term) ||
      user.department.toLowerCase().includes(term)
    )
  }
}

// Instância singleton do serviço
export const userShieldService = new UserShieldService()
