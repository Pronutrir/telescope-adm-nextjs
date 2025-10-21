/**
 * Serviço para integração com UserShield API
 * Baseado no telescopeContext.tsx da aplicação anterior
 * Agora com cache seguro de tokens via Redis
 */
import { SERVICES_CONFIG } from '@/config/env'
import { tokenStorage } from './token'
import { tokenCacheService } from './tokenCacheService'

export interface UserShieldUser {
  id: string // ID do usuário (string vinda da API)
  name: string
  email: string
  userName: string
  role: string
  status: string
  lastLogin: string
  department: string
  perfis?: {
    id: number  // Corrigido para number
    nomePerfil: string
  }[]
  roles?: {
    id: number  // Corrigido para number
    perfisId: number
    usuarioId: number
    perfis: {
      id: number  // Corrigido para number
      nomePerfil: string
      statusPerfil?: string
      dataRegistro?: string
      dataAtualizacao?: string
      usuario?: string
    }
  }[]
}

export interface UserShieldResponse {
  success: boolean
  result: UserShieldUser[]
  message?: string
}

export interface UserShieldProfile {
  id: number  // ID é number na API
  nomePerfil: string
  descricao?: string
  statusPerfil?: string
  dataRegistro?: string
  dataAtualizacao?: string
  usuario?: string
}

export interface UserShieldRole {
  id: string
  nomeRole: string
  descricao?: string
  perfis: UserShieldProfile[]
}

class UserShieldService {
  private baseURL: string
  private timeout: number = 30000 // Aumentado para 30 segundos
  private useTestEndpoint: boolean = false // Usar API real

  constructor() {
    this.baseURL = SERVICES_CONFIG.USERSHIELD
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Escolher entre endpoint de teste ou API real
    const url = this.useTestEndpoint 
      ? `/api/test/usershield`
      : `/api/usershield/${endpoint}`
    
    // Obter token do cache seguro (Redis) primeiro, depois fallback para localStorage
    let accessToken = await tokenCacheService.getToken('usershield')
    if (!accessToken) {
      accessToken = tokenStorage.getToken()
    }
    
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
   * Listar todos os perfis disponíveis
   */
  async listarPerfis(): Promise<UserShieldProfile[]> {
    const response = await this.request<{ result: UserShieldProfile[] }>(
      'perfis'
    )
    return response.result || []
  }

  /**
   * Obter um perfil específico por ID
   */
  async obterPerfilPorId(perfilId: number): Promise<UserShieldProfile | null> {
    try {
      const response = await this.request<{ result: UserShieldProfile }>(
        `perfis/${perfilId}`
      )
      return response.result || null
    } catch (error) {
      console.error('❌ Erro ao obter perfil:', error)
      return null
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

  /**
   * Alterar senha do usuário
   * Endpoint: PUT /Usuarios/RecoveryPass/{idUsuario}
   */
  async alterarSenha(
    idUsuario: number,
    username: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔐 Alterando senha para usuário:', idUsuario)
      
      const response = await this.request<{ success: boolean; message: string }>(
        `Usuarios/RecoveryPass/${idUsuario}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            username,
            password: currentPassword,
            newPassword
          })
        }
      )
      
      console.log('✅ Senha alterada com sucesso')
      return response
    } catch (error) {
      console.error('❌ Erro ao alterar senha:', error)
      throw new Error('Falha ao alterar senha. Verifique sua senha atual.')
    }
  }

  /**
   * Obter perfis/roles de um usuário específico
   * Os perfis vêm dentro do array 'roles' do usuário
   * Endpoint: GET /Usuarios/{idUsuario}
   */
  async obterPerfisUsuario(idUsuario: number): Promise<UserShieldProfile[]> {
    try {
      console.log('🔄 Obtendo perfis do usuário:', idUsuario)
      
      // Buscar usuário completo
      const response = await this.request<{ result: UserShieldUser }>(
        `usuarios/${idUsuario}`
      )
      
      const usuario = response.result
      if (!usuario || !usuario.roles) {
        console.log('⚠️ Usuário sem perfis')
        return []
      }
      
      // Extrair perfis únicos do array roles
      const perfisMap = new Map<number, UserShieldProfile>()
      usuario.roles.forEach(role => {
        if (role.perfis && !perfisMap.has(role.perfis.id)) {
          perfisMap.set(role.perfis.id, role.perfis)
        }
      })
      
      const perfis = Array.from(perfisMap.values())
      console.log('✅ Perfis obtidos:', perfis.length)
      return perfis
    } catch (error) {
      console.error('❌ Erro ao obter perfis do usuário:', error)
      throw new Error('Falha ao carregar perfis do usuário.')
    }
  }

  /**
   * Adicionar perfil a um usuário
   * Usa PUT no usuário completo com array perfisIds atualizado
   */
  async adicionarPerfilUsuario(
    idUsuario: number,
    perfilId: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`🔄 Adicionando perfil ${perfilId} ao usuário ${idUsuario}`)
      
      // Buscar perfis atuais
      const perfisAtuais = await this.obterPerfisUsuario(idUsuario)
      const perfisIds: number[] = perfisAtuais.map(p => p.id)
      
      // Adicionar novo se ainda não existe
      if (!perfisIds.includes(perfilId)) {
        perfisIds.push(perfilId)
      }
      
      // Atualizar usuário com novos perfis
      await this.atualizarPerfisUsuario(idUsuario, perfisIds)
      
      console.log('✅ Perfil adicionado com sucesso')
      return { success: true, message: 'Perfil adicionado com sucesso' }
    } catch (error) {
      console.error('❌ Erro ao adicionar perfil:', error)
      throw new Error('Falha ao adicionar perfil ao usuário.')
    }
  }

  /**
   * Remover perfil de um usuário
   * Usa PUT no usuário completo sem o perfil removido
   */
  async removerPerfilUsuario(
    idUsuario: number,
    perfilId: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`🔄 Removendo perfil ${perfilId} do usuário ${idUsuario}`)
      
      // Buscar perfis atuais
      const perfisAtuais = await this.obterPerfisUsuario(idUsuario)
      const perfisIds: number[] = perfisAtuais
        .map(p => p.id)
        .filter(id => id !== perfilId)
      
      // Atualizar usuário sem o perfil removido
      await this.atualizarPerfisUsuario(idUsuario, perfisIds)
      
      console.log('✅ Perfil removido com sucesso')
      return { success: true, message: 'Perfil removido com sucesso' }
    } catch (error) {
      console.error('❌ Erro ao remover perfil:', error)
      throw new Error('Falha ao remover perfil do usuário.')
    }
  }

  /**
   * Atualizar perfis do usuário (substituir todos)
   * Usa PUT no usuário completo com campo perfisIds
   */
  /**
   * ⚠️ ATENÇÃO: A API UserShield NÃO tem endpoint direto para atualizar perfis.
   * 
   * Estratégia baseada na documentação OpenAPI real:
   * 1. GET /Usuarios/{id} - Buscar roles atuais
   * 2. DELETE /Roles/{id} - Remover roles antigas
   * 3. POST /Roles - Criar novas roles com perfisIds
   * 
   * Segundo schema "Roles": {usuarioId, perfisId, perfis{...}, usuarios{...}}
   */
  async atualizarPerfisUsuario(idUsuario: number, perfisIds: number[]): Promise<void> {
    try {
      console.log(`🔄 Atualizando perfis do usuário ${idUsuario}`)
      console.log('📋 Novos perfis IDs:', perfisIds)
      
      // 1. Buscar roles atuais do usuário
      const usuarioResponse = await this.request<{ result: UserShieldUser }>(
        `usuarios/${idUsuario}`
      )
      const rolesAtuais = usuarioResponse.result.roles || []
      
      console.log(`📋 Roles atuais (${rolesAtuais.length}):`, rolesAtuais.map(r => r.id))
      
      // 2. Deletar todas as roles antigas
      for (const role of rolesAtuais) {
        console.log(`🗑️ Deletando role ID: ${role.id}`)
        await this.request(`roles/${role.id}`, {
          method: 'DELETE'
        })
      }
      
      // 3. Criar novas roles para cada perfilId
      if (perfisIds.length > 0) {
        // Buscar detalhes dos perfis para montar o rolesArray
        const perfisDetalhes = await Promise.all(
          perfisIds.map(id => this.obterPerfilPorId(id))
        )
        
        // Filtrar perfis válidos (não nulos)
        const perfisValidos = perfisDetalhes.filter(p => p !== null) as UserShieldProfile[]
        
        console.log(`➕ Criando ${perfisValidos.length} novas roles`)
        await this.request('roles', {
          method: 'POST',
          body: JSON.stringify({
            usuarioId: idUsuario,
            rolesArray: perfisValidos.map(perfil => ({
              id: perfil.id,
              nomePerfil: perfil.nomePerfil,
              statusPerfil: perfil.statusPerfil || 'A'
            }))
          })
        })
      }
      
      console.log('✅ Perfis do usuário atualizados com sucesso')
    } catch (error) {
      console.error('❌ Erro ao atualizar perfis:', error)
      throw new Error('Falha ao atualizar perfis do usuário.')
    }
  }
}

// Instância singleton do serviço
export const userShieldService = new UserShieldService()
