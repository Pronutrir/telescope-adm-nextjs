'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface MenuVisibilityContextType {
    // Estado de visibilidade das rotas
    routeVisibility: { [ routeName: string ]: boolean }

    // Funções para controlar visibilidade
    toggleRouteVisibility: (routeName: string) => void
    setRouteVisibility: (routeName: string, visible: boolean) => void
    resetToDefaults: () => void

    // Estado do modal de configuração
    isConfigModalOpen: boolean
    setConfigModalOpen: (open: boolean) => void
}

const MenuVisibilityContext = createContext<MenuVisibilityContextType | undefined>(undefined)

interface MenuVisibilityProviderProps {
    children: ReactNode
}

// Configuração padrão de visibilidade baseada nas rotas
// Por padrão, todos os itens estarão habilitados
// ⚠️ Sincronizar com routes.ts - usar nomes exatos
const DEFAULT_VISIBILITY: Record<string, boolean> = {
    'Dashboard': true,
    'Biblioteca de Componentes': true,
    'Gerenciador de PDFs': true,
    'Usuários': true,
    'Seu Perfil': true
}

export function MenuVisibilityProvider({ children }: MenuVisibilityProviderProps) {
    const [ routeVisibility, setRouteVisibilityState ] = useState<{ [ routeName: string ]: boolean }>(DEFAULT_VISIBILITY)
    const [ isConfigModalOpen, setConfigModalOpen ] = useState(false)
    const [ isLoaded, setIsLoaded ] = useState(false)

    // Carregar configurações do localStorage na inicialização
    useEffect(() => {
        // 🚨 RESET FORÇADO TEMPORÁRIO - Garante que todos vejam todas as rotas
        const FORCE_RESET = true // TODO: Mudar para false após deploy
        
        if (FORCE_RESET) {
            console.log('🔄 RESET FORÇADO ATIVADO - Todos os itens visíveis')
            setRouteVisibilityState(DEFAULT_VISIBILITY)
            localStorage.setItem('menuVisibility', JSON.stringify(DEFAULT_VISIBILITY))
            setIsLoaded(true)
            return
        }
        
        const savedVisibility = localStorage.getItem('menuVisibility')
        
        if (savedVisibility) {
            try {
                const parsed = JSON.parse(savedVisibility)
                
                // Verificar se as configurações salvas são antigas (tem muitos false)
                const falseCount = Object.values(parsed).filter(v => v === false).length
                const totalCount = Object.keys(parsed).length
                const falsePercentage = totalCount > 0 ? (falseCount / totalCount) * 100 : 0
                
                console.log(`� Configurações salvas: ${falseCount}/${totalCount} ocultos (${falsePercentage.toFixed(1)}%)`)
                
                // FORÇAR reset se tiver mais de 30% ocultos (configurações antigas)
                if (falsePercentage > 30) {
                    console.log('🔄 DETECTADAS CONFIGURAÇÕES ANTIGAS! Resetando tudo...')
                    console.log('   ❌ Configuração antiga:', parsed)
                    console.log('   ✅ Nova configuração:', DEFAULT_VISIBILITY)
                    
                    setRouteVisibilityState(DEFAULT_VISIBILITY)
                    localStorage.setItem('menuVisibility', JSON.stringify(DEFAULT_VISIBILITY))
                    
                    // Força reload para garantir que os componentes usem os novos valores
                    setTimeout(() => {
                        console.log('🔄 Forçando atualização...')
                        setRouteVisibilityState({ ...DEFAULT_VISIBILITY })
                    }, 100)
                } else {
                    // Mesclar com defaults para garantir que novos itens apareçam
                    const merged = { ...DEFAULT_VISIBILITY, ...parsed }
                    console.log('✅ Usando configurações válidas (mescladas)')
                    setRouteVisibilityState(merged)
                }
            } catch (error) {
                console.warn('❌ Erro ao carregar configurações:', error)
                setRouteVisibilityState(DEFAULT_VISIBILITY)
                localStorage.setItem('menuVisibility', JSON.stringify(DEFAULT_VISIBILITY))
            }
        } else {
            console.log('📝 Primeira vez - usando padrões')
            localStorage.setItem('menuVisibility', JSON.stringify(DEFAULT_VISIBILITY))
        }
        
        setIsLoaded(true)
    }, [])

    // Salvar no localStorage sempre que houver mudanças
    useEffect(() => {
        if (isLoaded && Object.keys(routeVisibility).length > 0) {
            // � Logs de debug removidos para limpar console
            // Descomentar apenas se precisar debugar visibilidade do menu
            // localStorage.setItem('menuVisibility', JSON.stringify(routeVisibility))
        }
    }, [ routeVisibility, isLoaded ])

    const toggleRouteVisibility = (routeName: string) => {
        setRouteVisibilityState(prev => ({
            ...prev,
            [ routeName ]: !prev[ routeName ]
        }))
    }

    const setRouteVisibility = (routeName: string, visible: boolean) => {
        setRouteVisibilityState(prev => ({
            ...prev,
            [ routeName ]: visible
        }))
    }

    const resetToDefaults = () => {
        setRouteVisibilityState(DEFAULT_VISIBILITY)
        localStorage.setItem('menuVisibility', JSON.stringify(DEFAULT_VISIBILITY))
    }

    return (
        <MenuVisibilityContext.Provider value={{
            routeVisibility,
            toggleRouteVisibility,
            setRouteVisibility,
            resetToDefaults,
            isConfigModalOpen,
            setConfigModalOpen
        }}>
            {children}
        </MenuVisibilityContext.Provider>
    )
}

export function useMenuVisibility() {
    const context = useContext(MenuVisibilityContext)
    if (context === undefined) {
        throw new Error('useMenuVisibility must be used within a MenuVisibilityProvider')
    }
    return context
}
