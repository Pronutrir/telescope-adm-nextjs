'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'

interface ProgressStatProps {
    title: string
    value: string
    total: string
    progress: number
    icon: LucideIcon
    color?: 'success' | 'warning' | 'error' | 'info' | 'primary'
    variant?: 'default' | 'modern' | 'telescope'
    size?: 'sm' | 'md' | 'lg'
    className?: string
    isDark?: boolean
    style?: React.CSSProperties
}

const ProgressStat: React.FC<ProgressStatProps> = ({
    title,
    value,
    total,
    progress,
    icon: Icon,
    color = 'primary',
    variant = 'default',
    size = 'md',
    className = '',
    isDark = false,
    style
}) => {
    // Função para obter cores baseadas no tema (apenas para progresso e backgrounds)
    const getColors = () => {
        const colors = {
            success: {
                iconBg: isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
                progress: isDark ? 'rgb(34, 197, 94)' : 'rgb(22, 163, 74)',
                progressBg: isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)'
            },
            warning: {
                iconBg: isDark ? 'rgba(251, 146, 60, 0.2)' : 'rgba(251, 146, 60, 0.1)',
                progress: isDark ? 'rgb(251, 146, 60)' : 'rgb(234, 88, 12)',
                progressBg: isDark ? 'rgba(251, 146, 60, 0.1)' : 'rgba(251, 146, 60, 0.05)'
            },
            error: {
                iconBg: isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                progress: isDark ? 'rgb(239, 68, 68)' : 'rgb(220, 38, 38)',
                progressBg: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)'
            },
            info: {
                iconBg: isDark ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.1)',
                progress: isDark ? 'rgb(14, 165, 233)' : 'rgb(2, 132, 199)',
                progressBg: isDark ? 'rgba(14, 165, 233, 0.1)' : 'rgba(14, 165, 233, 0.05)'
            },
            primary: {
                iconBg: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                progress: isDark ? 'rgb(59, 130, 246)' : 'rgb(37, 99, 235)',
                progressBg: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'
            }
        }

        return colors[ color ]
    }

    // Função para obter estilos baseados na variante
    const getVariantStyles = () => {
        getColors()

        if (variant === 'telescope') {
            return {
                container: {
                    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    border: isDark ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '1rem',
                    padding: size === 'sm' ? '1rem' : size === 'lg' ? '1.5rem' : '1.25rem',
                    boxShadow: isDark
                        ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)'
                        : '0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease-in-out'
                },
                title: {
                    fontSize: size === 'sm' ? '1rem' : size === 'lg' ? '1.25rem' : '1.125rem',
                    fontWeight: '600',
                    color: isDark ? 'rgb(248, 250, 252)' : 'rgb(15, 23, 42)',
                    marginBottom: '0.25rem'
                },
                subtitle: {
                    fontSize: size === 'sm' ? '0.875rem' : '1rem',
                    color: isDark ? 'rgb(148, 163, 184)' : 'rgb(71, 85, 105)',
                    marginBottom: '0.75rem'
                }
            }
        } else if (variant === 'modern') {
            return {
                container: {
                    backgroundColor: isDark ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                    border: isDark ? '1px solid rgba(75, 85, 99, 0.3)' : '1px solid rgba(229, 231, 235, 0.8)',
                    borderRadius: '0.75rem',
                    padding: size === 'sm' ? '1rem' : size === 'lg' ? '1.5rem' : '1.25rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.3s ease-in-out'
                },
                title: {
                    fontSize: size === 'sm' ? '1rem' : size === 'lg' ? '1.25rem' : '1.125rem',
                    fontWeight: '600',
                    color: isDark ? 'rgb(243, 244, 246)' : 'rgb(17, 24, 39)',
                    marginBottom: '0.25rem'
                },
                subtitle: {
                    fontSize: size === 'sm' ? '0.875rem' : '1rem',
                    color: isDark ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)',
                    marginBottom: '0.75rem'
                }
            }
        } else {
            return {
                container: {
                    backgroundColor: isDark ? 'rgba(31, 41, 55, 0.9)' : 'rgba(248, 250, 252, 0.9)',
                    border: isDark ? '1px solid rgba(75, 85, 99, 0.5)' : '1px solid rgba(203, 213, 225, 0.8)',
                    borderRadius: '0.5rem',
                    padding: size === 'sm' ? '1rem' : size === 'lg' ? '1.5rem' : '1.25rem',
                    boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.3s ease-in-out'
                },
                title: {
                    fontSize: size === 'sm' ? '1rem' : size === 'lg' ? '1.25rem' : '1.125rem',
                    fontWeight: '600',
                    color: isDark ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)',
                    marginBottom: '0.25rem'
                },
                subtitle: {
                    fontSize: size === 'sm' ? '0.875rem' : '1rem',
                    color: isDark ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)',
                    marginBottom: '0.75rem'
                }
            }
        }
    }

    const variantStyles = getVariantStyles()
    const currentColors = getColors()
    const iconSize = size === 'sm' ? 20 : size === 'lg' ? 28 : 24

    const progressBarStyles: React.CSSProperties = {
        width: '100%',
        height: '0.5rem',
        backgroundColor: currentColors.progressBg,
        borderRadius: '0.25rem',
        overflow: 'hidden',
        position: 'relative'
    }

    const progressFillStyles: React.CSSProperties = {
        width: `${Math.min(Math.max(progress, 0), 100)}%`,
        height: '100%',
        backgroundColor: currentColors.progress,
        borderRadius: '0.25rem',
        transition: 'width 0.5s ease-in-out'
    }

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        const element = e.currentTarget
        element.style.transform = 'translateY(-2px)'
        if (variant === 'telescope') {
            element.style.boxShadow = isDark
                ? '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
                : '0 20px 25px -5px rgba(59, 130, 246, 0.2), 0 10px 10px -5px rgba(59, 130, 246, 0.1)'
        }
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        const element = e.currentTarget
        element.style.transform = 'translateY(0)'
        element.style.boxShadow = variantStyles.container.boxShadow || ''
    }

    return (
        <div
            className={className}
            style={{
                ...variantStyles.container,
                ...style
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                {/* Ícone */}
                <div
                    style={{
                        width: size === 'sm' ? '2.5rem' : size === 'lg' ? '3.5rem' : '3rem',
                        height: size === 'sm' ? '2.5rem' : size === 'lg' ? '3.5rem' : '3rem',
                        backgroundColor: currentColors.iconBg,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}
                >
                    <Icon
                        size={iconSize}
                        className={`progressstat-icon progressstat-${color}-icon`}
                    />
                </div>

                {/* Conteúdo */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Título */}
                    <div style={variantStyles.title}>
                        {title}
                    </div>

                    {/* Subtítulo */}
                    <div style={variantStyles.subtitle}>
                        {value} of {total}
                    </div>

                    {/* Barra de Progresso */}
                    <div
                        style={progressBarStyles}
                        role="progressbar"
                        aria-label={`${title} Progress`}
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    >
                        <div style={progressFillStyles} />
                    </div>

                    {/* Porcentagem */}
                    <div
                        style={{
                            fontSize: '0.75rem',
                            color: currentColors.progress,
                            fontWeight: '500',
                            marginTop: '0.5rem',
                            textAlign: 'right'
                        }}
                    >
                        {progress}%
                    </div>
                </div>
            </div>
        </div>
    )
}

export { ProgressStat }
export type { ProgressStatProps }
