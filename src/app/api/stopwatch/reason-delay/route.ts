import { NextRequest, NextResponse } from 'next/server'
import { SERVICES_CONFIG } from '@/config/env'
import { sessionManager } from '@/services/session'

const NOTIFY_BASE = SERVICES_CONFIG.NOTIFY + 'v1/'

async function getAuthHeaders(request: NextRequest): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  try {
    const session = await sessionManager.getSession()
    if (session?.token) {
      headers['Authorization'] = `Bearer ${session.token}`
    }
  } catch {
    // sem sessão, segue sem auth
  }

  return headers
}

// GET - Listar motivos padrões
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'padrao'
  const dataRegistro = searchParams.get('dataRegistro') || ''

  try {
    const headers = await getAuthHeaders(request)
    let url = ''

    if (type === 'padrao') {
      url = `${NOTIFY_BASE}ReasonDelay/ListarMotivosAtrasosPadroes?msnPadrao=true${dataRegistro ? `&dataRegistro=${dataRegistro}` : ''}`
    } else if (type === 'byNrSequencia') {
      const nrSequencia = searchParams.get('nrSequencia') || '0'
      url = `${NOTIFY_BASE}ReasonDelay/FiltroMotivoAtrasoNumSequencia/${nrSequencia}`
    }

    console.log(`📡 [ReasonDelay] GET ${url}`)
    const res = await fetch(url, { headers })

    if (!res.ok) {
      console.error(`❌ [ReasonDelay] Erro ${res.status}: ${await res.text()}`)
      return NextResponse.json([], { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ [ReasonDelay] Erro ao buscar motivos:', error)
    return NextResponse.json([], { status: 500 })
  }
}

// POST - Criar motivo de atraso
export async function POST(request: NextRequest) {
  try {
    const headers = await getAuthHeaders(request)
    const body = await request.json()

    console.log(`📡 [ReasonDelay] POST ${NOTIFY_BASE}ReasonDelay`)
    const res = await fetch(`${NOTIFY_BASE}ReasonDelay`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error(`❌ [ReasonDelay] Erro ${res.status}: ${errorText}`)
      return NextResponse.json({ error: errorText }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ [ReasonDelay] Erro ao salvar:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
