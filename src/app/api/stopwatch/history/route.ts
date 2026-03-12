import { NextRequest, NextResponse } from 'next/server'
import { SERVICES_CONFIG } from '@/config/env'
import { sessionManager } from '@/services/session'

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
  const date = searchParams.get('date')
  const endDate = searchParams.get('endDate')
  const altaAtendimento = searchParams.get('altaAtendimento') ?? 'false'
  const atendimentosCancelados = searchParams.get('atendimentosCancelados')
  const rows = searchParams.get('rows')

  if (!date) {
    return NextResponse.json({ error: 'Parâmetro date é obrigatório' }, { status: 400 })
  }

  const params = new URLSearchParams()
  if (endDate) params.append('endDate', endDate)
  params.append('altaAtendimento', altaAtendimento)
  if (atendimentosCancelados) params.append('atendimentosCancelados', atendimentosCancelados)
  if (rows) params.append('rows', rows)

  const url = `${SERVICES_CONFIG.APITASY}/api/v1/StopWatchH/HistoryStopwatchH/${date}?${params.toString()}`

  try {
    const headers = await getAuthHeaders()
    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Erro ao buscar histórico: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno ao buscar histórico' }, { status: 500 })
  }
}
