'use client'

import React, { useEffect } from 'react'
import { clsx } from 'clsx'
import type { INotification } from '@/types/auth'

interface NotificationProps {
    notification: INotification
    onClose: () => void
    duration?: number
}

const Notification: React.FC<NotificationProps> = ({
    notification,
    onClose,
    duration = 5000
}) => {
    useEffect(() => {
        if (notification.isOpen) {
            const timer = setTimeout(() => {
                onClose()
            }, duration)

            return () => clearTimeout(timer)
        }
    }, [ notification.isOpen, duration, onClose ])

    if (!notification.isOpen) return null

    const getNotificationStyles = () => {
        const baseStyles = "fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 min-w-[320px] max-w-md transform transition-all duration-300 ease-in-out"

        switch (notification.type) {
            case 'success':
                return clsx(baseStyles, "bg-green-600 text-white border-l-4 border-green-800")
            case 'warning':
                return clsx(baseStyles, "bg-yellow-600 text-white border-l-4 border-yellow-800")
            case 'error':
                return clsx(baseStyles, "bg-red-600 text-white border-l-4 border-red-800")
            case 'info':
            default:
                return clsx(baseStyles, "bg-blue-600 text-white border-l-4 border-blue-800")
        }
    }

    const getIcon = () => {
        switch (notification.type) {
            case 'success':
                return (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                )
            case 'warning':
                return (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                )
            case 'error':
                return (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                )
            case 'info':
            default:
                return (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                )
        }
    }

    return (
        <div className={getNotificationStyles()}>
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    {getIcon()}
                </div>
                <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-medium">
                        {notification.message}
                    </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button
                        className="inline-flex text-white hover:text-gray-200 focus:outline-none focus:text-gray-200 transition-colors duration-200"
                        onClick={onClose}
                    >
                        <span className="sr-only">Fechar</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Notification
