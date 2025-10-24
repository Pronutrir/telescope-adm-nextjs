/**
 * 🔔 GLOBAL NOTIFICATION CONTAINER
 * 
 * Componente visual para renderizar as notificações globais
 */

'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNotifications, type Notification, type NotificationPosition } from '@/contexts/NotificationContext'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

// 🎨 Ícones para cada tipo
const typeIcons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
}

// 🎨 Classes de cor para cada tipo (ícones agora usam classes globais)
const getTypeStyles = (type: Notification[ 'type' ], isDark: boolean) => {
    const styles = {
        success: {
            container: isDark
                ? 'bg-green-900/95 border-green-600/60 text-green-50 shadow-xl shadow-green-900/20'
                : 'bg-green-50/95 border-green-300/60 text-green-900 shadow-xl shadow-green-500/10',
            closeButton: isDark ? 'text-green-200 hover:text-green-50' : 'text-green-600 hover:text-green-800'
        },
        error: {
            container: isDark
                ? 'bg-red-900/95 border-red-600/60 text-red-50 shadow-xl shadow-red-900/20'
                : 'bg-red-50/95 border-red-300/60 text-red-900 shadow-xl shadow-red-500/10',
            closeButton: isDark ? 'text-red-200 hover:text-red-50' : 'text-red-600 hover:text-red-800'
        },
        warning: {
            container: isDark
                ? 'bg-yellow-900/90 border-yellow-700/50 text-yellow-100'
                : 'bg-yellow-50 border-yellow-200 text-yellow-800',
            closeButton: isDark ? 'text-yellow-300 hover:text-yellow-100' : 'text-yellow-500 hover:text-yellow-700'
        },
        info: {
            container: isDark
                ? 'bg-blue-900/90 border-blue-700/50 text-blue-100'
                : 'bg-blue-50 border-blue-200 text-blue-800',
            closeButton: isDark ? 'text-blue-300 hover:text-blue-100' : 'text-blue-500 hover:text-blue-700'
        }
    }

    return styles[ type ]
}

// 🎨 Classes de posicionamento
const getPositionStyles = (position: NotificationPosition) => {
    const positions = {
        'top-right': 'top-4 right-4 flex-col',
        'top-left': 'top-4 left-4 flex-col',
        'top-center': 'top-4 left-1/2 transform -translate-x-1/2 flex-col',
        'bottom-right': 'bottom-4 right-4 flex-col-reverse',
        'bottom-left': 'bottom-4 left-4 flex-col-reverse',
        'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2 flex-col-reverse'
    }

    return positions[ position ] || positions[ 'top-right' ]
}

// 🔔 Componente de notificação individual
interface NotificationItemProps {
    notification: Notification
    onClose: (id: string) => void
    isDark: boolean
}

const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
    onClose,
    isDark
}) => {
    const [ isVisible, setIsVisible ] = useState(false)
    const [ isLeaving, setIsLeaving ] = useState(false)

    const Icon = notification.icon || typeIcons[ notification.type ]
    const typeStyles = getTypeStyles(notification.type, isDark)

    // Animação de entrada
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 10)
        return () => clearTimeout(timer)
    }, [])

    // Função de fechar com animação
    const handleClose = () => {
        setIsLeaving(true)
        setTimeout(() => {
            onClose(notification.id)
        }, 300)
    }

    return (
        <div
            className={`
        relative max-w-sm w-full mx-auto mb-3 rounded-xl border-2 backdrop-blur-md
        transition-all duration-500 ease-out transform
        ${typeStyles.container}
        ${notification.className || ''}
        ${isVisible && !isLeaving
                    ? 'translate-x-0 opacity-100 scale-100'
                    : 'translate-x-full opacity-0 scale-95'
                }
      `}
        >
            <div className="p-4">
                <div className="flex items-start space-x-3">
                    {/* Ícone */}
                    <div className="flex-shrink-0 mt-0.5">
                        <Icon className={`h-6 w-6 icon-${notification.type}`} />
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                        {notification.title && (
                            <h4 className="text-base font-bold mb-2 leading-tight">
                                {notification.title}
                            </h4>
                        )}
                        <p className="text-sm leading-relaxed break-words">
                            {notification.message}
                        </p>

                        {/* Ações */}
                        {notification.actions && notification.actions.length > 0 && (
                            <div className="mt-3 flex space-x-2">
                                {notification.actions.map((action, index) => (
                                    <button
                                        key={index}
                                        onClick={action.onClick}
                                        className={`
                      px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200
                      ${action.variant === 'primary'
                                                ? isDark
                                                    ? 'bg-white/20 text-white hover:bg-white/30'
                                                    : 'bg-gray-900/10 text-gray-900 hover:bg-gray-900/20'
                                                : action.variant === 'ghost'
                                                    ? 'text-current hover:bg-white/10'
                                                    : isDark
                                                        ? 'bg-white/10 text-white hover:bg-white/20'
                                                        : 'bg-gray-900/5 text-gray-900 hover:bg-gray-900/10'
                                            }
                      ${action.className || ''}
                    `}
                                    >
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Botão de fechar */}
                    {notification.dismissible !== false && (
                        <button
                            onClick={handleClose}
                            className={`
                absolute top-3 right-3 rounded-full p-1.5 
                transition-all duration-200 focus:outline-none hover:scale-110
                ${typeStyles.closeButton}
              `}
                            aria-label="Fechar notificação"
                        >
                            <X className={`h-4 w-4 icon-${notification.type}`} />
                        </button>
                    )}
                </div>
            </div>

            {/* Barra de progresso para auto-hide */}
            {notification.duration && notification.duration > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 rounded-b-lg overflow-hidden">
                    <div
                        className={`h-full transition-all ease-linear ${notification.type === 'success' ? 'bg-green-500' :
                            notification.type === 'error' ? 'bg-red-500' :
                                notification.type === 'warning' ? 'bg-yellow-500' :
                                    'bg-blue-500'
                            }`}
                        style={{
                            animation: `shrink ${notification.duration}ms linear forwards`
                        }}
                    />
                </div>
            )}
        </div>
    )
}

// 🔔 Container principal das notificações
const NotificationContainer: React.FC = () => {
    const { notifications, config, hide } = useNotifications()
    const [ isDark, setIsDark ] = useState(false)
    const [ mounted, setMounted ] = useState(false)

    // Detectar tema
    useEffect(() => {
        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains('dark'))
        }

        checkTheme()

        const observer = new MutationObserver(checkTheme)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: [ 'class' ]
        })

        return () => observer.disconnect()
    }, [])

    // Aguardar montagem do componente
    useEffect(() => {
        setMounted(true)
    }, [])

    // Não renderizar no servidor
    if (!mounted) return null

    // Criar portal para renderizar acima de tudo
    return createPortal(
        <>
            {/* Estilos de animação */}
            <style jsx global>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>

            {/* Container das notificações - Z-index mais alto que modais (99999 vs 9999) */}
            <div
                className={`
          fixed z-[99999] pointer-events-none p-4
          ${getPositionStyles(config.position)}
        `}
                style={{
                    maxWidth: '420px',
                    minWidth: '320px',
                    zIndex: 99999,
                    position: 'fixed' // Garantir posicionamento fixo
                }}
            >
                <div className="flex flex-col space-y-4">
                    {notifications.map((notification) => (
                        <div key={notification.id} className="pointer-events-auto">
                            <NotificationItem
                                notification={notification}
                                onClose={hide}
                                isDark={isDark}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>,
        document.body
    )
}

export default NotificationContainer
