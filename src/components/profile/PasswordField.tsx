'use client'

import React from 'react'
import { Input } from '@/components/ui/Input'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PasswordFieldProps {
    label: string
    name: string
    value: string
    onChange: React.ChangeEventHandler<HTMLInputElement>
    onBlur: React.FocusEventHandler<HTMLInputElement>
    error: string | false | undefined
    isDark: boolean
    show: boolean
    onToggleShow: () => void
    placeholder?: string
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
    label, name, value, onChange, onBlur, error, isDark, show, onToggleShow, placeholder,
}) => (
    <div className="space-y-2">
        <Input
            label={label}
            name={name}
            type={show ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={error}
            icon={Lock}
            placeholder={placeholder}
            required
            isDark={isDark}
        />
        <button
            type="button"
            onClick={onToggleShow}
            className={cn(
                'text-sm flex items-center gap-2 p-2',
                isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700',
            )}
        >
            {show
                ? <><EyeOff className="w-4 h-4 text-button-icon" /> Ocultar senha</>
                : <><Eye className="w-4 h-4 text-button-icon" /> Mostrar senha</>
            }
        </button>
    </div>
)
