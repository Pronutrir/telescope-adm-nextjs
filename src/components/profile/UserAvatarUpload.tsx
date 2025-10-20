'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Camera, Upload, X, CheckCircle, AlertCircle } from 'lucide-react'
import Image from 'next/image'

interface UserAvatarUploadProps {
    currentAvatar?: string
    userName: string
    onUpload: (file: File) => Promise<void>
    isDark?: boolean
}

export const UserAvatarUpload: React.FC<UserAvatarUploadProps> = ({
    currentAvatar,
    userName,
    onUpload,
    isDark = false
}) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatar || null)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2)
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validações
        if (!file.type.startsWith('image/')) {
            setError('Por favor, selecione uma imagem válida')
            return
        }

        if (file.size > 2 * 1024 * 1024) { // 2MB
            setError('A imagem deve ter no máximo 2MB')
            return
        }

        setError(null)
        setSuccess(false)

        // Preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const handleUpload = async () => {
        const file = fileInputRef.current?.files?.[0]
        if (!file) return

        try {
            setIsUploading(true)
            setError(null)
            await onUpload(file)
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err: any) {
            setError(err.message || 'Erro ao fazer upload da imagem')
        } finally {
            setIsUploading(false)
        }
    }

    const handleRemove = () => {
        setPreviewUrl(currentAvatar || null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        setError(null)
        setSuccess(false)
    }

    return (
        <div className={`
            p-6 rounded-xl border
            ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}
        `}>
            <div className="flex flex-col items-center space-y-6">
                {/* Avatar Preview */}
                <div className="relative group">
                    <div className={`
                        relative w-32 h-32 rounded-full overflow-hidden border-4
                        ${isDark ? 'border-gray-700' : 'border-gray-200'}
                        shadow-lg
                    `}>
                        {previewUrl ? (
                            <Image
                                src={previewUrl}
                                alt={userName}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className={`
                                w-full h-full flex items-center justify-center text-4xl font-bold
                                ${isDark 
                                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' 
                                    : 'bg-gradient-to-br from-blue-400 to-purple-500 text-white'
                                }
                            `}>
                                {getInitials(userName)}
                            </div>
                        )}
                    </div>

                    {/* Upload Button Overlay */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                            absolute inset-0 rounded-full flex items-center justify-center
                            bg-black/50 opacity-0 group-hover:opacity-100
                            transition-opacity duration-200 cursor-pointer
                        `}
                    >
                        <Camera className="w-8 h-8" style={{ stroke: 'white', strokeWidth: 1.5, fill: 'none' }} />
                    </button>
                </div>

                {/* File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                {/* Actions */}
                <div className="flex flex-col items-center gap-3 w-full">
                    <Button
                        variant="primary"
                        icon={Camera}
                        size="md"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full max-w-xs"
                    >
                        Escolher Foto
                    </Button>

                    {previewUrl !== currentAvatar && previewUrl && (
                        <div className="flex gap-2 w-full max-w-xs">
                            <Button
                                variant="success"
                                icon={Upload}
                                size="sm"
                                onClick={handleUpload}
                                disabled={isUploading}
                                loading={isUploading}
                                className="flex-1"
                            >
                                {isUploading ? 'Enviando...' : 'Confirmar'}
                            </Button>
                            <Button
                                variant="error"
                                icon={X}
                                size="sm"
                                onClick={handleRemove}
                                disabled={isUploading}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                        </div>
                    )}
                </div>

                {/* Messages */}
                {error && (
                    <div className={`
                        flex items-center gap-2 p-3 rounded-lg border w-full max-w-xs
                        ${isDark 
                            ? 'bg-red-900/20 border-red-800 text-red-400' 
                            : 'bg-red-50 border-red-200 text-red-600'
                        }
                    `}>
                        <AlertCircle className="w-4 h-4 flex-shrink-0 info-card-icon" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className={`
                        flex items-center gap-2 p-3 rounded-lg border w-full max-w-xs
                        ${isDark 
                            ? 'bg-green-900/20 border-green-800 text-green-400' 
                            : 'bg-green-50 border-green-200 text-green-600'
                        }
                    `}>
                        <CheckCircle className="w-4 h-4 flex-shrink-0 info-card-icon" />
                        <p className="text-sm">Foto atualizada com sucesso!</p>
                    </div>
                )}

                {/* Info */}
                <p className={`text-xs text-center max-w-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    JPG, PNG ou GIF. Tamanho máximo: 2MB
                </p>
            </div>
        </div>
    )
}
