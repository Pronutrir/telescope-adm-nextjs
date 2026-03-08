'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import type { MergeProgress } from './usePDFMerge'

interface MergeProgressBannerProps {
  isDark: boolean
  mergeProgress: MergeProgress
  isMerging: boolean
}

const STYLES = {
  success: { border: 'border-green-500', light: 'bg-green-50 text-green-700', dark: 'bg-green-900/20 text-green-400' },
  error: { border: 'border-red-500', light: 'bg-red-50 text-red-700', dark: 'bg-red-900/20 text-red-400' },
  info: { border: 'border-blue-500', light: 'bg-blue-50 text-blue-700', dark: 'bg-blue-900/20 text-blue-400' },
}

const LABELS = { success: '✅ Sucesso', error: '❌ Erro', info: '🔄 Processando' }

export const MergeProgressBanner: React.FC<MergeProgressBannerProps> = ({ isDark, mergeProgress, isMerging }) => {
  if (!mergeProgress.show) return null

  const s = STYLES[mergeProgress.type]

  return (
    <div className={cn('p-4 rounded-lg border-l-4', s.border, isDark ? s.dark : s.light)}>
      <div className="flex items-center gap-2">
        {isMerging && <Loader2 className="w-5 h-5 animate-spin" />}
        <span className="font-medium">{LABELS[mergeProgress.type]}</span>
      </div>
      <p className="mt-1 text-sm">{mergeProgress.message}</p>
    </div>
  )
}
