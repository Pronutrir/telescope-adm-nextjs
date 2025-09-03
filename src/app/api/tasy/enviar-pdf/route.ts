import { NextRequest, NextResponse } from 'next/server'

const TASY_API_BASE = process.env.TASY_API_URL || 'https://localhost:44326/api/v2'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { contaPaciente, textoAnexo, nomeArquivo } = body

        if (!contaPaciente) {
            return NextResponse.json(
                { error: 'Número da conta do paciente é obrigatório' },
                { status: 400 }
            )
        }

        if (!textoAnexo) {
            return NextResponse.json(
                { error: 'Texto do anexo é obrigatório' },
                { status: 400 }
            )
        }

        console.log(`📤 Enviando PDF para TASY - Conta: ${contaPaciente}, Arquivo: ${nomeArquivo}`)

        // Criar AbortController para timeout manual
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 segundos

        try {
            const response = await fetch(
                `${TASY_API_BASE}/ContaPaciente/UploadAnexoContaPaciente`,
                {
                    method: 'POST',
                    headers: {
                        'accept': '*/*',
                        'Content-Type': 'application/json-patch+json; x-api-version=2.0',
                    },
                    body: JSON.stringify({
                        numero_Conta_Paciente: contaPaciente,
                        textoAnexo: textoAnexo
                    }),
                    signal: controller.signal
                }
            )

            // Limpar timeout se a requisição foi bem-sucedida
            clearTimeout(timeoutId)

        if (!response.ok) {
            const errorText = await response.text()
            console.error('❌ Erro na API TASY:', response.status, response.statusText, errorText)
            return NextResponse.json(
                { 
                    error: 'Erro ao enviar PDF para o TASY',
                    details: errorText,
                    status: response.status
                },
                { status: response.status }
            )
        }

        const result = await response.text()
        console.log(`✅ PDF enviado com sucesso para TASY - Conta: ${contaPaciente}`)

        return NextResponse.json({
            success: true,
            message: 'PDF enviado com sucesso para o TASY',
            contaPaciente,
            nomeArquivo,
            tasyResponse: result
        })

        } catch (fetchError) {
            // Limpar timeout em caso de erro
            clearTimeout(timeoutId)
            
            if (fetchError instanceof Error && fetchError.name === 'AbortError') {
                console.error('❌ Timeout na API TASY')
                return NextResponse.json(
                    { error: 'Timeout ao enviar PDF para o TASY' },
                    { status: 408 }
                )
            }
            
            throw fetchError // Re-throw para ser capturado pelo catch externo
        }

    } catch (error) {
        console.error('❌ Erro ao enviar PDF para TASY:', error)
        
        if (error instanceof Error && error.name === 'AbortError') {
            return NextResponse.json(
                { error: 'Timeout ao enviar PDF para o TASY. Tente novamente.' },
                { status: 408 }
            )
        }

        return NextResponse.json(
            { error: 'Erro interno do servidor ao enviar PDF' },
            { status: 500 }
        )
    }
}
