'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { MainLayout } from '@/components/layout'

interface AdminAuthGuardProps {
  children: React.ReactNode
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const { isDark } = useTheme()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user)) {
      router.push('/auth/server-login')
    }
  }, [authLoading, isAuthenticated, user, router])

  if (authLoading || !isAuthenticated || !user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div
            className={cn(
              'flex flex-col items-center gap-4',
              isDark ? 'text-gray-300' : 'text-gray-600'
            )}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            <p className="text-lg font-medium">
              {authLoading ? 'Verificando autenticação...' : 'Redirecionando...'}
            </p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return <MainLayout>{children}</MainLayout>
}
