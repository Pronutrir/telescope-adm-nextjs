'use client'

import React from 'react'
import { motion } from 'framer-motion'
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

const SubHeading: React.FC<{ isDark: boolean; children: React.ReactNode }> = ({ isDark, children }) => (
    <div className="flex items-center gap-3 mb-4">
        <div className={cn('h-px flex-1', isDark ? 'bg-slate-700/40' : 'bg-slate-300/50')} />
        <h3 className={cn('text-[11px] font-semibold uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-slate-500')}>
            {children}
        </h3>
        <div className={cn('h-px flex-1', isDark ? 'bg-slate-700/40' : 'bg-slate-300/50')} />
    </div>
)

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } }

const noop = () => {}

export const TelescopePDFSection: React.FC<Props> = ({ isDark, pdfExamples }) => (
    <div className="space-y-10">
        <motion.div variants={stagger} initial="hidden" animate="show">
            <SubHeading isDark={isDark}>Modo Grid</SubHeading>
            <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {pdfExamples.slice(0, 3).map((pdf, i) => (
                    <motion.div key={pdf.id} variants={fadeUp}>
                        <TelescopePDFCard
                            pdf={pdf} viewMode="grid" priority={GRID_PRIORITIES[i]}
                            showStats formatDate={formatDate} onView={noop} onEdit={noop} onDelete={noop}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" animate="show">
            <SubHeading isDark={isDark}>Modo Lista</SubHeading>
            <motion.div variants={stagger} className="flex flex-col gap-3">
                {pdfExamples.slice(3, 6).map((pdf, i) => (
                    <motion.div key={pdf.id} variants={fadeUp}>
                        <TelescopePDFCard
                            pdf={pdf} viewMode="list" priority={LIST_PRIORITIES[i]}
                            showStats formatDate={formatDate} actionButtonStyle="full"
                            onView={noop} onEdit={noop} onDelete={noop} onDownload={noop}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" animate="show">
            <SubHeading isDark={isDark}>Modo Seleção</SubHeading>
            <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <motion.div variants={fadeUp}>
                    <TelescopePDFCard
                        key={`sel-${pdfExamples[0]?.id}`} pdf={pdfExamples[0]} viewMode="grid"
                        isSelectionMode isSelected priority="high" formatDate={formatDate} onSelect={noop}
                    />
                </motion.div>
                <motion.div variants={fadeUp}>
                    <TelescopePDFCard
                        key={`sel-${pdfExamples[1]?.id}`} pdf={pdfExamples[1]} viewMode="grid"
                        isSelectionMode isSelected={false} priority="medium" formatDate={formatDate} onSelect={noop}
                    />
                </motion.div>
            </motion.div>
        </motion.div>
    </div>
)
