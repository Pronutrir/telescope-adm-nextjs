'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { authService } from '@/services/auth'
import { tokenStorage } from '@/services/token'
import { axiosConfig } from '@/lib/api'
import { cleanupService } from '@/services/cleanup'
import { setApiToken } from '@/lib/api'
import type { IAuthState, IUser, INotification } from '@/types/auth'

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
    const hasInitialized = React.useRef(false) // ✅ Prevenir execuções duplicadas

    // 🔄 Verificar sessão periodicamente
    useEffect(() => {
        // Só verificar se já está autenticado
        if (!state.isAuthenticated || !state.user) return

        const checkSession = async () => {
            try {
                const response = await fetch('/api/auth/me', {
                    credentials: 'include',
                    cache: 'no-store'
                })
                
                if (!response.ok) {
                    console.warn('⚠️ [AuthContext] Sessão expirada durante uso')
                    setApiToken(null)
                    dispatch({ type: 'LOGOUT' })
                }
            } catch (error) {
                console.error('❌ [AuthContext] Erro ao verificar sessão:', error)
                setApiToken(null)
                dispatch({ type: 'LOGOUT' })
            }
        }

        // ⚡ Verificar a cada 5 minutos
        const intervalId = setInterval(checkSession, 5 * 60 * 1000)

        return () => clearInterval(intervalId)
    }, [state.isAuthenticated, state.user])

    // Verificar se o usuário já está logado ao carregar a aplicação
    useEffect(() => {
        // ✅ Prevenir múltiplas execuções (React Strict Mode)
        if (hasInitialized.current) {
            console.log('⏭️ initializeAuth já executou, pulando...')
            return
        }
        hasInitialized.current = true

        const initializeAuth = async () => {
            // ✅ OTIMIZAÇÃO: Remover limpeza desnecessária de localStorage
            // (já foi feita em carregamentos anteriores)

            try {
                // ✅ Buscar dados do usuário via API (session_id vai automaticamente no cookie httpOnly)
                const response = await fetch('/api/auth/me', {
                    credentials: 'include', // ✅ Garantir que cookies sejam enviados
                    cache: 'no-store' // ✅ Evitar cache para dados de sessão
                })
                
                if (!response.ok) {
                    throw new Error('Sessão inválida ou expirada')
                }
                
                const userData = await response.json()
                
                // Setar token JWT do Redis para as instâncias Axios (Api/ApiNotify)
                if (userData.token) {
                    setApiToken(userData.token)
                }
                
                dispatch({ type: 'SET_USER', payload: userData })

            } catch (error) {
                // Sessão inexistente ou expirada
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
            // Quando a aba fica visível novamente, verificar sessão
            if (!document.hidden && state.isAuthenticated && state.user) {
                console.log('👁️ [AuthContext] Aba visível - verificando sessão...')
                fetch('/api/auth/me', {
                    credentials: 'include',
                    cache: 'no-store'
                })
                    .then(response => {
                        if (!response.ok) {
                            console.warn('⚠️ [AuthContext] Sessão expirada ao retornar')
                            setApiToken(null)
                            dispatch({ type: 'LOGOUT' })
                        }
                    })
                    .catch(() => {
                        console.error('❌ [AuthContext] Erro ao verificar sessão')
                        setApiToken(null)
                        dispatch({ type: 'LOGOUT' })
                    })
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

            // 🐛 DEBUG - Verificar resposta da API
            console.log('📦 [LOGIN] Resposta da API:', {
                hasJwtToken: !!response.jwtToken,
                jwtTokenLength: response.jwtToken?.length || 0,
                hasRefreshToken: !!response.refreshToken,
                refreshTokenLength: response.refreshToken?.length || 0,
                responseKeys: Object.keys(response)
            })

            if (!response.jwtToken || !response.refreshToken) {
                console.error('❌ [LOGIN] API não retornou tokens válidos!')
                throw new Error('API não retornou tokens de autenticação')
            }

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

            // 🚫 REMOVIDO: tokenInterceptor.scheduleTokenRefresh() - Sistema JWT legado

            setNotification({
                isOpen: true,
                message: 'Login realizado com sucesso!',
                type: 'success'
            })
            
            // 🐛 DEBUG - Verificar cookies antes do redirect
            console.log('🍪 [LOGIN] Cookies antes do redirect:', {
                allCookies: document.cookie,
                hasToken: document.cookie.includes('token='),
                hasRefreshToken: document.cookie.includes('refreshToken=')
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
        console.log('🚪 Logout simples - apenas limpando estado local...')

        // Limpar token das instâncias Axios
        setApiToken(null)

        // ✅ Limpeza mínima e rápida
        try {
            // Limpar apenas dados locais sensíveis (sem API calls pesadas)
            const sensitiveKeys = ['user', 'authState', 'sessionData']
            sensitiveKeys.forEach(key => localStorage.removeItem(key))
            
            // Limpar sessionStorage
            sessionStorage.clear()
        } catch (error) {
            console.warn('Erro na limpeza local:', error)
        }

        // ✅ Limpar estado da aplicação
        dispatch({ type: 'LOGOUT' })

        console.log('✅ Logout local completo')
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
