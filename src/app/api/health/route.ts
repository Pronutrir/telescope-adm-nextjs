import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

/**
 * Health check endpoint para Docker
 * GET /api/health
 */
export async function GET() {
    try {
        // Verificações básicas de saúde da aplicação
        const healthData = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            version: process.env.npm_package_version || '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            services: {
                database: 'ok', // Adicionar verificação de BD se necessário
                pdfApi: 'ok',   // Adicionar verificação da API de PDFs se necessário
            }
        }

        return NextResponse.json(healthData, { 
            status: 200,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Content-Type': 'application/json'
            }
        })
    } catch (error) {
        logger.error('Health check failed:', error)
        
        return NextResponse.json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { 
            status: 503,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Content-Type': 'application/json'
            }
        })
    }
}
