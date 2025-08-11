'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Menu,
    ChevronDown
} from 'lucide-react'
import { useLayout } from '@/contexts/LayoutContext'
import { useAuth } from '@/contexts/AuthContext'
import { routes, getMainMenus, getSubmenus, hasSubmenus, filterRoutesByRoles, type Route } from '@/config/routes'
import type { SidebarProps } from '@/types/layout'

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
    const { sidebarOpen, sidebarCollapsed, toggleSidebar, isMobile, mounted } = useLayout()
    const { user, isAuthenticated } = useAuth()
    const pathname = usePathname()
    const [ openMenus, setOpenMenus ] = useState<{ [ key: string ]: boolean }>({})
    const [ isClientMounted, setIsClientMounted ] = useState(false)
    const [ isDark, setIsDark ] = useState(false)

    // Garantir que só renderizamos o conteúdo responsivo após a hidratação
    useEffect(() => {
        setIsClientMounted(true)
    }, [])

    // Detectar tema atual
    useEffect(() => {
        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains('dark'))
        }

        checkTheme()

        // Observer para mudanças no tema
        const observer = new MutationObserver(checkTheme)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: [ 'class' ]
        })

        return () => observer.disconnect()
    }, [])

    // Filtrar rotas baseado na autenticação e roles do usuário
    const userRoles = user?.roles?.map(role => role.perfis?.nomePerfil).filter(Boolean) ||
        (user?.tipoUsuario ? [ user.tipoUsuario ] : []) ||
        [ 'default_fullstackdev' ] // fallback para desenvolvimento

    let availableRoutes: Route[]
    if (isAuthenticated && user) {
        // Usuário autenticado - filtrar por roles
        availableRoutes = filterRoutesByRoles(routes, userRoles)
    } else {
        // Não autenticado - apenas rotas públicas + algumas básicas
        availableRoutes = routes.filter(route =>
            !route.private ||
            route.name === 'Dashboard' ||
            route.name === 'FlyonUI Cards' ||
            route.name === 'Tráfego de Acessos'
        )
    }

    const mainRoutes = getMainMenus(availableRoutes)

    const handleMenuToggle = (menuName: string) => {
        setOpenMenus(prev => ({
            ...prev,
            [ menuName ]: !prev[ menuName ]
        }))
    }

    const isRouteActive = (route: Route): boolean => {
        const fullPath = route.layout + route.path
        return pathname === fullPath
    }

    const isMenuActive = (menuName: string): boolean => {
        const submenus = getSubmenus(routes, menuName)
        return submenus.some(submenu => isRouteActive(submenu))
    }

    const renderIcon = (route: Route, size: string = 'size-5') => {
        if (!route.icon) return null
        const IconComponent = route.icon
        return <IconComponent className={`${size} flex-shrink-0`} />
    }

    // Background dinâmico baseado no tema
    const getSidebarBackground = () => {
        if (isDark) {
            return 'linear-gradient(180deg, rgba(31, 41, 55, 0.98) 0%, rgba(17, 24, 39, 0.98) 100%)'
        } else {
            return 'rgba(255, 255, 255, 0.85)'
        }
    }

    return (
        <aside
            className={`
                overlay drawer drawer-start border-e border-base-content/20 flex flex-col overflow-x-hidden
                ${!mounted || !isClientMounted
                    ? 'w-66 sm:flex sm:translate-x-0'
                    : isMobile
                        ? (sidebarOpen ? 'w-66 translate-x-0' : 'w-66 -translate-x-full')
                        : sidebarCollapsed
                            ? 'overlay-minified:w-17 w-17'
                            : 'w-66'
                }
                ${sidebarCollapsed ? 'overlay-minified' : ''}
                fixed top-0 left-0 h-screen backdrop-blur-xl
                shadow-xl shadow-black/10 transition-all duration-500 ease-in-out z-40
                ${className}
            `}
            style={{
                background: getSidebarBackground()
            }}
            role="dialog"
            tabIndex={-1}
        >
            {/* Header com Logo e Toggle */}
            <div className="drawer-header overlay-minified:px-3.75 py-2 w-full flex items-center justify-between gap-3 flex-shrink-0">
                {/* <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-white"
                            >
                                <circle cx="12" cy="8" r="3" fill="currentColor" />
                                <circle cx="8" cy="16" r="2" fill="currentColor" />
                                <circle cx="16" cy="16" r="2" fill="currentColor" />
                                <path d="M12 11v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M10 15l4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M14 15l-4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <rect x="3" y="3" width="5" height="1" rx="0.5" fill="currentColor" />
                                <rect x="16" y="3" width="5" height="1" rx="0.5" fill="currentColor" />
                                <rect x="3" y="20" width="5" height="1" rx="0.5" fill="currentColor" />
                                <rect x="16" y="20" width="5" height="1" rx="0.5" fill="currentColor" />
                                <rect x="3" y="11.5" width="3" height="1" rx="0.5" fill="currentColor" />
                                <rect x="18" y="11.5" width="3" height="1" rx="0.5" fill="currentColor" />
                                <rect x="9" y="6.5" width="6" height="1" rx="0.5" fill="currentColor" />
                                <rect x="15" y="11.5" width="3" height="1" rx="0.5" fill="currentColor" />
                            </svg>
                        </div>
                        <h3 className="drawer-title text-xl font-semibold overlay-minified:hidden text-gray-800 dark:text-white">
                            Telescope ADM
                        </h3>
                    </div> */}

                {/* Toggle Button - FlyonUI Original Style */}
                {!isMobile && (
                    <button
                        onClick={toggleSidebar}
                        className="overlay-minified:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200"
                        aria-label="Toggle sidebar"
                    >
                        <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                )}
            </div>

            {/* Navigation Menu */}
            <div className="drawer-body px-2 pt-4 overflow-y-auto overflow-x-hidden flex-1">
                <ul className="menu p-0 space-y-1">
                    {mainRoutes.map((route) => {
                        const isActive = isRouteActive(route)
                        const hasSubmenu = hasSubmenus(routes, route.name)
                        const submenus = hasSubmenu ? getSubmenus(routes, route.name) : []
                        const isMenuOpen = openMenus[ route.name ]

                        if (hasSubmenu) {
                            return (
                                <li
                                    key={route.path}
                                    className={`
                                            dropdown relative [--adaptive:none] [--strategy:static] 
                                            overlay-minified:[--adaptive:adaptive] overlay-minified:[--strategy:fixed] 
                                            overlay-minified:[--offset:15] overlay-minified:[--trigger:hover] 
                                            overlay-minified:[--placement:right-start]
                                            ${isMenuActive(route.name) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                                        `}
                                >
                                    <button
                                        type="button"
                                        className={`
                                                dropdown-toggle w-full flex items-center justify-between px-3 py-3 rounded-xl
                                                text-sm font-medium transition-all duration-300
                                                hover:bg-gray-100 dark:hover:bg-gray-700/50
                                                ${isMenuActive(route.name)
                                                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                                : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white'
                                            }
                                            `}
                                        onClick={() => handleMenuToggle(route.name)}
                                        aria-haspopup="menu"
                                        aria-expanded={isMenuOpen}
                                    >
                                        <div className="flex items-center space-x-3">
                                            {renderIcon(route)}
                                            <span className="overlay-minified:hidden">{route.name}</span>
                                        </div>
                                        <ChevronDown className={`size-4 overlay-minified:hidden transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Submenu */}
                                    <ul className={`
                                            dropdown-menu mt-0 shadow-none overlay-minified:shadow-md overlay-minified:shadow-base-300/20
                                            min-w-60 ml-6 overlay-minified:ml-0 space-y-1
                                            overlay-minified:before:absolute overlay-minified:before:-start-4 overlay-minified:before:top-0 
                                            overlay-minified:before:h-full overlay-minified:before:w-4 overlay-minified:before:bg-transparent
                                            ${isMenuOpen ? 'block' : 'hidden'}
                                        `}>
                                        {submenus.map((submenu) => {
                                            const isSubmenuActive = isRouteActive(submenu)
                                            return (
                                                <li key={submenu.path}>
                                                    <Link
                                                        href={submenu.layout + submenu.path}
                                                        className={`
                                                                flex items-center space-x-3 px-3 py-2 rounded-lg
                                                                text-sm transition-all duration-200
                                                                ${isSubmenuActive
                                                                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                                                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/30'
                                                            }
                                                            `}
                                                    >
                                                        {renderIcon(submenu)}
                                                        <span>{submenu.name}</span>
                                                    </Link>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </li>
                            )
                        }

                        // Menu item simples
                        return (
                            <li key={route.path}>
                                <Link
                                    href={route.layout + route.path}
                                    className={`
                                            flex items-center space-x-3 px-3 py-3 rounded-xl
                                            text-sm font-medium transition-all duration-300
                                            hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:scale-[1.02]
                                            ${isActive
                                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-md border border-blue-200 dark:border-blue-700'
                                            : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white'
                                        }
                                        `}
                                    title={sidebarCollapsed ? route.name : undefined}
                                >
                                    {renderIcon(route)}
                                    <span className="overlay-minified:hidden">{route.name}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/* Footer */}
            <div className="drawer-footer p-4 border-t border-gray-200/30 dark:border-gray-700/30 overlay-minified:hidden flex-shrink-0">
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    <p className="font-medium">Telescope ADM</p>
                    <p>v2.0.0 - FlyonUI</p>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
