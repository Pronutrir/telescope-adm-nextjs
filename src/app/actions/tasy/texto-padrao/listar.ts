'use server'

import { SERVICES_CONFIG } from '@/config/env'
import { sessionManager } from '@/lib/session'
import { cookies } from 'next/headers'

export async function listarTextosPadroesReduzidos(codNotasClinicas: number) {
    try {
        // ✅ Verificar autenticação
        const cookieStore = await cookies()
        const sessionId = cookieStore.get('session_id')?.value

        if (!sessionId) {
            return { sucesso: false, erro: 'Sessão não encontrada' }
        }

        // ✅ Obter token do Redis
        const sessionData = await sessionManager.getSession(sessionId)

        if (!sessionData?.token) {
            return { sucesso: false, erro: 'Token de autenticação não encontrado' }
        }

        const token = sessionData.token
        const APITASY_URL = SERVICES_CONFIG.APITASY

        if (!APITASY_URL) {
            return { sucesso: false, erro: 'Serviço TASY não configurado' }
        }

        console.log(`🔍 [Server Action] Buscando textos padrões reduzidos para nota clínica: ${codNotasClinicas}`)
        
        const url = `${APITASY_URL}/api/v1/TextoPadrao/ListarTextosPadroesInstituicaoReduzidos?codNotasClinicas=${codNotasClinicas}`
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
            signal: AbortSignal.timeout(15000)
        })

        if (!response.ok) {
            console.error(`❌ [Server Action] Erro ao buscar textos padrões: ${response.status}`)
            return { sucesso: false, erro: `Erro ao buscar textos padrões (${response.status})` }
        }

        const data = await response.json()
        const textosRaw = data.result || []

        const textos = textosRaw.map((t: any) => ({
            sequencia: Number(t.nR_SEQUENCIA || t.sequencia),
            titulo: t.dS_TITULO || t.titulo || 'Sem título',
            texto: t.dS_TEXTO || t.texto
        })).filter((t: any) => !isNaN(t.sequencia) && t.sequencia !== 0)
        
        return {
            sucesso: true,
            textos: textos
        }
    } catch (error) {
        console.error('❌ [Server Action] Erro ao listar textos padrões reduzidos:', error)
        return {
            sucesso: false,
            erro: 'Erro ao buscar textos padrões',
            textos: []
        }
    }
}

export async function obterTextoPadraoCompleto(nrSequencia: number) {
    try {
        // ✅ Verificar autenticação
        const cookieStore = await cookies()
        const sessionId = cookieStore.get('session_id')?.value

        if (!sessionId) {
            return { sucesso: false, erro: 'Sessão não encontrada' }
        }

        // ✅ Obter token do Redis
        const sessionData = await sessionManager.getSession(sessionId)

        if (!sessionData?.token) {
            return { sucesso: false, erro: 'Token de autenticação não encontrado' }
        }

        const token = sessionData.token
        const APITASY_URL = SERVICES_CONFIG.APITASY

        if (!APITASY_URL) {
            return { sucesso: false, erro: 'Serviço TASY não configurado' }
        }

        console.log(`🔍 [Server Action] Buscando texto padrão completo sequencia: ${nrSequencia}`)
        
        const url = `${APITASY_URL}/api/v1/TextoPadrao/ListarTextosPadroesInstituicao?nrSequencia=${nrSequencia}`
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
            signal: AbortSignal.timeout(15000)
        })

        if (!response.ok) {
            console.error(`❌ [Server Action] Erro ao buscar texto padrão completo: ${response.status}`)
            return { sucesso: false, erro: `Erro ao buscar texto padrão completo (${response.status})` }
        }

        const data = await response.json()
        const resultado = data.result
        const textoRaw = Array.isArray(resultado) && resultado.length > 0 ? resultado[0] : null

        const texto = textoRaw ? {
            sequencia: Number(textoRaw.nR_SEQUENCIA || textoRaw.sequencia),
            titulo: textoRaw.dS_TITULO || textoRaw.titulo,
            texto: textoRaw.dS_TEXTO || textoRaw.texto
        } : null

        return {
            sucesso: true,
            texto: texto
        }
    } catch (error) {
        console.error('❌ [Server Action] Erro ao obter texto padrão completo:', error)
        return {
            sucesso: false,
            erro: 'Erro ao buscar conteúdo do texto padrão',
            texto: null
        }
    }
}
