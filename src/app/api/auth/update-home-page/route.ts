/**
 * 🏠 API: Atualizar Página Inicial Preferida
 * 
 * PUT /api/auth/update-home-page
 * Body: { homePage: string }
 * 
 * Salva a página inicial preferida do usuário na sessão Redis
 */

import { NextRequest, NextResponse } from 'next/server'
import { sessionManager } from '@/lib/session'

export async function PUT(request: NextRequest) {
    try {
        // 🍪 Verificar cookie de sessão
        const sessionId = request.cookies.get('session_id')?.value

        if (!sessionId) {
            return NextResponse.json(
                { error: 'Sessão não encontrada' },
                { status: 401 }
            )
        }

        // 📦 Obter dados do corpo
        const body = await request.json()
        const { homePage } = body

        if (!homePage || typeof homePage !== 'string') {
            return NextResponse.json(
                { error: 'homePage é obrigatório e deve ser uma string' },
                { status: 400 }
            )
        }

        // ✅ Validar formato do path (deve começar com /admin/)
        if (!homePage.startsWith('/admin/')) {
            return NextResponse.json(
                { error: 'homePage deve começar com /admin/' },
                { status: 400 }
            )
        }

        // 🔄 Atualizar sessão com nova preferência
        console.log(`🏠 [API] Atualizando sessão ${sessionId} com homePage: ${homePage}`)
        const updated = await sessionManager.updateSession(sessionId, {
            preferredHomePage: homePage
        })
        console.log(`🏠 [API] Resultado da atualização:`, updated)

        // Verificar se foi salvo corretamente
        const verificacao = await sessionManager.getSession(sessionId)
        console.log(`🏠 [API] Verificação - preferredHomePage na sessão:`, verificacao?.preferredHomePage)

        console.log(`🏠 [API] Página inicial atualizada: ${homePage} para sessão ${sessionId}`)

        return NextResponse.json({
            success: true,
            message: 'Página inicial atualizada com sucesso',
            homePage
        })

    } catch (error) {
        console.error('❌ Erro ao atualizar página inicial:', error)
        return NextResponse.json(
            { error: 'Erro ao atualizar página inicial' },
            { status: 500 }
        )
    }
}
