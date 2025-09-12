'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { authService } from '@/services/auth'
import { tokenStorage } from '@/services/token'
import { axiosConfig } from '@/lib/axios-config'
import { cleanupService } from '@/services/cleanup'
import type { IAuthState, IUser, INotification } from '@/lib/auth-types'

interface AuthContextType extends IAuthState {
    login: (username: string, password: string) => Promise<void>
    logout: () => void
    updatePassword: (username: string, newPassword: string) => Promise<void>
    notification: INotification
    setNotification: (notification: INotification) => void
    clearNotification: () => void
}

type AuthAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_USER'; payload: IUser }
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'CLEAR_ERROR' }
    | { type: 'LOGOUT' }

const initialState: IAuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
}

const authReducer = (state: IAuthState, action: AuthAction): IAuthState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload }
        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            }
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            }
        case 'CLEAR_ERROR':
            return { ...state, error: null }
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            }
        default:
            return state
    }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [ state, dispatch ] = useReducer(authReducer, initialState)
    const [ notification, setNotificationState ] = React.useState<INotification>({
        isOpen: false,
        message: '',
        type: 'info'
    })

    // Verificar se o usuário já está logado ao carregar a aplicação
    useEffect(() => {
        const initializeAuth = async () => {
            console.log('🚀 Iniciando verificação de autenticação...')

            // ✅ LIMPEZA FORÇADA DE TOKENS RESIDUAIS DO LOCALSTORAGE (SEGURANÇA)
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token')
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('telescope_token')
                console.log('🧹 Tokens removidos do localStorage por segurança')
            }

            // Verificar se há dados de sessão inconsistentes e limpar se necessário
            const hasInconsistentData = cleanupService.checkForRemainingData()
            if (hasInconsistentData) {
                const token = tokenStorage.getToken()
                if (!token || !tokenStorage.isTokenValid(token)) {
                    console.log('🧹 Dados de sessão inconsistentes detectados, limpando...')
                    cleanupService.clearAuthData()
                }
            }

            const token = tokenStorage.getToken()
            const refreshToken = tokenStorage.getRefreshToken()

            // ❌ Log sensível removido (segurança)
            // console.log('🔍 Tokens encontrados:', {
            //     token: token ? `${token.substring(0, 20)}...` : 'null',
            //     refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : 'null',
            //     isValid: token ? tokenStorage.isTokenValid(token) : false
            // })

            if (token && tokenStorage.isTokenValid(token)) {
                try {
                    // ❌ Log sensível removido (segurança - produção)
                    if (process.env.NODE_ENV === 'development') {
                        console.log('✅ Token válido, aplicando aos headers e buscando usuário...')
                    }

                    // APLICA O TOKEN AOS HEADERS DE TODAS AS INSTÂNCIAS DO AXIOS
                    axiosConfig.setAuthToken(token)

                    const userResponse = await authService.getUser()
                    console.log('👤 Usuário obtido:', userResponse.result ? 'Sucesso' : 'Falhou')

                    dispatch({ type: 'SET_USER', payload: userResponse.result })
                } catch (error) {
                    console.error('❌ Erro ao inicializar autenticação:', error)
                    tokenStorage.clearTokens()
                    cleanupService.clearAuthData()
                    axiosConfig.clearAuthToken()
                    dispatch({ type: 'LOGOUT' })
                }
            } else {
                console.log('❌ Token inválido ou inexistente, limpando dados e definindo loading como false')
                tokenStorage.clearTokens()
                cleanupService.clearAuthData()
                dispatch({ type: 'SET_LOADING', payload: false })
            }
        }

        initializeAuth()

        // Listener para detectar fechamento da aba/janela
        const handleBeforeUnload = () => {
            // Só limpar se não houver token válido ou se houver problemas
            const token = tokenStorage.getToken()
            if (!token || !tokenStorage.isTokenValid(token)) {
                cleanupService.clearAuthData()
            }
        }

        const handleVisibilityChange = () => {
            // Quando a aba fica oculta, verificar se a sessão ainda é válida
            if (document.hidden) {
                const token = tokenStorage.getToken()
                if (!token || !tokenStorage.isTokenValid(token)) {
                    cleanupService.clearAuthData()
                }
            }
        }

        // Adicionar listeners
        window.addEventListener('beforeunload', handleBeforeUnload)
        document.addEventListener('visibilitychange', handleVisibilityChange)

        // Cleanup
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [])

    const login = async (username: string, password: string): Promise<void> => {
        console.log('🔐 Iniciando processo de login...')
        dispatch({ type: 'SET_LOADING', payload: true })
        dispatch({ type: 'CLEAR_ERROR' })

        try {
            console.log('📤 Fazendo requisição de login...')
            const response = await authService.login(username, password)
            console.log('📥 Resposta do login:', response.pass ? 'Precisa alterar senha' : 'Login bem-sucedido')

            if (response.pass === true) {
                // Usuário precisa alterar a senha
                setNotification({
                    isOpen: true,
                    message: 'Você precisa alterar sua senha',
                    type: 'warning'
                })
                // Redirecionar para página de alteração de senha
                window.location.href = '/auth/recovery'
                return
            }

            // Login bem-sucedido
            // ❌ Log sensível removido (segurança)
            // console.log('💾 Salvando tokens...', {
            //     jwtToken: response.jwtToken ? `${response.jwtToken.substring(0, 20)}...` : 'null',
            //     refreshToken: response.refreshToken ? `${response.refreshToken.substring(0, 20)}...` : 'null'
            // })

            tokenStorage.saveTokens(response.jwtToken, response.refreshToken)

            // APLICA O TOKEN AOS HEADERS DE TODAS AS INSTÂNCIAS DO AXIOS
            // ❌ Log sensível removido (segurança - produção)
            if (process.env.NODE_ENV === 'development') {
                console.log('🔗 Aplicando token aos headers do Axios...')
            }
            axiosConfig.setAuthToken(response.jwtToken)

            // Obter dados completos do usuário
            console.log('👤 Buscando dados do usuário...')
            const userResponse = await authService.getUser()
            console.log('✅ Dados do usuário obtidos, atualizando estado...')
            dispatch({ type: 'SET_USER', payload: userResponse.result })

            setNotification({
                isOpen: true,
                message: 'Login realizado com sucesso!',
                type: 'success'
            })

            // Redirecionar para gerenciador de PDFs após login bem-sucedido
            console.log('🔄 Redirecionando para /admin/gerenciador-pdfs...')
            window.location.href = '/admin/gerenciador-pdfs'

        } catch (error: unknown) {
            let errorMessage = 'Erro inesperado, tente novamente!'

            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { status?: number; data?: { message?: string } } }
                if (axiosError.response?.status === 401) {
                    errorMessage = 'Usuário ou senha incorretos!'
                } else if (axiosError.response?.status === 400) {
                    errorMessage = axiosError.response.data?.message || 'Dados inválidos!'
                }
            }

            dispatch({ type: 'SET_ERROR', payload: errorMessage })
            setNotification({
                isOpen: true,
                message: errorMessage,
                type: 'error'
            })
        }
    }

    const logout = async () => {
        console.log('🚪 Iniciando processo de logout...')

        try {
            // Primeiro chama o serviço de logout (que limpa API e storage)
            await authService.logout()
        } catch (error) {
            console.error('Erro durante logout da API:', error)
        }

        // Garantir limpeza completa dos tokens
        tokenStorage.clearTokens()

        // Remover token dos headers de todas as instâncias do Axios
        axiosConfig.clearAuthToken()

        // Usar serviço de limpeza completa
        cleanupService.clearAuthData()

        // Limpar estado local da aplicação
        dispatch({ type: 'LOGOUT' })

        // Verificar se ainda há dados remanescentes
        const hasRemainingData = cleanupService.checkForRemainingData()
        if (hasRemainingData) {
            console.warn('⚠️ Executando limpeza completa devido a dados remanescentes...')
            await cleanupService.performCompleteCleanup()
        }

        console.log('✅ Logout completo - redirecionando...')

        // Aguardar um momento para garantir que tudo foi limpo
        setTimeout(() => {
            // Redirecionar com replace para não manter histórico
            window.location.replace('/auth/login')
        }, 100)
    }

    const updatePassword = async (username: string, newPassword: string): Promise<void> => {
        dispatch({ type: 'SET_LOADING', payload: true })

        try {
            await authService.updatePassword(username, newPassword)
            setNotification({
                isOpen: true,
                message: 'Senha alterada com sucesso!',
                type: 'success'
            })

            // Após alterar a senha, fazer login automaticamente
            await login(username, newPassword)

        } catch (error: unknown) {
            let errorMessage = 'Erro ao alterar senha!'

            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { message?: string } } }
                errorMessage = axiosError.response?.data?.message || 'Erro ao alterar senha!'
            }

            dispatch({ type: 'SET_ERROR', payload: errorMessage })
            setNotification({
                isOpen: true,
                message: errorMessage,
                type: 'error'
            })
        }
    }

    const setNotification = (newNotification: INotification) => {
        setNotificationState(newNotification)
    }

    const clearNotification = () => {
        setNotificationState({
            isOpen: false,
            message: '',
            type: 'info'
        })
    }

    const value: AuthContextType = {
        ...state,
        login,
        logout,
        updatePassword,
        notification,
        setNotification,
        clearNotification,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
