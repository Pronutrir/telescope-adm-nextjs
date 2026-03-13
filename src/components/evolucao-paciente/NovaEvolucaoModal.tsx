'use client'

import React from 'react'
import { Modal } from '@/components/ui/Modal'
import { useTheme } from '@/contexts/ThemeContext'
import { AutocompletePessoa } from '@/components/pdf/AutocompletePessoa'
import { RichTextEditor } from '@/components/ui/RichTextEditor'
import { cn } from '@/lib/utils'
import { Save, AlertCircle, Loader2 } from 'lucide-react'
import { useNovaEvolucaoModal } from './useNovaEvolucaoModal'

interface NovaEvolucaoModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    pacienteId: string | number
    pacienteNome: string
}

const inputBase = 'w-full p-2.5 rounded-xl border outline-none transition-all duration-200'
const inputDark = 'bg-slate-900/80 border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
const inputLight = 'bg-white border-slate-200 text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
const inputDisabledDark = 'disabled:bg-slate-800/60 disabled:text-slate-500'
const inputDisabledLight = 'disabled:bg-slate-100 disabled:text-slate-400'

export const NovaEvolucaoModal: React.FC<NovaEvolucaoModalProps> = ({
    isOpen, onClose, onSuccess, pacienteId, pacienteNome,
}) => {
    const { isDark } = useTheme()
    const h = useNovaEvolucaoModal(isOpen, pacienteId, onSuccess, onClose)
    const ic = cn(inputBase, isDark ? inputDark : inputLight, isDark ? inputDisabledDark : inputDisabledLight)
    const labelCls = cn('text-sm font-medium', isDark ? 'text-slate-300' : 'text-slate-600')

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nova Evolução" size="xl">
            <form onSubmit={h.handleSubmit} className="space-y-6">
                {h.error && (
                    <div className={cn(
                        'flex items-center gap-2.5 p-3.5 rounded-xl border text-sm',
                        isDark ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-red-50 border-red-200 text-red-700',
                    )}>
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{h.error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                        <span className={labelCls}>Paciente</span>
                        <div className={cn(
                            'h-[42px] px-3 flex items-center rounded-xl border text-sm',
                            isDark ? 'bg-slate-800/60 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500',
                        )}>
                            {pacienteNome}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <span className={labelCls}>Profissional <span className="text-red-400">*</span></span>
                        <AutocompletePessoa
                            value={h.medico?.nome || ''}
                            onChange={(_, pessoa) => h.setMedico(pessoa || null)}
                            placeholder="Busque pelo nome..."
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <span className={labelCls}>Data da Nota Clínica <span className="text-red-400">*</span></span>
                        <input type="datetime-local" value={h.dataEvolucao} onChange={(e) => h.setDataEvolucao(e.target.value)} className={ic} required />
                    </div>

                    <div className="space-y-1.5">
                        <span className={cn(labelCls, 'flex items-center gap-2')}>
                            Especialidade <span className="text-red-400">*</span>
                            {h.isLoading && <Loader2 className="w-3 h-3 animate-spin text-cyan-500" />}
                        </span>
                        <select value={h.especialidadeId} onChange={(e) => h.setEspecialidadeId(e.target.value || '')} className={cn(ic, 'cursor-pointer')} required disabled={h.isLoading}>
                            <option value="">{h.isLoading ? 'Carregando...' : 'Selecione...'}</option>
                            {h.especialidades.map(esp => <option key={esp.id} value={esp.id}>{esp.descricao}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <span className={cn(labelCls, 'flex items-center gap-2')}>
                            Nota Clínica <span className="text-red-400">*</span>
                            {h.isLoading && <Loader2 className="w-3 h-3 animate-spin text-cyan-500" />}
                        </span>
                        <select value={h.tipoEvolucaoId} onChange={(e) => h.setTipoEvolucaoId(e.target.value || '')} className={cn(ic, 'cursor-pointer')} required disabled={h.isLoading}>
                            <option value="">{h.isLoading ? 'Carregando...' : 'Selecione...'}</option>
                            {h.tiposEvolucao.map(t => <option key={t.id} value={t.id}>{t.descricao}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <span className={cn(labelCls, 'flex items-center gap-2')}>
                            Texto Padrão da Instituição
                            {h.isLoadingTextos && <Loader2 className="w-3 h-3 animate-spin text-cyan-500" />}
                        </span>
                        <select
                            value={h.textoPadraoSelecionado}
                            onChange={(e) => h.handleTextoPadraoChange(e.target.value === '' ? 0 : Number(e.target.value))}
                            className={cn(ic, 'cursor-pointer')}
                            disabled={h.isLoadingTextos || !h.tipoEvolucaoId || h.textosPadroes.length === 0}
                        >
                            <option value="">
                                {h.isLoadingTextos ? 'Carregando...' : !h.tipoEvolucaoId ? 'Selecione Nota...' : h.textosPadroes.length === 0 ? 'Nenhum modelo' : 'Selecione...'}
                            </option>
                            {h.textosPadroes.map(t => <option key={t.sequencia} value={t.sequencia}>{t.titulo}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1.5 md:col-span-3">
                        <span className={cn(labelCls, 'flex items-center gap-2')}>
                            Conteúdo da Evolução <span className="text-red-400">*</span>
                            {h.isLoadingTextos && <Loader2 className="w-3 h-3 animate-spin text-cyan-500" />}
                        </span>
                        <RichTextEditor value={h.descricao} onChange={h.setDescricao} placeholder="Digite o conteúdo da evolução..." disabled={h.isLoadingTextos} />
                    </div>
                </div>

                <div className={cn('flex justify-end gap-3 pt-4 border-t', isDark ? 'border-slate-700/50' : 'border-slate-200')}>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={h.isSubmitting}
                        className={cn(
                            'px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer',
                            isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                        )}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={h.isSubmitting || h.isLoading}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 flex items-center gap-2 cursor-pointer bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {h.isSubmitting ? (
                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Salvando...</>
                        ) : (
                            <><Save className="w-4 h-4" /> Registrar Evolução</>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    )
}
