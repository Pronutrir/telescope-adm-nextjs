import { NextRequest, NextResponse } from 'next/server'
import { SERVICES_CONFIG } from '@/config/env'
import { sessionManager } from '@/services/session'

const NOTIFY_BASE = SERVICES_CONFIG.NOTIFY + 'v1/'

async function getAuthHeaders(): Promise<Record<string, string>> {
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

// POST - Enviar alerta de atraso para setor
export async function POST(request: NextRequest) {
  try {
    const headers = await getAuthHeaders()
    const body = await request.json()

    console.log(`📡 [DelayWarning] POST ${NOTIFY_BASE}DelayWarningMessages/PostMensagensAlertasPaciente`)
    const res = await fetch(`${NOTIFY_BASE}DelayWarningMessages/PostMensagensAlertasPaciente`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error(`❌ [DelayWarning] Erro ${res.status}: ${errorText}`)
      return NextResponse.json({ error: errorText }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ [DelayWarning] Erro ao enviar alerta:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
