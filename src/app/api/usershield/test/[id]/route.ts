/**
 * Route de teste para verificar rotas dinâmicas
 */
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  
  return NextResponse.json({
    success: true,
    message: `✅ Rota dinâmica funcionando! ID recebido: ${id}`,
    url: request.url,
    method: request.method
  })
}
