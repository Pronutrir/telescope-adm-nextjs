'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface LayoutContextType {
    // Sidebar state
    sidebarOpen: boolean
    sidebarCollapsed: boolean
    toggleSidebar: () => void
    setSidebarOpen: (open: boolean) => void
    collapseSidebar: () => void

    // Mobile state
    isMobile: boolean
    setIsMobile: (mobile: boolean) => void
    toggleMobileSidebar: () => void
    mounted: boolean

    // Search state
    searchOpen: boolean
    searchQuery: string
    setSearchOpen: (open: boolean) => void
    setSearchQuery: (query: string) => void
    toggleSearch: () => void

    // Notifications state
    notificationsOpen: boolean
    setNotificationsOpen: (open: boolean) => void
    notificationsCount: number
    setNotificationsCount: (count: number) => void
    toggleNotifications: () => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

interface LayoutProviderProps {
    children: ReactNode
}

export function LayoutProvider({ children }: LayoutProviderProps) {
    // Sidebar states
    const [ sidebarOpen, setSidebarOpen ] = useState(true)
    const [ sidebarCollapsed, setSidebarCollapsed ] = useState(false)

    // Mobile state - Initialize as false to match server render
    const [ isMobile, setIsMobile ] = useState(false)
    const [ mounted, setMounted ] = useState(false)

    // Search states
    const [ searchOpen, setSearchOpen ] = useState(false)
    const [ searchQuery, setSearchQuery ] = useState('')

    // Notifications states
    const [ notificationsOpen, setNotificationsOpen ] = useState(false)
    const [ notificationsCount, setNotificationsCount ] = useState(0)

    // Detectar se é mobile e evitar hydration mismatch
    useEffect(() => {
        // Mark as mounted to avoid hydration issues
        setMounted(true)

        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 1024) // lg breakpoint do Tailwind
        }

        // Verificar no mount
        checkIfMobile()

        // Adicionar listener para resize
        window.addEventListener('resize', checkIfMobile)

        // Cleanup
        return () => window.removeEventListener('resize', checkIfMobile)
    }, [])

    const toggleSidebar = () => {
        // Only use mobile logic if component is mounted (client-side)
        if (mounted && isMobile) {
            setSidebarOpen(!sidebarOpen)
        } else {
            setSidebarCollapsed(!sidebarCollapsed)
        }
    }

    const toggleMobileSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const toggleSearch = () => {
        setSearchOpen(!searchOpen)
    }

    const toggleNotifications = () => {
        setNotificationsOpen(!notificationsOpen)
    }

    const collapseSidebar = () => {
        setSidebarCollapsed(true)
    }

    const value: LayoutContextType = {
        // Sidebar
        sidebarOpen,
        sidebarCollapsed,
        toggleSidebar,
        setSidebarOpen,
        collapseSidebar,

        // Mobile
        isMobile,
        setIsMobile,
        toggleMobileSidebar,
        mounted,

        // Search
        searchOpen,
        searchQuery,
        setSearchOpen,
        setSearchQuery,
        toggleSearch,

        // Notifications
        notificationsOpen,
        setNotificationsOpen,
        notificationsCount,
        setNotificationsCount,
        toggleNotifications,
    }

    return (
        <LayoutContext.Provider value={value}>
            {children}
        </LayoutContext.Provider>
    )
}

export function useLayout() {
    const context = useContext(LayoutContext)
    if (context === undefined) {
        throw new Error('useLayout must be used within a LayoutProvider')
    }
    return context
}
