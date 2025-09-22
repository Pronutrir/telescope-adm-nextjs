import { NextRequest, NextResponse } from 'next/server'
import { requirePdfApiBaseUrl } from '@/config/env'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID do PDF é obrigatório' },
        { status: 400 }
      )
    }

  logger.info('[API] Editando PDF', { id, updateDataKeys: Object.keys(updateData) })

  const SHAREPOINT_API_BASE = requirePdfApiBaseUrl('public')

        const response = await fetch(`${SHAREPOINT_API_BASE}/Pdfs/editar-arquivo`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    })

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    logger.info('[API] PDF editado com sucesso', { id })
    return NextResponse.json(data)
    
  } catch (error) {
    logger.error('[API] Erro ao editar PDF:', error)
    return NextResponse.json(
      { error: 'Falha ao editar PDF', message: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}
