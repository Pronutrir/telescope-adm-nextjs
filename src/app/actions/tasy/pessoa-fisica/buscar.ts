'use server'

import { SERVICES_CONFIG } from '@/config/env'
import { sessionManager } from '@/services/session'
import { cookies } from 'next/headers'
import type { PessoaFisica } from '@/types/tasy'

interface BuscarPessoaResponse {
  sucesso: boolean
  pessoas: PessoaFisica[]
  total: number
  message?: string
  erro?: string
}

/**
 * 🔍 Server Action: Buscar Pessoa Física no TASY
 * 
 * @param nome - Nome para buscar (mínimo 3 caracteres)
 * @returns Lista de pessoas físicas encontradas
 * 
 * Features:
 * - Autenticação automática via cookies
 * - Token do Redis (SessionData)
 * - Transformação de dados para camelCase
 * - Type-safe nativo
 */
export async function buscarPessoaFisica(nome: string): Promise<BuscarPessoaResponse> {
  try {
    // ✅ Validação de entrada
    if (!nome || nome.trim().length < 3) {
      return {
        sucesso: false,
        pessoas: [],
        total: 0,
        erro: 'O nome deve ter pelo menos 3 caracteres'
      }
    }

    // ✅ Verificar autenticação
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session_id')?.value

    if (!sessionId) {
      return {
        sucesso: false,
        pessoas: [],
        total: 0,
        erro: 'Sessão não encontrada'
      }
    }

    // ✅ Obter token do Redis
    const sessionData = await sessionManager.getSession(sessionId)

    if (!sessionData?.token) {
      return {
        sucesso: false,
        pessoas: [],
        total: 0,
        erro: 'Token de autenticação não encontrado'
      }
    }

    const token = sessionData.token

    // ✅ Buscar na API TASY
    const APITASY_URL = SERVICES_CONFIG.APITASY
    if (!APITASY_URL) {
      return {
        sucesso: false,
        pessoas: [],
        total: 0,
        erro: 'Serviço TASY não configurado'
      }
    }

    const tasyUrl = `${APITASY_URL}/api/v1/PessoaFisica/filtroPessoas/${encodeURIComponent(nome.trim())}`

    console.log(`🔍 [Server Action] Buscando pessoas: ${nome}`)

    const response = await fetch(tasyUrl, {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store', // Sempre dados frescos
      signal: AbortSignal.timeout(10000) // Timeout de 10s
    })

    if (!response.ok) {
      console.error(`❌ [Server Action] Erro na busca: ${response.status} ${response.statusText}`)
      return {
        sucesso: false,
        pessoas: [],
        total: 0,
        erro: `Erro ao buscar pessoas no TASY (${response.status})`
      }
    }

    const data = await response.json()

    // ✅ Extrair e formatar dados (API TASY retorna: { result: [], statusCode, message })
    const pessoasRaw = Array.isArray(data)
      ? data
      : (data.result || data.pessoas || data.data || [])

    const pessoasFormatadas: PessoaFisica[] = pessoasRaw.map((pessoa: any) => ({
      id: pessoa.cD_PESSOA_FISICA,
      nome: pessoa.nM_PESSOA_FISICA,
      cpf: pessoa.nR_CPF || null,
      telefone: pessoa.nR_TELEFONE_CELULAR || null,
      dataNascimento: pessoa.dT_NASCIMENTO,
      isFuncionario: pessoa.iE_FUNCIONARIO === 'S',
      tipoPessoa: pessoa.iE_TIPO_PESSOA,
      dataAtualizacao: pessoa.dT_ATUALIZACAO,
      dataCadastro: pessoa.dT_CADASTRO_ORIGINAL,
      usuarioAtualizacao: pessoa.nM_USUARIO || null
    }))

    console.log(`✅ [Server Action] Encontradas ${pessoasFormatadas.length} pessoas`)

    return {
      sucesso: true,
      pessoas: pessoasFormatadas,
      total: pessoasFormatadas.length,
      message: data.message || 'Busca realizada com sucesso'
    }

  } catch (error) {
    // Timeout
    if (error instanceof Error && error.name === 'TimeoutError') {
      console.error('⏱️ [Server Action] Timeout na busca de pessoas')
      return {
        sucesso: false,
        pessoas: [],
        total: 0,
        erro: 'Timeout ao buscar pessoas - tente novamente'
      }
    }

    // Outros erros
    console.error('❌ [Server Action] Erro ao buscar pessoas:', error)
    return {
      sucesso: false,
      pessoas: [],
      total: 0,
      erro: error instanceof Error ? error.message : 'Erro interno ao buscar pessoas'
    }
  }
}
