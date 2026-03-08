'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { TelescopePDFCard } from '@/components/pdf/TelescopePDFCard'
import type { PDFItem } from '@/types/pdf'

interface Props {
    isDark: boolean
    pdfExamples: PDFItem[]
}

type Priority = 'low' | 'medium' | 'high' | 'critical'

const GRID_PRIORITIES: Priority[] = ['high', 'medium', 'critical']
const LIST_PRIORITIES: Priority[] = ['medium', 'low', 'high']

const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })

export const TelescopePDFSection: React.FC<Props> = ({ isDark, pdfExamples }) => (
    <div className="mb-12">
        <h2 className={cn('text-3xl font-semibold mb-8', isDark ? 'text-white' : 'text-slate-800')}>
            Telescope PDF Card
        </h2>

        <div className="mb-8">
            <h3 className={cn('text-xl font-semibold mb-4', isDark ? 'text-white' : 'text-slate-800')}>
                Modo Grid
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pdfExamples.slice(0, 3).map((pdf, i) => (
                    <TelescopePDFCard
                        key={pdf.id}
                        pdf={pdf}
                        viewMode="grid"
                        priority={GRID_PRIORITIES[i]}
                        showStats
                        formatDate={formatDate}
                        onView={() => {}}
                        onEdit={() => {}}
                        onDelete={() => {}}
                    />
                ))}
            </div>
        </div>

        <div className="mb-8">
            <h3 className={cn('text-xl font-semibold mb-4', isDark ? 'text-white' : 'text-slate-800')}>
                Modo Lista
            </h3>
            <div className="flex flex-col gap-3">
                {pdfExamples.slice(3, 6).map((pdf, i) => (
                    <TelescopePDFCard
                        key={pdf.id}
                        pdf={pdf}
                        viewMode="list"
                        priority={LIST_PRIORITIES[i]}
                        showStats
                        formatDate={formatDate}
                        actionButtonStyle="full"
                        onView={() => {}}
                        onEdit={() => {}}
                        onDelete={() => {}}
                        onDownload={() => {}}
                    />
                ))}
            </div>
        </div>

        <div className="mb-8">
            <h3 className={cn('text-xl font-semibold mb-4', isDark ? 'text-white' : 'text-slate-800')}>
                Modo Seleção
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TelescopePDFCard
                    key={`sel-${pdfExamples[0]?.id}`}
                    pdf={pdfExamples[0]}
                    viewMode="grid"
                    isSelectionMode
                    isSelected
                    priority="high"
                    formatDate={formatDate}
                    onSelect={() => {}}
                />
                <TelescopePDFCard
                    key={`sel-${pdfExamples[1]?.id}`}
                    pdf={pdfExamples[1]}
                    viewMode="grid"
                    isSelectionMode
                    isSelected={false}
                    priority="medium"
                    formatDate={formatDate}
                    onSelect={() => {}}
                />
            </div>
        </div>
    </div>
)
