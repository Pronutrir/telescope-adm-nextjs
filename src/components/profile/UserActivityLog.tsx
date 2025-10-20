'use client'

import React from 'react'
import { 
    Clock, 
    LogIn, 
    LogOut, 
    Shield, 
    Edit,
    FileText,
    Activity
} from 'lucide-react'

interface ActivityItem {
    id: string
    type: 'login' | 'logout' | 'update' | 'security' | 'document' | 'other'
    title: string
    description: string
    timestamp: string
}

interface UserActivityLogProps {
    activities: ActivityItem[]
    isDark?: boolean
}

    // Activity icon based on type
    const ActivityIcon = ({ type }: { type: ActivityItem['type'] }) => {
        const iconClass = "w-5 h-5 info-card-icon"

        switch (type) {        case 'login':
            return <LogIn className={iconClass} />
        case 'logout':
            return <LogOut className={iconClass} />
        case 'update':
            return <Edit className={iconClass} />
        case 'security':
            return <Shield className={iconClass} />
        case 'document':
            return <FileText className={iconClass} />
        default:
            return <Activity className={iconClass} />
    }
}

const getActivityColor = (type: ActivityItem['type'], isDark: boolean) => {
    const colors = {
        login: isDark ? 'text-green-400 bg-green-900/20' : 'text-green-600 bg-green-50',
        logout: isDark ? 'text-red-400 bg-red-900/20' : 'text-red-600 bg-red-50',
        update: isDark ? 'text-blue-400 bg-blue-900/20' : 'text-blue-600 bg-blue-50',
        security: isDark ? 'text-purple-400 bg-purple-900/20' : 'text-purple-600 bg-purple-50',
        document: isDark ? 'text-orange-400 bg-orange-900/20' : 'text-orange-600 bg-orange-50',
        other: isDark ? 'text-gray-400 bg-gray-900/20' : 'text-gray-600 bg-gray-50',
    }
    return colors[type]
}

export const UserActivityLog: React.FC<UserActivityLogProps> = ({
    activities,
    isDark = false
}) => {
    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffInMs = now.getTime() - date.getTime()
        const diffInHours = diffInMs / (1000 * 60 * 60)
        
        if (diffInHours < 1) {
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
            return `${diffInMinutes} minuto${diffInMinutes !== 1 ? 's' : ''} atrás`
        } else if (diffInHours < 24) {
            const hours = Math.floor(diffInHours)
            return `${hours} hora${hours !== 1 ? 's' : ''} atrás`
        } else if (diffInHours < 48) {
            return 'Ontem'
        } else {
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
        }
    }

    return (
        <div className={`
            p-8 rounded-xl border shadow-lg
            ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}
        `}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <Clock className="w-8 h-8 profile-header-icon" />
                <div>
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        Atividades Recentes
                    </h2>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Acompanhe suas últimas ações no sistema
                    </p>
                </div>
            </div>

            {/* Activities List */}
            <div className="space-y-4">
                {activities.length > 0 ? (
                    activities.map((activity, index) => (
                        <div
                            key={activity.id}
                            className={`
                                relative flex gap-4 p-4 rounded-lg border transition-all duration-200
                                ${isDark 
                                    ? 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50' 
                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                }
                            `}
                        >
                            {/* Timeline Line */}
                            {index < activities.length - 1 && (
                                <div className={`
                                    absolute left-6 top-16 w-0.5 h-8
                                    ${isDark ? 'bg-gray-600' : 'bg-gray-300'}
                                `} />
                            )}

                            {/* Icon */}
                            <div className={`
                                flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                                ${getActivityColor(activity.type, isDark)}
                            `}>
                                <ActivityIcon type={activity.type} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className={`
                                            text-base font-semibold
                                            ${isDark ? 'text-white' : 'text-gray-800'}
                                        `}>
                                            {activity.title}
                                        </h3>
                                        <p className={`
                                            text-sm mt-1
                                            ${isDark ? 'text-gray-300' : 'text-gray-600'}
                                        `}>
                                            {activity.description}
                                        </p>
                                    </div>
                                    
                                    {/* Timestamp */}
                                    <div className={`
                                        flex-shrink-0 text-xs
                                        ${isDark ? 'text-gray-400' : 'text-gray-500'}
                                    `}>
                                        {formatDate(activity.timestamp)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <Clock className="w-16 h-16 mx-auto mb-4 info-card-icon" />
                        <p className={`
                            text-lg font-medium
                            ${isDark ? 'text-gray-300' : 'text-gray-700'}
                        `}>
                            Nenhuma atividade recente
                        </p>
                        <p className={`
                            text-sm mt-2
                            ${isDark ? 'text-gray-400' : 'text-gray-500'}
                        `}>
                            Suas ações no sistema aparecerão aqui
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
