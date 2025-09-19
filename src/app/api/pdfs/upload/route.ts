import { NextRequest, NextResponse } from 'next/server'
import { getPdfApiConfig } from '@/config/env'

const { baseUrl: PDF_API_BASE } = getPdfApiConfig()

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        
        console.log('📤 Iniciando upload de PDF...')
        console.log('🌐 URL da API:', `${PDF_API_BASE}/Pdfs/upload`)
        
        // Verificar se o arquivo foi enviado com o nome correto
        const file = formData.get('arquivo') || formData.get('file')
        if (!file) {
            console.log('❌ Arquivo não encontrado no FormData')
            console.log('📋 Campos disponíveis:', Array.from(formData.keys()))
            return NextResponse.json({
                success: false,
                message: 'Arquivo não encontrado. Use o campo "arquivo" para enviar o PDF.'
            }, { status: 400 })
        }
        
        // Criar novo FormData com o nome correto esperado pela API
        const apiFormData = new FormData()
        apiFormData.append('arquivo', file)
        
        // Verificar se existe nomePersonalizado
        const nomePersonalizado = formData.get('nomePersonalizado')
        let uploadUrl = `${PDF_API_BASE}/Pdfs/upload`
        
        if (nomePersonalizado && typeof nomePersonalizado === 'string') {
            uploadUrl += `?nomePersonalizado=${encodeURIComponent(nomePersonalizado)}`
            console.log('📝 Nome personalizado:', nomePersonalizado)
        }
        
        console.log('📤 Enviando arquivo para:', uploadUrl)
        
        // Fazer proxy do upload para a API real
        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: apiFormData,
            signal: AbortSignal.timeout(30000) // 30 segundos para upload
        })

        console.log('📡 Status da resposta:', response.status, response.statusText)

        if (!response.ok) {
            let errorMessage = `API Error: ${response.status} ${response.statusText}`
            
            // Tentar obter detalhes do erro da API
            try {
                const errorData = await response.text()
                console.log('❌ Detalhes do erro da API:', errorData)
                
                // Tentar fazer parse do JSON se possível
                try {
                    const errorJson = JSON.parse(errorData)
                    errorMessage = errorJson.mensagem || errorMessage
                } catch {
                    errorMessage = errorData || errorMessage
                }
            } catch (parseError) {
                console.log('⚠️ Não foi possível parse do erro da API')
            }
            
            throw new Error(errorMessage)
        }

        const data = await response.json()
        console.log('✅ Upload realizado com sucesso:', data)
        
        return NextResponse.json(data)
    } catch (error) {
        console.error('❌ Erro ao fazer upload:', error)
        
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao conectar com o servidor de PDFs'
        }, { status: 503 })
    }
}
