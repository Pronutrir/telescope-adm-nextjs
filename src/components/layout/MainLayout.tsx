'use client'

import React, { useEffect, useState } from 'react'
import { useLayout } from '@/contexts/LayoutContext'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import ClientOnly from './ClientOnly'
import type { LayoutProps } from '@/types/layout'

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
    const { sidebarOpen, sidebarCollapsed, isMobile, toggleSidebar } = useLayout()
    const [ isDark, setIsDark ] = useState(false)

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

    // Background dinâmico baseado no tema com melhor contraste
    const getMainBackground = () => {
        if (isDark) {
            // Tema escuro: gradiente sofisticado com outer_space e night
            return 'linear-gradient(135deg, rgba(11, 14, 14, 0.98) 0%, rgba(22, 27, 29, 0.95) 50%, rgba(34, 41, 43, 0.92) 100%)'
        } else {
            // Tema claro: gradiente limpo com tons neutros
            return 'linear-gradient(135deg, rgba(248, 250, 252, 0.98) 0%, rgba(241, 245, 249, 0.95) 50%, rgba(226, 232, 240, 0.92) 100%)'
        }
    }

    // Estilo de container para melhor contraste e distribuição
    const getContainerStyles = () => {
        if (isDark) {
            return {
                backgroundColor: 'rgba(34, 41, 43, 0.3)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(57, 69, 72, 0.2)'
            }
        } else {
            return {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(203, 213, 225, 0.3)'
            }
        }
    }

    // Single layout approach - optimized for sidebar interaction
    return (
        <div
            className="min-h-screen transition-all duration-300"
            style={{
                background: getMainBackground(),
                overflowX: 'hidden',
                overflowY: 'auto',
                width: '100vw',
                minHeight: '100vh'
            }}
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

                {/* Main Content Area - Dynamic Responsive Layout */}
                <main className={`
                    pt-16 min-h-screen transition-all duration-300 ease-in-out
                    ${isMobile
                        ? 'ml-0'
                        : sidebarCollapsed
                            ? 'ml-16'
                            : 'ml-64'
                    }
                `} style={{
                        width: isMobile
                            ? '100%'
                            : sidebarCollapsed
                                ? 'calc(100vw - 64px)'
                                : 'calc(100vw - 256px)',
                        maxWidth: '100vw',
                        position: 'relative',
                        overflowX: 'hidden'
                    }}>
                    {/* Content Container - Responsive to Sidebar State */}
                    <div className="h-full w-full max-w-full">
                        <div className="h-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 w-full">
                            {/* Content Wrapper - Natural Height Flow */}
                            <div
                                className="flex flex-col rounded-2xl shadow-lg transition-all duration-300 w-full"
                                style={{
                                    ...getContainerStyles(),
                                    maxWidth: '100%',
                                    position: 'relative'
                                }}
                            >
                                {/* Content Area - Natural Flow without Height Constraints */}
                                <div className={`
                                    p-6 transition-colors duration-300 overflow-x-hidden
                                    ${isDark ? 'text-gray-100' : 'text-gray-900'}
                                `}>
                                    <div className="flex flex-col space-y-4 lg:space-y-6 w-full">
                                        {/* Children - Main Page Content */}
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default MainLayout
