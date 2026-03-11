import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProfileInfoRowProps {
    icon: LucideIcon
    label: string
    value: string | number
    badge?: { text: string; color: string }
    isDark: boolean
    className?: string
}

export const ProfileInfoRow: React.FC<ProfileInfoRowProps> = ({ icon: Icon, label, value, badge, isDark, className }) => (
    <div className={cn(
        'flex items-start gap-4 p-4 rounded-lg border transition-all duration-200',
        isDark ? 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50' : 'bg-gray-50 border-gray-200 hover:bg-gray-100',
        className,
    )}>
        <div className={cn('flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center', isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600')}>
            <Icon className="w-5 h-5 info-card-icon" />
        </div>
        <div className="flex-1 min-w-0">
            <p className={cn('text-sm font-medium', isDark ? 'text-gray-400' : 'text-gray-600')}>{label}</p>
            <p className={cn('text-base font-semibold mt-1', isDark ? 'text-white' : 'text-gray-800')}>
                {value ?? 'Não informado'}
            </p>
        </div>
        {badge && (
            <span className={cn('flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium', badge.color)}>
                {badge.text}
            </span>
        )}
    </div>
)
