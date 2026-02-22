'use client'

import React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PasswordFieldProps {
  id: string
  name: string
  label: string
  placeholder: string
  autoComplete: string
  value: string
  showPassword: boolean
  onToggle: () => void
  onChange: React.ChangeEventHandler<HTMLInputElement>
  onBlur: React.FocusEventHandler<HTMLInputElement>
  error?: string
  touched?: boolean
  isDark: boolean
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  name,
  label,
  placeholder,
  autoComplete,
  value,
  showPassword,
  onToggle,
  onChange,
  onBlur,
  error,
  touched,
  isDark,
}) => {
  const hasError = !!(error && touched)

  return (
    <div>
      <label
        htmlFor={id}
        className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className={cn(
            'block w-full pl-3 pr-12 py-3 border rounded-lg',
            'focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200',
            isDark
              ? 'bg-slate-700/50 text-slate-100 placeholder-slate-400'
              : 'bg-slate-50/80 text-slate-900 placeholder-slate-400',
            hasError
              ? 'border-red-500 focus:ring-red-400'
              : isDark
                ? 'border-slate-600/40 focus:ring-green-500/50'
                : 'border-slate-300/40 focus:ring-green-500/50'
          )}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          className={cn(
            'absolute top-0 right-0 h-full flex items-center justify-center w-12',
            'rounded-r-lg transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-green-500',
            isDark ? 'text-gray-400 hover:text-gray-100' : 'text-gray-500 hover:text-gray-800'
          )}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Eye className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
      {hasError && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
