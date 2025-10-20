import { useState } from 'react'
import { UserProfileFormData } from '@/types/user'
import UserProfileService from '@/services/userProfileService'

export interface UseUserProfileReturn {
  updateUserProfile: (userData: UserProfileFormData) => Promise<void>
  isLoading: boolean
  error: string | null
  success: boolean
}

export const useUserProfile = (userId: string | number): UseUserProfileReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const updateUserProfile = async (userData: UserProfileFormData): Promise<void> => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Usar o serviço centralizado
      const result = await UserProfileService.updatePersonalData(userId, {
        nomeCompleto: userData.nomeCompleto,
        cpf: userData.cpf || '',
        cnpj: userData.cnpj || '',
        estabelecimento: userData.estabelecimento,
        email: userData.email,
        telefone: userData.telefone || '',
        celular: userData.celular || '',
        endereco: userData.endereco || '',
      })

      if (result.success) {
        setSuccess(true)
        setError(null)
        
        // Recarregar dados do usuário para sincronizar o contexto
        try {
          await UserProfileService.getCurrentUser()
        } catch (err) {
          console.warn('Aviso: Não foi possível recarregar os dados do usuário:', err)
        }
      }
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err)
      setError(err.message || 'Erro interno do servidor. Tente novamente mais tarde.')
      setSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateUserProfile,
    isLoading,
    error,
    success
  }
}

// Hook para buscar dados dos estabelecimentos
export const useEstabelecimentos = () => {
  const [estabelecimentos, setEstabelecimentos] = useState([
    { value: 7, label: 'Fortaleza - CE' },
    { value: 8, label: 'Cariri - CE' },
    { value: 2, label: 'Sobral - CE' }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEstabelecimentos = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // TODO: Implementar endpoint real quando disponível
      // const response = await Api.get('Estabelecimentos')
      // setEstabelecimentos(response.data)
      
      // Por enquanto, usar dados estáticos
      setEstabelecimentos([
        { value: 7, label: 'Fortaleza - CE' },
        { value: 8, label: 'Cariri - CE' },
        { value: 2, label: 'Sobral - CE' }
      ])
    } catch (err: unknown) {
      console.error('Erro ao buscar estabelecimentos:', err)
      setError('Erro ao carregar estabelecimentos')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    estabelecimentos,
    fetchEstabelecimentos,
    isLoading,
    error
  }
}

// Hook para buscar tipos de usuário
export const useTiposUsuario = () => {
  const [tiposUsuario] = useState([
    { value: 'Administrador', label: 'Administrador' },
    { value: 'Diretor', label: 'Diretor' },
    { value: 'Gerencial', label: 'Gerencial' },
    { value: 'Recepção', label: 'Recepção' },
    { value: 'Convidado', label: 'Convidado' },
    { value: 'Aplicação', label: 'Aplicação' },
    { value: 'Marketing', label: 'Marketing' }
  ])

  return {
    tiposUsuario
  }
}
