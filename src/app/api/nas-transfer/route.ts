import { NextRequest, NextResponse } from 'next/server'
import { requirePdfApiBaseUrl } from '@/config/env'
import { logger } from '@/lib/logger'

logger.info('🚀 [API Route] /api/nas-transfer pronta')

export async function POST(request: NextRequest) {
  logger.debug('📥 POST /api/nas-transfer recebido')
  
  try {
    const body = await request.json()
    const { sharePointUrl } = body
    
  logger.debug('📝 Body:', { sharePointUrl })

    if (!sharePointUrl) {
  logger.warn('sharePointUrl não fornecido')
      return NextResponse.json(
        { message: 'O parametro sharePointUrl e obrigatorio.' },
        { status: 400 }
      )
    }

  logger.info('[API Proxy] Transferindo arquivo do SharePoint', { sharePointUrl })

    // Encaminha a requisicao para a API NAS
    try {
      const NAS_API_BASE = requirePdfApiBaseUrl()
      const response = await fetch(`${NAS_API_BASE}/Nas/transferir-sharepoint-para-nas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/plain, application/json'
        },
        body: JSON.stringify({
          sharePointUrl: sharePointUrl,
          fileId: "Tasy",
          nomeArquivo: null,
          sobrescrever: true,
          pastaDestino: null
        })
      })

  logger.debug('[API Proxy] Resposta NAS', response.status, response.statusText)

      // A API sempre retorna JSON, mesmo em caso de erro
      const result = await response.json()
  logger.debug('[API Proxy] Body NAS:', result)

      if (!response.ok || !result.sucesso) {
  logger.warn('[API Proxy] Erro da API NAS', result)
        return NextResponse.json(
          {
            sucesso: false,
            mensagem: result.mensagem || `Erro ao transferir arquivo (${response.status})`
          },
          { status: 400 } // Usar 400 em vez do status original para indicar erro de negócio
        )
      }

      return NextResponse.json({
        sucesso: true,
        mensagem: 'Arquivo transferido com sucesso',
        caminhoCompleto: result.caminhoCompleto || result.caminhoArquivo || result.path
      })

    } catch (fetchError) {
  logger.error('[API Proxy] Erro ao conectar com API NAS', fetchError)

      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'Erro ao conectar com API NAS',
          error: 'CONNECTION_ERROR'
        },
        { status: 502 }
      )
    }

  } catch (error) {
  logger.error('[API Proxy] Erro interno', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
