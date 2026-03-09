'use server'

import { SERVICES_CONFIG } from '@/config/env'
import { sessionManager } from '@/services/session'
import { cookies } from 'next/headers'
import type { Especialidade, TipoEvolucao, EvolucaoPaciente } from '@/types/tasy'

interface ListarEvolucoesResponse {
  sucesso: boolean
  evolucoes: EvolucaoPaciente[]
  total: number
  message?: string
  erro?: string
}

interface CriarEvolucaoInput {
  dataEvolucao: string
  medicoId: number
  especialidadeId: number | string
  tipoEvolucaoId: number | string
  descricao: string
  pacienteId: number | string
}

interface CriarEvolucaoResponse {
  sucesso: boolean
  message?: string
  erro?: string
}

/**
 * 📋 Server Action: Listar Especialidades Médicas
 */
export async function listarEspecialidades(): Promise<{ sucesso: boolean, especialidades: Especialidade[], erro?: string }> {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session_id')?.value
    if (!sessionId) return { sucesso: false, especialidades: [], erro: 'Sessão não encontrada' }

    const sessionData = await sessionManager.getSession(sessionId)
    if (!sessionData?.token) return { sucesso: false, especialidades: [], erro: 'Token não encontrado' }

    const APITASY_URL = SERVICES_CONFIG.APITASY
    const url = `${APITASY_URL}/api/v1/EspecialidadeMedica/ListarTodasEspecialidadesMedicas`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${sessionData.token}`,
      },
      cache: 'force-cache', // Cachear pois muda pouco
      next: { revalidate: 3600 } // 1 hora
    })

    if (!response.ok) throw new Error(`Erro API: ${response.status}`)

    const data = await response.json()
    const result = data.result || []

    const especialidades: Especialidade[] = result.map((item: any) => ({
      id: item.cD_ESPECIALIDADE, // Aceita string ou number
      descricao: item.dS_ESPECIALIDADE
    })).filter((item: any) => item.id !== null && item.id !== undefined && item.id !== '')

    return { sucesso: true, especialidades }

  } catch (error) {
    console.error('Erro ao listar especialidades:', error)
    return { sucesso: false, especialidades: [], erro: 'Erro ao buscar especialidades' }
  }
}

/**
 * 📋 Server Action: Listar Tipos de Evolução
 */
export async function listarTiposEvolucao(): Promise<{ sucesso: boolean, tipos: TipoEvolucao[], erro?: string }> {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session_id')?.value
    if (!sessionId) return { sucesso: false, tipos: [], erro: 'Sessão não encontrada' }

    const sessionData = await sessionManager.getSession(sessionId)
    if (!sessionData?.token) return { sucesso: false, tipos: [], erro: 'Token não encontrado' }

    const APITASY_URL = SERVICES_CONFIG.APITASY
    // Buscando página 1 com 1000 registros para garantir que venha tudo (limite aumentado de 100 para 1000)
    const url = `${APITASY_URL}/api/v1/TipoEvolucao/ListarTiposEvolucoes?pagina=1&rows=1000`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${sessionData.token}`,
      },
      cache: 'force-cache',
      next: { revalidate: 3600 }
    })

    if (!response.ok) throw new Error(`Erro API: ${response.status}`)

    const data = await response.json()
    const result = data.result || []

    const tipos: TipoEvolucao[] = result.map((item: any) => ({
      id: item.cD_TIPO_EVOLUCAO, // Mantém o valor original (pode ser string ou number)
      descricao: item.dS_TIPO_EVOLUCAO
    })).filter((item: any) => item.id !== null && item.id !== undefined && item.id !== '')

    return { sucesso: true, tipos }

  } catch (error) {
    console.error('Erro ao listar tipos de evolução:', error)
    return { sucesso: false, tipos: [], erro: 'Erro ao buscar tipos de evolução' }
  }
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

/**
 * 📋 Server Action: Criar Nova Evolução do Paciente
 */
export async function criarEvolucaoPaciente(input: CriarEvolucaoInput): Promise<CriarEvolucaoResponse> {
  try {
    // ✅ Verificar autenticação
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session_id')?.value

    if (!sessionId) {
      return { sucesso: false, erro: 'Sessão não encontrada' }
    }

    const sessionData = await sessionManager.getSession(sessionId)

    if (!sessionData?.token) {
      return { sucesso: false, erro: 'Token de autenticação não encontrado' }
    }

    const token = sessionData.token
    const APITASY_URL = SERVICES_CONFIG.APITASY

    if (!APITASY_URL) {
      return { sucesso: false, erro: 'Serviço TASY não configurado' }
    }

    // ✅ Obter usuário da sessão (assumindo que email guarda o username, conforme logs observados)
    const username = sessionData.email || 'Telescope'

    // ✅ Construir Payload
    const payload = {
      dT_EVOLUCAO: input.dataEvolucao,
      cD_MEDICO: input.medicoId,
      cD_ESPECIALIDADE_MEDICO: input.especialidadeId,
      iE_EVOLUCAO_CLINICA: input.tipoEvolucaoId,
      dS_EVOLUCAO: input.descricao,
      iE_TIPO_EVOLUCAO: 1, // Valor fixo conforme legado
      iE_SITUACAO: 'A', // Valor fixo conforme legado
      dT_ATUALIZACAO: new Date().toISOString(),
      nM_USUARIO: username,
      nM_USUARIO_NREC: username,
      cD_PESSOA_FISICA: input.pacienteId,
      cD_EVOLUCAO: 0 // 0 para criação
    }

    console.log('📝 [Server Action] Criando evolução:', payload)

    const url = `${APITASY_URL}/api/v1/EvolucaoPaciente/PostEvolucaoPaciente`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ [Server Action] Erro ao criar evolução: ${response.status}`, errorText)
      return { 
        sucesso: false, 
        erro: `Erro ao criar evolução (${response.status}): ${errorText}` 
      }
    }

    const data = await response.json()
    console.log('✅ [Server Action] Evolução criada com sucesso:', data)

    return {
      sucesso: true,
      message: 'Evolução registrada com sucesso'
    }

  } catch (error) {
    console.error('❌ [Server Action] Erro interno ao criar evolução:', error)
    return {
      sucesso: false,
      erro: error instanceof Error ? error.message : 'Erro interno ao criar evolução'
    }
  }
}
