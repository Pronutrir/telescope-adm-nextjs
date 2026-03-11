'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { Camera, Upload, X, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAvatarUpload, getInitials } from './useAvatarUpload'
import { AvatarPreview } from './AvatarPreview'

interface UserAvatarUploadProps {
    currentAvatar?: string
    userName: string
    onUpload: (file: File) => Promise<void>
    isDark?: boolean
}

export const UserAvatarUpload: React.FC<UserAvatarUploadProps> = ({ currentAvatar, userName, onUpload, isDark = false }) => {
    const { previewUrl, isUploading, error, success, fileInputRef, handleFileSelect, handleUpload, handleRemove } = useAvatarUpload({ currentAvatar, onUpload })
    const hasNewPreview = previewUrl !== currentAvatar && previewUrl

    return (
        <div className={cn('p-6 rounded-xl border', isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200')}>
            <div className="flex flex-col items-center space-y-6">
                <AvatarPreview
                    previewUrl={previewUrl}
                    userName={userName}
                    isDark={isDark}
                    onClickCamera={() => fileInputRef.current?.click()}
                    getInitials={getInitials}
                />

                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

                <div className="flex flex-col items-center gap-3 w-full">
                    <Button variant="primary" icon={Camera} size="md" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full max-w-xs">
                        Escolher Foto
                    </Button>
                    {hasNewPreview && (
                        <div className="flex gap-2 w-full max-w-xs">
                            <Button variant="success" icon={Upload} size="sm" onClick={handleUpload} disabled={isUploading} loading={isUploading} className="flex-1">
                                {isUploading ? 'Enviando...' : 'Confirmar'}
                            </Button>
                            <Button variant="error" icon={X} size="sm" onClick={handleRemove} disabled={isUploading} className="flex-1">
                                Cancelar
                            </Button>
                        </div>
                    )}
                </div>

                {error && (
                    <div className={cn('flex items-center gap-2 p-3 rounded-lg border w-full max-w-xs', isDark ? 'bg-red-900/20 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-600')}>
                        <AlertCircle className="w-4 h-4 flex-shrink-0 info-card-icon" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className={cn('flex items-center gap-2 p-3 rounded-lg border w-full max-w-xs', isDark ? 'bg-green-900/20 border-green-800 text-green-400' : 'bg-green-50 border-green-200 text-green-600')}>
                        <CheckCircle className="w-4 h-4 flex-shrink-0 info-card-icon" />
                        <p className="text-sm">Foto atualizada com sucesso!</p>
                    </div>
                )}

                <p className={cn('text-xs text-center max-w-xs', isDark ? 'text-gray-400' : 'text-gray-500')}>
                    JPG, PNG ou GIF. Tamanho máximo: 2MB
                </p>
            </div>
        </div>
    )
}
