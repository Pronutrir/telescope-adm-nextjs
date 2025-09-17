/**
 * API Route para testar se as variáveis de ambiente estão sendo carregadas
 * GET /api/test/env
 */
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    env: {
      USERSHIELD_USERNAME: process.env.USERSHIELD_USERNAME ? '✅ Carregada' : '❌ Não encontrada',
      USERSHIELD_PASSWORD: process.env.USERSHIELD_PASSWORD ? '✅ Carregada' : '❌ Não encontrada',
      NODE_ENV: process.env.NODE_ENV
    },
    values: {
      username: process.env.USERSHIELD_USERNAME || 'undefined',
      password: process.env.USERSHIELD_PASSWORD ? '[REDACTED]' : 'undefined'
    }
  })
}
