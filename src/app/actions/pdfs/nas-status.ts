'use server'

/**
 * 🔌 Server Action - Status do NAS
 * Busca informações de conexão com o servidor NAS
 */

interface NasStatusResponse {
    status: 'online' | 'offline' | 'error'
    message?: string
    details?: {
        totalSpace?: string
        usedSpace?: string
        freeSpace?: string
        uptime?: string
        lastCheck?: string
        [key: string]: any
    }
}

export async function getNasStatus(): Promise<NasStatusResponse> {
    try {
        const PDF_API_URL = process.env.PDF_API_URL

        if (!PDF_API_URL) {
            console.error('❌ PDF_API_URL não configurada no .env')
            return {
                status: 'error',
                message: 'Configuração da API não encontrada'
            }
        }

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5s timeout

        const url = `${PDF_API_URL}/Nas/status`
        console.log('📡 Consultando status do NAS:', url)

        const response = await fetch(url, {
            method: 'GET',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            console.error('❌ Erro HTTP ao consultar NAS:', response.status)
            return {
                status: 'error',
                message: `Erro HTTP: ${response.status}`
            }
        }

        const data = await response.json()
        console.log('✅ Status do NAS recebido:', data)

        return {
            status: 'online',
            details: data
        }

    } catch (error: any) {
        console.error('❌ Erro ao buscar status do NAS:', error)

        if (error.name === 'AbortError') {
            return {
                status: 'offline',
                message: 'Timeout ao conectar com o servidor'
            }
        }

        return {
            status: 'error',
            message: error.message || 'Erro desconhecido'
        }
    }
}
