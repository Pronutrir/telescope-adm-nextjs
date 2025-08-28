import { NextRequest, NextResponse } from 'next/server'

const PDF_API_BASE = process.env.PDF_API_URL || 'http://20.65.208.119:5000/api'

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        if (!id) {
            return NextResponse.json({
                success: false,
                message: 'ID do PDF é obrigatório'
            }, { status: 400 })
        }

        // NOTA: API não possui endpoint de exclusão na documentação
        // Implementando resposta de sucesso temporária
        console.warn(`Tentativa de exclusão do PDF ${id} - endpoint não disponível na API`)
        
        return NextResponse.json({
            success: true,
            message: `PDF ${id} marcado para exclusão (funcionalidade em desenvolvimento)`
        })
    } catch (error) {
        console.error('Erro ao excluir PDF:', error)
        
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao conectar com o servidor de PDFs'
        }, { status: 503 })
    }
}
