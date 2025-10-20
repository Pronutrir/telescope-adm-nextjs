import { Api } from '@/lib/api'
import type { IUser } from '@/lib/auth-types'

/**
 * Serviço para gerenciar operações relacionadas ao perfil do usuário
 */
export class UserProfileService {
  /**
   * Atualiza os dados pessoais do usuário
   * Endpoint: PUT Usuarios/PutDadosPessoaisUsuario/{userId}
   */
  static async updatePersonalData(userId: number | string, data: {
    nomeCompleto: string
    cpf?: string
    cnpj?: string
    estabelecimento: number | string
    email: string
    telefone?: string
    celular?: string
    endereco?: string
  }) {
    try {
      const response = await Api.put(`Usuarios/PutDadosPessoaisUsuario/${userId}`, {
        nomeCompleto: data.nomeCompleto,
        cpf: data.cpf || '',
        cnpj: data.cnpj || '',
        estabelecimento: data.estabelecimento,
        email: data.email,
        telefone: data.telefone || '',
        celular: data.celular || '',
        endereco: data.endereco || '',
      })

      return {
        success: response.status === 200,
        data: response.data,
        message: 'Dados atualizados com sucesso!'
      }
    } catch (error: any) {
      console.error('Erro ao atualizar dados pessoais:', error)
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('A atualização não foi autorizada!')
          case 400:
            throw new Error('Não foi possível atualizar os dados devido a algum procedimento incorreto!')
          default:
            throw new Error('Ocorreu um erro inesperado, tente novamente!')
        }
      }
      
      throw new Error(error.message || 'Erro ao atualizar dados pessoais')
    }
  }

  /**
   * Busca os dados atualizados do usuário logado
   * Utilizado após atualização para sincronizar o contexto
   */
  static async getCurrentUser(): Promise<IUser> {
    try {
      const response = await Api.get('Auth/UsuarioLogado')
      return response.data.result
    } catch (error: any) {
      console.error('Erro ao buscar usuário logado:', error)
      throw new Error('Erro ao buscar dados do usuário')
    }
  }

  /**
   * Altera a senha do usuário
   * Endpoint: PUT Usuarios/RecoveryPass/{idUsuario}
   * @param username - Email/username do usuário
   * @param password - Senha atual
   * @param newPassword - Nova senha
   * @param idUsuario - ID do usuário
   */
  static async updatePassword(
    username: string, 
    password: string,
    newPassword: string,
    idUsuario: number
  ) {
    try {
      const response = await fetch('/api/auth/updatePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          newPassword,
          idUsuario
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao alterar senha')
      }

      return {
        success: true,
        message: 'Senha alterada com sucesso!'
      }
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error)
      throw new Error(error.message || 'Erro ao alterar senha')
    }
  }

  /**
   * Faz upload do avatar do usuário
   * TODO: Implementar quando o endpoint estiver disponível
   */
  static async uploadAvatar(userId: number | string, file: File) {
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      formData.append('userId', userId.toString())

      // TODO: Implementar quando o endpoint estiver disponível
      // const response = await Api.post('Usuarios/UploadAvatar', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // })

      // return {
      //   success: true,
      //   avatarUrl: response.data.avatarUrl,
      //   message: 'Avatar atualizado com sucesso!'
      // }

      throw new Error('Endpoint de upload de avatar ainda não implementado')
    } catch (error: any) {
      console.error('Erro ao fazer upload do avatar:', error)
      throw new Error(error.message || 'Erro ao fazer upload do avatar')
    }
  }

  /**
   * Busca as atividades recentes do usuário
   * TODO: Implementar quando o endpoint estiver disponível
   */
  static async getUserActivities(userId: number | string, page: number = 1, limit: number = 10) {
    try {
      // TODO: Implementar quando o endpoint estiver disponível
      // const response = await Api.get(`Usuarios/${userId}/activities`, {
      //   params: { page, limit }
      // })

      // return {
      //   activities: response.data.activities,
      //   total: response.data.total,
      //   page: response.data.page,
      //   totalPages: response.data.totalPages
      // }

      // Mock de atividades enquanto o endpoint não existe
      return {
        activities: [
          {
            id: '1',
            type: 'login' as const,
            title: 'Login realizado',
            description: 'Você fez login no sistema',
            timestamp: new Date().toISOString()
          },
          {
            id: '2',
            type: 'update' as const,
            title: 'Perfil atualizado',
            description: 'Você atualizou suas informações de perfil',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '3',
            type: 'security' as const,
            title: 'Senha alterada',
            description: 'Sua senha foi alterada com sucesso',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '4',
            type: 'document' as const,
            title: 'Documento visualizado',
            description: 'Você visualizou um documento PDF',
            timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
          }
        ],
        total: 4,
        page: 1,
        totalPages: 1
      }
    } catch (error: any) {
      console.error('Erro ao buscar atividades:', error)
      throw new Error('Erro ao buscar atividades do usuário')
    }
  }

  /**
   * Valida se houve mudanças nos dados antes de salvar
   */
  static validateChanges(currentData: Partial<IUser>, newData: Partial<IUser>): boolean {
    const fieldsToCheck = [
      'nomeCompleto',
      'cpf',
      'cnpj',
      'email',
      'telefone',
      'celular',
      'endereco'
    ]

    return fieldsToCheck.some(field => {
      const current = currentData[field as keyof IUser]
      const updated = newData[field as keyof IUser]
      return current !== updated
    })
  }
}

export default UserProfileService
