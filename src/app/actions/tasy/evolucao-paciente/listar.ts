'use server'

import { SERVICES_CONFIG } from '@/config/env'
import { sessionManager } from '@/lib/session'
import { cookies } from 'next/headers'
import type { EvolucaoPaciente } from '@/types/tasy'

interface ListarEvolucoesResponse {
  sucesso: boolean
  evolucoes: EvolucaoPaciente[]
  total: number
  message?: string
  erro?: string
}

/**
 * 📋 Server Action: Listar Evoluções do Paciente
 * 
 * @param codPessoaFisica - Código da Pessoa Física no TASY
 * @param pagina - Número da página (default: 1)
 * @param rows - Registros por página (default: 100)
 */
export async function listarEvolucoesPaciente(
  codPessoaFisica: string | number,
  pagina: number = 1,
  rows: number = 100
): Promise<ListarEvolucoesResponse> {
  try {
    if (!codPessoaFisica) {
      return {
        sucesso: false,
        evolucoes: [],
        total: 0,
        erro: 'Código da pessoa física é obrigatório'
      }
    }

    // ✅ Verificar autenticação
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session_id')?.value

    if (!sessionId) {
      return {
        sucesso: false,
        evolucoes: [],
        total: 0,
        erro: 'Sessão não encontrada'
      }
    }

    // ✅ Obter token do Redis
    const sessionData = await sessionManager.getSession(sessionId)

    if (!sessionData?.token) {
      return {
        sucesso: false,
        evolucoes: [],
        total: 0,
        erro: 'Token de autenticação não encontrado'
      }
    }

    const token = sessionData.token
    const APITASY_URL = SERVICES_CONFIG.APITASY

    if (!APITASY_URL) {
      return {
        sucesso: false,
        evolucoes: [],
        total: 0,
        erro: 'Serviço TASY não configurado'
      }
    }

    // ✅ Construir URL
    const tasyUrl = `${APITASY_URL}/api/v1/EvolucaoPaciente/ListarEvolucaoPaciente?codPessoaFisica=${codPessoaFisica}&pagina=${pagina}&rows=${rows}`

    console.log(`🔍 [Server Action] Buscando evoluções para PF: ${codPessoaFisica}`)

    const response = await fetch(tasyUrl, {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(15000) // 15s timeout
    })

    if (!response.ok) {
      console.error(`❌ [Server Action] Erro na busca de evoluções: ${response.status}`)
      return {
        sucesso: false,
        evolucoes: [],
        total: 0,
        erro: `Erro ao buscar evoluções (${response.status})`
      }
    }

    const data = await response.json()
    const evolucoesRaw = data.result || []

    // ✅ Formatar dados para camelCase
    const evolucoesFormatadas: EvolucaoPaciente[] = evolucoesRaw.map((evol: any) => ({
      id: evol.cD_EVOLUCAO,
      dataEvolucao: evol.dT_EVOLUCAO,
      nomeProfissional: evol.nM_PROFISSIONAL,
      tipoEvolucaoId: evol.iE_EVOLUCAO_CLINICA,
      especialidadeMedicoId: evol.cD_ESPECIALIDADE_MEDICO,
      descricao: evol.dS_EVOLUCAO,
      dataLiberacao: evol.dT_LIBERACAO,
      numeroAtendimento: evol.nR_ATENDIMENTO,
      dataAtualizacao: evol.dT_ATUALIZACAO,
      medicoId: evol.cD_MEDICO,
      usuario: evol.nM_USUARIO
    }))

    console.log(`✅ [Server Action] Encontradas ${evolucoesFormatadas.length} evoluções`)

    return {
      sucesso: true,
      evolucoes: evolucoesFormatadas,
      total: evolucoesFormatadas.length,
      message: 'Evoluções listadas com sucesso'
    }

  } catch (error) {
    console.error('❌ [Server Action] Erro ao buscar evoluções:', error)
    return {
      sucesso: false,
      evolucoes: [],
      total: 0,
      erro: error instanceof Error ? error.message : 'Erro interno ao buscar evoluções'
    }
  }
}
