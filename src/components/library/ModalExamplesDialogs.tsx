'use client'

import React from 'react'
import { Trash2, Edit, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Modal } from '@/components/ui/Modal'

interface ModalState {
    isOpen: boolean
    openModal: () => void
    closeModal: () => void
}

interface FormData {
    name: string
    email: string
    message: string
    category: string
}

interface Props {
    isDark: boolean
    confirmModal: ModalState
    formModal: ModalState
    detailModal: ModalState
    customModal: ModalState
    alertModal: ModalState
    successModal: ModalState
    infoModal: ModalState
    fullscreenModal: ModalState
    formData: FormData
    setFormData: React.Dispatch<React.SetStateAction<FormData>>
    onConfirmDelete: () => void
    onFormSubmit: (e: React.FormEvent) => void
}

export const ModalExamplesDialogs: React.FC<Props> = ({
    isDark, confirmModal, formModal, detailModal, customModal,
    alertModal, successModal, infoModal, fullscreenModal,
    formData, setFormData, onConfirmDelete, onFormSubmit,
}) => {
    const cancelCls = cn('px-4 py-2 transition-colors rounded-lg', isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100')
    const inputCls = cn('w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors', isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900')
    const labelCls = cn('block text-sm font-medium mb-2', isDark ? 'text-slate-200' : 'text-slate-700')
    const subText = isDark ? 'text-slate-300' : 'text-slate-500'

    return (
        <>
            <Modal isOpen={confirmModal.isOpen} onClose={confirmModal.closeModal} title="Confirmar Exclusão" size="sm" animation="slide-down"
                footer={<div className="flex gap-3"><button onClick={confirmModal.closeModal} className={cancelCls}>Cancelar</button><button onClick={onConfirmDelete} className="btn-modal btn-modal-destructive">Excluir</button></div>}>
                <div className="flex items-start gap-3">
                    <Trash2 className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div><p className="font-medium mb-1">Tem certeza que deseja excluir este item?</p><p className={cn('text-sm', subText)}>Esta ação não pode ser desfeita.</p></div>
                </div>
            </Modal>

            <Modal isOpen={formModal.isOpen} onClose={formModal.closeModal} title="Novo Contato" size="md" animation="slide-up" closeOnOverlayClick={false}
                footer={<div className="flex gap-3"><button type="button" onClick={formModal.closeModal} className={cancelCls}>Cancelar</button><button type="submit" form="contact-form" className="btn-modal btn-modal-primary">Salvar</button></div>}>
                <form id="contact-form" onSubmit={onFormSubmit} className="space-y-4">
                    <div><label htmlFor="name" className={labelCls}>Nome *</label><input id="name" type="text" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className={inputCls} placeholder="Seu nome completo" /></div>
                    <div><label htmlFor="email" className={labelCls}>Email *</label><input id="email" type="email" required value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className={inputCls} placeholder="seu@email.com" /></div>
                    <div><label htmlFor="category" className={labelCls}>Categoria</label>
                        <select id="category" value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} className={inputCls}>
                            <option value="general">Geral</option><option value="support">Suporte</option><option value="sales">Vendas</option><option value="feedback">Feedback</option>
                        </select></div>
                    <div><label htmlFor="message" className={labelCls}>Mensagem</label><textarea id="message" rows={3} value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} className={inputCls} placeholder="Digite sua mensagem..." /></div>
                </form>
            </Modal>

            <Modal isOpen={detailModal.isOpen} onClose={detailModal.closeModal} title="Perfil do Usuário" size="lg" animation="fade">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="icon-container-md icon-container-gradient"><span className="text-white font-bold text-xl">JS</span></div>
                        <div><h3 className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>João Silva</h3><p className={subText}>Desenvolvedor Frontend</p></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className={cn('block text-sm font-medium mb-1', isDark ? 'text-slate-400' : 'text-slate-500')}>Email</label><p className={isDark ? 'text-slate-200' : 'text-slate-700'}>joao.silva@exemplo.com</p></div>
                        <div><label className={cn('block text-sm font-medium mb-1', isDark ? 'text-slate-400' : 'text-slate-500')}>Telefone</label><p className={isDark ? 'text-slate-200' : 'text-slate-700'}>(11) 99999-9999</p></div>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={customModal.isOpen} onClose={customModal.closeModal} size="xl" animation="zoom" showCloseButton={false} closeOnEsc={false} closeOnOverlayClick={false} className="border-4 border-purple-500">
                <div className="text-center p-6">
                    <div className="icon-container-lg icon-container-purple mx-auto mb-4"><Edit className="w-10 h-10 text-purple-600" /></div>
                    <h2 className="text-2xl font-bold text-purple-600 mb-4">Modal Totalmente Customizado</h2>
                    <p className={cn('mb-6 max-w-md mx-auto', subText)}>Sem botão de fechar, não fecha com ESC nem fora dele.</p>
                    <button onClick={customModal.closeModal} className="btn-modal btn-modal-secondary">Fechar Modal</button>
                </div>
            </Modal>

            <Modal isOpen={alertModal.isOpen} onClose={alertModal.closeModal} title="Atenção" size="sm" animation="slide-down"
                footer={<button onClick={alertModal.closeModal} className="btn-modal btn-modal-warning">Entendi</button>}>
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div><p className="font-medium mb-1">Limite de tentativas atingido</p><p className={cn('text-sm', subText)}>Tente novamente em 15 minutos.</p></div>
                </div>
            </Modal>

            <Modal isOpen={successModal.isOpen} onClose={successModal.closeModal} title="Sucesso!" size="sm" animation="slide-down"
                footer={<button onClick={successModal.closeModal} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">Continuar</button>}>
                <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div><p className="font-medium mb-1">Operação realizada com sucesso</p><p className={cn('text-sm', subText)}>Sua solicitação foi processada.</p></div>
                </div>
            </Modal>

            <Modal isOpen={infoModal.isOpen} onClose={infoModal.closeModal} title="Informação" size="md" animation="fade"
                footer={<button onClick={infoModal.closeModal} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Ok, obrigado</button>}>
                <div className="flex items-start gap-3">
                    <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div><p className="font-medium mb-1">Nova funcionalidade disponível</p><p className={cn('text-sm', subText)}>Exporte relatórios em PDF, Excel e CSV.</p></div>
                </div>
            </Modal>

            <Modal isOpen={fullscreenModal.isOpen} onClose={fullscreenModal.closeModal} title="Visualização Completa" size="xl" animation="slide-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={cn('p-4 rounded-xl border', isDark ? 'bg-slate-800/60 border-slate-700/50' : 'bg-slate-100/80 border-slate-200')}>
                        <h3 className={cn('text-lg font-semibold mb-3', isDark ? 'text-white' : 'text-slate-900')}>Estatísticas</h3>
                        <div className="grid grid-cols-2 gap-3 text-center">
                            <div><div className="text-2xl font-bold text-blue-600">1.234</div><div className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>Usuários</div></div>
                            <div><div className="text-2xl font-bold text-green-600">98.5%</div><div className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>Uptime</div></div>
                        </div>
                    </div>
                    <div className={cn('p-4 rounded-xl border', isDark ? 'bg-slate-800/60 border-slate-700/50' : 'bg-slate-100/80 border-slate-200')}>
                        <h3 className={cn('text-lg font-semibold mb-3', isDark ? 'text-white' : 'text-slate-900')}>Performance</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between"><span className={isDark ? 'text-slate-300' : 'text-slate-500'}>CPU</span><span>45%</span></div>
                            <div className="flex justify-between"><span className={isDark ? 'text-slate-300' : 'text-slate-500'}>Memory</span><span>68%</span></div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}
