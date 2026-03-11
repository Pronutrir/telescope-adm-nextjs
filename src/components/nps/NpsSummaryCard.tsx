'use client'

import { type LucideIcon, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface NpsSummaryCardProps {
  icon: LucideIcon
  color: string
  bg: string
  label: string
  value: string | number
  unit?: string
  pct?: string
  tooltip?: string
}

function getPctClass(color: string): string {
  if (color.includes('emerald')) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
  if (color.includes('amber')) return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
  if (color.includes('cyan')) return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300'
  if (color.includes('rose')) return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
  if (color.includes('blue')) return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
  if (color.includes('violet')) return 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300'
  if (color.includes('gray')) return 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400'
  return 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400'
}

export function NpsSummaryCard({ icon: Icon, color, bg, label, value, unit, pct, tooltip }: NpsSummaryCardProps) {
  return (
    <div className="flex-1 min-w-[150px] flex items-center gap-3 px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700/40 bg-white dark:bg-[#1b2030] shadow-sm">
      <span className={cn('flex items-center justify-center w-10 h-10 rounded-xl shrink-0', bg)}>
        <Icon size={18} className={color} />
      </span>
      <div className="flex flex-col min-w-0">
        <div className="flex items-end gap-1 leading-none">
          <span className="text-2xl font-bold text-gray-800 dark:text-white">{value}</span>
          {unit && <span className="text-sm font-semibold text-gray-400 dark:text-gray-500 mb-0.5">{unit}</span>}
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight truncate">{label}</span>
          {tooltip && <span title={tooltip}><Info size={11} className="text-gray-400 cursor-help shrink-0" /></span>}
        </div>
        {pct && (
          <span className={cn('mt-1 self-start text-[10px] font-semibold leading-none px-1.5 py-0.5 rounded-full', getPctClass(color))}>
            {pct}
          </span>
        )}
      </div>
    </div>
  )
}
