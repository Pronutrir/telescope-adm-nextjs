'use client'

import React from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { ptBR } from 'date-fns/locale'
import { CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'
// @ts-expect-error css module
import 'react-datepicker/dist/react-datepicker.css'

registerLocale('pt-BR', ptBR)

interface NpsDatePickerProps {
  label: string
  name: string
  value: string
  onChange: (name: string, value: string) => void
  maxDate?: Date
  error?: string
  touched?: boolean
}

export function NpsDatePicker({ label, name, value, onChange, maxDate, error, touched }: NpsDatePickerProps) {
  const { isDark } = useTheme()
  const selected = value ? new Date(`${value}T12:00:00`) : null

  function handleChange(date: Date | null) {
    if (!date) { onChange(name, ''); return }
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    onChange(name, `${y}-${m}-${d}`)
  }

  return (
    <div className="flex-1 min-w-[140px]">
      <label className={cn(
        'text-sm mb-1 block font-medium',
        isDark ? 'text-slate-300' : 'text-slate-700',
      )}>{label}</label>
      <div className="relative flex items-center">
        <DatePicker
          selected={selected}
          onChange={handleChange}
          locale="pt-BR"
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/mm/aaaa"
          className={cn(
            'w-full rounded-lg pl-9 pr-3 py-2 text-sm outline-none border transition-colors duration-150',
            'focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500',
            isDark
              ? 'bg-[#1E293B] text-slate-100 placeholder:text-slate-500'
              : 'bg-white text-slate-900 placeholder:text-slate-400',
            error && touched
              ? 'border-red-500'
              : isDark
                ? 'border-slate-600 hover:border-slate-500'
                : 'border-slate-300 hover:border-slate-400',
          )}
          wrapperClassName="w-full"
          maxDate={maxDate}
          showPopperArrow={false}
          popperPlacement="bottom-start"
          calendarClassName="nps-datepicker-calendar"
        />
        <CalendarDays
          size={15}
          className="input-icon absolute left-3 pointer-events-none"
        />
      </div>
      {error && touched && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
