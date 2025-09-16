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
// Por padrão, apenas "Gerenciador de PDFs" estará habilitado
const DEFAULT_VISIBILITY = {
    'Dashboard': false,
    'Biblioteca de Componentes': false,
    'Biblioteca de PDFs': false,
    'Gerenciador de PDFs': true, // 🎯 Único item habilitado por padrão
    'Bloqueios': false,
    'Regra Médica': false,
    'Usuários': false,
    'Configurações': false,
    'Planos de Saúde': false,
    'Tipos Sanguíneos': false,
    'Grupos de Usuários': false,
    'Médicos': false,
    'Agendamentos': false,
    'Convênios': false,
    'Emergências': false,
    'Chat': false,
    'Especialidades': false,
    'Perfil de Usuário': false,
    'Cadastro de Usuário': false
}

export function MenuVisibilityProvider({ children }: MenuVisibilityProviderProps) {
    const [ routeVisibility, setRouteVisibilityState ] = useState<{ [ routeName: string ]: boolean }>({})
    const [ isConfigModalOpen, setConfigModalOpen ] = useState(false)

    // Carregar configurações do localStorage na inicialização
    useEffect(() => {
        const savedVisibility = localStorage.getItem('menuVisibility')
        if (savedVisibility) {
            try {
                const parsed = JSON.parse(savedVisibility)
                setRouteVisibilityState(parsed)
            } catch (error) {
                console.warn('Erro ao carregar configurações de visibilidade do menu:', error)
                setRouteVisibilityState(DEFAULT_VISIBILITY)
            }
        } else {
            setRouteVisibilityState(DEFAULT_VISIBILITY)
        }
    }, [])

    // Salvar no localStorage sempre que houver mudanças
    useEffect(() => {
        if (Object.keys(routeVisibility).length > 0) {
            localStorage.setItem('menuVisibility', JSON.stringify(routeVisibility))
        }
    }, [ routeVisibility ])

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
