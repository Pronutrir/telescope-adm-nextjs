'use client'

import React, { useState, useEffect } from 'react'
import { StatsCard } from '@/components/ui/StatsCard'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { ProgressStat } from '@/components/ui/ProgressStat'
import { SortableProgressStats } from '@/components/ui/SortableProgressStats'
import {
    Users,
    TrendingUp,
    Activity,
    Settings,
    ArrowRight,
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
    User
} from 'lucide-react'

// Interface para items sortable
export interface SortableItem {
    id: string
    title: string
    value: string
    total: string
    progress: number
    icon: any
    color: 'success' | 'warning' | 'error' | 'info' | 'primary'
    variant: 'default' | 'modern' | 'telescope'
    size?: 'sm' | 'md' | 'lg'
    className?: string
    style?: React.CSSProperties
}

const ComponentsExamples: React.FC = () => {
    // Estado para detectar tema
    const [ isDark, setIsDark ] = useState(false)

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

    // Detectar tema atual
    useEffect(() => {
        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains('dark'))
        }

        checkTheme()

        // Observer para mudanças no tema
        const observer = new MutationObserver(checkTheme)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: [ 'class' ]
        })

        return () => observer.disconnect()
    }, [])

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
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}>
                        🎨 <strong>Design System:</strong> Todos os componentes seguem o sistema de design unificado com suporte completo a temas light/dark.
                    </p>
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
                                onChange={setSelectedValue}
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
  onChange={setSelectedValue}
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
