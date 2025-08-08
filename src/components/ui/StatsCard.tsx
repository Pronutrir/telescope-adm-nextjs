'use client'

import React from 'react'
import { twMerge } from 'tailwind-merge'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
    title: string
    value: string | number
    description?: string
    icon?: LucideIcon
    iconColor?: 'primary' | 'success' | 'warning' | 'error' | 'info'
    trend?: {
        value: string
        isPositive: boolean
    }
    className?: string
    variant?: 'default' | 'gradient' | 'telescope'
}

const iconColorClasses = {
    primary: 'text-neon-green bg-neon-green/10 dark:bg-neon-green/20',
    success: 'text-neon-green bg-neon-green/10 dark:bg-neon-green/20',
    warning: 'text-neon-yellow bg-neon-yellow/10 dark:bg-neon-yellow/20',
    error: 'text-neon-pink bg-neon-pink/10 dark:bg-neon-pink/20',
    info: 'text-neon-blue bg-neon-blue/10 dark:bg-neon-blue/20',
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    description,
    icon: Icon,
    iconColor = 'primary',
    trend,
    className,
    variant = 'default'
}) => {
    const baseClasses = "rounded-xl border border-border/20 backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1"

    const variantClasses = {
        default: "bg-card/98 text-card-foreground shadow-lg shadow-black/8 hover:shadow-xl hover:shadow-primary/15 border-border/40",
        gradient: "bg-gradient-to-br from-card/98 to-card-elevated/98 glass-theme border-border/30 shadow-lg shadow-primary/8 hover:shadow-xl hover:shadow-primary/20 neon-glow",
        telescope: "bg-card/98 text-card-foreground shadow-xl shadow-primary/15 hover:shadow-2xl hover:shadow-primary/25 border-primary/30 ring-1 ring-primary/15"
    }

    return (
        <div className={twMerge(baseClasses, variantClasses[ variant ], className)}>
            <div className="p-5">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground mb-3">
                            {title}
                        </p>
                        <div className="flex items-end space-x-3 mb-2">
                            <p className="text-4xl font-bold text-white leading-none">
                                {value}
                            </p>
                            {trend && (
                                <div className="flex items-center space-x-2 mb-1">
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${trend.isPositive ? 'bg-neon-green shadow-neon-green' : 'bg-neon-pink shadow-neon-pink'}`} />
                                    <span
                                        className={twMerge(
                                            "text-sm font-semibold",
                                            trend.isPositive
                                                ? "text-neon-green"
                                                : "text-neon-pink"
                                        )}
                                    >
                                        {trend.value}
                                    </span>
                                </div>
                            )}
                        </div>
                        {description && (
                            <p className="text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>

                    {Icon && (
                        <div className="flex-shrink-0 ml-3">
                            <div className={twMerge(
                                "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110",
                                iconColorClasses[ iconColor ]
                            )}>
                                <Icon className="w-5 h-5" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export { StatsCard }