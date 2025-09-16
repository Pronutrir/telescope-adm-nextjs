/**
 * API Route para gerenciamento de cache de tokens
 * POST /api/usershield/cache/clean - Limpar tokens expirados
 * DELETE /api/usershield/cache/clear - Limpar todos os tokens
 * GET /api/usershield/cache/stats - Estatísticas do cache
 */
import { NextRequest, NextResponse } from 'next/server'
import { tokenCacheService } from '@/services/tokenCacheService'

/**
 * GET - Estatísticas do cache
 */
export async function GET(request: NextRequest) {
  try {
    const stats = await tokenCacheService.getCacheStats()
    
    return NextResponse.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas do cache:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno'
      },
      { status: 500 }
    )
  }
}

/**
 * POST - Limpeza de tokens expirados
 */
export async function POST(request: NextRequest) {
  try {
    await tokenCacheService.cleanExpiredTokens()
    const stats = await tokenCacheService.getCacheStats()
    
    return NextResponse.json({
      success: true,
      message: 'Tokens expirados removidos com sucesso',
      stats,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Erro ao limpar cache:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Limpar todos os tokens (força renovação)
 */
export async function DELETE(request: NextRequest) {
  try {
    // Remove o token principal do UserShield
    await tokenCacheService.removeToken('usershield')
    
    // Limpa todos os tokens expirados também
    await tokenCacheService.cleanExpiredTokens()
    
    const stats = await tokenCacheService.getCacheStats()
    
    return NextResponse.json({
      success: true,
      message: 'Cache limpo com sucesso - próxima requisição fará novo login',
      stats,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Erro ao limpar cache completo:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno'
      },
      { status: 500 }
    )
  }
}
