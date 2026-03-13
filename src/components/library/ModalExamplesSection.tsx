'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Plus, Eye, Edit, AlertTriangle, CheckCircle, Info, Layout } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useModal } from '@/components/ui/Modal'
import { ModalExamplesDialogs } from './ModalExamplesDialogs'

interface Props {
    isDark: boolean
}

interface FormData {
    name: string
    email: string
    message: string
    category: string
}

const INITIAL_FORM: FormData = { name: '', email: '', message: '', category: 'general' }

const ACTION_BTN_BASE = 'group/btn flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer hover:-translate-y-0.5'
const ICON_WRAP = 'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/btn:scale-110'

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }
const fadeUp = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } }

export const ModalExamplesSection: React.FC<Props> = ({ isDark }) => {
    const confirmModal = useModal()
    const formModal = useModal()
    const detailModal = useModal()
    const customModal = useModal()
    const alertModal = useModal()
    const successModal = useModal()
    const infoModal = useModal()
    const fullscreenModal = useModal()

    const [formData, setFormData] = useState<FormData>(INITIAL_FORM)

    const handleConfirmDelete = () => {
        confirmModal.closeModal()
        setTimeout(() => successModal.openModal(), 300)
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        formModal.closeModal()
        setFormData(INITIAL_FORM)
        setTimeout(() => successModal.openModal(), 300)
    }

    const subHeadingCls = cn(
        'flex items-center gap-3 mb-4',
    )
    const subLine = cn('h-px flex-1', isDark ? 'bg-slate-700' : 'bg-slate-300')
    const subText = cn('text-[11px] font-semibold uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-slate-500')

    const actionBtn = (variant: 'destructive' | 'primary' | 'success' | 'secondary' | 'warning' | 'info') => {
        const map = {
            destructive: isDark
                ? 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/30'
                : 'bg-red-50 border-red-200 hover:bg-red-100 hover:border-red-300',
            primary: isDark
                ? 'bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/30'
                : 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300',
            success: isDark
                ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/30'
                : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300',
            secondary: isDark
                ? 'bg-slate-500/5 border-slate-600/30 hover:bg-slate-500/10 hover:border-slate-500/30'
                : 'bg-slate-50 border-slate-300 hover:bg-slate-100 hover:border-slate-400',
            warning: isDark
                ? 'bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10 hover:border-amber-500/30'
                : 'bg-amber-50 border-amber-200 hover:bg-amber-100 hover:border-amber-300',
            info: isDark
                ? 'bg-sky-500/5 border-sky-500/20 hover:bg-sky-500/10 hover:border-sky-500/30'
                : 'bg-sky-50 border-sky-200 hover:bg-sky-100 hover:border-sky-300',
        }
        return cn(ACTION_BTN_BASE, map[variant])
    }

    const iconWrap = (variant: 'destructive' | 'primary' | 'success' | 'secondary' | 'warning' | 'info') => {
        const map = {
            destructive: isDark ? 'bg-red-500/15 text-red-400' : 'bg-red-100 text-red-600',
            primary: isDark ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-100 text-blue-600',
            success: isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-100 text-emerald-600',
            secondary: isDark ? 'bg-slate-600/30 text-slate-300' : 'bg-slate-200 text-slate-600',
            warning: isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-100 text-amber-600',
            info: isDark ? 'bg-sky-500/15 text-sky-400' : 'bg-sky-100 text-sky-600',
        }
        return cn(ICON_WRAP, map[variant])
    }

    const labelCls = cn('font-medium text-sm', isDark ? 'text-slate-200' : 'text-slate-700')

    return (
        <div className="space-y-10">
            <section>
                <div className={subHeadingCls}>
                    <div className={cn('h-px flex-1 max-w-[40px]', isDark ? 'bg-slate-700' : 'bg-slate-300')} />
                    <h3 className={subText}>Básicos</h3>
                    <div className={subLine} />
                </div>
                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" variants={stagger} initial="hidden" animate="show">
                    <motion.button variants={fadeUp} onClick={confirmModal.openModal} className={actionBtn('destructive')}>
                        <div className={iconWrap('destructive')}><Trash2 className="w-4 h-4" /></div>
                        <span className={labelCls}>Confirmação</span>
                    </motion.button>
                    <motion.button variants={fadeUp} onClick={formModal.openModal} className={actionBtn('primary')}>
                        <div className={iconWrap('primary')}><Plus className="w-4 h-4" /></div>
                        <span className={labelCls}>Formulário</span>
                    </motion.button>
                    <motion.button variants={fadeUp} onClick={detailModal.openModal} className={actionBtn('success')}>
                        <div className={iconWrap('success')}><Eye className="w-4 h-4" /></div>
                        <span className={labelCls}>Detalhes</span>
                    </motion.button>
                    <motion.button variants={fadeUp} onClick={customModal.openModal} className={actionBtn('secondary')}>
                        <div className={iconWrap('secondary')}><Edit className="w-4 h-4" /></div>
                        <span className={labelCls}>Personalizado</span>
                    </motion.button>
                </motion.div>
            </section>

            <section>
                <div className={subHeadingCls}>
                    <div className={cn('h-px flex-1 max-w-[40px]', isDark ? 'bg-slate-700' : 'bg-slate-300')} />
                    <h3 className={subText}>Notificação</h3>
                    <div className={subLine} />
                </div>
                <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4" variants={stagger} initial="hidden" animate="show">
                    <motion.button variants={fadeUp} onClick={alertModal.openModal} className={actionBtn('warning')}>
                        <div className={iconWrap('warning')}><AlertTriangle className="w-4 h-4" /></div>
                        <span className={labelCls}>Modal de Alerta</span>
                    </motion.button>
                    <motion.button variants={fadeUp} onClick={successModal.openModal} className={actionBtn('success')}>
                        <div className={iconWrap('success')}><CheckCircle className="w-4 h-4" /></div>
                        <span className={labelCls}>Modal de Sucesso</span>
                    </motion.button>
                    <motion.button variants={fadeUp} onClick={infoModal.openModal} className={actionBtn('info')}>
                        <div className={iconWrap('info')}><Info className="w-4 h-4" /></div>
                        <span className={labelCls}>Modal Informativo</span>
                    </motion.button>
                </motion.div>
            </section>

            <section>
                <div className={subHeadingCls}>
                    <div className={cn('h-px flex-1 max-w-[40px]', isDark ? 'bg-slate-700' : 'bg-slate-300')} />
                    <h3 className={subText}>Tamanhos e Animações</h3>
                    <div className={subLine} />
                </div>
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={stagger} initial="hidden" animate="show">
                    <motion.button variants={fadeUp} onClick={fullscreenModal.openModal} className={actionBtn('info')}>
                        <div className={iconWrap('info')}><Layout className="w-4 h-4" /></div>
                        <span className={labelCls}>Modal Grande</span>
                    </motion.button>
                </motion.div>
            </section>

            <ModalExamplesDialogs
                isDark={isDark}
                confirmModal={confirmModal}
                formModal={formModal}
                detailModal={detailModal}
                customModal={customModal}
                alertModal={alertModal}
                successModal={successModal}
                infoModal={infoModal}
                fullscreenModal={fullscreenModal}
                formData={formData}
                setFormData={setFormData}
                onConfirmDelete={handleConfirmDelete}
                onFormSubmit={handleFormSubmit}
            />
        </div>
    )
}
