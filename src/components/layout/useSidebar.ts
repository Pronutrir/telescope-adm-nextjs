'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useMenuVisibility } from '@/contexts/MenuVisibilityContext'
import {
    routes,
    getMainMenus,
    getSubmenus,
    filterRoutesByRoles,
    type Route,
} from '@/config/routes'

export const useSidebar = () => {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth()
    const { routeVisibility, setConfigModalOpen } = useMenuVisibility()
    const pathname = usePathname()
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({})

    const userRoles =
        user?.perfis?.map((perfil) => perfil.nomePerfil).filter(Boolean) ||
        (user?.tipoUsuario ? [user.tipoUsuario] : [])

    let availableRoutes: Route[]
    if (isAuthenticated && user && !authLoading) {
        const roleFiltered = filterRoutesByRoles(routes, userRoles)
        availableRoutes = roleFiltered.filter(
            (route) => routeVisibility[route.name] !== false
        )
    } else if (authLoading) {
        availableRoutes = []
    } else {
        const publicRoutes = routes.filter(
            (route) => !route.private && (!route.roles || route.roles.length === 0)
        )
        availableRoutes = publicRoutes.filter(
            (route) => routeVisibility[route.name] !== false
        )
    }

    const mainRoutes = getMainMenus(availableRoutes)

    const handleMenuToggle = (menuName: string) => {
        setOpenMenus((prev) => ({ ...prev, [menuName]: !prev[menuName] }))
    }

    const isRouteActive = (route: Route): boolean =>
        pathname === route.layout + route.path

    const isMenuActive = (menuName: string): boolean =>
        getSubmenus(routes, menuName).some((sub) => isRouteActive(sub))

    return {
        authLoading,
        openMenus,
        mainRoutes,
        handleMenuToggle,
        isRouteActive,
        isMenuActive,
        setConfigModalOpen,
    }
}
