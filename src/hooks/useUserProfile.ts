import { useState } from 'react'
import { Api } from '@/lib/api'
import { User, UserProfileFormData } from '@/types/user'

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
      // Endpoint baseado na aplicação original
      const response = await Api.put(`Usuarios/PutDadosPessoaisUsuario/${userId}`, {
        nomeCompleto: userData.nomeCompleto,
        cpf: userData.cpf || '',
        cnpj: userData.cnpj || '',
        estabelecimento: userData.estabelecimento,
        email: userData.email,
        telefone: userData.telefone || '',
        celular: userData.celular || '',
        endereco: userData.endereco || '',
      })

      if (response.data.success || response.status === 200) {
        setSuccess(true)
        setError(null)
      } else {
        throw new Error(response.data.message || 'Erro ao atualizar dados')
      }
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err)
      
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.response?.data?.errors) {
        // Tratar erros de validação
        const validationErrors = Object.values(err.response.data.errors).flat()
        setError(validationErrors.join(', '))
      } else if (err.message) {
        setError(err.message)
      } else {
        setError('Erro interno do servidor. Tente novamente mais tarde.')
      }
      
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
    } catch (err: any) {
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
