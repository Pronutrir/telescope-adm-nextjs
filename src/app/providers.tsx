'use client'
import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import { LayoutProvider } from '@/contexts/LayoutContext'
import { ThemeProvider } from '@/contexts/ThemeContext'

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
                        {children}
                    </LayoutProvider>
                </AuthProvider>
            </ThemeProvider>
        </QueryClientProvider>
    )
}