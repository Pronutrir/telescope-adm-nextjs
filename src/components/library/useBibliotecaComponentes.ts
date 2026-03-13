'use client'

import { useState } from 'react'
import {
    LucideIcon,
    Users, Activity, TrendingUp, Clock,
    Monitor, Database, CheckCircle, AlertTriangle,
    Settings, BarChart3, GripVertical, FileText, Layers2, ChevronDown,
    Sparkles, Table2, LayoutGrid, GitBranch,
    Command, Bell, CreditCard,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import type { PDFItem } from '@/types/pdf'

export const SECTION_CONFIG = {
    contexts: { icon: Settings, color: 'text-violet-400' },
    stats: { icon: BarChart3, color: 'text-blue-400' },
    progress: { icon: Activity, color: 'text-emerald-400' },
    sortable: { icon: GripVertical, color: 'text-amber-400' },
    pdf: { icon: FileText, color: 'text-rose-400' },
    modals: { icon: Layers2, color: 'text-cyan-400' },
    dropdown: { icon: ChevronDown, color: 'text-indigo-400' },
    premiumMetrics: { icon: Sparkles, color: 'text-fuchsia-400' },
    modernTable: { icon: Table2, color: 'text-sky-400' },
    bentoGrid: { icon: LayoutGrid, color: 'text-lime-400' },
    activityTimeline: { icon: GitBranch, color: 'text-orange-400' },
    commandPalette: { icon: Command, color: 'text-teal-400' },
    notificationCenter: { icon: Bell, color: 'text-rose-400' },
    pricingCards: { icon: CreditCard, color: 'text-yellow-400' },
} as const

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
}

const SORTABLE_DEFAULTS: SortableItem[] = [
    { id: 'cpu', title: 'Performance CPU', value: '67', total: '100', progress: 67, icon: Monitor, color: 'info', variant: 'modern' },
    { id: 'memory', title: 'Uso de Memória', value: '8.2', total: '16', progress: 51, icon: Database, color: 'warning', variant: 'modern' },
    { id: 'tasks', title: 'Tarefas Completas', value: '94', total: '120', progress: 78, icon: CheckCircle, color: 'success', variant: 'modern' },
    { id: 'alerts', title: 'Alertas Ativos', value: '7', total: '15', progress: 47, icon: AlertTriangle, color: 'error', variant: 'modern' },
]

export const STATS_EXAMPLES = [
    { title: 'Total de Usuários', value: '2,847', icon: Users, iconColor: 'primary' as const, trend: { value: '+12% vs mês anterior', isPositive: true }, description: 'Usuários ativos registrados' },
    { title: 'Sessões Ativas', value: '1,429', icon: Activity, iconColor: 'success' as const, trend: { value: '+8.5% vs período anterior', isPositive: true }, description: 'Sessões simultâneas no momento' },
    { title: 'Taxa de Conversão', value: '68.2%', icon: TrendingUp, iconColor: 'warning' as const, trend: { value: '-2.1% vs último trimestre', isPositive: false }, description: 'Conversão de visitantes em clientes' },
    { title: 'Tempo Médio', value: '4:32', icon: Clock, iconColor: 'info' as const, trend: { value: '+15% vs semana anterior', isPositive: true }, description: 'Tempo médio de permanência' },
]

export const PDF_EXAMPLES: PDFItem[] = [
    { id: 'pdf-1', title: 'Relatório Financeiro Q1 2025', fileName: 'relatorio-financeiro-q1-2025.pdf', url: '/pdfs/relatorio-financeiro-q1-2025.pdf', size: '2.4 MB', uploadDate: '2025-01-15T10:30:00Z', description: 'Relatório das atividades financeiras do Q1.' },
    { id: 'pdf-2', title: 'Manual do Usuário - Telescope', fileName: 'manual-usuario-telescope.pdf', url: '/pdfs/manual-usuario-telescope.pdf', size: '8.7 MB', uploadDate: '2025-01-12T14:15:00Z', description: 'Guia completo de utilização do sistema.' },
    { id: 'pdf-3', title: 'Política de Segurança da Informação', fileName: 'politica-seguranca-info.pdf', url: '/pdfs/politica-seguranca-info.pdf', size: '1.2 MB', uploadDate: '2025-01-08T09:00:00Z', description: 'Diretrizes para proteção de dados.' },
    { id: 'pdf-4', title: 'Plano Estratégico 2025-2027', fileName: 'plano-estrategico-2025-2027.pdf', url: '/pdfs/plano-estrategico-2025-2027.pdf', size: '5.8 MB', uploadDate: '2025-01-05T16:45:00Z', description: 'Planejamento estratégico do triênio.' },
    { id: 'pdf-5', title: 'Contrato de Prestação de Serviços', fileName: 'contrato-prestacao-servicos.pdf', url: '/pdfs/contrato-prestacao-servicos.pdf', size: '890 KB', uploadDate: '2025-01-03T11:20:00Z', description: 'Modelo padrão de contrato.' },
    { id: 'pdf-6', title: 'Apresentação Resultados Anuais', fileName: 'apresentacao-resultados-anuais.pdf', url: '/pdfs/apresentacao-resultados-anuais.pdf', size: '12.3 MB', uploadDate: '2024-12-28T13:30:00Z', description: 'Slides dos resultados anuais.' },
]

export const useBibliotecaComponentes = () => {
    const { theme, isDark, toggleTheme } = useTheme()
    const { isMobile, sidebarOpen, mounted } = useLayout()

    const [sortableItems, setSortableItems] = useState<SortableItem[]>(SORTABLE_DEFAULTS)
    const [interactiveItems, setInteractiveItems] = useState<SortableItem[]>(
        SORTABLE_DEFAULTS.map(item => ({ ...item, id: `${item.id}-demo` }))
    )

    return {
        theme, isDark, toggleTheme,
        isMobile, sidebarOpen, mounted,
        sortableItems, setSortableItems,
        interactiveItems, setInteractiveItems,
    }
}
