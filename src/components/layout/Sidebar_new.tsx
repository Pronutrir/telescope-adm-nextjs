'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    ChevronRight,
    Dot
} from 'lucide-react'
import { useLayout } from '@/contexts/LayoutContext'
import { routes, getMainMenus, getSubmenus, hasSubmenus, type Route } from '@/config/routes'
import type { SidebarProps } from '@/types/layout'

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
    const { sidebarOpen, sidebarCollapsed, toggleSidebar, toggleMobileSidebar, isMobile, mounted } = useLayout()
    const pathname = usePathname()
    const [ openMenus, setOpenMenus ] = useState<{ [ key: string ]: boolean }>({})

    // Filtrar apenas rotas que não são privadas e não são submenus
    const mainRoutes = getMainMenus(routes.filter(route => !route.private))

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

    const renderIcon = (route: Route, size: string = 'w-5 h-5') => {
        if (!route.icon) return null
        const IconComponent = route.icon
        return <IconComponent className={`${size} flex-shrink-0 icon-colored`} />
    }

    // Classes do sidebar
    const getSidebarClasses = () => {
        if (!mounted) {
            // SSR fallback - default desktop state
            return `
                fixed top-0 left-0 h-screen
                bg-sidebar-sophisticated/98 backdrop-blur-xl
                shadow-xl shadow-black/10
                transition-all duration-500 ease-in-out z-40
                overflow-hidden
                w-72 translate-x-0
                ${className}
            `
        }

        // Client-side with full mobile support
        return `
            fixed top-0 left-0 h-screen
            bg-sidebar-sophisticated/98 backdrop-blur-xl
            shadow-xl shadow-black/10
            transition-all duration-500 ease-in-out z-40
            overflow-hidden
            ${isMobile
                ? (sidebarOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full')
                : (sidebarCollapsed ? 'w-16 -translate-x-0' : 'w-72 translate-x-0')
            }
            ${className}
        `
    }

    return (
        <>
            {/* Mobile Overlay */}
            {mounted && isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={getSidebarClasses()}>
                <div className="h-full flex flex-col">
                    {/* Header com Logo */}
                    <div className="flex-shrink-0 h-16 px-6 flex items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-500 rounded-lg flex items-center justify-center shadow-lg">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="text-white"
                                >
                                    <path
                                        d="M12 2L13.09 8.26L18 7L15.74 12L22 13.09L15.74 14.18L18 19L13.09 17.74L12 24L10.91 17.74L6 19L8.26 14.18L2 13.09L8.26 12L6 7L10.91 8.26L12 2Z"
                                        fill="currentColor"
                                    />
                                    <circle cx="12" cy="12" r="3" fill="white" opacity="0.9" />
                                    <rect x="8" y="11" width="8" height="2" rx="1" fill="currentColor" />
                                    <rect x="6" y="11.5" width="3" height="1" rx="0.5" fill="currentColor" />
                                    <rect x="15" y="11.5" width="3" height="1" rx="0.5" fill="currentColor" />
                                </svg>
                            </div>
                            {(mounted && isMobile || !sidebarCollapsed) && (
                                <div>
                                    <h2 className="text-lg font-bold text-white">Telescope</h2>
                                    <p className="text-xs text-telescope-icon">ADM</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className={`flex-1 py-6 overflow-y-auto scrollbar-hide ${(!mounted || !isMobile) && sidebarCollapsed ? 'px-2' : 'px-6'}`}>
                        <div className="space-y-2">
                            {mainRoutes.map((route) => {
                                const isActive = isRouteActive(route)
                                return (
                                    <Link
                                        key={route.path}
                                        href={route.layout + route.path}
                                        className={`
                                            group flex items-center space-x-3 px-3 py-3 rounded-xl
                                            text-sm font-medium transition-all duration-300
                                            hover:bg-card-elevated hover:scale-[1.02] hover:shadow-lg
                                            ${isActive
                                                ? 'text-accent-foreground bg-accent/20 shadow-md border border-accent/20'
                                                : 'text-muted-foreground hover:text-foreground'
                                            }
                                        `}
                                        title={(!mounted || !isMobile) && sidebarCollapsed ? route.name : undefined}
                                    >
                                        <div className="flex items-center space-x-3 flex-1">
                                            {renderIcon(route)}
                                            {(mounted && isMobile || !sidebarCollapsed) && (
                                                <span className="truncate font-medium">{route.name}</span>
                                            )}
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </nav>

                    {/* Footer */}
                    {(mounted && isMobile || !sidebarCollapsed) && (
                        <div className="flex-shrink-0 p-6 border-t border-telescope-icon/20">
                            <div className="text-xs text-telescope-icon text-center">
                                <p>Telescope ADM</p>
                                <p>v2.0.0</p>
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </>
    )
}

export default Sidebar
