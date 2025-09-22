import { NextRequest, NextResponse } from 'next/server'
import { requirePdfApiBaseUrl } from '@/config/env'
import { logger } from '@/lib/logger'

logger.info('🚀 [API Route] /api/transferir-pdf pronta')

export async function POST(request: NextRequest) {
  logger.debug('📥 POST /api/transferir-pdf recebido')
  
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
  const response = await fetch(`${NAS_API_BASE}/transferir-sharepoint-para-nas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*'
        },
        body: JSON.stringify({
          sharePointUrl: sharePointUrl,
          nomeArquivo: null,
          sobrescrever: true,
          pastaDestino: null
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        logger.error(`[API Proxy] Erro da API NAS (${response.status}):`, errorText)
        return NextResponse.json(
          {
            sucesso: false,
            mensagem: `Erro ao transferir arquivo: ${errorText}`
          },
          { status: response.status }
        )
      }

      const result = await response.json()
      logger.debug('[API Proxy] Resposta NAS', result)

      return NextResponse.json({
        sucesso: true,
        mensagem: 'Arquivo transferido com sucesso',
        caminhoCompleto: result.caminhoArquivo || result.path || result.caminhoCompleto
      })

    } catch (fetchError) {
      logger.error('[API Proxy] Erro ao conectar com API NAS:', fetchError)

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
    logger.error('[API Proxy] Erro interno:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
