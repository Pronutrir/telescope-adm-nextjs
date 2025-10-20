'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Menu,
    ChevronDown,
    Settings
} from 'lucide-react'
import { useLayout } from '@/contexts/LayoutContext'
import { useAuth } from '@/contexts/AuthContext'
import { useMenuVisibility } from '@/contexts/MenuVisibilityContext'
import { routes, getMainMenus, getSubmenus, hasSubmenus, filterRoutesByRoles, type Route } from '@/config/routes'

import type { SidebarProps } from '@/types/layout'

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
    const { sidebarOpen, sidebarCollapsed, toggleSidebar, isMobile, mounted } = useLayout()
    const { user, isAuthenticated } = useAuth()
    const { routeVisibility, setConfigModalOpen } = useMenuVisibility()
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
    console.log('👤 FULL USER OBJECT:', user)
    console.log('📦 user?.perfis:', user?.perfis)
    console.log('📦 user?.roles:', user?.roles)
    console.log('🔑 user?.tipoUsuario:', user?.tipoUsuario)
    
    // ✅ CORREÇÃO: Usar perfis diretamente, não roles.perfis
    const userRoles = user?.perfis?.map((perfil) => perfil.nomePerfil).filter(Boolean) ||
        (user?.tipoUsuario ? [ user.tipoUsuario ] : []) ||
        [ 'default_fullstackdev' ] // fallback para desenvolvimento

    console.log('🔍 User Roles (final):', userRoles)
    console.log('   📋 Roles extraídos:', userRoles.join(', '))
    console.log('📊 Total Routes:', routes.length)
    console.log('👁️ Route Visibility State:', routeVisibility)

    let availableRoutes: Route[]
    if (isAuthenticated && user) {
        // Usuário autenticado - filtrar por roles primeiro
        const roleFiltered = filterRoutesByRoles(routes, userRoles)
        console.log('✅ After Role Filter:', roleFiltered.length, 'routes')
        console.log('📋 Role Filtered Routes:', roleFiltered.map(r => r.name))
        
        // Depois filtrar por visibilidade usando o contexto
        // Se routeVisibility não tem a chave, considera visível (true)
        availableRoutes = roleFiltered.filter(route => {
            const isVisible = routeVisibility[route.name] !== false
            console.log(`  - ${route.name}: visibility=${routeVisibility[route.name]} → ${isVisible ? '✅' : '❌'}`)
            return isVisible
        })
        console.log('🎯 Final Available Routes:', availableRoutes.length)
    } else {
        // Não autenticado - apenas rotas públicas + algumas básicas
        const publicRoutes = routes.filter(route =>
            !route.private ||
            route.name === 'Dashboard' ||
            route.name === 'FlyonUI Cards'
        )
        // Filtrar por visibilidade usando o contexto
        // Se routeVisibility não tem a chave, considera visível (true)
        availableRoutes = publicRoutes.filter(route => routeVisibility[route.name] !== false)
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
        return <IconComponent className={`${size} flex-shrink-0 sidebar-icon pdf-icon transition-all duration-300 hover:scale-110 hover:rotate-3`} />
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
                overlay drawer drawer-start flex flex-col overflow-hidden sidebar-no-scrollbar
                ${!mounted || !isClientMounted
                    ? 'w-66 sm:flex sm:translate-x-0'
                    : isMobile
                        ? (sidebarOpen ? 'w-66 translate-x-0' : 'w-66 -translate-x-full')
                        : sidebarCollapsed
                            ? 'w-16 overlay-minified:w-16'
                            : 'w-64'
                }
                ${sidebarCollapsed ? 'overlay-minified' : ''}
                fixed top-0 left-0 h-screen backdrop-blur-xl
                shadow-xl shadow-black/10 transition-all duration-300 ease-in-out z-40
                ${className}
            `}
            style={{
                background: getSidebarBackground()
            }}
            role="dialog"
            tabIndex={-1}
        >
            {/* Header com Logo e Toggle */}
            <div className="drawer-header px-4 py-3 w-full flex items-center justify-center gap-3 flex-shrink-0">
                {/* Toggle Button - Sempre centralizado quando colapsado */}
                {!isMobile && (
                    <button
                        onClick={toggleSidebar}
                        className={`
                            p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 
                            transition-colors duration-200 
                            ${sidebarCollapsed ? 'mx-auto' : 'ml-auto'}
                        `}
                        aria-label="Toggle sidebar"
                        title={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
                    >
                        <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300 pdf-icon transition-all duration-300 hover:scale-110 hover:rotate-3" />
                    </button>
                )}

                {/* Logo - só mostra quando não está colapsado */}
                {!sidebarCollapsed && !isMobile && (
                    <div className="flex items-center space-x-3 flex-1">

                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Telescope ADM
                        </h3>
                    </div>
                )}
            </div>

            {/* Navigation Menu */}
            <div className="drawer-body px-2 pt-2 overflow-y-auto overflow-x-hidden flex-1 scrollbar-hidden">
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
                                        ${sidebarCollapsed ? '[--adaptive:adaptive] [--strategy:fixed] [--offset:15] [--trigger:hover] [--placement:right-start]' : ''}
                                        ${isMenuActive(route.name) ? 'bg-blue-50 dark:bg-blue-900/20 rounded-xl' : ''}
                                    `}
                                >
                                    <button
                                        type="button"
                                        className={`
                                            dropdown-toggle w-full flex items-center rounded-xl
                                            text-sm font-medium transition-all duration-300
                                            hover:bg-gray-100 dark:hover:bg-gray-700/50
                                            ${sidebarCollapsed ? 'justify-center px-3 py-3' : 'justify-between px-4 py-3'}
                                            ${isMenuActive(route.name)
                                                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                                : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white'
                                            }
                                        `}
                                        onClick={() => !sidebarCollapsed && handleMenuToggle(route.name)}
                                        aria-haspopup="menu"
                                        aria-expanded={!sidebarCollapsed && isMenuOpen}
                                        title={sidebarCollapsed ? route.name : undefined}
                                    >
                                        <div className={`flex items-center ${sidebarCollapsed ? '' : 'space-x-3'}`}>
                                            {renderIcon(route, sidebarCollapsed ? 'size-5' : 'size-5')}
                                            {!sidebarCollapsed && <span>{route.name}</span>}
                                        </div>
                                        {!sidebarCollapsed && (
                                            <ChevronDown className={`size-4 pdf-icon transition-all duration-300 hover:scale-110 ${isMenuOpen ? 'rotate-180' : ''}`} />
                                        )}
                                    </button>

                                    {/* Submenu */}
                                    <ul className={`
                                        dropdown-menu mt-0 shadow-none
                                        ${sidebarCollapsed ? 'shadow-md shadow-base-300/20 min-w-60' : 'ml-6 space-y-1'}
                                        ${sidebarCollapsed ? 'before:absolute before:-start-4 before:top-0 before:h-full before:w-4 before:bg-transparent' : ''}
                                        ${!sidebarCollapsed && isMenuOpen ? 'block' : sidebarCollapsed ? '' : 'hidden'}
                                    `}>
                                        {submenus.map((submenu) => {
                                            const isSubmenuActive = isRouteActive(submenu)
                                            return (
                                                <li key={submenu.path}>
                                                    <Link
                                                        href={submenu.layout + submenu.path}
                                                        className={`
                                                            flex items-center px-4 py-2.5 rounded-lg
                                                            text-sm transition-all duration-200 space-x-3
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
                                        flex items-center rounded-xl text-sm font-medium transition-all duration-300
                                        hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:scale-[1.02]
                                        ${sidebarCollapsed ? 'justify-center px-3 py-3' : 'space-x-3 px-4 py-3'}
                                        ${isActive
                                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-md border border-blue-200 dark:border-blue-700'
                                            : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white'
                                        }
                                    `}
                                    title={sidebarCollapsed ? route.name : undefined}
                                >
                                    {renderIcon(route)}
                                    {!sidebarCollapsed && <span>{route.name}</span>}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/* Footer */}
            {!sidebarCollapsed && (
                <div className="drawer-footer p-4 flex-shrink-0 space-y-3">
                    {/* Botão de Configuração de Menu - Apenas em desenvolvimento */}
                    {process.env.NODE_ENV === 'development' && (
                        <button
                            onClick={() => setConfigModalOpen(true)}
                            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300 hover:scale-[1.02] group"
                            title="Configurar visibilidade do menu"
                        >
                            <Settings className="w-4 h-4 pdf-icon sidebar-icon transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                            <span className="transition-all duration-300">Configurar Menu</span>
                        </button>
                    )}

                    {/* Informações do App */}
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        <p className="font-medium">Telescope ADM</p>
                        <p>v2.0.0 - FlyonUI</p>
                    </div>
                </div>
            )}
        </aside>
    )
}

export default Sidebar
