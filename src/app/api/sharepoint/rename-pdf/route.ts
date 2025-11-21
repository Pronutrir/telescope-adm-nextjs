import { NextRequest, NextResponse } from 'next/server'
import { requirePdfApiBaseUrl } from '@/config/env'
import { logger } from '@/lib/logger'

/**
 * API Route para renomear arquivo PDF no SharePoint
 * POST /api/sharepoint/rename-pdf
 * 
 * Body: {
 *   fileId: string
 *   newFileName: string
 * }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { fileId, newFileName } = body

        if (!fileId || !newFileName) {
            return NextResponse.json(
                { error: 'fileId e newFileName são obrigatórios' },
                { status: 400 }
            )
        }

        logger.info('[API] Renomeando PDF', { fileId, newFileName })

        const SHAREPOINT_API_BASE = requirePdfApiBaseUrl('public')

        // Chamar endpoint de renomeação do SharePoint
        const response = await fetch(`${SHAREPOINT_API_BASE}/Pdfs/renomear-arquivo`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: fileId,
                novoNome: newFileName
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            logger.error('[API] Erro ao renomear PDF no SharePoint', {
                fileId,
                newFileName,
                status: response.status,
                error: errorText
            })
            
            return NextResponse.json(
                { 
                    error: 'Falha ao renomear PDF no SharePoint',
                    details: errorText
                },
                { status: response.status }
            )
        }

        const data = await response.json()
        
        logger.info('[API] PDF renomeado com sucesso', { 
            fileId, 
            newFileName,
            response: data
        })
        
        return NextResponse.json({
            success: true,
            message: 'PDF renomeado com sucesso',
            data
        })
        
    } catch (error) {
        logger.error('[API] Erro ao renomear PDF:', error)
        return NextResponse.json(
            { 
                error: 'Falha ao renomear PDF', 
                message: error instanceof Error ? error.message : 'Erro desconhecido' 
            },
            { status: 500 }
        )
    }
}
