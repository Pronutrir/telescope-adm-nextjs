'use server'

import { SERVICES_CONFIG } from '@/config/env'
import { sessionManager } from '@/services/session'
import { cookies } from 'next/headers'

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
