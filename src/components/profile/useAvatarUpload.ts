'use client'

import { useState, useRef, useCallback } from 'react'

interface UseAvatarUploadProps {
    currentAvatar?: string
    onUpload: (file: File) => Promise<void>
}

export function getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
}

export function useAvatarUpload({ currentAvatar, onUpload }: UseAvatarUploadProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatar || null)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (!file.type.startsWith('image/')) { setError('Por favor, selecione uma imagem válida'); return }
        if (file.size > 2 * 1024 * 1024) { setError('A imagem deve ter no máximo 2MB'); return }
        setError(null)
        setSuccess(false)
        const reader = new FileReader()
        reader.onloadend = () => setPreviewUrl(reader.result as string)
        reader.readAsDataURL(file)
    }, [])

    const handleUpload = useCallback(async () => {
        const file = fileInputRef.current?.files?.[0]
        if (!file) return
        try {
            setIsUploading(true)
            setError(null)
            await onUpload(file)
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao fazer upload da imagem')
        } finally {
            setIsUploading(false)
        }
    }, [onUpload])

    const handleRemove = useCallback(() => {
        setPreviewUrl(currentAvatar || null)
        if (fileInputRef.current) fileInputRef.current.value = ''
        setError(null)
        setSuccess(false)
    }, [currentAvatar])

    return { previewUrl, isUploading, error, success, fileInputRef, handleFileSelect, handleUpload, handleRemove }
}
