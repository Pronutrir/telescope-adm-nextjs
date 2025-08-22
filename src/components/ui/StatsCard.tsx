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
        type?: 'up' | 'down'
    }
    className?: string
    variant?: 'default' | 'gradient' | 'telescope'
    style?: React.CSSProperties
    isDark?: boolean
    onClick?: () => void
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    description,
    icon: Icon,
    iconColor = 'primary',
    trend,
    className,
    variant = 'default',
    style,
    isDark = false,
    onClick
}) => {
    // Função para obter cores dos ícones baseada no tema
    const getIconColors = (color: string) => {
        const colors = {
            primary: {
                text: isDark ? 'rgb(59, 130, 246)' : 'rgb(37, 99, 235)',
                bg: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                shadow: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'
            },
            success: {
                text: isDark ? 'rgb(34, 197, 94)' : 'rgb(22, 163, 74)',
                bg: isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
                shadow: isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)'
            },
            warning: {
                text: isDark ? 'rgb(251, 146, 60)' : 'rgb(245, 101, 101)',
                bg: isDark ? 'rgba(251, 146, 60, 0.2)' : 'rgba(251, 146, 60, 0.1)',
                shadow: isDark ? 'rgba(251, 146, 60, 0.3)' : 'rgba(251, 146, 60, 0.2)'
            },
            error: {
                text: isDark ? 'rgb(248, 113, 113)' : 'rgb(239, 68, 68)',
                bg: isDark ? 'rgba(248, 113, 113, 0.2)' : 'rgba(248, 113, 113, 0.1)',
                shadow: isDark ? 'rgba(248, 113, 113, 0.3)' : 'rgba(248, 113, 113, 0.2)'
            },
            info: {
                text: isDark ? 'rgb(56, 189, 248)' : 'rgb(14, 165, 233)',
                bg: isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(56, 189, 248, 0.1)',
                shadow: isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(56, 189, 248, 0.2)'
            }
        }
        return colors[ color as keyof typeof colors ] || colors.primary
    }

    // Função para obter estilos da variante baseada no tema
    const getVariantStyles = () => {
        const baseStyle = {
            borderRadius: '12px',
            border: '1px solid',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'translateY(0)',
            position: 'relative' as const,
            overflow: 'hidden' as const
        }

        switch (variant) {
            case 'gradient':
                return {
                    ...baseStyle,
                    background: isDark
                        ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.98) 0%, rgba(55, 65, 81, 0.95) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
                    borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
                    boxShadow: isDark
                        ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(59, 130, 246, 0.1)'
                        : '0 10px 15px -3px rgba(59, 130, 246, 0.08), 0 4px 6px -2px rgba(59, 130, 246, 0.04), 0 0 0 1px rgba(59, 130, 246, 0.05)'
                }
            case 'telescope':
                return {
                    ...baseStyle,
                    background: isDark
                        ? 'rgba(31, 41, 55, 0.95)'
                        : 'rgba(255, 255, 255, 0.95)',
                    borderColor: isDark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.25)',
                    boxShadow: isDark
                        ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(59, 130, 246, 0.2)'
                        : '0 20px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04), 0 0 0 1px rgba(59, 130, 246, 0.1)'
                }
            default:
                return {
                    ...baseStyle,
                    background: isDark
                        ? 'rgba(31, 41, 55, 0.95)'
                        : 'rgba(255, 255, 255, 0.95)',
                    borderColor: isDark ? 'rgba(75, 85, 99, 0.4)' : 'rgba(203, 213, 225, 0.5)',
                    boxShadow: isDark
                        ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                        : '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)'
                }
        }
    }

    // Cores do texto baseadas no tema
    const textColors = {
        primary: isDark ? 'rgb(243, 244, 246)' : 'rgb(30, 41, 59)',
        secondary: isDark ? 'rgb(156, 163, 175)' : 'rgb(71, 85, 105)',
        muted: isDark ? 'rgb(156, 163, 175)' : 'rgb(100, 116, 139)'
    }

    // Cores do trend
    const trendColors = {
        positive: {
            text: isDark ? 'rgb(34, 197, 94)' : 'rgb(22, 163, 74)',
            bg: isDark ? 'rgb(34, 197, 94)' : 'rgb(34, 197, 94)',
            shadow: 'rgba(34, 197, 94, 0.5)'
        },
        negative: {
            text: isDark ? 'rgb(248, 113, 113)' : 'rgb(239, 68, 68)',
            bg: isDark ? 'rgb(248, 113, 113)' : 'rgb(248, 113, 113)',
            shadow: 'rgba(248, 113, 113, 0.5)'
        }
    }

    const iconColors = getIconColors(iconColor)
    const variantStyles = getVariantStyles()

    return (
        <div
            className={twMerge("group cursor-pointer", className)}
            style={{
                ...variantStyles,
                ...style
            }}
            onClick={onClick}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'
                e.currentTarget.style.boxShadow = variant === 'telescope'
                    ? (isDark
                        ? '0 25px 30px -5px rgba(0, 0, 0, 0.15), 0 15px 15px -5px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(59, 130, 246, 0.3)'
                        : '0 25px 30px -5px rgba(59, 130, 246, 0.15), 0 15px 15px -5px rgba(59, 130, 246, 0.08), 0 0 0 1px rgba(59, 130, 246, 0.2)')
                    : variantStyles.boxShadow
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = variantStyles.boxShadow as string
            }}
        >
            <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: textColors.secondary,
                            marginBottom: '12px',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap'
                        }}>
                            {title}
                        </p>
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            gap: '12px',
                            marginBottom: '8px',
                            flexWrap: 'wrap'
                        }}>
                            <p style={{
                                fontSize: 'clamp(24px, 4vw, 36px)',
                                fontWeight: 700,
                                lineHeight: 1,
                                color: textColors.primary,
                                margin: 0
                            }}>
                                {value}
                            </p>
                            {trend && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    marginBottom: '4px'
                                }}>
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: trend.isPositive ? trendColors.positive.bg : trendColors.negative.bg,
                                        boxShadow: `0 2px 4px ${trend.isPositive ? trendColors.positive.shadow : trendColors.negative.shadow}`,
                                        flexShrink: 0
                                    }} />
                                    <span style={{
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: trend.isPositive ? trendColors.positive.text : trendColors.negative.text,
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {trend.value}
                                    </span>
                                </div>
                            )}
                        </div>
                        {description && (
                            <p style={{
                                fontSize: '13px',
                                color: textColors.muted,
                                lineHeight: 1.4,
                                margin: 0,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}>
                                {description}
                            </p>
                        )}
                    </div>

                    {Icon && (
                        <div style={{ flexShrink: 0, marginLeft: '16px' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: iconColors.bg,
                                boxShadow: `0 4px 6px ${iconColors.shadow}`,
                                transition: 'all 0.3s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
                                }}
                            >
                                <Icon
                                    size={24}
                                    className="stats-card-icon"
                                    style={{ color: iconColors.text }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export { StatsCard }
export default StatsCard