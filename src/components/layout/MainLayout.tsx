'use client'

import React, { useEffect, useState } from 'react'
import { useLayout } from '@/contexts/LayoutContext'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Container } from '@/components/ui/Container'
import { containerClasses } from '@/utils/responsive'
import type { LayoutProps } from '@/types/layout'

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
    const { sidebarOpen, sidebarCollapsed, isMobile, mounted, toggleSidebar, toggleMobileSidebar } = useLayout()
    const [ isClientMounted, setIsClientMounted ] = useState(false)

    // Garantir que só renderizamos o conteúdo responsivo após a hidratação
    useEffect(() => {
        setIsClientMounted(true)
    }, [])

    // Prevent hydration mismatch by not rendering mobile-dependent content until mounted
    if (!mounted || !isClientMounted) {
        return (
            <div className="min-h-screen bg-theme transition-colors duration-300">
                {/* Navbar - Updated */}
                <Navbar />

                {/* Layout Container */}
                <div className="flex min-h-screen">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content - Default state for SSR */}
                    <main className="flex-1 pt-16 transition-all duration-300 ease-in-out min-h-screen flex flex-col ml-[264px]">
                        {/* Content Container - Melhor distribuição e espaçamento */}
                        <div className="flex-1 w-full">
                            <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-10">
                                {/* Content Wrapper - Distribuição otimizada */}
                                <div className="w-full h-full flex flex-col space-y-6 lg:space-y-8">
                                    <div className="w-full max-w-[1920px] mx-auto">
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    // Client-side rendering with full mobile support
    return (
        <div className="min-h-screen bg-theme transition-colors duration-300" suppressHydrationWarning>
            {/* Navbar - Updated */}
            <Navbar />

            {/* Layout Container */}
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content - Centralizado e Responsivo */}
                <main className={`
                    flex-1 pt-16 transition-all duration-300 ease-in-out min-h-screen
                    flex flex-col
                    ${isMobile
                        ? 'ml-0'
                        : sidebarCollapsed
                            ? 'ml-[68px]'
                            : 'ml-[264px]'
                    }
                `}>
                    {/* Content Container - Melhor distribuição e espaçamento */}
                    <div className="flex-1 w-full">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-10">
                            {/* Content Wrapper - Distribuição otimizada */}
                            <div className="w-full h-full flex flex-col space-y-6 lg:space-y-8">
                                <div className="w-full max-w-[1920px] mx-auto">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile Overlay */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}
        </div>
    )
}

export default MainLayout
