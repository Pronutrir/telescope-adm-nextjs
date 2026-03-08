'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { routes, filterRoutesByRoles } from '@/config/routes'
import type { Route } from '@/config/routes'

export function useHomePageSelector() {
    const { isDark } = useTheme()
    const { user, setNotification } = useAuth()
    const [selectedPage, setSelectedPage] = useState('/admin/dashboard')
    const [currentHomePage, setCurrentHomePage] = useState('/admin/dashboard')
    const [isSaving, setIsSaving] = useState(false)

    const userRoles = user?.perfis?.map((perfil) => perfil.nomePerfil) ?? []
    const availableRoutes: Route[] = filterRoutesByRoles(routes, userRoles).filter(
        route => route.type !== 'submenu' && route.visible !== false
    )

    useEffect(() => {
        const load = async () => {
            try {
                const response = await fetch('/api/auth/me')
                if (response.ok) {
                    const data = await response.json()
                    const homePage: string = data.preferredHomePage || '/admin/dashboard'
                    setCurrentHomePage(homePage)
                    setSelectedPage(homePage)
                }
            } catch (error) {
                console.error('Erro ao carregar preferência:', error)
            }
        }
        load()
    }, [])

    const handleSave = async () => {
        if (selectedPage === currentHomePage) {
            setNotification({ isOpen: true, message: 'Nenhuma alteração foi feita', type: 'info' })
            return
        }
        setIsSaving(true)
        try {
            const response = await fetch('/api/auth/update-home-page', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ homePage: selectedPage }),
            })
            if (!response.ok) throw new Error('Erro ao salvar preferência')
            setCurrentHomePage(selectedPage)
            setNotification({ isOpen: true, message: '✅ Página inicial atualizada com sucesso!', type: 'success' })
        } catch {
            setNotification({ isOpen: true, message: '❌ Erro ao atualizar página inicial', type: 'error' })
        } finally {
            setIsSaving(false)
        }
    }

    const hasChanges = selectedPage !== currentHomePage
    return { isDark, selectedPage, setSelectedPage, isSaving, availableRoutes, handleSave, hasChanges }
}
