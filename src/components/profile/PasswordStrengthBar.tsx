import React from 'react'
import { cn } from '@/lib/utils'

interface PasswordStrengthBarProps {
    strength: number
    label: string
    color: string
    isDark: boolean
}

export const PasswordStrengthBar: React.FC<PasswordStrengthBarProps> = ({ strength, label, color, isDark }) => (
    <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Força da senha:</span>
            <span className={cn(
                'font-medium',
                strength === 100 ? (isDark ? 'text-green-400' : 'text-green-600') :
                strength === 75  ? (isDark ? 'text-blue-400'  : 'text-blue-600')  :
                strength === 50  ? (isDark ? 'text-yellow-400': 'text-yellow-600') :
                                   (isDark ? 'text-red-400'   : 'text-red-600'),
            )}>
                {label}
            </span>
        </div>
        <div className={cn('w-full h-2 rounded-full overflow-hidden', isDark ? 'bg-gray-700' : 'bg-gray-200')}>
            <div className={cn('h-full transition-all duration-300', color)} style={{ width: `${strength}%` }} />
        </div>
    </div>
)
