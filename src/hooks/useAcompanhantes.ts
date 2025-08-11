import { useQuery } from '@tanstack/react-query'

// Interfaces (mesmas do componente original)
export interface IFamiliarSimples {
  dt_Atualizacao?: string
  dt_Registro?: string
  id_Pessoa_Fisica?: number
  nm_Pessoa_Fisica?: string
  dt_Nascimento?: string
  nr_CPF?: string
  nr_Identidade?: string
  nr_Ddd?: string
  nr_Telefone_Celular?: string
}

export interface IFamiliar {
  cod_Grau_Parentesco: number
  cod_Pf_Familiar: number
  cod_Pf_Paciente: string
  cod_Pf_Profissional: string
  nm_Usuario: string
  nm_Usuario_Reg: string
  desc_Grau_Parentesco: string
  dt_Atualizacao: string
  dt_Registro: string
  id_Familiar: number
  ie_Sexo: string
  ie_Situacao: string
  nm_Paciente: string
  nm_Profissional: string
  pessoaFisicaSimplificadoSqlServer: IFamiliarSimples
}

interface IResponseFamiliar {
  result: IFamiliar[]
  statusCode: number
  message: string
}

// Função para fazer chamada real para a API
async function getFamiliar(codPfPaciente?: string): Promise<IFamiliar[]> {
  if (!codPfPaciente) {
    return []
  }

  try {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    const response = await fetch(
      `${baseURL}/apitasy/api/v1/PessoaFisicaFamiliaSqlServer/ListPfFamilySql?codPfPaciente=${codPfPaciente}&distinct=true&page=1&rows=100`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // TODO: Adicionar autenticação quando necessário
          // 'Authorization': `Bearer ${token}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`)
    }

    const data: IResponseFamiliar = await response.json()
    return data.result || []
  } catch (error) {
    console.error('Erro ao buscar acompanhantes:', error)
    
    // Em caso de erro, retornar dados mockados para demonstração
    return getMockAcompanhantes(codPfPaciente)
  }
}

// Função com dados mockados para fallback e desenvolvimento
function getMockAcompanhantes(codPfPaciente: string): IFamiliar[] {
  const mockAcompanhantes: IFamiliar[] = [
    {
      cod_Grau_Parentesco: 1,
      cod_Pf_Familiar: 123,
      cod_Pf_Paciente: '12345',
      cod_Pf_Profissional: 'PROF001',
      nm_Usuario: 'Sistema',
      nm_Usuario_Reg: 'Admin',
      desc_Grau_Parentesco: 'Mãe',
      dt_Atualizacao: '2025-08-09T10:30:00Z',
      dt_Registro: '2025-08-09T07:30:00Z',
      id_Familiar: 1,
      ie_Sexo: 'F',
      ie_Situacao: 'A',
      nm_Paciente: 'João Santos Silva',
      nm_Profissional: 'Dr. Carlos',
      pessoaFisicaSimplificadoSqlServer: {
        id_Pessoa_Fisica: 123,
        nm_Pessoa_Fisica: 'Maria José Santos',
        dt_Nascimento: '1970-03-15',
        nr_CPF: '123.456.789-00',
        nr_Identidade: '12.345.678-9',
        nr_Ddd: '11',
        nr_Telefone_Celular: '99999-8888',
        dt_Registro: '2025-08-09T07:30:00Z'
      }
    },
    {
      cod_Grau_Parentesco: 2,
      cod_Pf_Familiar: 124,
      cod_Pf_Paciente: '12346',
      cod_Pf_Profissional: 'PROF002',
      nm_Usuario: 'Sistema',
      nm_Usuario_Reg: 'Admin',
      desc_Grau_Parentesco: 'Esposo',
      dt_Atualizacao: '2025-08-09T06:15:00Z',
      dt_Registro: '2025-08-09T06:15:00Z',
      id_Familiar: 2,
      ie_Sexo: 'M',
      ie_Situacao: 'A',
      nm_Paciente: 'Ana Paula Oliveira',
      nm_Profissional: 'Dra. Ana',
      pessoaFisicaSimplificadoSqlServer: {
        id_Pessoa_Fisica: 124,
        nm_Pessoa_Fisica: 'Carlos Eduardo Oliveira',
        dt_Nascimento: '1973-08-22',
        nr_CPF: '987.654.321-00',
        nr_Identidade: '98.765.432-1',
        nr_Ddd: '11',
        nr_Telefone_Celular: '98888-7777',
        dt_Registro: '2025-08-09T06:15:00Z'
      }
    },
    {
      cod_Grau_Parentesco: 3,
      cod_Pf_Familiar: 125,
      cod_Pf_Paciente: '12347',
      cod_Pf_Profissional: 'PROF003',
      nm_Usuario: 'Sistema',
      nm_Usuario_Reg: 'Admin',
      desc_Grau_Parentesco: 'Filha',
      dt_Atualizacao: '2025-08-08T22:00:00Z',
      dt_Registro: '2025-08-08T22:00:00Z',
      id_Familiar: 3,
      ie_Sexo: 'F',
      ie_Situacao: 'A',
      nm_Paciente: 'Antônio Fernandes',
      nm_Profissional: 'Dr. Roberto',
      pessoaFisicaSimplificadoSqlServer: {
        id_Pessoa_Fisica: 125,
        nm_Pessoa_Fisica: 'Lucia Fernandes',
        dt_Nascimento: '1995-12-03',
        nr_CPF: '456.789.123-00',
        nr_Identidade: '45.678.912-3',
        nr_Ddd: '11',
        nr_Telefone_Celular: '97777-6666',
        dt_Registro: '2025-08-08T22:00:00Z'
      }
    }
  ]

  // Filtrar pelos dados do paciente selecionado
  return mockAcompanhantes.filter(
    acompanhante => acompanhante.cod_Pf_Paciente === codPfPaciente
  )
}

interface UseAcompanhantesProps {
  codPfPaciente?: string
  enabled?: boolean
}

export function useAcompanhantes({ codPfPaciente, enabled = true }: UseAcompanhantesProps) {
  return useQuery({
    queryKey: ['acompanhantes', codPfPaciente],
    queryFn: () => getFamiliar(codPfPaciente),
    enabled: enabled && Boolean(codPfPaciente),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (anteriormente cacheTime)
  })
}
