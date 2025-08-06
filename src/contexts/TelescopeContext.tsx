'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ITelescopeContext {
    // Notificações
    notify: boolean
    setNotify: (value: boolean) => void
    msn: string
    setMsn: (value: string) => void
    cor: string
    setCor: (value: string) => void

    // Estado global da aplicação
    isLoading: boolean
    setIsLoading: (value: boolean) => void
}

const TelescopeContext = createContext<ITelescopeContext | undefined>(undefined)

export const useTelescopeContext = () => {
    const context = useContext(TelescopeContext)
    if (context === undefined) {
        throw new Error('useTelescopeContext must be used within a TelescopeProvider')
    }
    return context
}

interface TelescopeProviderProps {
    children: ReactNode
}

export const TelescopeProvider: React.FC<TelescopeProviderProps> = ({ children }) => {
    const [ notify, setNotify ] = useState(false)
    const [ msn, setMsn ] = useState('')
    const [ cor, setCor ] = useState('info')
    const [ isLoading, setIsLoading ] = useState(false)

    const value: ITelescopeContext = {
        notify,
        setNotify,
        msn,
        setMsn,
        cor,
        setCor,
        isLoading,
        setIsLoading,
    }

    return (
        <TelescopeContext.Provider value={value}>
            {children}
        </TelescopeContext.Provider>
    )
}

export { TelescopeContext }
