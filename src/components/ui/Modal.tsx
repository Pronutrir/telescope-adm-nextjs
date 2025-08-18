'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import { twMerge } from 'tailwind-merge'
import { X } from 'lucide-react'

interface ModalProps {
    /**
     * Se o modal está aberto
     */
    isOpen: boolean

    /**
     * Função para fechar o modal
     */
    onClose: () => void

    /**
     * Título do modal
     */
    title?: string

    /**
     * Conteúdo do corpo do modal
     */
    children: ReactNode

    /**
     * Conteúdo do footer (botões de ação)
     */
    footer?: ReactNode

    /**
     * Classes CSS adicionais
     */
    className?: string

    /**
     * Tamanho do modal
     */
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'

    /**
     * Se deve mostrar o botão de fechar
     */
    showCloseButton?: boolean

    /**
     * Se deve fechar ao clicar no overlay
     */
    closeOnOverlayClick?: boolean

    /**
     * Se deve fechar ao pressionar ESC
     */
    closeOnEsc?: boolean

    /**
     * Animação de entrada
     */
    animation?: 'slide-down' | 'fade' | 'slide-up' | 'zoom'
}

/**
 * Componente Modal reutilizável com animações e suporte a temas
 * Baseado no exemplo HTML fornecido, adaptado para React/Next.js
 * 
 * Características:
 * - Sempre centralizado na viewport atual (sem necessidade de scroll)
 * - Altura máxima de 90vh com scroll interno quando necessário
 * - Animações suaves com transform e opacity
 * - Suporte completo a temas dark/light
 * - Responsive e acessível
 */
export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    className,
    size = 'md',
    showCloseButton = true,
    closeOnOverlayClick = true,
    closeOnEsc = true,
    animation = 'slide-down'
}) => {
    // 🎯 CONTEXTOS OBRIGATÓRIOS
    const { isDark } = useTheme()
    const { isMobile } = useLayout()

    // Estado para controlar se está no cliente (para o portal)
    const [ mounted, setMounted ] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Tamanhos do modal
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'w-full h-[95vh] max-w-none max-h-none m-2'
    }

    // Classes de animação - ajustadas para centralização fixa
    const animationClasses = {
        'slide-down': {
            overlay: 'transition-opacity duration-300',
            dialog: 'transition-all duration-300 ease-out',
            openOverlay: 'opacity-100',
            openDialog: 'translate-y-0 opacity-100',
            closedOverlay: 'opacity-0',
            closedDialog: '-translate-y-4 opacity-0'
        },
        'fade': {
            overlay: 'transition-opacity duration-300',
            dialog: 'transition-opacity duration-300',
            openOverlay: 'opacity-100',
            openDialog: 'opacity-100',
            closedOverlay: 'opacity-0',
            closedDialog: 'opacity-0'
        },
        'slide-up': {
            overlay: 'transition-opacity duration-300',
            dialog: 'transition-all duration-300 ease-out',
            openOverlay: 'opacity-100',
            openDialog: 'translate-y-0 opacity-100',
            closedOverlay: 'opacity-0',
            closedDialog: 'translate-y-4 opacity-0'
        },
        'zoom': {
            overlay: 'transition-opacity duration-300',
            dialog: 'transition-all duration-300 ease-out',
            openOverlay: 'opacity-100',
            openDialog: 'scale-100 opacity-100',
            closedOverlay: 'opacity-0',
            closedDialog: 'scale-95 opacity-0'
        }
    }

    const currentAnimation = animationClasses[ animation ]

    // Fechar modal ao pressionar ESC
    useEffect(() => {
        if (!closeOnEsc) return

        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        document.addEventListener('keydown', handleEsc)
        return () => document.removeEventListener('keydown', handleEsc)
    }, [ isOpen, onClose, closeOnEsc ])

    // Prevenir scroll do body quando modal está aberto
    useEffect(() => {
        if (isOpen) {
            // Salva o scroll atual
            const scrollY = window.scrollY

            // Bloqueia o scroll
            document.body.style.position = 'fixed'
            document.body.style.top = `-${scrollY}px`
            document.body.style.width = '100%'
            document.body.style.overflow = 'hidden'

            // Força o modal a aparecer no topo
            window.scrollTo(0, 0)
        } else {
            // Restaura o scroll
            const scrollY = document.body.style.top
            document.body.style.position = ''
            document.body.style.top = ''
            document.body.style.width = ''
            document.body.style.overflow = ''

            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1)
            }
        }

        return () => {
            // Cleanup
            document.body.style.position = ''
            document.body.style.top = ''
            document.body.style.width = ''
            document.body.style.overflow = ''
        }
    }, [ isOpen ])

    // Se modal não está aberto ou ainda não está montado, não renderizar
    if (!isOpen || !mounted) {
        return null
    }

    // Renderiza o modal em um portal para evitar problemas de posicionamento
    const modalContent = (
        <>
            {/* Overlay - Posicionamento absoluto e z-index muito alto */}
            <div
                className={twMerge(
                    // Posicionamento fixo com z-index máximo para sempre ficar no topo
                    'fixed inset-0 z-[9999]',
                    // Força posicionamento no topo da viewport
                    'top-0 left-0 right-0 bottom-0',
                    // Animações
                    currentAnimation.overlay,
                    isOpen ? currentAnimation.openOverlay : currentAnimation.closedOverlay,
                    // Tema adaptado
                    'bg-black/50 backdrop-blur-sm'
                )}
                role="dialog"
                tabIndex={-1}
                onClick={closeOnOverlayClick ? onClose : undefined}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 9999
                }}
            >
                {/* Modal Dialog - Centralizado forçadamente na viewport */}
                <div
                    className={twMerge(
                        // Posicionamento absoluto dentro do overlay fixo
                        'absolute inset-0 pointer-events-none',
                        // Centralização apenas se não for full size
                        size === 'full' ? '' : 'flex items-center justify-center p-4',
                        // Responsividade
                        size !== 'full' && isMobile ? 'p-2' : size !== 'full' ? 'p-4' : ''
                    )}
                    style={size === 'full' ? {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%'
                    } : {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div
                        className={twMerge(
                            // Modal dialog classes - reabilita pointer events
                            'relative w-full transform shadow-xl pointer-events-auto',
                            // Overflow e border radius apenas se não for full
                            size === 'full' ? '' : 'overflow-hidden rounded-lg',
                            // Animações
                            currentAnimation.dialog,
                            isOpen ? currentAnimation.openDialog : currentAnimation.closedDialog,
                            // Tamanho
                            sizeClasses[ size ],
                            // Altura máxima apenas se não for full size
                            size === 'full' ? '' : 'max-h-[90vh] overflow-y-auto',
                            // Classes adicionais
                            className
                        )}
                        onClick={(e) => e.stopPropagation()} // Previne fechar ao clicar no conteúdo
                    >
                        {/* Modal Content - Preservando estrutura */}
                        <div className={twMerge(
                            // Largura total e altura total se for full size
                            size === 'full' ? 'w-full h-full flex flex-col' : 'w-full',
                            // Tema adaptado
                            isDark
                                ? 'bg-gray-800 text-white'
                                : 'bg-white text-gray-900'
                        )}>

                            {/* Modal Header - Preservando estrutura original */}
                            {(title || showCloseButton) && (
                                <div className={twMerge(
                                    'relative flex items-center justify-between px-6 py-4 border-b',
                                    isDark ? 'border-gray-700' : 'border-gray-200'
                                )}>
                                    {title && (
                                        <h3 className={twMerge(
                                            'text-lg font-semibold leading-6',
                                            isDark ? 'text-white' : 'text-gray-900'
                                        )}>
                                            {title}
                                        </h3>
                                    )}

                                    {/* Close Button - Preservando posição do exemplo */}
                                    {showCloseButton && (
                                        <button
                                            type="button"
                                            className={twMerge(
                                                // Classes do exemplo adaptadas
                                                'absolute end-3 top-3 p-2 rounded-full',
                                                'transition-colors duration-200',
                                                // Tema adaptado
                                                isDark
                                                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                            )}
                                            onClick={onClose}
                                            aria-label="Fechar modal"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Modal Body - Com scroll interno otimizado */}
                            <div className={twMerge(
                                // Padding apenas se não for full size
                                size === 'full' ? 'mb-6' : 'px-6 py-4',
                                // Altura flexível baseada no conteúdo, máximo de 70vh para viewport pequenas
                                size === 'full' ? 'h-full flex-1' : 'max-h-[70vh] overflow-y-auto',
                                // Scroll suave apenas se não for full
                                size === 'full' ? '' : 'scroll-smooth'
                            )}>
                                {children}
                            </div>

                            {/* Modal Footer - Preservando estrutura original */}
                            {footer && (
                                <div className={twMerge(
                                    'flex items-center justify-end gap-3 px-6 py-4 border-t',
                                    isDark ? 'border-gray-700' : 'border-gray-200'
                                )}>
                                    {footer}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

    // Usa portal para renderizar o modal diretamente no body
    return createPortal(modalContent, document.body)
}

/**
 * Hook para controlar estado do modal
 */
export const useModal = () => {
    const [ isOpen, setIsOpen ] = React.useState(false)

    const openModal = () => setIsOpen(true)
    const closeModal = () => setIsOpen(false)
    const toggleModal = () => setIsOpen(prev => !prev)

    return {
        isOpen,
        openModal,
        closeModal,
        toggleModal
    }
}

export default Modal
