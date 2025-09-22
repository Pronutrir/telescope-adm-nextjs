import { useQuery } from '@tanstack/react-query'
import { useDebounce } from './useDebounce'

// Interface para o paciente
export interface IPaciente {
  cD_PESSOA_FISICA?: string
  nM_PESSOA_FISICA: string
  dT_NASCIMENTO?: string
  nR_ATENDIMENTO?: number
}

interface IResponsePacientes {
  result: IPaciente[]
  statusCode: number
  message: string
}

// Função para buscar pacientes na API
async function getPacientes(searchTerm?: string): Promise<IPaciente[]> {
  if (!searchTerm || searchTerm.length < 2) {
    return []
  }

  try {
    // Construir URL com parâmetros de busca
    const searchParams = new URLSearchParams({
      nome: searchTerm,
      page: '1',
      rows: '20'
    })

    // Usar rewrite do Next para resolver para a API de backend
    const response = await fetch(`/apitasy/api/v1/PacientesSinaisVitais/Search?${searchParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // TODO: Adicionar autenticação quando necessário
        // 'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`)
    }

    const data: IResponsePacientes = await response.json()
    return data.result || []
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error)
    
    // Em caso de erro, retornar dados mockados para demonstração
    return getMockPacientes(searchTerm)
  }
}

// Função com dados mockados para fallback e desenvolvimento
function getMockPacientes(searchTerm: string): IPaciente[] {
  const mockPacientes: IPaciente[] = [
    {
      cD_PESSOA_FISICA: '12345',
      nM_PESSOA_FISICA: 'João Santos Silva',
      dT_NASCIMENTO: '1980-05-15',
      nR_ATENDIMENTO: 2025001
    },
    {
      cD_PESSOA_FISICA: '12346',
      nM_PESSOA_FISICA: 'Ana Paula Oliveira',
      dT_NASCIMENTO: '1975-08-22',
      nR_ATENDIMENTO: 2025002
    },
    {
      cD_PESSOA_FISICA: '12347',
      nM_PESSOA_FISICA: 'Antônio Fernandes',
      dT_NASCIMENTO: '1965-12-03',
      nR_ATENDIMENTO: 2025003
    },
    {
      cD_PESSOA_FISICA: '12348',
      nM_PESSOA_FISICA: 'Marcos Silva',
      dT_NASCIMENTO: '1990-03-18',
      nR_ATENDIMENTO: 2025004
    },
    {
      cD_PESSOA_FISICA: '12349',
      nM_PESSOA_FISICA: 'Maria José Santos',
      dT_NASCIMENTO: '1985-07-12',
      nR_ATENDIMENTO: 2025005
    },
    {
      cD_PESSOA_FISICA: '12350',
      nM_PESSOA_FISICA: 'Carlos Eduardo Silva',
      dT_NASCIMENTO: '1978-11-30',
      nR_ATENDIMENTO: 2025006
    },
    {
      cD_PESSOA_FISICA: '12351',
      nM_PESSOA_FISICA: 'Lucia Fernandes Costa',
      dT_NASCIMENTO: '1992-02-25',
      nR_ATENDIMENTO: 2025007
    },
    {
      cD_PESSOA_FISICA: '12352',
      nM_PESSOA_FISICA: 'Roberto Silva Santos',
      dT_NASCIMENTO: '1965-09-14',
      nR_ATENDIMENTO: 2025008
    }
  ]

  // Filtrar por nome
  return mockPacientes.filter(paciente =>
    paciente.nM_PESSOA_FISICA.toLowerCase().includes(searchTerm.toLowerCase())
  )
}

interface UsePacientesProps {
  searchTerm: string
  enabled?: boolean
  debounceMs?: number
}

export function usePacientes({ 
  searchTerm, 
  enabled = true, 
  debounceMs = 300 
}: UsePacientesProps) {
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs)

  return useQuery({
    queryKey: ['pacientes', debouncedSearchTerm],
    queryFn: () => getPacientes(debouncedSearchTerm),
    enabled: enabled && Boolean(debouncedSearchTerm) && debouncedSearchTerm.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (anteriormente cacheTime)
  })
}
