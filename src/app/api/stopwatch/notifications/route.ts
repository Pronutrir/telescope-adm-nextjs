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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const setor = searchParams.get('setor')
  const date = searchParams.get('date')

  if (!setor || !date) {
    return NextResponse.json({ error: 'Parâmetros setor e date são obrigatórios' }, { status: 400 })
  }

  const url = `${NOTIFY_BASE}DelayWarningMessages/ListarMensagensAlertasDoSetor?setorParam=${setor}&dataRegistro=${date}`

  try {
    const headers = await getAuthHeaders()
    console.log('[notifications] upstream URL:', url)
    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.log('[notifications] upstream error:', response.status, errorBody)
      return NextResponse.json(
        { error: `Erro ao buscar notificações: ${response.status}`, detail: errorBody },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno ao buscar notificações' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  const url = `${NOTIFY_BASE}DelayWarningMessages/PutConfirmMensagensAlertas`

  try {
    const headers = await getAuthHeaders()
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Erro ao confirmar alerta: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno ao confirmar alerta' }, { status: 500 })
  }
}
