'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Search,
    Bell,
    Settings,
    MessageSquare
} from 'lucide-react'
import { useLayout } from '@/contexts/LayoutContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { NavbarDropdown } from './NavbarDropdown'
import type { NavbarProps } from '@/types/layout'

const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
    const {
        sidebarCollapsed,
        searchOpen,
        toggleSearch,
        toggleNotifications,
        isMobile
    } = useLayout()

    const { isDark } = useTheme()
    const { user } = useAuth()
    const router = useRouter()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        if (isLoggingOut) return

        setIsLoggingOut(true)
        try {
            const response = await fetch('/api/auth/session', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            })

            if (!response.ok) {
                // Mesmo com erro, redireciona para login
            }
        } catch {
            // Em caso de erro, ainda assim redireciona
        } finally {
            setIsLoggingOut(false)
            router.push('/auth/server-login')
        }
    }

    return (
        <nav
            className={cn(
                'fixed top-0 z-30 backdrop-blur-xl navbar-adjusted',
                'transition-all duration-300 ease-in-out',
                isMobile
                    ? 'left-0 right-0'
                    : sidebarCollapsed
                        ? 'left-16 right-0'
                        : 'left-64 right-0',
                isDark ? 'bg-gray-800/95' : 'bg-transparent',
                className
            )}
        >
            <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                {/* Search Bar - Desktop */}
                <div
                    className={cn(
                        'hidden md:flex flex-1 justify-center mx-auto transition-all duration-300',
                        sidebarCollapsed ? 'max-w-xl' : 'max-w-2xl'
                    )}
                >
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 navbar-search-icon" />
                        <input
                            type="text"
                            placeholder="Pesquisar médicos, agendamentos..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl
                                text-gray-800 bg-gray-100/80 border-gray-300 placeholder:text-gray-500
                                focus:border-blue-500 focus:ring-2 focus:ring-blue-400/20 focus:outline-none
                                dark:text-white dark:bg-gray-700/80 dark:border-gray-600
                                dark:focus:border-blue-400 dark:placeholder:text-gray-400
                                transition-all duration-300"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                    {/* Sidebar State Indicator - Dev only */}
                    {process.env.NODE_ENV === 'development' && (
                        <span className="hidden lg:block text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                            {sidebarCollapsed ? 'Collapsed' : 'Expanded'}
                        </span>
                    )}

                    {/* Theme Toggle */}
                    <ThemeToggle size="md" />

                    {/* Search Toggle - Mobile */}
                    <button
                        onClick={toggleSearch}
                        className="md:hidden p-2 rounded-lg
                            bg-gray-100/80 border-gray-300 hover:bg-gray-200/80 hover:border-blue-500/50
                            dark:bg-gray-700/80 dark:border-gray-600 dark:hover:bg-gray-600/80 dark:hover:border-blue-400/50
                            transition-all duration-300"
                        aria-label="Alternar busca"
                    >
                        <Search className="w-5 h-5 navbar-search-icon" />
                    </button>

                    {/* Messages */}
                    <button
                        className="p-2 rounded-lg relative
                            bg-gray-100/80 border-gray-300 hover:bg-gray-200/80 hover:border-blue-500/50
                            dark:bg-gray-700/80 dark:border-gray-600 dark:hover:bg-gray-600/80 dark:hover:border-blue-400/50
                            transition-all duration-300"
                        aria-label="Mensagens"
                    >
                        <MessageSquare className="w-5 h-5 navbar-message-icon" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full" />
                    </button>

                    {/* Notifications */}
                    <button
                        onClick={toggleNotifications}
                        className="p-2 rounded-lg relative
                            bg-card border border-border hover:bg-card-elevated hover:border-primary-500/50
                            transition-all duration-300"
                        aria-label="Alternar notificações"
                    >
                        <Bell className="w-5 h-5 navbar-bell-icon" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full" />
                    </button>

                    {/* Settings */}
                    <button
                        className="hidden sm:block p-2 rounded-lg
                            bg-gray-100/80 border-gray-300 hover:bg-gray-200/80 hover:border-blue-500/50
                            dark:bg-gray-700/80 dark:border-gray-600 dark:hover:bg-gray-600/80 dark:hover:border-blue-400/50
                            transition-all duration-300"
                        aria-label="Configurações"
                    >
                        <Settings className="w-5 h-5 navbar-settings-icon" />
                    </button>

                    {/* User Menu */}
                    <NavbarDropdown
                        user={user ? { nomeCompleto: user.nomeCompleto, email: user.email } : undefined}
                        onLogout={handleLogout}
                        isLoggingOut={isLoggingOut}
                    />
                </div>
            </div>

            {/* Mobile Search Bar */}
            {searchOpen && (
                <div className={cn(
                    'md:hidden p-4',
                    isDark ? 'bg-gray-800' : 'bg-white'
                )}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 navbar-search-icon" />
                        <input
                            type="text"
                            placeholder="Pesquisar..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg
                                bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500
                                dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
                                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                                transition-all duration-200"
                            autoFocus
                        />
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
