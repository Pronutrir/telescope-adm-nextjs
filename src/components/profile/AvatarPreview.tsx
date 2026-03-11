'use client'

import React from 'react'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AvatarPreviewProps {
    previewUrl: string | null
    userName: string
    isDark: boolean
    onClickCamera: () => void
    getInitials: (name: string) => string
}

export const AvatarPreview: React.FC<AvatarPreviewProps> = ({ previewUrl, userName, isDark, onClickCamera, getInitials }) => (
    <div className="relative group">
        <div className={cn('relative w-32 h-32 rounded-full overflow-hidden border-4 shadow-lg', isDark ? 'border-gray-700' : 'border-gray-200')}>
            {previewUrl ? (
                <Image src={previewUrl} alt={userName} fill className="object-cover" />
            ) : (
                <div className={cn('w-full h-full flex items-center justify-center text-4xl font-bold', isDark ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' : 'bg-gradient-to-br from-blue-400 to-purple-500 text-white')}>
                    {getInitials(userName)}
                </div>
            )}
        </div>
        <button
            type="button"
            onClick={onClickCamera}
            aria-label="Alterar foto de perfil"
            className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
        >
            <Camera className="w-8 h-8" style={{ stroke: 'white', strokeWidth: 1.5, fill: 'none' }} />
        </button>
    </div>
)
