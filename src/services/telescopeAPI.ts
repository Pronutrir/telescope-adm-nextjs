// Serviço para gerenciar chamadas da API interna do Telescope
class TelescopeAPIService {
    private baseURL: string
    private token: string | null = null

    constructor() {
        this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    }

    // Configurar token de autenticação
    setAuthToken(token: string) {
        this.token = token
        localStorage.setItem('telescope_token', token)
    }

    // Obter token armazenado
    getAuthToken(): string | null {
        if (this.token) return this.token
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('telescope_token')
        }
        return this.token
    }

    // Fazer requisição autenticada
    private async request(endpoint: string, options: RequestInit = {}) {
        const url = `${this.baseURL}${endpoint}`
        const token = this.getAuthToken()

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
            ...(token && { 'Authorization': `Bearer ${token}` })
        }

        const config: RequestInit = {
            ...options,
            headers
        }

        try {
            const response = await fetch(url, config)
            
            // Se token expirou, tentar renovar
            if (response.status === 401) {
                const refreshed = await this.refreshToken()
                if (refreshed) {
                    // Tentar novamente com novo token
                    const newHeaders = { ...headers, 'Authorization': `Bearer ${this.token}` }
                    return fetch(url, { ...config, headers: newHeaders })
                }
            }

            return response
        } catch (error) {
            console.error('Erro na requisição:', error)
            throw error
        }
    }

    // Renovar token de autenticação
    private async refreshToken(): Promise<boolean> {
        try {
            const refreshToken = localStorage.getItem('telescope_refresh_token')
            if (!refreshToken) return false

            const response = await fetch(`${this.baseURL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            })

            if (response.ok) {
                const data = await response.json()
                this.setAuthToken(data.accessToken)
                localStorage.setItem('telescope_refresh_token', data.refreshToken)
                return true
            }
        } catch (error) {
            console.error('Erro ao renovar token:', error)
        }
        return false
    }

    // Buscar estatísticas do dashboard
    async getDashboardStats() {
        try {
            const response = await this.request('/api/dashboard/stats')
            if (response.ok) {
                return await response.json()
            }
            
            // Retornar dados fallback se API não estiver disponível
            return {
                pacientes: 0,
                agendas: 2201,
                medicos: 45,
                consultas: 1890
            }
        } catch (error) {
            console.error('Erro ao buscar stats do dashboard:', error)
            return {
                pacientes: 0,
                agendas: 2201,
                medicos: 45,
                consultas: 1890
            }
        }
    }

    // Buscar dados de pacientes
    async getPacientesData() {
        try {
            const response = await this.request('/api/pacientes/summary')
            if (response.ok) {
                return await response.json()
            }
            return { total: 0, novos: 0, ativos: 0 }
        } catch (error) {
            console.error('Erro ao buscar dados de pacientes:', error)
            return { total: 0, novos: 0, ativos: 0 }
        }
    }

    // Buscar dados de agendas
    async getAgendasData() {
        try {
            const response = await this.request('/api/agendas/summary')
            if (response.ok) {
                return await response.json()
            }
            return { total: 2201, pendentes: 150, confirmadas: 2051 }
        } catch (error) {
            console.error('Erro ao buscar dados de agendas:', error)
            return { total: 2201, pendentes: 150, confirmadas: 2051 }
        }
    }

    // Buscar dados de médicos
    async getMedicosData() {
        try {
            const response = await this.request('/api/medicos/summary')
            if (response.ok) {
                return await response.json()
            }
            return { total: 45, ativos: 42, inativos: 3 }
        } catch (error) {
            console.error('Erro ao buscar dados de médicos:', error)
            return { total: 45, ativos: 42, inativos: 3 }
        }
    }

    // Fazer login
    async login(credentials: { email: string, password: string }) {
        try {
            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            })

            if (response.ok) {
                const data = await response.json()
                this.setAuthToken(data.accessToken)
                localStorage.setItem('telescope_refresh_token', data.refreshToken)
                return { success: true, user: data.user }
            }

            return { success: false, error: 'Credenciais inválidas' }
        } catch (error) {
            console.error('Erro no login:', error)
            return { success: false, error: 'Erro de conexão' }
        }
    }

    // Fazer logout
    logout() {
        this.token = null
        localStorage.removeItem('telescope_token')
        localStorage.removeItem('telescope_refresh_token')
    }

    // Verificar se usuário está autenticado
    isAuthenticated(): boolean {
        return !!this.getAuthToken()
    }
}

// Singleton instance
export const telescopeAPI = new TelescopeAPIService()
export default telescopeAPI
