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
