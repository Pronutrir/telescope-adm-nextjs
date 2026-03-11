import React from 'react'
import { cn } from '@/lib/utils'

interface PasswordRequirementsProps {
    isDark: boolean
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ isDark }) => (
    <div className={cn('p-4 rounded-lg border', isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200')}>
        <h4 className={cn('text-sm font-medium mb-2', isDark ? 'text-white' : 'text-gray-800')}>
            Requisitos de senha:
        </h4>
        <ul className={cn('text-xs space-y-1', isDark ? 'text-gray-300' : 'text-gray-600')}>
            <li>• Mínimo de 8 caracteres</li>
            <li>• Pelo menos uma letra maiúscula</li>
            <li>• Pelo menos uma letra minúscula</li>
            <li>• Pelo menos um número</li>
            <li>• Pelo menos um caractere especial (@$!%*?&#)</li>
        </ul>
    </div>
)
