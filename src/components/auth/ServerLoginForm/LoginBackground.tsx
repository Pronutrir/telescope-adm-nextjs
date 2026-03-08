'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface LoginBackgroundProps {
  isDark: boolean
  children: React.ReactNode
}

export const LoginBackground: React.FC<LoginBackgroundProps> = ({ isDark, children }) => (
  <div
    className={cn(
      'min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat bg-fixed transition-all duration-300',
      isDark ? 'bg-gray-950' : 'bg-slate-800'
    )}
    style={{
      backgroundImage: isDark
        ? "url(/backgrounds/galaxy.webp), url(/backgrounds/galaxy.jpg), linear-gradient(135deg, rgba(11,14,14,0.6) 0%, rgba(22,27,29,0.7) 50%, rgba(34,41,43,0.8) 100%)"
        : "url(/backgrounds/galaxy.webp), url(/backgrounds/galaxy.jpg), linear-gradient(135deg, rgba(248,250,252,0.3) 0%, rgba(241,245,249,0.4) 50%, rgba(226,232,240,0.5) 100%)",
    }}
  >
    <div className="absolute inset-0 opacity-10">
      <div className={cn('absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent', isDark ? 'text-gray-400' : 'text-gray-600')} />
    </div>
    <div className="relative w-full max-w-md">
      {children}
    </div>
  </div>
)
