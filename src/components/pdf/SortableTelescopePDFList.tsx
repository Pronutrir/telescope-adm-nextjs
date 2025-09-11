'use client'

import React, { useEffect, useRef, useState } from 'react'
import Sortable from 'sortablejs'
import { twMerge } from 'tailwind-merge'
import { PDFItem } from '@/types/pdf'
import { TelescopePDFCard } from '@/components/pdf/TelescopePDFCard'
import { Check } from 'lucide-react'

interface SortableTelescopePDFListProps {
    items: PDFItem[]
    onSortEnd?: (items: PDFItem[]) => void
    onViewPDF?: (pdf: PDFItem) => void
    onEditPDF?: (pdf: PDFItem) => void
    onSendToTasy?: (pdf: PDFItem) => void
    onSelectPDF?: (pdfId: string) => void
    className?: string
    isDark?: boolean
    gridCols?: 1 | 2 | 3 | 4 | 5 | 6
    animation?: number
    disabled?: boolean
    isSelectionMode?: boolean
    selectedItems?: Set<string>
    selectionOrder?: string[]
    formatDate?: (dateString: string) => string
    viewMode?: 'grid' | 'list'
}

const SortableTelescopePDFList: React.FC<SortableTelescopePDFListProps> = ({
    items,
    onSortEnd,
    onViewPDF,
    onEditPDF,
    onSendToTasy,
    onSelectPDF,
    className = '',
    isDark = false,
    gridCols = 3,
    animation = 150,
    disabled = false,
    isSelectionMode = false,
    selectedItems = new Set(),
    selectionOrder = [],
    formatDate = (date) => new Date(date).toLocaleDateString('pt-BR'),
    viewMode = 'grid'
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const sortableInstance = useRef<Sortable | null>(null)
    const [ currentItems, setCurrentItems ] = useState(items)
    const isComponentMounted = useRef(true)

    // Atualizar items quando props mudarem
    useEffect(() => {
        setCurrentItems(items)
    }, [ items ])

    // Inicializar SortableJS
    useEffect(() => {
        // Sempre limpar instância anterior primeiro
        if (sortableInstance.current) {
            try {
                sortableInstance.current.destroy()
            } catch (error) {
                console.warn('Erro ao destruir instância SortableJS:', error)
            }
            sortableInstance.current = null
        }

        // Não criar nova instância se desabilitado ou em modo seleção
        if (!containerRef.current || disabled || isSelectionMode) return

        try {
            sortableInstance.current = Sortable.create(containerRef.current, {
                animation,
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                dragClass: 'sortable-drag',
                forceFallback: true, // Força uso do fallback para evitar bugs do drag nativo
                fallbackOnBody: true,
                swapThreshold: 0.65,
                onEnd: (evt) => {
                    try {
                        // Verificar se o componente ainda está montado
                        if (!isComponentMounted.current) {
                            return
                        }

                        const { oldIndex, newIndex } = evt

                        if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== newIndex) {
                            const newItems = [ ...currentItems ]
                            const [ movedItem ] = newItems.splice(oldIndex, 1)
                            newItems.splice(newIndex, 0, movedItem)

                            // Verificar novamente antes de atualizar o estado
                            if (isComponentMounted.current) {
                                setCurrentItems(newItems)
                                onSortEnd?.(newItems)
                            }
                        }
                    } catch (error) {
                        console.error('Erro durante o reordenamento:', error)
                    }
                }
            })
        } catch (error) {
            console.error('Erro ao criar instância SortableJS:', error)
        }

        return () => {
            if (sortableInstance.current) {
                try {
                    sortableInstance.current.destroy()
                } catch (error) {
                    console.warn('Erro ao limpar instância SortableJS:', error)
                }
                sortableInstance.current = null
            }
        }
    }, [ animation, disabled, isSelectionMode ])

    // Atualizar configurações do Sortable quando props mudarem
    useEffect(() => {
        if (sortableInstance.current) {
            try {
                sortableInstance.current.option('animation', animation)
                sortableInstance.current.option('disabled', disabled || isSelectionMode)
            } catch (error) {
                console.warn('Erro ao atualizar opções do SortableJS:', error)
            }
        }
    }, [ animation, disabled, isSelectionMode ])

    // Cleanup adicional no desmonte do componente
    useEffect(() => {
        isComponentMounted.current = true

        return () => {
            isComponentMounted.current = false

            if (sortableInstance.current) {
                try {
                    // Verificar se o elemento ainda existe antes de destruir
                    if (containerRef.current) {
                        sortableInstance.current.destroy()
                    }
                } catch (error) {
                    console.warn('Erro final na limpeza do SortableJS:', error)
                }
                sortableInstance.current = null
            }
        }
    }, [])

    const getGridClasses = () => {
        if (viewMode === 'list') {
            return 'grid-cols-1 gap-3'
        }

        switch (gridCols) {
            case 1: return 'grid-cols-1 gap-3'
            case 2: return 'grid-cols-1 sm:grid-cols-2 gap-3'
            case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'
            case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'
            case 5: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3'
            case 6: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3'
            default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'
        }
    }

    // Função para determinar prioridade baseada em características do PDF
    const getPDFPriority = (pdf: PDFItem): 'low' | 'medium' | 'high' | 'critical' => {
        const sizeNum = parseFloat(pdf.size.replace(/[^0-9.]/g, ''))
        const uploadDays = Math.floor((new Date().getTime() - new Date(pdf.uploadDate).getTime()) / (1000 * 60 * 60 * 24))

        // Lógica para determinar prioridade baseada no tamanho e data
        if (sizeNum > 10 || uploadDays < 1) return 'critical' // Arquivos grandes ou muito recentes
        if (sizeNum > 5 || uploadDays < 7) return 'high' // Arquivos médios ou recentes
        if (uploadDays < 30) return 'medium' // Arquivos do último mês
        return 'low' // Arquivos antigos
    }

    const handleCardClick = (pdf: PDFItem) => {
        if (isSelectionMode && onSelectPDF) {
            onSelectPDF(pdf.id)
        }
    }

    const handleViewPDF = (pdf: PDFItem) => {
        onViewPDF?.(pdf)
    }

    const handleEditPDF = (pdf: PDFItem) => {
        onEditPDF?.(pdf)
    }

    const handleDownloadPDF = (pdf: PDFItem) => {
        // Função de download (pode ser implementada conforme necessidade)
        console.log('Download PDF:', pdf.title)
    }

    const handleDeletePDF = (pdf: PDFItem) => {
        // Função de exclusão (implementar conforme necessidade)
        console.log('Delete PDF:', pdf.title)
    }

    const handleSendToTasyPDF = (pdf: PDFItem) => {
        onSendToTasy?.(pdf)
    }

    const getSelectionNumber = (pdfId: string) => {
        const index = selectionOrder.indexOf(pdfId)
        return index !== -1 ? index + 1 : null
    }

    const renderTelescopePDFCard = (pdf: PDFItem) => {
        const isSelected = selectedItems.has(pdf.id)
        const priority = getPDFPriority(pdf)

        return (
            <div
                key={pdf.id}
                className="pdf-telescope-item"
                data-id={pdf.id}
            >
                {/* Wrapper para seleção se necessário */}
                <div className="relative">
                    <TelescopePDFCard
                        pdf={pdf}
                        isSelected={isSelected}
                        isSelectionMode={isSelectionMode}
                        viewMode={viewMode}
                        priority={priority}
                        showStats={viewMode === 'grid'}
                        onView={handleViewPDF}
                        onEdit={handleEditPDF}
                        onDownload={handleDownloadPDF}
                        onDelete={handleDeletePDF}
                        onSelect={() => handleCardClick(pdf)}
                        onSendToTasy={onSendToTasy ? handleSendToTasyPDF : undefined}
                        formatDate={formatDate}
                        actionButtonStyle="full" // Usar botões completos como no original
                        className={twMerge(
                            'w-full transition-all duration-300',
                            disabled || isSelectionMode ? 'cursor-pointer' : 'cursor-grab'
                        )}
                    />

                    {/* Indicador de ordem de seleção (se em modo seleção) */}
                    {isSelectionMode && isSelected && (
                        <div className="absolute -top-2 -right-2 z-20">
                            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white">
                                {getSelectionNumber(pdf.id) || <Check className="w-4 h-4" />}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Estilos CSS para SortableJS */}
            <style jsx global>{`
                .sortable-ghost {
                    opacity: 0.3;
                    transform: scale(0.95);
                    filter: blur(1px);
                }
                
                .sortable-chosen {
                    cursor: grabbing !important;
                    z-index: 999;
                }
                
                .sortable-drag {
                    opacity: 0.9;
                    transform: rotate(5deg) scale(1.05);
                    z-index: 9999;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
                
                .pdf-telescope-list-container .pdf-telescope-item {
                    cursor: ${disabled || isSelectionMode ? 'pointer' : 'grab'};
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .pdf-telescope-list-container .pdf-telescope-item:hover {
                    transform: ${disabled || isSelectionMode ? 'none' : 'none'};
                }
                
                .pdf-telescope-list-container .pdf-telescope-item:active {
                    cursor: ${disabled || isSelectionMode ? 'pointer' : 'grabbing'};
                }

                .pdf-telescope-list-container .pdf-telescope-item.sortable-chosen {
                    transform: scale(1.05) rotate(2deg);
                }
            `}</style>

            <div
                ref={containerRef}
                className={twMerge(
                    'pdf-telescope-list-container grid overflow-hidden',
                    getGridClasses(),
                    className
                )}
                style={{
                    padding: isSelectionMode ? '20px 20px 0 6px' : '0 6px',
                    contain: 'layout style'
                }}
            >
                {currentItems.map(renderTelescopePDFCard)}
            </div>

            {/* Indicador de status para drag & drop */}
            {!disabled && !isSelectionMode && currentItems.length > 1 && (
                <div className={twMerge(
                    'mt-8 text-center text-sm',
                    isDark ? 'text-gray-200' : 'text-gray-800'
                )}>
                    <div className={twMerge(
                        'inline-flex items-center gap-3 px-6 py-3 rounded-xl shadow-sm border backdrop-blur-sm',
                        isDark
                            ? 'bg-gray-800/80 border-gray-700/50 text-gray-200'
                            : 'bg-white/80 border-gray-200 text-gray-700'
                    )}>
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                            />
                        </svg>
                        <span className="font-medium">
                            Arraste e solte para reorganizar os PDFs
                        </span>
                    </div>
                </div>
            )}

            {/* Indicador de modo de seleção */}
            {isSelectionMode && (
                <div className={twMerge(
                    'mt-8 text-center text-sm',
                    isDark ? 'text-blue-200' : 'text-blue-800'
                )}>
                    <div className={twMerge(
                        'inline-flex items-center gap-3 px-6 py-3 rounded-xl shadow-sm border backdrop-blur-sm',
                        isDark
                            ? 'bg-blue-900/30 border-blue-700/50 text-blue-200'
                            : 'bg-blue-50/80 border-blue-200 text-blue-700'
                    )}>
                        <Check className="w-5 h-5" />
                        <span className="font-medium">
                            Clique nos PDFs para selecioná-los na ordem desejada
                        </span>
                        {selectedItems.size > 0 && (
                            <span className={twMerge(
                                'px-2 py-1 rounded-full text-xs font-bold',
                                isDark
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-blue-600 text-white'
                            )}>
                                {selectedItems.size}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export { SortableTelescopePDFList }
export type { SortableTelescopePDFListProps }
