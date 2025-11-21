'use client'

import React from 'react'
import { PDFItem, UnifiedPDFItem } from '@/types/pdf'
import { useTheme } from '@/contexts/ThemeContext'
import { FileText, Eye, Trash2, Calendar, HardDrive, Edit3, Send, Download } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface TelescopePDFCardProps {
    pdf: PDFItem | UnifiedPDFItem
    isSelected?: boolean
    isSelectionMode?: boolean
    viewMode?: 'grid' | 'list'
    onView?: (pdf: PDFItem | UnifiedPDFItem) => void
    onEdit?: (pdf: PDFItem | UnifiedPDFItem) => void
    onDelete?: (pdf: PDFItem | UnifiedPDFItem) => void
    onSelect?: (pdf: PDFItem | UnifiedPDFItem) => void
    onSendToTasy?: (pdf: PDFItem | UnifiedPDFItem) => void
    onDownload?: (pdf: PDFItem | UnifiedPDFItem) => void
    className?: string
    showStats?: boolean
    priority?: 'low' | 'medium' | 'high' | 'critical'
    formatDate?: (dateString: string) => string
    actionButtonStyle?: 'icons' | 'full'
}

/**
 * Componente PDFCard refatorado com características do StatsCard Telescope Premium
 * Mantém todas as funcionalidades do PDFCard original com design premium
 * 
 * AJUSTES PARA ORIENTAÇÕES GLOBAIS:
 * - Ícones usam classes CSS globais (icon-sm, icon-md, icon-lg, pdf-file-icon)
 * - Textos usam classes do design system (text-title-*, text-body-*, text-emphasis, text-muted)
 * - Títulos descritivos para acessibilidade
 * - Labels aria para botões de ação
 */
export const TelescopePDFCard: React.FC<TelescopePDFCardProps> = ({
    pdf,
    isSelected = false,
    isSelectionMode = false,
    viewMode = 'grid',
    onView,
    onEdit,
    onDelete,
    onSelect,
    onSendToTasy,
    onDownload,
    className,
    priority = 'medium',
    formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR'),
    actionButtonStyle = 'icons'
}) => {
    const { isDark } = useTheme()

    // Função para obter cores baseadas na prioridade
    const getPriorityColors = (priority: string) => {
        const colors = {
            low: {
                text: isDark ? 'rgb(34, 197, 94)' : 'rgb(22, 163, 74)',
                bg: isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
                shadow: isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)',
                border: isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)'
            },
            medium: {
                text: isDark ? 'rgb(59, 130, 246)' : 'rgb(37, 99, 235)',
                bg: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                shadow: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
                border: isDark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.25)'
            },
            high: {
                text: isDark ? 'rgb(251, 146, 60)' : 'rgb(245, 101, 101)',
                bg: isDark ? 'rgba(251, 146, 60, 0.2)' : 'rgba(251, 146, 60, 0.1)',
                shadow: isDark ? 'rgba(251, 146, 60, 0.3)' : 'rgba(251, 146, 60, 0.2)',
                border: isDark ? 'rgba(251, 146, 60, 0.4)' : 'rgba(251, 146, 60, 0.25)'
            },
            critical: {
                text: isDark ? 'rgb(248, 113, 113)' : 'rgb(239, 68, 68)',
                bg: isDark ? 'rgba(248, 113, 113, 0.2)' : 'rgba(248, 113, 113, 0.1)',
                shadow: isDark ? 'rgba(248, 113, 113, 0.3)' : 'rgba(248, 113, 113, 0.2)',
                border: isDark ? 'rgba(248, 113, 113, 0.4)' : 'rgba(248, 113, 113, 0.25)'
            }
        }
        return colors[ priority as keyof typeof colors ] || colors.medium
    }

    // Estilo base Telescope Premium
    const getTelescopeStyles = () => {
        const priorityColors = getPriorityColors(priority)

        return {
            borderRadius: '12px',
            border: '1px solid',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'translateY(0)',
            position: 'relative' as const,
            overflow: 'hidden' as const,
            contain: 'layout style' as const,
            margin: viewMode === 'grid' ? '2px' : '1px 0',
            background: isDark
                ? 'rgba(31, 41, 55, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
            borderColor: isSelected ? priorityColors.text : priorityColors.border,
            boxShadow: isSelected
                ? (isDark
                    ? `0 8px 12px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03), 0 0 0 2px ${priorityColors.text}`
                    : `0 8px 12px -3px ${priorityColors.shadow}, 0 4px 6px -2px ${priorityColors.shadow}, 0 0 0 2px ${priorityColors.text}`)
                : (isDark
                    ? '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.02), 0 0 0 1px rgba(59, 130, 246, 0.15)'
                    : `0 4px 6px -1px ${priorityColors.shadow}, 0 2px 4px -1px ${priorityColors.shadow}, 0 0 0 1px ${priorityColors.border}`)
        }
    }

    // Cores do texto baseadas no tema
    const textColors = {
        primary: isDark ? 'rgb(243, 244, 246)' : 'rgb(30, 41, 59)',
        secondary: isDark ? 'rgb(156, 163, 175)' : 'rgb(71, 85, 105)',
        muted: isDark ? 'rgb(156, 163, 175)' : 'rgb(100, 116, 139)'
    }

    const priorityColors = getPriorityColors(priority)
    const telescopeStyles = getTelescopeStyles()

    // Função para renderizar botões de ação seguindo orientações globais
    const renderActionButtons = (isGridView: boolean = false) => {
        if (actionButtonStyle === 'full') {
            // Botões completos com texto (estilo sophisticado e proporcional)
            const buttonStyle = {
                flex: '1',
                padding: isGridView ? '8px 12px' : '6px 10px',
                borderRadius: '8px',
                fontSize: isGridView ? '0.75rem' : '0.7rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                minHeight: isGridView ? '36px' : '32px',
                backdropFilter: 'blur(8px)',
                position: 'relative' as const,
                overflow: 'hidden' as const
            }

            return (
                <div className={`flex gap-2 ${isGridView ? 'mt-4' : 'mt-3'}`}>
                    <button
                        onClick={handleViewClick}
                        style={{
                            ...buttonStyle,
                            background: isDark
                                ? 'linear-gradient(135deg, rgba(148, 163, 184, 0.8), rgba(100, 116, 139, 0.9))'
                                : 'linear-gradient(135deg, rgba(248, 250, 252, 0.95), rgba(226, 232, 240, 0.9))',
                            color: isDark ? 'rgba(248, 250, 252, 0.9)' : 'rgba(51, 65, 85, 0.9)',
                            border: isDark
                                ? '1px solid rgba(148, 163, 184, 0.3)'
                                : '1px solid rgba(226, 232, 240, 0.6)',
                            boxShadow: isDark
                                ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                                : '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)'
                            e.currentTarget.style.background = isDark
                                ? 'linear-gradient(135deg, rgba(148, 163, 184, 0.9), rgba(100, 116, 139, 1))'
                                : 'linear-gradient(135deg, rgba(241, 245, 249, 0.95), rgba(203, 213, 225, 0.9))'
                            e.currentTarget.style.boxShadow = isDark
                                ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                                : '0 4px 12px rgba(0, 0, 0, 0.15)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.background = isDark
                                ? 'linear-gradient(135deg, rgba(148, 163, 184, 0.8), rgba(100, 116, 139, 0.9))'
                                : 'linear-gradient(135deg, rgba(248, 250, 252, 0.95), rgba(226, 232, 240, 0.9))'
                            e.currentTarget.style.boxShadow = isDark
                                ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                                : '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                        title="Visualizar PDF completo"
                        aria-label="Visualizar PDF completo"
                    >
                        <Eye className="w-4 h-4 navbar-bell-icon" />
                        <span>{isGridView ? 'Ver' : 'Ver'}</span>
                    </button>

                    <button
                        onClick={handleEditClick}
                        style={{
                            ...buttonStyle,
                            background: isDark
                                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.9))'
                                : 'linear-gradient(135deg, rgba(239, 246, 255, 0.95), rgba(219, 234, 254, 0.9))',
                            color: isDark ? 'rgba(147, 197, 253, 0.95)' : 'rgba(37, 99, 235, 0.9)',
                            border: isDark
                                ? '1px solid rgba(59, 130, 246, 0.3)'
                                : '1px solid rgba(219, 234, 254, 0.6)',
                            boxShadow: isDark
                                ? '0 2px 8px rgba(59, 130, 246, 0.15)'
                                : '0 2px 8px rgba(59, 130, 246, 0.1)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)'
                            e.currentTarget.style.background = isDark
                                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 1))'
                                : 'linear-gradient(135deg, rgba(233, 243, 255, 0.95), rgba(191, 219, 254, 0.9))'
                            e.currentTarget.style.boxShadow = isDark
                                ? '0 4px 12px rgba(59, 130, 246, 0.25)'
                                : '0 4px 12px rgba(59, 130, 246, 0.15)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.background = isDark
                                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.9))'
                                : 'linear-gradient(135deg, rgba(239, 246, 255, 0.95), rgba(219, 234, 254, 0.9))'
                            e.currentTarget.style.boxShadow = isDark
                                ? '0 2px 8px rgba(59, 130, 246, 0.15)'
                                : '0 2px 8px rgba(59, 130, 246, 0.1)'
                        }}
                        title="Editar informações do PDF"
                        aria-label="Editar informações do PDF"
                    >
                        <Edit3 className="w-4 h-4 navbar-settings-icon" />
                        <span>{isGridView ? 'Editar' : 'Editar'}</span>
                    </button>

                    {('sentToTasy' in pdf && pdf.sentToTasy) ? (
                        onDownload && (
                            <button
                                onClick={handleDownloadClick}
                                style={{
                                    ...buttonStyle,
                                    background: isDark
                                        ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(22, 163, 74, 0.9))'
                                        : 'linear-gradient(135deg, rgba(240, 253, 244, 0.95), rgba(220, 252, 231, 0.9))',
                                    color: isDark ? 'rgba(134, 239, 172, 0.95)' : 'rgba(22, 163, 74, 0.9)',
                                    border: isDark
                                        ? '1px solid rgba(34, 197, 94, 0.3)'
                                        : '1px solid rgba(220, 252, 231, 0.6)',
                                    boxShadow: isDark
                                        ? '0 2px 8px rgba(34, 197, 94, 0.15)'
                                        : '0 2px 8px rgba(34, 197, 94, 0.1)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-1px)'
                                    e.currentTarget.style.background = isDark
                                        ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(22, 163, 74, 1))'
                                        : 'linear-gradient(135deg, rgba(220, 252, 231, 0.95), rgba(187, 247, 208, 0.9))'
                                    e.currentTarget.style.boxShadow = isDark
                                        ? '0 4px 12px rgba(34, 197, 94, 0.25)'
                                        : '0 4px 12px rgba(34, 197, 94, 0.15)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.background = isDark
                                        ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(22, 163, 74, 0.9))'
                                        : 'linear-gradient(135deg, rgba(240, 253, 244, 0.95), rgba(220, 252, 231, 0.9))'
                                    e.currentTarget.style.boxShadow = isDark
                                        ? '0 2px 8px rgba(34, 197, 94, 0.15)'
                                        : '0 2px 8px rgba(34, 197, 94, 0.1)'
                                }}
                                title="Ver informações do PDF"
                                aria-label="Ver informações do PDF"
                            >
                                <Download className="w-4 h-4" />
                                <span>Info</span>
                            </button>
                        )
                    ) : (
                        onSendToTasy && (
                            <button
                                onClick={handleSendToTasyClick}
                                style={{
                                    ...buttonStyle,
                                    background: isDark
                                        ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.8), rgba(147, 51, 234, 0.9))'
                                        : 'linear-gradient(135deg, rgba(250, 245, 255, 0.95), rgba(233, 213, 255, 0.9))',
                                    color: isDark ? 'rgba(196, 181, 253, 0.95)' : 'rgba(147, 51, 234, 0.9)',
                                    border: isDark
                                        ? '1px solid rgba(168, 85, 247, 0.3)'
                                        : '1px solid rgba(233, 213, 255, 0.6)',
                                    boxShadow: isDark
                                        ? '0 2px 8px rgba(168, 85, 247, 0.15)'
                                        : '0 2px 8px rgba(168, 85, 247, 0.1)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-1px)'
                                    e.currentTarget.style.background = isDark
                                        ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.9), rgba(147, 51, 234, 1))'
                                        : 'linear-gradient(135deg, rgba(245, 243, 255, 0.95), rgba(221, 214, 254, 0.9))'
                                    e.currentTarget.style.boxShadow = isDark
                                        ? '0 4px 12px rgba(168, 85, 247, 0.25)'
                                        : '0 4px 12px rgba(168, 85, 247, 0.15)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.background = isDark
                                        ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.8), rgba(147, 51, 234, 0.9))'
                                        : 'linear-gradient(135deg, rgba(250, 245, 255, 0.95), rgba(233, 213, 255, 0.9))'
                                    e.currentTarget.style.boxShadow = isDark
                                        ? '0 2px 8px rgba(168, 85, 247, 0.15)'
                                        : '0 2px 8px rgba(168, 85, 247, 0.1)'
                                }}
                                title="Enviar PDF para sistema TASY"
                                aria-label="Enviar PDF para sistema TASY"
                            >
                                <Send className="w-4 h-4 navbar-message-icon" />
                                <span>{isGridView ? 'TASY' : 'TASY'}</span>
                            </button>
                        )
                    )}
                </div>
            )
        }

        // Botões apenas com ícones (estilo premium)
        const padding = isGridView ? '10px' : '8px'
        const gap = isGridView ? '2' : '1'
        //

        return (
            <div className={`flex items-center ${isGridView ? 'justify-center' : ''} gap-${gap} opacity-0 group-hover:opacity-100 transition-opacity ${isGridView ? '' : 'flex-shrink-0'}`}>
                <button
                    onClick={handleViewClick}
                    style={{
                        padding: padding,
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: textColors.secondary,
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = priorityColors.bg
                        e.currentTarget.style.color = priorityColors.text
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = textColors.secondary
                    }}
                    title="Visualizar PDF completo"
                    aria-label="Visualizar PDF completo"
                >
                    <Eye className="w-5 h-5 navbar-bell-icon" />
                </button>

                <button
                    onClick={handleEditClick}
                    style={{
                        padding: padding,
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: textColors.secondary,
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)'
                        e.currentTarget.style.color = isDark ? 'rgb(34, 197, 94)' : 'rgb(22, 163, 74)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = textColors.secondary
                    }}
                    title="Editar informações do PDF"
                    aria-label="Editar informações do PDF"
                >
                    <Edit3 className="w-5 h-5 navbar-settings-icon" />
                </button>

                {('sentToTasy' in pdf && pdf.sentToTasy) ? (
                    onDownload && (
                        <button
                            onClick={handleDownloadClick}
                            style={{
                                padding: padding,
                                borderRadius: '8px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: textColors.secondary,
                                transition: 'all 0.2s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)'
                                e.currentTarget.style.color = isDark ? 'rgb(34, 197, 94)' : 'rgb(22, 163, 74)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent'
                                e.currentTarget.style.color = textColors.secondary
                            }}
                            title="Ver informações do PDF"
                            aria-label="Ver informações do PDF"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                    )
                ) : (
                    onSendToTasy && (
                        <button
                            onClick={handleSendToTasyClick}
                            style={{
                                padding: padding,
                                borderRadius: '8px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: textColors.secondary,
                                transition: 'all 0.2s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = isDark ? 'rgba(168, 85, 247, 0.2)' : 'rgba(168, 85, 247, 0.1)'
                                e.currentTarget.style.color = isDark ? 'rgb(168, 85, 247)' : 'rgb(147, 51, 234)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent'
                                e.currentTarget.style.color = textColors.secondary
                            }}
                            title="Enviar PDF para sistema TASY"
                            aria-label="Enviar PDF para sistema TASY"
                        >
                            <Send className="w-5 h-5 navbar-message-icon" />
                        </button>
                    )
                )}

                {onDelete && (
                    <button
                        onClick={handleDeleteClick}
                        style={{
                            padding: padding,
                            borderRadius: '8px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: textColors.secondary,
                            transition: 'all 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? 'rgba(248, 113, 113, 0.2)' : 'rgba(248, 113, 113, 0.1)'
                            e.currentTarget.style.color = isDark ? 'rgb(248, 113, 113)' : 'rgb(239, 68, 68)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                            e.currentTarget.style.color = textColors.secondary
                        }}
                        title="Excluir PDF permanentemente"
                        aria-label="Excluir PDF permanentemente"
                    >
                        <Trash2 className="w-5 h-5 navbar-settings-icon" />
                    </button>
                )}
            </div>
        )
    }

    // Handlers
    const handleCardClick = () => {
        if (isSelectionMode && onSelect) {
            onSelect(pdf)
        } else if (onView) {
            onView(pdf)
        }
    }

    const handleViewClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (onView) onView(pdf)
    }

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (onEdit) onEdit(pdf)
    }

    // Download é tratado externamente onde aplicável

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (onDelete) onDelete(pdf)
    }

    const handleSendToTasyClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (onSendToTasy) onSendToTasy(pdf)
    }

    const handleDownloadClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (onDownload) onDownload(pdf)
    }

    const handleSelectClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation()
        if (onSelect) onSelect(pdf)
    }



    if (viewMode === 'list') {
        return (
            <div
                className={twMerge("group cursor-pointer", className)}
                style={telescopeStyles}
                onClick={handleCardClick}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-0.5px)'
                    e.currentTarget.style.boxShadow = isDark
                        ? '0 6px 8px -2px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(59, 130, 246, 0.25)'
                        : `0 6px 8px -2px ${priorityColors.shadow}, 0 2px 4px -1px ${priorityColors.shadow}, 0 0 0 1px ${priorityColors.border}`
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = telescopeStyles.boxShadow as string
                }}
            >
                <div className="p-card">
                    <div className="flex items-center gap-6">
                        {/* Checkbox de seleção */}
                        {isSelectionMode && (
                            <div className="flex-shrink-0">
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={handleSelectClick}
                                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    aria-label={`Selecionar PDF: ${pdf.title}`}
                                />
                            </div>
                        )}

                        {/* Ícone do PDF com estilo Telescope */}
                        <div className="icon-container-md" style={{
                            backgroundColor: priorityColors.bg,
                            boxShadow: `0 2px 4px ${priorityColors.shadow}`,
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.02) rotate(1deg)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
                            }}
                        >
                            <FileText
                                className="pdf-file-icon"
                                style={{
                                    color: priorityColors.text,
                                    width: '28px',
                                    height: '28px'
                                }}
                            />
                        </div>

                        {/* Informações principais do arquivo */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm text-emphasis font-semibold mb-1 leading-tight break-words" style={{
                                        wordWrap: 'break-word',
                                        overflowWrap: 'break-word',
                                        hyphens: 'auto'
                                    }}>
                                        {pdf.title}
                                    </h3>
                                    <p className="text-body-sm text-muted mb-3 line-clamp-2 leading-relaxed">
                                        {pdf.description || pdf.fileName}
                                    </p>

                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <HardDrive className="w-4 h-4 navbar-settings-icon" />
                                            <span className="text-body-xs text-muted font-medium">
                                                {pdf.size}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 navbar-bell-icon" />
                                            <span className="text-body-xs text-muted font-medium">
                                                {formatDate(pdf.uploadDate)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ações */}
                        {!isSelectionMode && renderActionButtons(false)}
                    </div>
                </div>
            </div>
        )
    }

    // Visualização em Grid (Telescope Premium Style)
    return (
        <div
            className={twMerge("group cursor-pointer", className)}
            style={{
                ...telescopeStyles,
                minHeight: '320px',
                display: 'flex',
                flexDirection: 'column'
            }}
            onClick={handleCardClick}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = isDark
                    ? '0 8px 10px -3px rgba(0, 0, 0, 0.1), 0 3px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(59, 130, 246, 0.25)'
                    : `0 8px 10px -3px ${priorityColors.shadow}, 0 3px 6px -2px ${priorityColors.shadow}, 0 0 0 1px ${priorityColors.border}`
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = telescopeStyles.boxShadow as string
            }}
        >
            <div className="p-card flex-1 flex flex-col">
                {/* Checkbox de seleção */}
                {isSelectionMode && (
                    <div className="absolute top-3 left-3 z-10">
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={handleSelectClick}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            aria-label={`Selecionar PDF: ${pdf.title}`}
                        />
                    </div>
                )}

                <div className="relative mb-6 flex-shrink-0">
                    {/* Ícone do PDF posicionado absolutamente */}
                    <div className="absolute top-0 right-0 icon-container-md" style={{
                        backgroundColor: priorityColors.bg,
                        boxShadow: `0 2px 4px ${priorityColors.shadow}`,
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.02) rotate(1deg)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
                        }}
                    >
                        <FileText
                            className="pdf-file-icon"
                            style={{
                                color: priorityColors.text,
                                width: '28px',
                                height: '28px'
                            }}
                        />
                    </div>

                    {/* Título e Descrição com padding adequado para não sobrepor o ícone */}
                    <div className={twMerge(
                        "pr-20", // 80px de padding direito para não sobrepor o ícone de 64px
                        isSelectionMode && "pl-8"
                    )}>
                        <h3 className="text-sm text-emphasis font-semibold mb-2 leading-tight break-words" style={{
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            hyphens: 'auto'
                        }}>
                            {pdf.title}
                        </h3>
                        <p className="text-body-sm text-muted line-clamp-2 leading-snug break-words" style={{
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            hyphens: 'auto'
                        }}>
                            {pdf.description || pdf.fileName}
                        </p>
                    </div>
                </div>

                {/* Informações do arquivo */}
                <div className="flex items-center justify-center gap-6 mb-6 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 navbar-settings-icon" />
                        <span className="text-body-xs text-muted font-medium">
                            {pdf.size}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 navbar-bell-icon" />
                        <span className="text-body-xs text-muted font-medium">
                            {formatDate(pdf.uploadDate)}
                        </span>
                    </div>
                </div>

                {/* Ações */}
                <div className="mt-auto">
                    {!isSelectionMode && renderActionButtons(true)}
                </div>
            </div>
        </div>
    )
}

export default TelescopePDFCard
