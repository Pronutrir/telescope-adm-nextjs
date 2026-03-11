'use client'

import React from 'react'
import Link from 'next/link'
import {
    Menu,
    ChevronDown,
    Settings
} from 'lucide-react'
import { useLayout } from '@/contexts/LayoutContext'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { routes, getSubmenus, hasSubmenus, type Route } from '@/config/routes'
import { useSidebar } from './useSidebar'
import type { SidebarProps } from '@/types/layout'

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
    const { sidebarOpen, sidebarCollapsed, toggleSidebar, isMobile, mounted } = useLayout()
    const { isDark } = useTheme()
    const {
        authLoading,
        openMenus,
        mainRoutes,
        handleMenuToggle,
        isRouteActive,
        isMenuActive,
        setConfigModalOpen,
    } = useSidebar()

    const handleLinkClick = () => {
        if (isMobile && sidebarOpen) {
            toggleSidebar()
        }
    }

    const renderIcon = (route: Route, size = 'size-5') => {
        if (!route.icon) return null
        const IconComponent = route.icon
        return <IconComponent className={`${size} flex-shrink-0 sidebar-icon pdf-icon`} />
    }

    return (
        <aside
            className={cn(
                'overlay drawer drawer-start flex flex-col overflow-hidden sidebar-no-scrollbar',
                !mounted
                    ? 'w-66 sm:flex sm:translate-x-0'
                    : isMobile
                        ? sidebarOpen ? 'w-66 translate-x-0' : 'w-66 -translate-x-full'
                        : sidebarCollapsed ? 'w-16 overlay-minified:w-16' : 'w-64',
                sidebarCollapsed && 'overlay-minified',
                'fixed top-0 left-0 h-screen backdrop-blur-xl',
                'shadow-xl shadow-black/10 transition-all duration-300 ease-in-out z-40',
                isDark
                    ? 'bg-gradient-to-b from-gray-800/[0.98] to-gray-900/[0.98]'
                    : 'bg-white/95',
                className
            )}
            role="dialog"
            tabIndex={-1}
        >
            {/* Header */}
            <div className="drawer-header px-4 py-3 w-full flex items-center justify-center gap-3 flex-shrink-0">
                {!isMobile && (
                    <button
                        onClick={toggleSidebar}
                        className={cn(
                            'p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200',
                            sidebarCollapsed ? 'mx-auto' : 'ml-auto'
                        )}
                        aria-label={sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
                    >
                        <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300 pdf-icon" />
                    </button>
                )}
                {!sidebarCollapsed && !isMobile && (
                    <div className="flex items-center space-x-3 flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Telescope ADM
                        </h3>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="drawer-body px-2 pt-2 overflow-y-auto overflow-x-hidden flex-1 scrollbar-hidden">
                <ul className="menu p-0 space-y-1">
                    {/* Loading skeleton */}
                    {authLoading && [1, 2, 3, 4].map((i) => (
                        <li key={i} className="animate-pulse">
                            <div className={cn(
                                'rounded-xl h-12 bg-gray-200 dark:bg-gray-700',
                                sidebarCollapsed ? 'mx-1' : 'mx-2'
                            )} />
                        </li>
                    ))}

                    {/* Menu items */}
                    {!authLoading && mainRoutes.map((route) => {
                        const isActive = isRouteActive(route)
                        const hasSubmenu = hasSubmenus(routes, route.name)
                        const submenus = hasSubmenu ? getSubmenus(routes, route.name) : []
                        const isMenuOpen = openMenus[route.name]

                        if (hasSubmenu) {
                            return (
                                <li
                                    key={route.path}
                                    className={cn(
                                        'dropdown relative [--adaptive:none] [--strategy:static]',
                                        sidebarCollapsed && '[--adaptive:adaptive] [--strategy:fixed] [--offset:15] [--trigger:hover] [--placement:right-start]',
                                        isMenuActive(route.name) && 'bg-blue-50 dark:bg-blue-900/20 rounded-xl'
                                    )}
                                >
                                    <button
                                        type="button"
                                        className={cn(
                                            'dropdown-toggle w-full flex items-center rounded-xl text-sm font-medium transition-all duration-300',
                                            'hover:bg-gray-100 dark:hover:bg-gray-700/50',
                                            sidebarCollapsed ? 'justify-center px-3 py-3' : 'justify-between px-4 py-3',
                                            isMenuActive(route.name)
                                                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                                : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white'
                                        )}
                                        onClick={() => !sidebarCollapsed && handleMenuToggle(route.name)}
                                        aria-haspopup="menu"
                                        aria-expanded={!sidebarCollapsed && isMenuOpen}
                                        title={sidebarCollapsed ? route.name : undefined}
                                    >
                                        <div className={cn('flex items-center', !sidebarCollapsed && 'space-x-3')}>
                                            {renderIcon(route)}
                                            {!sidebarCollapsed && <span>{route.name}</span>}
                                        </div>
                                        {!sidebarCollapsed && (
                                            <ChevronDown className={cn('size-4 pdf-icon transition-transform duration-200', isMenuOpen && 'rotate-180')} />
                                        )}
                                    </button>
                                    <ul className={cn(
                                        'dropdown-menu mt-0 shadow-none',
                                        sidebarCollapsed
                                            ? 'shadow-md shadow-base-300/20 min-w-60 before:absolute before:-start-4 before:top-0 before:h-full before:w-4 before:bg-transparent'
                                            : cn('ml-6 space-y-1', isMenuOpen ? 'block' : 'hidden')
                                    )}>
                                        {submenus.map((submenu) => (
                                            <li key={submenu.path}>
                                                <Link
                                                    href={submenu.layout + submenu.path}
                                                    onClick={handleLinkClick}
                                                    className={cn(
                                                        'flex items-center px-4 py-2.5 rounded-lg text-sm transition-all duration-200 space-x-3',
                                                        isRouteActive(submenu)
                                                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                                                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/30'
                                                    )}
                                                >
                                                    {renderIcon(submenu)}
                                                    <span>{submenu.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            )
                        }

                        return (
                            <li key={route.path}>
                                <Link
                                    href={route.layout + route.path}
                                    onClick={handleLinkClick}
                                    className={cn(
                                        'flex items-center rounded-xl text-sm font-medium transition-colors duration-200',
                                        'hover:bg-gray-100 dark:hover:bg-gray-700/50',
                                        sidebarCollapsed ? 'justify-center px-3 py-3' : 'space-x-3 px-4 py-3',
                                        isActive
                                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500 dark:border-blue-400'
                                            : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white border-l-2 border-transparent'
                                    )}
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
                    {process.env.NODE_ENV === 'development' && (
                        <button
                            onClick={() => setConfigModalOpen(true)}
                            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300 hover:scale-[1.02] group"
                            title="Configurar visibilidade do menu"
                        >
                            <Settings className="w-4 h-4 pdf-icon sidebar-icon" />
                            <span>Configurar Menu</span>
                        </button>
                    )}
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
