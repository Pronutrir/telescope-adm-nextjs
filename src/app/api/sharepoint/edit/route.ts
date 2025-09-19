import { NextRequest, NextResponse } from 'next/server'
import { getPdfApiConfig } from '@/config/env'

const { publicUrl: SHAREPOINT_API_BASE } = getPdfApiConfig()

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

    console.log(`✏️ [API] Editando PDF ID: ${id}`, updateData)

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
    
    console.log(`✅ [API] PDF ${id} editado com sucesso`)
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('❌ [API] Erro ao editar PDF:', error)
    return NextResponse.json(
      { error: 'Falha ao editar PDF', message: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}
