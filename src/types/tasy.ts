/**
 * Tipos TypeScript para integração com API TASY
 */

/**
 * Interface para dados de Pessoa Física do TASY
 * Formato padronizado em camelCase
 */
export interface PessoaFisica {
  id: string
  nome: string
  cpf?: string | null
  telefone?: string | null
  dataNascimento?: string
  isFuncionario: boolean
  tipoPessoa: number
  dataAtualizacao?: string
  dataCadastro?: string
  usuarioAtualizacao?: string | null
}

/**
 * Interface para resposta da API de busca de pessoas
 */
export interface BuscarPessoasResponse {
  sucesso: boolean
  mensagem?: string
  pessoas: PessoaFisica[]
  total: number
}

/**
 * Interface para Evolução do Paciente
 */
export interface EvolucaoPaciente {
  id: number
  dataEvolucao: string
  nomeProfissional: string
  tipoEvolucaoId: number | string
  especialidadeMedicoId: number
  descricao: string
  dataLiberacao?: string | null
  numeroAtendimento: number
  dataAtualizacao: string
  medicoId: number
  usuario?: string
}

/**
 * Interface para Especialidade Médica
 */
export interface Especialidade {
  id: number | string
  descricao: string
}

/**
 * Interface para Tipo de Evolução
 */
export interface TipoEvolucao {
  id: number | string
  descricao: string
}

/**
 * Interface para Texto Padrão
 */
export interface TextoPadrao {
  sequencia: number
  titulo: string
  texto?: string
}
