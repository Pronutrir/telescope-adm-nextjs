'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Bell, Check, CheckCheck, X,
    GitPullRequest, AlertTriangle, UserPlus, MessageSquare,
    Shield, Zap, Package, Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ───────── Types ───────── */

type NotificationType = 'pr' | 'alert' | 'invite' | 'comment' | 'security' | 'deploy' | 'release' | 'event'

interface Notification {
    id: string
    type: NotificationType
    title: string
    message: string
    time: string
    read: boolean
    avatar?: { initial: string; color: string }
}

/* ───────── Config ───────── */

const TYPE_CONFIG: Record<NotificationType, { icon: React.ElementType; color: string; bgDark: string; bgLight: string }> = {
    pr:       { icon: GitPullRequest, color: '#6366f1', bgDark: 'bg-indigo-500/10', bgLight: 'bg-indigo-50' },
    alert:    { icon: AlertTriangle,  color: '#f59e0b', bgDark: 'bg-amber-500/10',  bgLight: 'bg-amber-50' },
    invite:   { icon: UserPlus,       color: '#10b981', bgDark: 'bg-emerald-500/10', bgLight: 'bg-emerald-50' },
    comment:  { icon: MessageSquare,  color: '#06b6d4', bgDark: 'bg-cyan-500/10',    bgLight: 'bg-cyan-50' },
    security: { icon: Shield,         color: '#ef4444', bgDark: 'bg-red-500/10',     bgLight: 'bg-red-50' },
    deploy:   { icon: Zap,            color: '#8b5cf6', bgDark: 'bg-violet-500/10',  bgLight: 'bg-violet-50' },
    release:  { icon: Package,        color: '#ec4899', bgDark: 'bg-pink-500/10',    bgLight: 'bg-pink-50' },
    event:    { icon: Calendar,       color: '#64748b', bgDark: 'bg-slate-500/10',   bgLight: 'bg-slate-100' },
}

const INITIAL_NOTIFICATIONS: Notification[] = [
    { id: '1', type: 'security', title: 'Login suspeito detectado',   message: 'Novo acesso de São Paulo, SP — dispositivo desconhecido.',   time: 'agora',       read: false, avatar: { initial: '!', color: '#ef4444' } },
    { id: '2', type: 'pr',       title: 'PR #143 aprovado',           message: 'Bruno C. aprovou seu pull request "Stopwatch Module".',      time: '5 min',       read: false, avatar: { initial: 'B', color: '#6366f1' } },
    { id: '3', type: 'comment',  title: 'Novo comentário',            message: 'Carla M.: "Ficou excelente a refatoração do componente."',   time: '12 min',      read: false, avatar: { initial: 'C', color: '#06b6d4' } },
    { id: '4', type: 'deploy',   title: 'Deploy concluído',           message: 'telescope-adm v2.4.1 publicado em produção com sucesso.',    time: '30 min',      read: true,  avatar: { initial: 'CI', color: '#8b5cf6' } },
    { id: '5', type: 'invite',   title: 'Convite para equipe',        message: 'Ana S. te adicionou ao workspace "Oncologia".',              time: '1h',          read: true,  avatar: { initial: 'A', color: '#10b981' } },
    { id: '6', type: 'alert',    title: 'Latência elevada',           message: 'API /nps/responses com p95 acima de 800ms nos últimos 5min.',time: '2h',          read: true },
    { id: '7', type: 'release',  title: 'Nova versão disponível',     message: 'Telescope UI Kit v3.0 com novos componentes premium.',       time: '4h',          read: true },
    { id: '8', type: 'event',    title: 'Reunião em 30 minutos',      message: 'Sprint Review — Sala virtual "Telescope Daily".',            time: '5h',          read: true },
]

/* ───────── Notification Item ───────── */

interface NotificationItemProps {
    notification: Notification
    isDark: boolean
    onRead: (id: string) => void
    onDelete: (id: string) => void
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, isDark, onRead, onDelete }) => {
    const cfg = TYPE_CONFIG[notification.type]
    const Icon = cfg.icon

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={cn(
                'group relative flex items-start gap-3 p-3.5 mx-2 rounded-xl',
                'transition-all duration-200 cursor-pointer',
                !notification.read && (isDark ? 'bg-slate-800/50' : 'bg-blue-50/50'),
                isDark ? 'hover:bg-slate-800/70' : 'hover:bg-slate-50'
            )}
        >
            {/* Unread dot */}
            {!notification.read && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 left-1 w-1.5 h-1.5 rounded-full bg-blue-500"
                />
            )}

            {/* Icon / Avatar */}
            {notification.avatar ? (
                <div
                    className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 text-white text-xs font-bold"
                    style={{ backgroundColor: notification.avatar.color }}
                >
                    {notification.avatar.initial}
                </div>
            ) : (
                <div className={cn(
                    'flex items-center justify-center w-9 h-9 rounded-xl shrink-0',
                    isDark ? cfg.bgDark : cfg.bgLight
                )}>
                    <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className={cn(
                        'text-sm font-semibold truncate',
                        isDark ? 'text-slate-100' : 'text-slate-800'
                    )}>
                        {notification.title}
                    </p>
                    <span className={cn('text-[11px] shrink-0', isDark ? 'text-slate-600' : 'text-slate-400')}>
                        {notification.time}
                    </span>
                </div>
                <p className={cn(
                    'text-xs mt-0.5 line-clamp-2',
                    isDark ? 'text-slate-400' : 'text-slate-500'
                )}>
                    {notification.message}
                </p>
            </div>

            {/* Actions — visible on hover */}
            <div className={cn(
                'flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100',
                'transition-opacity duration-150'
            )}>
                {!notification.read && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onRead(notification.id) }}
                        className={cn(
                            'p-1.5 rounded-lg transition-colors',
                            isDark ? 'hover:bg-slate-700 text-slate-500' : 'hover:bg-slate-200 text-slate-400'
                        )}
                        title="Marcar como lida"
                    >
                        <Check className="w-3.5 h-3.5" />
                    </button>
                )}
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(notification.id) }}
                    className={cn(
                        'p-1.5 rounded-lg transition-colors',
                        isDark ? 'hover:bg-red-500/10 text-slate-500 hover:text-red-400' : 'hover:bg-red-50 text-slate-400 hover:text-red-500'
                    )}
                    title="Remover"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        </motion.div>
    )
}

/* ───────── Main Showcase ───────── */

interface Props {
    isDark: boolean
}

export const NotificationCenterShowcase: React.FC<Props> = ({ isDark }) => {
    const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS)
    const [filter, setFilter] = useState<'all' | 'unread'>('all')

    const unreadCount = notifications.filter(n => !n.read).length

    const displayed = filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    }

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }

    const resetDemo = () => {
        setNotifications(INITIAL_NOTIFICATIONS)
        setFilter('all')
    }

    return (
        <div className="flex justify-center">
            <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={cn(
                    'w-full max-w-md rounded-2xl overflow-hidden',
                    'border backdrop-blur-2xl',
                    'shadow-2xl',
                    isDark
                        ? 'bg-slate-900/95 border-slate-700/60 shadow-black/40'
                        : 'bg-white/95 border-slate-200 shadow-slate-400/20'
                )}
            >
                {/* Header */}
                <div className={cn(
                    'flex items-center justify-between px-5 py-4',
                    'border-b',
                    isDark ? 'border-slate-800' : 'border-slate-100'
                )}>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Bell className={cn('w-5 h-5', isDark ? 'text-slate-300' : 'text-slate-600')} />
                            {unreadCount > 0 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold"
                                >
                                    {unreadCount}
                                </motion.div>
                            )}
                        </div>
                        <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-slate-900')}>
                            Notificações
                        </h3>
                    </div>

                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className={cn(
                                    'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium',
                                    'transition-colors duration-150',
                                    isDark
                                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                                )}
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Ler todas
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter tabs */}
                <div className={cn(
                    'flex items-center gap-1 px-4 py-2',
                    'border-b',
                    isDark ? 'border-slate-800/60' : 'border-slate-100/60'
                )}>
                    {(['all', 'unread'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={cn(
                                'relative px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150',
                                filter === tab
                                    ? isDark ? 'text-white' : 'text-slate-900'
                                    : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
                            )}
                        >
                            {filter === tab && (
                                <motion.div
                                    layoutId="notif-tab"
                                    className={cn(
                                        'absolute inset-0 rounded-lg',
                                        isDark ? 'bg-slate-800' : 'bg-slate-100'
                                    )}
                                    transition={{ duration: 0.2 }}
                                />
                            )}
                            <span className="relative z-10">
                                {tab === 'all' ? 'Todas' : `Não lidas (${unreadCount})`}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Notification list */}
                <div className={cn(
                    'max-h-[400px] overflow-y-auto py-1.5',
                    'scrollbar-thin',
                    isDark ? 'scrollbar-thumb-slate-700' : 'scrollbar-thumb-slate-300'
                )}>
                    <AnimatePresence mode="popLayout">
                        {displayed.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-12 text-center"
                            >
                                <Bell className={cn('w-10 h-10 mx-auto mb-3', isDark ? 'text-slate-700' : 'text-slate-300')} />
                                <p className={cn('text-sm font-medium', isDark ? 'text-slate-500' : 'text-slate-400')}>
                                    {filter === 'unread' ? 'Nenhuma notificação não lida' : 'Sem notificações'}
                                </p>
                            </motion.div>
                        ) : (
                            displayed.map(notification => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    isDark={isDark}
                                    onRead={markAsRead}
                                    onDelete={deleteNotification}
                                />
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className={cn(
                    'flex items-center justify-between px-5 py-3',
                    'border-t',
                    isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/60'
                )}>
                    <span className={cn('text-[11px]', isDark ? 'text-slate-600' : 'text-slate-400')}>
                        {notifications.length} notificações · {unreadCount} não lidas
                    </span>
                    <button
                        onClick={resetDemo}
                        className={cn(
                            'text-[11px] font-medium transition-colors',
                            isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'
                        )}
                    >
                        Resetar demo
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
