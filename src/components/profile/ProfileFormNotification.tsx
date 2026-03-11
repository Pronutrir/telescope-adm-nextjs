'use client'

import React from 'react'
import type { LucideIcon } from 'lucide-react'

interface ProfileFormNotificationProps {
    message: string
    colorClass: string
    Icon: LucideIcon
}

export const ProfileFormNotification: React.FC<ProfileFormNotificationProps> = ({
    message,
    colorClass,
    Icon,
}) => (
    <div className={`flex items-center gap-3 p-4 mb-6 rounded-lg border ${colorClass}`}>
        <Icon className="h-5 w-5 flex-shrink-0" />
        <p className="text-sm font-medium">{message}</p>
    </div>
)
