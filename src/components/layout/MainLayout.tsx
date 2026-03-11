'use client'

import React from 'react'
import { useLayout } from '@/contexts/LayoutContext'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { MenuVisibilityProvider } from '@/contexts/MenuVisibilityContext'
import MenuVisibilityModal from './MenuVisibilityModal'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import ClientOnly from './ClientOnly'
import type { LayoutProps } from '@/types/layout'

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
    const { sidebarOpen, sidebarCollapsed, isMobile, toggleSidebar } = useLayout()
    const { isDark } = useTheme()

    return (
        <MenuVisibilityProvider>
            <div
                className={cn(
                    'min-h-screen w-screen overflow-x-hidden transition-all duration-300',
                    isDark
                        ? 'bg-gradient-to-br from-[rgba(11,14,14,0.98)] via-[rgba(22,27,29,0.95)] to-[rgba(34,41,43,0.92)]'
                        : 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200'
                )}
            >
                {/* Navbar */}
                <Navbar />

                {/* Layout Container */}
                <div className="relative min-h-screen">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Mobile Overlay */}
                    <ClientOnly>
                        {isMobile && sidebarOpen && (
                            <div
                                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden transition-all duration-300"
                                onClick={toggleSidebar}
                            />
                        )}
                    </ClientOnly>

                    {/* Main Content Area */}
                    <main
                        className={cn(
                            'pt-16 min-h-screen transition-all duration-300 ease-in-out overflow-x-hidden',
                            isMobile
                                ? 'ml-0 w-full'
                                : sidebarCollapsed
                                    ? 'ml-16 w-[calc(100vw-64px)]'
                                    : 'ml-64 w-[calc(100vw-256px)]'
                        )}
                    >
                        <div className="h-full w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                            {/* Content Container */}
                            <div
                                className={cn(
                                    'flex flex-col rounded-2xl shadow-lg transition-all duration-300 w-full',
                                    'backdrop-blur-xl border',
                                    isDark
                                        ? 'bg-[rgba(34,41,43,0.3)] border-slate-700/20'
                                        : 'bg-white/80 border-slate-200/30'
                                )}
                            >
                                <div
                                    className={cn(
                                        'p-6 transition-colors duration-300 overflow-x-hidden',
                                        isDark ? 'text-gray-100' : 'text-gray-900'
                                    )}
                                >
                                    <div className="flex flex-col space-y-4 lg:space-y-6 w-full">
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>

                {/* Modal de Configuração */}
                <MenuVisibilityModal />
            </div>
        </MenuVisibilityProvider>
    )
}

export default MainLayout
