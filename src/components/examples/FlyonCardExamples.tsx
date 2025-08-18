'use client'

import React, { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import { StatsCard } from '@/components/ui/StatsCard'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { ProgressStat } from '@/components/ui/ProgressStat'
import { SortableProgressStats } from '@/components/ui/SortableProgressStats'
import { DropdownTest } from '@/components/ui/DropdownTest'
import { DropdownWithTitle } from '@/components/ui/DropdownWithTitle'
import { Modal, useModal } from '@/components/ui/Modal'
import { LucideIcon } from 'lucide-react'
import {
    Users,
    TrendingUp,
    Activity,
    Settings,
    Star,
    Shield,
    Zap,
    Layout,
    Sidebar,
    Calendar,
    Clock,
    BarChart3,
    Database,
    Globe,
    Monitor,
    Download,
    Save,
    Send,
    Plus,
    Edit,
    ChevronDown,
    Target,
    CheckCircle,
    AlertTriangle,
    User,
    Sun,
    Moon,
    Trash2,
    Eye,
    Info,
    X,
    AlertTriangle as AlertTriangleIcon
} from 'lucide-react'

// Interface para items sortable
export interface SortableItem {
    id: string
    title: string
    value: string
    total: string
    progress: number
    icon: LucideIcon
    color: 'success' | 'warning' | 'error' | 'info' | 'primary'
    variant: 'default' | 'modern' | 'telescope'
    size?: 'sm' | 'md' | 'lg'
    className?: string
    style?: React.CSSProperties
}

/**
 * Seção de exemplos do Modal Component
 */
const ModalExamplesSection: React.FC<{ isDark: boolean }> = ({ isDark }) => {
    // Estados para diferentes modals
    const confirmModal = useModal()
    const formModal = useModal()
    const detailModal = useModal()
    const customModal = useModal()
    const alertModal = useModal()
    const successModal = useModal()
    const infoModal = useModal()
    const fullscreenModal = useModal()

    // Estado do formulário de exemplo
    const [ formData, setFormData ] = useState({
        name: '',
        email: '',
        message: '',
        category: 'general'
    })

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Dados do formulário:', formData)
        formModal.closeModal()
        // Simular sucesso
        setTimeout(() => {
            successModal.openModal()
        }, 300)
        setFormData({ name: '', email: '', message: '', category: 'general' })
    }

    const handleConfirmDelete = () => {
        console.log('Item excluído!')
        confirmModal.closeModal()
        // Mostrar modal de sucesso
        setTimeout(() => {
            successModal.openModal()
        }, 300)
    }

    return (
        <div className="space-y-8">
            {/* Seção de Modais Básicos */}
            <section>
                <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Modais Básicos
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

                    {/* Modal de Confirmação */}
                    <button
                        onClick={confirmModal.openModal}
                        className="group flex flex-col items-center gap-3 p-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                        <Trash2 className="w-6 h-6" />
                        <span className="font-medium text-sm">Confirmação</span>
                    </button>

                    {/* Modal com Formulário */}
                    <button
                        onClick={formModal.openModal}
                        className="group flex flex-col items-center gap-3 p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                        <Plus className="w-6 h-6" />
                        <span className="font-medium text-sm">Formulário</span>
                    </button>

                    {/* Modal de Detalhes */}
                    <button
                        onClick={detailModal.openModal}
                        className="group flex flex-col items-center gap-3 p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                        <Eye className="w-6 h-6" />
                        <span className="font-medium text-sm">Detalhes</span>
                    </button>

                    {/* Modal Personalizado */}
                    <button
                        onClick={customModal.openModal}
                        className="group flex flex-col items-center gap-3 p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                        <Edit className="w-6 h-6" />
                        <span className="font-medium text-sm">Personalizado</span>
                    </button>
                </div>
            </section>

            {/* Seção de Modais de Notificação */}
            <section>
                <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Modais de Notificação
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                    {/* Modal de Alerta */}
                    <button
                        onClick={alertModal.openModal}
                        className="flex items-center gap-3 p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                        <AlertTriangleIcon className="w-5 h-5" />
                        <span className="text-sm">Modal de Alerta</span>
                    </button>

                    {/* Modal de Sucesso */}
                    <button
                        onClick={successModal.openModal}
                        className="flex items-center gap-3 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm">Modal de Sucesso</span>
                    </button>

                    {/* Modal de Info */}
                    <button
                        onClick={infoModal.openModal}
                        className="flex items-center gap-3 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <Info className="w-5 h-5" />
                        <span className="text-sm">Modal Informativo</span>
                    </button>
                </div>
            </section>

            {/* Seção de Tamanhos */}
            <section>
                <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Tamanhos e Animações
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <button
                        onClick={fullscreenModal.openModal}
                        className="flex items-center gap-3 p-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                        <Layout className="w-5 h-5" />
                        <span className="text-sm">Modal Grande</span>
                    </button>
                </div>
            </section>

            {/* =========================== */}
            {/* DEFINIÇÃO DOS MODALS */}
            {/* =========================== */}

            {/* Modal de Confirmação */}
            <Modal
                isOpen={confirmModal.isOpen}
                onClose={confirmModal.closeModal}
                title="Confirmar Exclusão"
                size="sm"
                animation="slide-down"
                footer={
                    <div className="flex gap-3">
                        <button
                            onClick={confirmModal.closeModal}
                            className={`px-4 py-2 transition-colors ${isDark
                                    ? 'text-gray-300 hover:text-white'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirmDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            Excluir
                        </button>
                    </div>
                }
            >
                <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Trash2 className="w-3 h-3 text-red-600" />
                    </div>
                    <div>
                        <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Esta ação não pode ser desfeita.
                        </p>
                        <p className="font-medium">
                            Tem certeza que deseja excluir este item?
                        </p>
                    </div>
                </div>
            </Modal>

            {/* Modal com Formulário */}
            <Modal
                isOpen={formModal.isOpen}
                onClose={formModal.closeModal}
                title="Novo Contato"
                size="md"
                animation="slide-up"
                closeOnOverlayClick={false}
                footer={
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={formModal.closeModal}
                            className={`px-4 py-2 transition-colors ${isDark
                                    ? 'text-gray-300 hover:text-white'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            form="contact-form"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            Salvar
                        </button>
                    </div>
                }
            >
                <form id="contact-form" onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                            Nome *
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                }`}
                            placeholder="Seu nome completo"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                            Email *
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                }`}
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                            Categoria
                        </label>
                        <select
                            id="category"
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                }`}
                        >
                            <option value="general">Geral</option>
                            <option value="support">Suporte</option>
                            <option value="sales">Vendas</option>
                            <option value="feedback">Feedback</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="message" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                            Mensagem
                        </label>
                        <textarea
                            id="message"
                            rows={3}
                            value={formData.message}
                            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                }`}
                            placeholder="Digite sua mensagem..."
                        />
                    </div>
                </form>
            </Modal>

            {/* Modal de Detalhes */}
            <Modal
                isOpen={detailModal.isOpen}
                onClose={detailModal.closeModal}
                title="Perfil do Usuário"
                size="lg"
                animation="fade"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xl">JS</span>
                        </div>
                        <div>
                            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                João Silva
                            </h3>
                            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                Desenvolvedor Frontend
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                                Email
                            </label>
                            <p className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                                joao.silva@exemplo.com
                            </p>
                        </div>
                        <div>
                            <label className={`block text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                                Telefone
                            </label>
                            <p className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                                (11) 99999-9999
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                            Sobre
                        </label>
                        <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Desenvolvedor experiente com foco em React, Next.js e TypeScript.
                            Apaixonado por criar interfaces intuitivas e experiências de usuário excepcionais.
                        </p>
                    </div>
                </div>
            </Modal>

            {/* Modal Personalizado */}
            <Modal
                isOpen={customModal.isOpen}
                onClose={customModal.closeModal}
                size="xl"
                animation="zoom"
                showCloseButton={false}
                closeOnEsc={false}
                closeOnOverlayClick={false}
                className="border-4 border-purple-500"
            >
                <div className="text-center p-6">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Edit className="w-10 h-10 text-purple-600" />
                    </div>

                    <h2 className="text-2xl font-bold text-purple-600 mb-4">
                        Modal Totalmente Customizado
                    </h2>

                    <p className={`mb-6 max-w-md mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Este modal demonstra configurações especiais: sem botão de fechar padrão,
                        não fecha com ESC nem clicando fora, e tem bordas personalizadas.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={customModal.closeModal}
                            className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                        >
                            Fechar Modal
                        </button>
                        <button
                            onClick={() => alert('Ação executada!')}
                            className="px-6 py-2 border border-purple-600 text-purple-600 rounded hover:bg-purple-50 transition-colors"
                        >
                            Executar Ação
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal de Alerta */}
            <Modal
                isOpen={alertModal.isOpen}
                onClose={alertModal.closeModal}
                title="Atenção"
                size="sm"
                animation="slide-down"
                footer={
                    <button
                        onClick={alertModal.closeModal}
                        className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                    >
                        Entendi
                    </button>
                }
            >
                <div className="flex items-start gap-3">
                    <AlertTriangleIcon className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium mb-2">
                            Limite de tentativas atingido
                        </p>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Você atingiu o limite máximo de tentativas.
                            Tente novamente em 15 minutos.
                        </p>
                    </div>
                </div>
            </Modal>

            {/* Modal de Sucesso */}
            <Modal
                isOpen={successModal.isOpen}
                onClose={successModal.closeModal}
                title="Sucesso!"
                size="sm"
                animation="slide-down"
                footer={
                    <button
                        onClick={successModal.closeModal}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                        Continuar
                    </button>
                }
            >
                <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium mb-2">
                            Operação realizada com sucesso
                        </p>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Sua solicitação foi processada com sucesso.
                        </p>
                    </div>
                </div>
            </Modal>

            {/* Modal Informativo */}
            <Modal
                isOpen={infoModal.isOpen}
                onClose={infoModal.closeModal}
                title="Informação"
                size="md"
                animation="fade"
                footer={
                    <button
                        onClick={infoModal.closeModal}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Ok, obrigado
                    </button>
                }
            >
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium mb-2">
                                Nova funcionalidade disponível
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                Agora você pode exportar seus relatórios em diferentes formatos.
                            </p>
                        </div>
                    </div>

                    <div className={`p-3 rounded ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                        <h4 className={`font-medium text-blue-800 mb-1 ${isDark ? 'text-blue-300' : ''}`}>
                            Formatos disponíveis:
                        </h4>
                        <ul className={`text-sm space-y-1 ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                            <li>• PDF para impressão</li>
                            <li>• Excel para análise</li>
                            <li>• CSV para integração</li>
                        </ul>
                    </div>
                </div>
            </Modal>

            {/* Modal Grande */}
            <Modal
                isOpen={fullscreenModal.isOpen}
                onClose={fullscreenModal.closeModal}
                title="Visualização Completa"
                size="xl"
                animation="slide-up"
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Estatísticas
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">1,234</div>
                                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Usuários
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">98.5%</div>
                                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Uptime
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Performance
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>CPU</span>
                                    <span>45%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Memory</span>
                                    <span>68%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

const ComponentsExamples: React.FC = () => {
    // Contextos
    const { theme, isDark, toggleTheme } = useTheme()
    const { isMobile, sidebarOpen, mounted } = useLayout()

    // Estado para o Select
    const [ selectedValue, setSelectedValue ] = useState('')

    // Estado para os items sortable
    const [ sortableItems, setSortableItems ] = useState<SortableItem[]>([
        {
            id: 'cpu',
            title: 'Performance CPU',
            value: '67',
            total: '100',
            progress: 67,
            icon: Monitor,
            color: 'info',
            variant: 'modern'
        },
        {
            id: 'memory',
            title: 'Uso de Memória',
            value: '8.2',
            total: '16',
            progress: 51,
            icon: Database,
            color: 'warning',
            variant: 'modern'
        },
        {
            id: 'tasks',
            title: 'Tarefas Completas',
            value: '94',
            total: '120',
            progress: 78,
            icon: CheckCircle,
            color: 'success',
            variant: 'modern'
        },
        {
            id: 'alerts',
            title: 'Alertas Ativos',
            value: '7',
            total: '15',
            progress: 47,
            icon: AlertTriangle,
            color: 'error',
            variant: 'modern'
        }
    ])

    // Estado para os items da demonstração interativa
    const [ interactiveItems, setInteractiveItems ] = useState<SortableItem[]>([
        {
            id: 'cpu-demo',
            title: 'Performance CPU',
            value: '67',
            total: '100',
            progress: 67,
            icon: Monitor,
            color: 'info',
            variant: 'modern'
        },
        {
            id: 'memory-demo',
            title: 'Uso de Memória',
            value: '8.2',
            total: '16',
            progress: 51,
            icon: Database,
            color: 'warning',
            variant: 'modern'
        },
        {
            id: 'tasks-demo',
            title: 'Tarefas Completas',
            value: '94',
            total: '120',
            progress: 78,
            icon: CheckCircle,
            color: 'success',
            variant: 'modern'
        },
        {
            id: 'alerts-demo',
            title: 'Alertas Ativos',
            value: '7',
            total: '15',
            progress: 47,
            icon: AlertTriangle,
            color: 'error',
            variant: 'modern'
        }
    ])

    // Dados de exemplo para StatsCards
    const statsExamples = [
        {
            title: 'Total de Usuários',
            value: '2,847',
            icon: Users,
            iconColor: 'primary' as const,
            trend: { value: '+12% vs mês anterior', isPositive: true },
            description: 'Usuários ativos registrados na plataforma'
        },
        {
            title: 'Sessões Ativas',
            value: '1,429',
            icon: Activity,
            iconColor: 'success' as const,
            trend: { value: '+8.5% vs período anterior', isPositive: true },
            description: 'Sessões simultâneas no momento'
        },
        {
            title: 'Taxa de Conversão',
            value: '68.2%',
            icon: TrendingUp,
            iconColor: 'warning' as const,
            trend: { value: '-2.1% vs último trimestre', isPositive: false },
            description: 'Conversão de visitantes em clientes'
        },
        {
            title: 'Tempo Médio',
            value: '4:32',
            icon: Clock,
            iconColor: 'info' as const,
            trend: { value: '+15% vs semana anterior', isPositive: true },
            description: 'Tempo médio de permanência na aplicação'
        }
    ]

    // Dados de exemplo para Select
    const selectOptions = [
        { value: '', label: 'Choose an option' },
        { value: 'name', label: 'Full Name' },
        { value: 'email', label: 'Email Address' },
        { value: 'description', label: 'Project Description' },
        { value: 'user_id', label: 'User Identification Number' }
    ]

    const categoryOptions = [
        { value: '', label: 'Select category' },
        { value: 'technology', label: 'Technology' },
        { value: 'design', label: 'Design' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'sales', label: 'Sales' },
        { value: 'support', label: 'Support', disabled: true }
    ]

    const priorityOptions = [
        { value: 'low', label: 'Low Priority' },
        { value: 'medium', label: 'Medium Priority' },
        { value: 'high', label: 'High Priority' },
        { value: 'urgent', label: 'Urgent' }
    ]

    return (
        <div className="w-full">
            {/* Header da Página */}
            <div className="text-center mb-8">
                <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Componentes da Aplicação
                </h1>
                <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}>
                    Exemplos e variações de todos os componentes disponíveis no Telescope ADM
                </p>
                <div className={`mt-6 p-4 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-accent/20 border-border/20'}`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}>
                                🎨 <strong>Design System:</strong> Todos os componentes seguem o sistema de design unificado com suporte completo a temas light/dark.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Tema: <span className="font-medium">{theme}</span>
                                {isMobile && <span className="ml-2">📱 Mobile</span>}
                                {!sidebarOpen && <span className="ml-2">📁 Sidebar fechada</span>}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={toggleTheme}
                                icon={isDark ? Sun : Moon}
                            >
                                {isDark ? 'Light' : 'Dark'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Context Information */}
            <div className="mb-12">
                <h2 className={`text-3xl font-semibold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <Settings className={`w-7 h-7 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                    Contextos da Aplicação
                </h2>
                <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}>
                    Informações dos contextos de tema e layout em uso na aplicação.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Theme Context Info */}
                    <div className={`p-6 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-50/50 border-gray-200/50'}`}>
                        <h3 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            🎨 Theme Context
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Tema atual:</span>
                                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{theme}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Modo escuro:</span>
                                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{isDark ? 'Ativo' : 'Inativo'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Mounted:</span>
                                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{mounted ? 'Sim' : 'Não'}</span>
                            </div>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={toggleTheme}
                                className="w-full mt-4"
                            >
                                Alternar Tema
                            </Button>
                        </div>
                    </div>

                    {/* Layout Context Info */}
                    <div className={`p-6 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-50/50 border-gray-200/50'}`}>
                        <h3 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            📱 Layout Context
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Mobile:</span>
                                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{isMobile ? 'Sim' : 'Não'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Sidebar aberta:</span>
                                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{sidebarOpen ? 'Sim' : 'Não'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Componente mounted:</span>
                                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{mounted ? 'Sim' : 'Não'}</span>
                            </div>
                            <div className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                                <p className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                                    ℹ️ O layout responde automaticamente ao tamanho da tela e preferências do usuário.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* StatsCard Examples */}
            <div className="mb-12">
                <h2 className={`text-3xl font-semibold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <BarChart3 className={`w-7 h-7 ${isDark ? 'text-blue-400' : 'text-primary-600'}`} />
                    StatsCard Component
                </h2>
                <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}>
                    Componente para exibir estatísticas e métricas com diferentes variantes e estilos.
                </p>

                {/* Variante Default */}
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Variante Default
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statsExamples.map((stat, index) => (
                            <StatsCard
                                key={`default-${index}`}
                                title={stat.title}
                                value={stat.value}
                                icon={stat.icon}
                                iconColor={stat.iconColor}
                                trend={stat.trend}
                                description={stat.description}
                                variant="default"
                                isDark={isDark}
                            />
                        ))}
                    </div>
                </div>

                {/* Variante Gradient */}
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Variante Gradient
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statsExamples.map((stat, index) => (
                            <StatsCard
                                key={`gradient-${index}`}
                                title={stat.title}
                                value={stat.value}
                                icon={stat.icon}
                                iconColor={stat.iconColor}
                                trend={stat.trend}
                                description={stat.description}
                                variant="gradient"
                                isDark={isDark}
                            />
                        ))}
                    </div>
                </div>

                {/* Variante Telescope */}
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Variante Telescope (Premium)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statsExamples.map((stat, index) => (
                            <StatsCard
                                key={`telescope-${index}`}
                                title={stat.title}
                                value={stat.value}
                                icon={stat.icon}
                                iconColor={stat.iconColor}
                                trend={stat.trend}
                                description={stat.description}
                                variant="telescope"
                                isDark={isDark}
                            />
                        ))}
                    </div>
                </div>

                {/* Exemplo sem ícone e trend */}
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Versões Simplificadas
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatsCard
                            title="Vendas do Mês"
                            value="R$ 45.230"
                            variant="default"
                            isDark={isDark}
                        />
                        <StatsCard
                            title="Produtos em Estoque"
                            value="1,247"
                            description="Disponíveis para venda"
                            variant="gradient"
                            isDark={isDark}
                        />
                        <StatsCard
                            title="Taxa de Satisfação"
                            value="97.8%"
                            icon={Star}
                            iconColor="warning"
                            variant="telescope"
                            isDark={isDark}
                        />
                    </div>
                </div>

                {/* Cores dos ícones */}
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Cores dos Ícones
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        <StatsCard
                            title="Primary"
                            value="100"
                            icon={Database}
                            iconColor="primary"
                            variant="telescope"
                            isDark={isDark}
                        />
                        <StatsCard
                            title="Success"
                            value="95.2%"
                            icon={Shield}
                            iconColor="success"
                            variant="telescope"
                            isDark={isDark}
                        />
                        <StatsCard
                            title="Warning"
                            value="23"
                            icon={Monitor}
                            iconColor="warning"
                            variant="telescope"
                            isDark={isDark}
                        />
                        <StatsCard
                            title="Error"
                            value="3"
                            icon={Settings}
                            iconColor="error"
                            variant="telescope"
                            isDark={isDark}
                        />
                        <StatsCard
                            title="Info"
                            value="156"
                            icon={Globe}
                            iconColor="info"
                            variant="telescope"
                            isDark={isDark}
                        />
                    </div>
                </div>
            </div>

            {/* Button Examples */}
            <div className="mb-12">
                <h2 className={`text-3xl font-semibold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <Zap className={`w-7 h-7 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                    Button Component
                </h2>
                <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}>
                    Componente de botão com diferentes variantes, tamanhos e estados.
                </p>

                {/* Variantes de Botões */}
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Variantes
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        <Button variant="default">Default</Button>
                        <Button variant="primary">Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="accent">Accent</Button>
                        <Button variant="info">Info</Button>
                        <Button variant="success">Success</Button>
                        <Button variant="warning">Warning</Button>
                        <Button variant="error">Error</Button>
                    </div>
                </div>

                {/* Tamanhos */}
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Tamanhos
                    </h3>
                    <div className="flex flex-wrap items-center gap-4">
                        <Button variant="primary" size="sm">Small</Button>
                        <Button variant="primary" size="md">Medium</Button>
                        <Button variant="primary" size="lg">Large</Button>
                        <Button variant="primary" size="xl">Extra Large</Button>
                    </div>
                </div>

                {/* Botões com Ícones */}
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Com Ícones
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        <Button variant="primary" icon={Download} iconPosition="left">
                            Download
                        </Button>
                        <Button variant="success" icon={Save} iconPosition="left">
                            Salvar
                        </Button>
                        <Button variant="info" icon={Send} iconPosition="right">
                            Enviar
                        </Button>
                        <Button variant="accent" icon={Plus} iconPosition="left">
                            Adicionar
                        </Button>
                        <Button variant="secondary" icon={Edit} iconPosition="left">
                            Editar
                        </Button>
                    </div>
                </div>

                {/* Estados */}
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Estados
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        <Button variant="primary">Normal</Button>
                        <Button variant="primary" loading>
                            Carregando
                        </Button>
                        <Button variant="primary" disabled>
                            Desabilitado
                        </Button>
                    </div>
                </div>

                {/* Variantes Especiais */}
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Variantes Especiais
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="neon">Neon</Button>
                    </div>
                </div>

                {/* Exemplo de Código */}
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Exemplo de Uso
                    </h3>
                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900/50 border-gray-700/50' : 'bg-gray-50/50 border-gray-200/50'}`}>
                        <pre className={`text-sm overflow-x-auto ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {`<Button 
  variant="primary" 
  size="md" 
  icon={Download} 
  iconPosition="left"
  onClick={() => console.log('Button clicked')}
>
  Download Arquivo
</Button>`}
                        </pre>
                    </div>
                </div>

                {/* Demonstração Interativa */}
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Demonstração Interativa
                    </h3>
                    <div className={`p-6 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-50/50 border-gray-200/50'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Button
                                variant="primary"
                                icon={Download}
                                onClick={() => alert('Download iniciado!')}
                                className="w-full"
                            >
                                Download
                            </Button>
                            <Button
                                variant="success"
                                icon={Save}
                                onClick={() => alert('Dados salvos!')}
                                className="w-full"
                            >
                                Salvar
                            </Button>
                            <Button
                                variant="warning"
                                icon={Settings}
                                onClick={() => alert('Configurações abertas!')}
                                className="w-full"
                            >
                                Configurar
                            </Button>
                            <Button
                                variant="error"
                                onClick={() => alert('Ação cancelada!')}
                                className="w-full"
                            >
                                Cancelar
                            </Button>
                        </div>
                        <div className={`mt-4 text-sm ${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}>
                            <p>💡 <strong>Dica:</strong> Clique nos botões acima para ver as interações em ação.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dropdown Test */}
            <div className="mb-12">
                <h2 className={`text-3xl font-semibold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <ChevronDown className={`w-7 h-7 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                    Dropdown Test
                </h2>
                <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}>
                    Componente dropdown com layout preservado e tema adaptado.
                </p>

                <div className="mb-8">
                    <div className="flex flex-wrap gap-4">
                        <DropdownTest />
                    </div>
                </div>
            </div>

            {/* Dropdown With Title */}
            <div className="mb-12">
                <h2 className={`text-3xl font-semibold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <ChevronDown className={`w-7 h-7 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                    Dropdown With Title
                </h2>
                <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}>
                    Variação com títulos de seção e separadores.
                </p>

                <div className="mb-8">
                    <div className="flex flex-wrap gap-4">
                        <DropdownWithTitle />
                    </div>
                </div>
            </div>

            {/* Select Examples */}
            <div className="mb-12">
                <h2 className={`text-3xl font-semibold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <ChevronDown className={`w-7 h-7 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    Select Component
                </h2>
                <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}>
                    Componente de seleção dropdown com diferentes variantes, tamanhos e funcionalidades.
                </p>

                {/* Variantes de Select */}
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Variantes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                Default
                            </label>
                            <Select
                                options={selectOptions}
                                variant="default"
                                placeholder="Select option..."
                                isDark={isDark}
                                onChange={(value) => console.log('Default:', value)}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                Modern
                            </label>
                            <Select
                                options={selectOptions}
                                variant="modern"
                                placeholder="Select option..."
                                isDark={isDark}
                                onChange={(value) => console.log('Modern:', value)}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                Telescope
                            </label>
                            <Select
                                options={selectOptions}
                                variant="telescope"
                                placeholder="Select option..."
                                isDark={isDark}
                                onChange={(value) => console.log('Telescope:', value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Tamanhos */}
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Tamanhos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                Small
                            </label>
                            <Select
                                options={priorityOptions}
                                variant="telescope"
                                size="sm"
                                placeholder="Small select..."
                                isDark={isDark}
                                onChange={(value) => console.log('Small:', value)}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                Medium
                            </label>
                            <Select
                                options={priorityOptions}
                                variant="telescope"
                                size="md"
                                placeholder="Medium select..."
                                isDark={isDark}
                                onChange={(value) => console.log('Medium:', value)}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                Large
                            </label>
                            <Select
                                options={priorityOptions}
                                variant="telescope"
                                size="lg"
                                placeholder="Large select..."
                                isDark={isDark}
                                onChange={(value) => console.log('Large:', value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Estados */}
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Estados
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                Normal
                            </label>
                            <Select
                                options={categoryOptions}
                                variant="telescope"
                                placeholder="Select category..."
                                isDark={isDark}
                                onChange={(value) => console.log('Normal:', value)}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                Disabled
                            </label>
                            <Select
                                options={categoryOptions}
                                variant="telescope"
                                placeholder="Disabled select..."
                                disabled={true}
                                isDark={isDark}
                                onChange={(value) => console.log('Disabled:', value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Exemplo com Valor Controlado */}
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Valor Controlado
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                Select com Estado
                            </label>
                            <Select
                                options={selectOptions}
                                variant="telescope"
                                value={selectedValue}
                                placeholder="Choose your option..."
                                isDark={isDark}
                                onChange={(value) => setSelectedValue(String(value))}
                            />
                        </div>
                        <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-50/50 border-gray-200/50'}`}>
                            <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                Valor Selecionado:
                            </h4>
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                                {selectedValue || 'Nenhum valor selecionado'}
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => setSelectedValue('')}
                            >
                                Limpar Seleção
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Exemplo de Código */}
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Exemplo de Uso
                    </h3>
                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900/50 border-gray-700/50' : 'bg-gray-50/50 border-gray-200/50'}`}>
                        <pre className={`text-sm overflow-x-auto ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {`const options = [
  { value: '', label: 'Choose an option' },
  { value: 'name', label: 'Full Name' },
  { value: 'email', label: 'Email Address' }
]

<Select
  options={options}
  variant="telescope"
  size="md"
  placeholder="Select option..."
  value={selectedValue}
  onChange={(value) => setSelectedValue(String(value))}
  isDark={isDark}
/>`}
                        </pre>
                    </div>
                </div>

                {/* Demonstração Interativa */}
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Demonstração Interativa
                    </h3>
                    <div className={`p-6 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-50/50 border-gray-200/50'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                    Campo de Formulário
                                </label>
                                <Select
                                    options={selectOptions}
                                    variant="telescope"
                                    placeholder="Selecione um campo..."
                                    isDark={isDark}
                                    onChange={(value) => alert(`Campo selecionado: ${value}`)}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                    Categoria
                                </label>
                                <Select
                                    options={categoryOptions}
                                    variant="telescope"
                                    placeholder="Escolha uma categoria..."
                                    isDark={isDark}
                                    onChange={(value) => alert(`Categoria: ${value}`)}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                    Prioridade
                                </label>
                                <Select
                                    options={priorityOptions}
                                    variant="telescope"
                                    placeholder="Defina a prioridade..."
                                    isDark={isDark}
                                    onChange={(value) => alert(`Prioridade: ${value}`)}
                                />
                            </div>
                        </div>
                        <div className={`mt-4 text-sm ${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}>
                            <p>💡 <strong>Dica:</strong> Selecione opções nos dropdowns acima para ver os alertas de interação.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Statistics Component */}
            <div className="mb-12">
                <h2 className={`text-3xl font-semibold mb-8 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Progress Statistics Component
                </h2>

                {/* Variants */}
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Variantes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <h4 className={`text-lg font-medium mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                Default
                            </h4>
                            <ProgressStat
                                title="Usuários Ativos"
                                value="1,234"
                                total="2,000"
                                progress={62}
                                icon={Users}
                                color="primary"
                                variant="default"
                                isDark={isDark}
                            />
                        </div>
                        <div>
                            <h4 className={`text-lg font-medium mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                Modern
                            </h4>
                            <ProgressStat
                                title="Vendas Concluídas"
                                value="847"
                                total="1,200"
                                progress={71}
                                icon={Target}
                                color="success"
                                variant="modern"
                                isDark={isDark}
                            />
                        </div>
                        <div>
                            <h4 className={`text-lg font-medium mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                Telescope
                            </h4>
                            <ProgressStat
                                title="Projetos Ativos"
                                value="23"
                                total="30"
                                progress={77}
                                icon={Activity}
                                color="info"
                                variant="telescope"
                                isDark={isDark}
                            />
                        </div>
                    </div>
                </div>

                {/* Colors */}
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Cores
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <ProgressStat
                            title="Primary"
                            value="856"
                            total="1,000"
                            progress={86}
                            icon={BarChart3}
                            color="primary"
                            variant="modern"
                            size="sm"
                            isDark={isDark}
                        />
                        <ProgressStat
                            title="Success"
                            value="432"
                            total="500"
                            progress={86}
                            icon={CheckCircle}
                            color="success"
                            variant="modern"
                            size="sm"
                            isDark={isDark}
                        />
                        <ProgressStat
                            title="Warning"
                            value="123"
                            total="200"
                            progress={62}
                            icon={Clock}
                            color="warning"
                            variant="modern"
                            size="sm"
                            isDark={isDark}
                        />
                        <ProgressStat
                            title="Error"
                            value="12"
                            total="50"
                            progress={24}
                            icon={AlertTriangle}
                            color="error"
                            variant="modern"
                            size="sm"
                            isDark={isDark}
                        />
                        <ProgressStat
                            title="Info"
                            value="678"
                            total="800"
                            progress={85}
                            icon={TrendingUp}
                            color="info"
                            variant="modern"
                            size="sm"
                            isDark={isDark}
                        />
                    </div>
                </div>

                {/* Sizes */}
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Tamanhos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h4 className={`text-lg font-medium mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                Small (sm)
                            </h4>
                            <ProgressStat
                                title="Downloads"
                                value="3,421"
                                total="5,000"
                                progress={68}
                                icon={Download}
                                color="success"
                                variant="telescope"
                                size="sm"
                                isDark={isDark}
                            />
                        </div>
                        <div>
                            <h4 className={`text-lg font-medium mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                Medium (md)
                            </h4>
                            <ProgressStat
                                title="Cadastros"
                                value="2,156"
                                total="3,000"
                                progress={72}
                                icon={User}
                                color="primary"
                                variant="telescope"
                                size="md"
                                isDark={isDark}
                            />
                        </div>
                        <div>
                            <h4 className={`text-lg font-medium mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                Large (lg)
                            </h4>
                            <ProgressStat
                                title="Receita Mensal"
                                value="R$ 47.8k"
                                total="R$ 60k"
                                progress={80}
                                icon={TrendingUp}
                                color="success"
                                variant="telescope"
                                size="lg"
                                isDark={isDark}
                            />
                        </div>
                    </div>
                </div>

                {/* Interactive Demo */}
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Demonstração Interativa com Drag & Drop
                    </h3>
                    <div className="space-y-6">
                        <div className={`p-4 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-gray-50/50'}`}>
                            <SortableProgressStats
                                items={interactiveItems}
                                onSortEnd={(newItems) => {
                                    setInteractiveItems(newItems)
                                    console.log('Nova ordem dos items:', newItems.map(item => ({ id: item.id, title: item.title })))
                                }}
                                isDark={isDark}
                                gridCols={4}
                                animation={250}
                            />
                        </div>

                        <div className={`p-6 rounded-lg border ${isDark ? 'border-blue-500/30 bg-blue-900/20' : 'border-blue-200 bg-blue-50'}`}>
                            <h4 className={`text-lg font-medium mb-2 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                                🎯 Funcionalidades Sortable
                            </h4>
                            <ul className={`space-y-2 text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                                <li>• <strong>Drag & Drop:</strong> Arraste qualquer card para reorganizar a ordem</li>
                                <li>• <strong>Animações fluidas:</strong> Transições suaves durante o movimento</li>
                                <li>• <strong>Estados visuais:</strong> Feedback visual durante o arraste (ghost, chosen, drag)</li>
                                <li>• <strong>Grid responsivo:</strong> Reorganização automática em diferentes resoluções</li>
                                <li>• <strong>Callback de eventos:</strong> Eventos disparados ao finalizar o movimento</li>
                                <li>• <strong>Console log:</strong> Verifique o console para ver a nova ordem dos itens</li>
                            </ul>
                        </div>

                        <div className={`p-6 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
                            <h4 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                💡 Características do ProgressStat
                            </h4>
                            <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                <li>• <strong>Ícones personalizáveis:</strong> Aceita qualquer ícone do Lucide React</li>
                                <li>• <strong>Cores temáticas:</strong> 5 variações de cores (primary, success, warning, error, info)</li>
                                <li>• <strong>3 variantes visuais:</strong> default, modern e telescope</li>
                                <li>• <strong>3 tamanhos:</strong> sm, md e lg para diferentes contextos</li>
                                <li>• <strong>Barra de progresso animada:</strong> Com transições suaves</li>
                                <li>• <strong>Hover effects:</strong> Elevação e destaque ao passar o mouse</li>
                                <li>• <strong>Acessibilidade:</strong> Atributos ARIA para leitores de tela</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sortable Progress Statistics */}
            <div className="mb-12">
                <h2 className={`text-3xl font-semibold mb-8 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Sortable Progress Statistics
                </h2>

                {/* Demonstração do SortableJS */}
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Drag & Drop Dashboard
                    </h3>

                    <div className={`p-6 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-gray-50/50'} mb-6`}>
                        <SortableProgressStats
                            items={sortableItems}
                            onSortEnd={(newItems) => {
                                setSortableItems(newItems)
                                console.log('Nova ordem:', newItems.map(item => item.id))
                            }}
                            isDark={isDark}
                            gridCols={4}
                            animation={200}
                        />
                    </div>

                    <div className={`p-4 rounded-lg border ${isDark ? 'border-blue-500/30 bg-blue-900/20' : 'border-blue-200 bg-blue-50'}`}>
                        <h4 className={`text-lg font-medium mb-2 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                            🎯 Funcionalidades SortableJS
                        </h4>
                        <ul className={`space-y-2 text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                            <li>• <strong>Drag & Drop:</strong> Arraste qualquer card para reorganizar</li>
                            <li>• <strong>Animações suaves:</strong> Transições fluidas durante o movimento</li>
                            <li>• <strong>Estados visuais:</strong> Feedback visual durante o arraste</li>
                            <li>• <strong>Grid responsivo:</strong> Reorganização automática em diferentes tamanhos</li>
                            <li>• <strong>Callback de mudança:</strong> Eventos disparados ao finalizar o movimento</li>
                            <li>• <strong>Configurável:</strong> Velocidade de animação e comportamentos customizáveis</li>
                        </ul>
                    </div>
                </div>

                {/* Exemplos de Layout Diferente */}
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Diferentes Layouts Sortable
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Layout Vertical (2 colunas) */}
                        <div>
                            <h4 className={`text-lg font-medium mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                Layout Vertical (2 Colunas)
                            </h4>
                            <div className={`p-4 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-gray-50/50'}`}>
                                <SortableProgressStats
                                    items={[
                                        {
                                            id: 'revenue-vertical',
                                            title: 'Receita Mensal',
                                            value: 'R$ 47.8k',
                                            total: 'R$ 60k',
                                            progress: 80,
                                            icon: TrendingUp,
                                            color: 'success',
                                            variant: 'telescope',
                                            size: 'sm'
                                        },
                                        {
                                            id: 'users-vertical',
                                            title: 'Novos Usuários',
                                            value: '234',
                                            total: '300',
                                            progress: 78,
                                            icon: Users,
                                            color: 'primary',
                                            variant: 'telescope',
                                            size: 'sm'
                                        },
                                        {
                                            id: 'downloads-vertical',
                                            title: 'Downloads',
                                            value: '1,456',
                                            total: '2,000',
                                            progress: 73,
                                            icon: Download,
                                            color: 'info',
                                            variant: 'telescope',
                                            size: 'sm'
                                        },
                                        {
                                            id: 'storage-vertical',
                                            title: 'Armazenamento',
                                            value: '34 GB',
                                            total: '50 GB',
                                            progress: 68,
                                            icon: Database,
                                            color: 'warning',
                                            variant: 'telescope',
                                            size: 'sm'
                                        }
                                    ]}
                                    isDark={isDark}
                                    gridCols={2}
                                    animation={300}
                                />
                            </div>
                        </div>

                        {/* Layout com animação mais rápida */}
                        <div>
                            <h4 className={`text-lg font-medium mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                Animação Rápida (100ms)
                            </h4>
                            <div className={`p-4 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-gray-50/50'}`}>
                                <SortableProgressStats
                                    items={[
                                        {
                                            id: 'fast-1',
                                            title: 'Velocidade',
                                            value: '95',
                                            total: '100',
                                            progress: 95,
                                            icon: Zap,
                                            color: 'success',
                                            variant: 'modern',
                                            size: 'sm'
                                        },
                                        {
                                            id: 'fast-2',
                                            title: 'Segurança',
                                            value: '88',
                                            total: '100',
                                            progress: 88,
                                            icon: Shield,
                                            color: 'primary',
                                            variant: 'modern',
                                            size: 'sm'
                                        },
                                        {
                                            id: 'fast-3',
                                            title: 'Performance',
                                            value: '92',
                                            total: '100',
                                            progress: 92,
                                            icon: Activity,
                                            color: 'info',
                                            variant: 'modern',
                                            size: 'sm'
                                        },
                                        {
                                            id: 'fast-4',
                                            title: 'Qualidade',
                                            value: '87',
                                            total: '100',
                                            progress: 87,
                                            icon: Star,
                                            color: 'warning',
                                            variant: 'modern',
                                            size: 'sm'
                                        }
                                    ]}
                                    isDark={isDark}
                                    gridCols={2}
                                    animation={100}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Exemplo Desabilitado */}
                <div className="mb-8">
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Sortable Desabilitado (Apenas Visualização)
                    </h3>

                    <div className={`p-4 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-gray-50/50'} mb-4`}>
                        <SortableProgressStats
                            items={[
                                {
                                    id: 'readonly-1',
                                    title: 'Sistema Principal',
                                    value: '98',
                                    total: '100',
                                    progress: 98,
                                    icon: Settings,
                                    color: 'success',
                                    variant: 'default'
                                },
                                {
                                    id: 'readonly-2',
                                    title: 'Base de Dados',
                                    value: '94',
                                    total: '100',
                                    progress: 94,
                                    icon: Database,
                                    color: 'primary',
                                    variant: 'default'
                                },
                                {
                                    id: 'readonly-3',
                                    title: 'Conectividade',
                                    value: '89',
                                    total: '100',
                                    progress: 89,
                                    icon: Globe,
                                    color: 'info',
                                    variant: 'default'
                                }
                            ]}
                            isDark={isDark}
                            gridCols={3}
                            animation={150}
                            disabled={true}
                        />
                    </div>

                    <div className={`p-4 rounded-lg border ${isDark ? 'border-red-500/30 bg-red-900/20' : 'border-red-200 bg-red-50'}`}>
                        <p className={`text-sm ${isDark ? 'text-red-200' : 'text-red-700'}`}>
                            ⚠️ <strong>Modo Somente Leitura:</strong> O drag & drop está desabilitado nesta seção.
                            Os cards mantêm as funcionalidades visuais mas não podem ser reorganizados.
                        </p>
                    </div>
                </div>
            </div>

            {/* Modal Component Examples */}
            <div className="mb-12">
                <h2 className={`text-3xl font-semibold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <Layout className={`w-7 h-7 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                    Modal Component
                </h2>
                <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}>
                    Componente Modal reutilizável com animações e suporte completo a temas.
                </p>

                {/* Modal Examples Sections */}
                <ModalExamplesSection isDark={isDark} />
            </div>

            {/* Futuras seções para outros componentes */}
            <div className="mb-12">
                <h2 className={`text-3xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Próximos Componentes
                </h2>
                <div className={`p-6 rounded-xl border-2 border-dashed ${isDark ? 'border-gray-600/50 bg-gray-800/20' : 'border-gray-300/50 bg-gray-50/50'}`}>
                    <div className="text-center space-y-4">
                        <div className="flex justify-center space-x-4 mb-4">
                            <Layout className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-primary-600'}`} />
                            <Sidebar className={`w-8 h-8 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                            <Calendar className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                        </div>
                        <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            Mais Componentes em Breve
                        </h3>
                        <p className={`${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}>
                            FlyonCards, Sidebar, Navbar, Tables, Charts e muito mais...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ComponentsExamples
