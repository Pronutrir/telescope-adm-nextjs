'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import { useAuth } from '@/contexts/AuthContext'

export const useNoAccessPage = () => {
  const { isDark } = useTheme()
  const { isMobile } = useLayout()
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/server-login')
    }
  }, [user, router])

  const handleLogout = useCallback(() => {
    logout()
    router.push('/auth/server-login')
  }, [logout, router])

  const handleGoHome = useCallback(() => {
    router.push('/')
  }, [router])

  return { isDark, isMobile, user, handleLogout, handleGoHome }
}
