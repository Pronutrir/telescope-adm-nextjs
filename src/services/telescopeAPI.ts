// Serviço para gerenciar chamadas da API interna do Telescope
import { getApiConfig } from '@/config/env'

class TelescopeAPIService {
    private baseURL: string
    private token: string | null = null
    private timeout: number

    constructor() {
        const config = getApiConfig()
        this.baseURL = config.baseUrl
        this.timeout = config.timeout
    }

    // Configurar token de autenticação (APENAS em memória - segurança)
    setAuthToken(token: string) {
        this.token = token
        // ❌ localStorage REMOVIDO por questões de segurança XSS
        // localStorage.setItem('telescope_token', token)
    }

    // Obter token armazenado (APENAS da memória - segurança)
    getAuthToken(): string | null {
        // ✅ Retorna apenas token da memória (não persiste entre sessões)
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

        try {
            const response = await fetch(url, {
                ...options,
                headers,
                signal: AbortSignal.timeout(this.timeout)
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return response
        } catch (error) {
            console.error(`Erro na requisição para ${url}:`, error)
            throw error
        }
    }

    // GET request
    async get(endpoint: string) {
        const response = await this.request(endpoint, { method: 'GET' })
        return response.json()
    }

    // POST request
    async post(endpoint: string, data?: any) {
        const response = await this.request(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined
        })
        return response.json()
    }

    // PUT request
    async put(endpoint: string, data?: any) {
        const response = await this.request(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined
        })
        return response.json()
    }

    // DELETE request
    async delete(endpoint: string) {
        const response = await this.request(endpoint, { method: 'DELETE' })
        return response.json()
    }

    // Login
    async login(credentials: { username: string; password: string }) {
        try {
            const response = await this.post('/auth/login', credentials)
            if (response.token) {
                this.setAuthToken(response.token)
            }
            return response
        } catch (error) {
            console.error('Erro no login:', error)
            throw error
        }
    }

    // Logout
    async logout() {
        try {
            await this.post('/auth/logout')
        } catch (error) {
            console.error('Erro no logout:', error)
        } finally {
            this.token = null
            // ❌ Não precisa limpar localStorage - token não fica mais lá
            // if (typeof window !== 'undefined') {
            //     localStorage.removeItem('telescope_token')
            // }
        }
    }

    // Obter informações do usuário
    async getCurrentUser() {
        return this.get('/auth/user')
    }

    // Atualizar senha
    async updatePassword(data: { currentPassword: string; newPassword: string }) {
        return this.put('/auth/updatePassword', data)
    }
}

// Exportar instância singleton
const telescopeAPI = new TelescopeAPIService()
export default telescopeAPI
