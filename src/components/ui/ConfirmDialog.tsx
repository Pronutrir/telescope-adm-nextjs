'use client'

import React from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useTheme } from '@/contexts/ThemeContext'
import { twMerge } from 'tailwind-merge'
import { AlertTriangle, Info, AlertCircle } from 'lucide-react'

interface ConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText: string
    cancelText: string
    isLoading: boolean
    variant: 'danger' | 'warning' | 'info'
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    cancelText,
    isLoading,
    variant
}) => {
    const { isDark } = useTheme()

    const getVariantStyles = () => {
        switch (variant) {
            case 'danger':
                return {
                    icon: <AlertTriangle className="w-6 h-6" />,
                    iconColor: isDark ? 'text-red-400' : 'text-red-500',
                    iconBg: isDark ? 'bg-red-900/20' : 'bg-red-100',
                    buttonColor: 'bg-red-600 hover:bg-red-700 text-white'
                }
            case 'warning':
                return {
                    icon: <AlertCircle className="w-6 h-6" />,
                    iconColor: isDark ? 'text-yellow-400' : 'text-yellow-500',
                    iconBg: isDark ? 'bg-yellow-900/20' : 'bg-yellow-100',
                    buttonColor: 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }
            default:
                return {
                    icon: <Info className="w-6 h-6" />,
                    iconColor: isDark ? 'text-blue-400' : 'text-blue-500',
                    iconBg: isDark ? 'bg-blue-900/20' : 'bg-blue-100',
                    buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white'
                }
        }
    }

    const styles = getVariantStyles()

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title=""
            size="sm"
            showCloseButton={false}
        >
            <div className="text-center">
                {/* Ícone */}
                <div className={twMerge(
                    'w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4',
                    styles.iconBg
                )}>
                    <div className={styles.iconColor}>
                        {styles.icon}
                    </div>
                </div>

                {/* Título */}
                <h3 className={twMerge(
                    'text-lg font-semibold mb-2',
                    isDark ? 'text-white' : 'text-gray-900'
                )}>
                    {title}
                </h3>

                {/* Mensagem */}
                <p className={twMerge(
                    'text-sm mb-6',
                    isDark ? 'text-gray-300' : 'text-gray-600'
                )}>
                    {message}
                </p>

                {/* Botões */}
                <div className="flex items-center justify-center gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="min-w-[100px]"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={twMerge(
                            'min-w-[100px] inline-flex items-center justify-center gap-2',
                            styles.buttonColor
                        )}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processando...
                            </>
                        ) : (
                            confirmText
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
