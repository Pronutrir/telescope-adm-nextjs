import { NextRequest, NextResponse } from 'next/server'

const NAS_API_BASE = process.env.NEXT_PUBLIC_PDF_API_URL || 'http://20.65.208.119:5656/api/v1'

console.log('🚀 [API Route] Rota /api/nas-transfer carregada com sucesso!')

export async function POST(request: NextRequest) {
  console.log('📥 [API Route] POST recebido em /api/nas-transfer')
  
  try {
    const body = await request.json()
    const { sharePointUrl } = body
    
    console.log('📝 [API Route] Body da requisição:', { sharePointUrl })

    if (!sharePointUrl) {
      console.log('❌ [API Route] sharePointUrl não fornecido')
      return NextResponse.json(
        { message: 'O parametro sharePointUrl e obrigatorio.' },
        { status: 400 }
      )
    }

    console.log(`[API Proxy] Transferindo arquivo do SharePoint: ${sharePointUrl}`)

    // Encaminha a requisicao para a API NAS
    try {
      const response = await fetch(`${NAS_API_BASE}/Nas/transferir-sharepoint-para-nas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/plain, application/json'
        },
        body: JSON.stringify({
          sharePointUrl: sharePointUrl,
          nomeArquivo: null,
          sobrescrever: true,
          pastaDestino: null
        })
      })

      console.log(`[API Proxy] Resposta da API NAS (${response.status}):`, response.statusText)

      // A API sempre retorna JSON, mesmo em caso de erro
      const result = await response.json()
      console.log('[API Proxy] Resposta da API NAS:', result)

      if (!response.ok || !result.sucesso) {
        console.error(`[API Proxy] Erro da API NAS:`, result)
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
      console.error('[API Proxy] Erro ao conectar com API NAS:', fetchError)

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
    console.error('[API Proxy] Erro interno:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
