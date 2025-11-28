'use server'

import { SERVICES_CONFIG } from '@/config/env'
import { sessionManager } from '@/lib/session'
import { cookies } from 'next/headers'
import type { Especialidade, TipoEvolucao } from '@/types/tasy'

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
      id: Number(item.cD_ESPECIALIDADE),
      descricao: item.dS_ESPECIALIDADE
    })).filter(item => !isNaN(item.id) && item.id !== 0)

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
    // Buscando página 1 com 100 registros para garantir que venha tudo
    const url = `${APITASY_URL}/api/v1/TipoEvolucao/ListarTiposEvolucoes?pagina=1&rows=100`

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
      id: Number(item.cD_TIPO_EVOLUCAO),
      descricao: item.dS_TIPO_EVOLUCAO
    })).filter(item => !isNaN(item.id) && item.id !== 0)

    return { sucesso: true, tipos }

  } catch (error) {
    console.error('Erro ao listar tipos de evolução:', error)
    return { sucesso: false, tipos: [], erro: 'Erro ao buscar tipos de evolução' }
  }
}
