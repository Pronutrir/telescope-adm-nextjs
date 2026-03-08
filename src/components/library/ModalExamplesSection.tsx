'use client'

import React, { useState } from 'react'
import { Trash2, Plus, Eye, Edit, AlertTriangle, CheckCircle, Info, Layout } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Modal, useModal } from '@/components/ui/Modal'

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

    const inputCls = cn(
        'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
        isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
    )
    const labelCls = cn('block text-sm font-medium mb-2', isDark ? 'text-gray-200' : 'text-gray-700')
    const headingCls = cn('text-xl font-semibold mb-4', isDark ? 'text-white' : 'text-gray-900')

    return (
        <div className="mb-12 space-y-8">
            <h2 className={cn('text-3xl font-semibold mb-8', isDark ? 'text-white' : 'text-slate-800')}>
                Modal Component
            </h2>

            <section>
                <h3 className={headingCls}>Modais Básicos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button onClick={confirmModal.openModal} className="btn-action-card btn-action-card-destructive">
                        <Trash2 className="btn-icon" /><span className="font-medium text-sm">Confirmação</span>
                    </button>
                    <button onClick={formModal.openModal} className="btn-action-card btn-action-card-primary">
                        <Plus className="btn-icon" /><span className="font-medium text-sm">Formulário</span>
                    </button>
                    <button onClick={detailModal.openModal} className="btn-action-card btn-action-card-success">
                        <Eye className="btn-icon" /><span className="font-medium text-sm">Detalhes</span>
                    </button>
                    <button onClick={customModal.openModal} className="btn-action-card btn-action-card-secondary">
                        <Edit className="btn-icon" /><span className="font-medium text-sm">Personalizado</span>
                    </button>
                </div>
            </section>

            <section>
                <h3 className={headingCls}>Modais de Notificação</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button onClick={alertModal.openModal} className="btn-action-inline btn-action-inline-warning">
                        <AlertTriangle className="btn-icon" /><span className="text-sm">Modal de Alerta</span>
                    </button>
                    <button onClick={successModal.openModal} className="btn-action-inline btn-action-inline-success">
                        <CheckCircle className="btn-icon" /><span className="text-sm">Modal de Sucesso</span>
                    </button>
                    <button onClick={infoModal.openModal} className="btn-action-inline btn-action-inline-primary">
                        <Info className="btn-icon" /><span className="text-sm">Modal Informativo</span>
                    </button>
                </div>
            </section>

            <section>
                <h3 className={headingCls}>Tamanhos e Animações</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={fullscreenModal.openModal} className="btn-action-inline btn-action-inline-info">
                        <Layout className="w-5 h-5" /><span className="text-sm">Modal Grande</span>
                    </button>
                </div>
            </section>

            {/* Confirm */}
            <Modal isOpen={confirmModal.isOpen} onClose={confirmModal.closeModal} title="Confirmar Exclusão" size="sm" animation="slide-down"
                footer={<div className="flex gap-3">
                    <button onClick={confirmModal.closeModal} className={cn('px-4 py-2 transition-colors', isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800')}>Cancelar</button>
                    <button onClick={handleConfirmDelete} className="btn-modal btn-modal-destructive">Excluir</button>
                </div>}>
                <div className="flex items-start gap-3">
                    <Trash2 className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-medium mb-1">Tem certeza que deseja excluir este item?</p>
                        <p className={cn('text-sm', isDark ? 'text-gray-300' : 'text-gray-600')}>Esta ação não pode ser desfeita.</p>
                    </div>
                </div>
            </Modal>

            {/* Form */}
            <Modal isOpen={formModal.isOpen} onClose={formModal.closeModal} title="Novo Contato" size="md" animation="slide-up" closeOnOverlayClick={false}
                footer={<div className="flex gap-3">
                    <button type="button" onClick={formModal.closeModal} className={cn('px-4 py-2 transition-colors', isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800')}>Cancelar</button>
                    <button type="submit" form="contact-form" className="btn-modal btn-modal-primary">Salvar</button>
                </div>}>
                <form id="contact-form" onSubmit={handleFormSubmit} className="space-y-4">
                    <div><label htmlFor="name" className={labelCls}>Nome *</label>
                        <input id="name" type="text" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className={inputCls} placeholder="Seu nome completo" /></div>
                    <div><label htmlFor="email" className={labelCls}>Email *</label>
                        <input id="email" type="email" required value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className={inputCls} placeholder="seu@email.com" /></div>
                    <div><label htmlFor="category" className={labelCls}>Categoria</label>
                        <select id="category" value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} className={inputCls}>
                            <option value="general">Geral</option><option value="support">Suporte</option>
                            <option value="sales">Vendas</option><option value="feedback">Feedback</option>
                        </select></div>
                    <div><label htmlFor="message" className={labelCls}>Mensagem</label>
                        <textarea id="message" rows={3} value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} className={inputCls} placeholder="Digite sua mensagem..." /></div>
                </form>
            </Modal>

            {/* Detail */}
            <Modal isOpen={detailModal.isOpen} onClose={detailModal.closeModal} title="Perfil do Usuário" size="lg" animation="fade">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="icon-container-md icon-container-gradient"><span className="text-white font-bold text-xl">JS</span></div>
                        <div>
                            <h3 className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>João Silva</h3>
                            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Desenvolvedor Frontend</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className={cn('block text-sm font-medium mb-1', isDark ? 'text-gray-400' : 'text-gray-500')}>Email</label>
                            <p className={isDark ? 'text-gray-200' : 'text-gray-700'}>joao.silva@exemplo.com</p></div>
                        <div><label className={cn('block text-sm font-medium mb-1', isDark ? 'text-gray-400' : 'text-gray-500')}>Telefone</label>
                            <p className={isDark ? 'text-gray-200' : 'text-gray-700'}>(11) 99999-9999</p></div>
                    </div>
                </div>
            </Modal>

            {/* Custom */}
            <Modal isOpen={customModal.isOpen} onClose={customModal.closeModal} size="xl" animation="zoom" showCloseButton={false} closeOnEsc={false} closeOnOverlayClick={false} className="border-4 border-purple-500">
                <div className="text-center p-6">
                    <div className="icon-container-lg icon-container-purple mx-auto mb-4"><Edit className="w-10 h-10 text-purple-600" /></div>
                    <h2 className="text-2xl font-bold text-purple-600 mb-4">Modal Totalmente Customizado</h2>
                    <p className={cn('mb-6 max-w-md mx-auto', isDark ? 'text-gray-300' : 'text-gray-600')}>Sem botão de fechar, não fecha com ESC nem fora dele.</p>
                    <button onClick={customModal.closeModal} className="btn-modal btn-modal-secondary">Fechar Modal</button>
                </div>
            </Modal>

            {/* Alert */}
            <Modal isOpen={alertModal.isOpen} onClose={alertModal.closeModal} title="Atenção" size="sm" animation="slide-down"
                footer={<button onClick={alertModal.closeModal} className="btn-modal btn-modal-warning">Entendi</button>}>
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium mb-1">Limite de tentativas atingido</p>
                        <p className={cn('text-sm', isDark ? 'text-gray-300' : 'text-gray-600')}>Tente novamente em 15 minutos.</p>
                    </div>
                </div>
            </Modal>

            {/* Success */}
            <Modal isOpen={successModal.isOpen} onClose={successModal.closeModal} title="Sucesso!" size="sm" animation="slide-down"
                footer={<button onClick={successModal.closeModal} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">Continuar</button>}>
                <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium mb-1">Operação realizada com sucesso</p>
                        <p className={cn('text-sm', isDark ? 'text-gray-300' : 'text-gray-600')}>Sua solicitação foi processada.</p>
                    </div>
                </div>
            </Modal>

            {/* Info */}
            <Modal isOpen={infoModal.isOpen} onClose={infoModal.closeModal} title="Informação" size="md" animation="fade"
                footer={<button onClick={infoModal.closeModal} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Ok, obrigado</button>}>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium mb-1">Nova funcionalidade disponível</p>
                            <p className={cn('text-sm', isDark ? 'text-gray-300' : 'text-gray-600')}>Exporte relatórios em PDF, Excel e CSV.</p>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Fullscreen */}
            <Modal isOpen={fullscreenModal.isOpen} onClose={fullscreenModal.closeModal} title="Visualização Completa" size="xl" animation="slide-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={cn('p-4 rounded-lg', isDark ? 'bg-gray-800' : 'bg-gray-50')}>
                        <h3 className={cn('text-lg font-semibold mb-3', isDark ? 'text-white' : 'text-gray-900')}>Estatísticas</h3>
                        <div className="grid grid-cols-2 gap-3 text-center">
                            <div><div className="text-2xl font-bold text-blue-600">1.234</div><div className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>Usuários</div></div>
                            <div><div className="text-2xl font-bold text-green-600">98.5%</div><div className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>Uptime</div></div>
                        </div>
                    </div>
                    <div className={cn('p-4 rounded-lg', isDark ? 'bg-gray-800' : 'bg-gray-50')}>
                        <h3 className={cn('text-lg font-semibold mb-3', isDark ? 'text-white' : 'text-gray-900')}>Performance</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between"><span className={isDark ? 'text-gray-300' : 'text-gray-600'}>CPU</span><span>45%</span></div>
                            <div className="flex justify-between"><span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Memory</span><span>68%</span></div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
