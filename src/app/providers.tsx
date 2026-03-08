'use client'
import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
import { LayoutProvider } from '@/contexts/LayoutContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import NotificationContainer from '@/components/notifications/NotificationContainer'

export function Providers({ children }: { children: React.ReactNode }) {
    const [ queryClient ] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                staleTime: 5 * 60 * 1000,
                retry: 2,
            },
        },
    }))

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <AuthProvider>
                    <LayoutProvider>
                        <NotificationProvider
                            initialConfig={{
                                position: 'top-right',
                                maxNotifications: 5,
                                defaultDuration: 5000,
                                defaultDismissible: true,
                                enableAnimations: true
                            }}
                        >
                            {children}

                            {/* Sistema de Notificações Global */}
                            <NotificationContainer />

                            {/* Manter Toaster para compatibilidade (pode ser removido futuramente) */}
                            <Toaster
                                position="bottom-right"
                                toastOptions={{
                                    duration: 4000,
                                    style: {
                                        background: '#363636',
                                        color: '#fff',
                                    },
                                }}
                            />
                        </NotificationProvider>
                    </LayoutProvider>
                </AuthProvider>
            </ThemeProvider>
        </QueryClientProvider>
    )
}