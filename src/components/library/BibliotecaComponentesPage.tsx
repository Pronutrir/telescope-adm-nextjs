'use client'

import React from 'react'
import { Moon, Sun, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useBibliotecaComponentes, STATS_EXAMPLES, PDF_EXAMPLES, SECTION_CONFIG } from './useBibliotecaComponentes'
import { ContextInfoSection } from './ContextInfoSection'
import { StatsCardSection } from './StatsCardSection'
import { ProgressStatSection } from './ProgressStatSection'
import { SortableProgressSection } from './SortableProgressSection'
import { TelescopePDFSection } from './TelescopePDFSection'
import { ModalExamplesSection } from './ModalExamplesSection'
import { DropdownTest } from './DropdownTest'
import { PremiumMetricsShowcase } from './PremiumMetricsShowcase'
import { ModernTableShowcase } from './ModernTableShowcase'
import { BentoGridShowcase } from './BentoGridShowcase'
import { ActivityTimelineShowcase } from './ActivityTimelineShowcase'
import { CommandPaletteShowcase } from './CommandPaletteShowcase'
import { NotificationCenterShowcase } from './NotificationCenterShowcase'
import { PricingCardsShowcase } from './PricingCardsShowcase'
import { SectionBlock } from './SectionBlock'

export const BibliotecaComponentesPage: React.FC = () => {
    const {
        theme, isDark, toggleTheme,
        isMobile, sidebarOpen, mounted,
        sortableItems, setSortableItems,
        interactiveItems, setInteractiveItems,
    } = useBibliotecaComponentes()

    return (
        <div className="w-full min-h-screen relative">
            {/* Subtle ambient glow */}
            <div className={cn(
                'absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] opacity-15 pointer-events-none',
                isDark ? 'bg-cyan-500' : 'bg-cyan-300'
            )} />

            {/* Hero Header */}
            <header className="relative text-center pt-4 pb-12 mb-12">
                <div className={cn(
                    'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6',
                    'ring-1 ring-inset',
                    isDark
                        ? 'bg-cyan-500/10 text-cyan-300 ring-cyan-500/20'
                        : 'bg-cyan-50 text-cyan-700 ring-cyan-200'
                )}>
                    <Layers className="w-3.5 h-3.5" />
                    Design System v2.0
                </div>

                <h1 className={cn(
                    'text-4xl sm:text-5xl font-bold tracking-tight mb-3',
                    isDark ? 'text-white' : 'text-slate-900'
                )}>
                    Biblioteca de Componentes
                </h1>
                <p className={cn(
                    'text-lg max-w-xl mx-auto mb-8',
                    isDark ? 'text-slate-400' : 'text-slate-500'
                )}>
                    Explore os componentes do Telescope ADM com suporte completo a temas e responsividade.
                </p>

                {/* Controls pill */}
                <div className={cn(
                    'inline-flex items-center gap-4 px-5 py-3 rounded-2xl',
                    'ring-1 ring-inset backdrop-blur-xl',
                    isDark
                        ? 'bg-slate-800/60 ring-slate-700/50'
                        : 'bg-slate-100/90 ring-slate-300/70 shadow-sm'
                )}>
                    <div className="flex items-center gap-2">
                        <div className={cn('w-2 h-2 rounded-full', isDark ? 'bg-emerald-400' : 'bg-emerald-500')} />
                        <span className={cn('text-xs font-medium', isDark ? 'text-slate-300' : 'text-slate-600')}>
                            Tema: {theme}
                        </span>
                    </div>
                    <div className={cn('w-px h-4', isDark ? 'bg-slate-700' : 'bg-slate-200')} />
                    <span className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>
                        {isMobile ? 'Mobile' : 'Desktop'}
                    </span>
                    <div className={cn('w-px h-4', isDark ? 'bg-slate-700' : 'bg-slate-200')} />
                    <Button
                        variant="outline" size="sm" onClick={toggleTheme} icon={isDark ? Sun : Moon}
                        aria-label={`Alternar para tema ${isDark ? 'claro' : 'escuro'}`}
                    >
                        {isDark ? 'Light' : 'Dark'}
                    </Button>
                </div>
            </header>

            {/* Sections */}
            <div className="space-y-16">
                <SectionBlock id="contexts" number="01" title="Contextos" description="Estado dos contextos de tema e layout da aplicação" icon={SECTION_CONFIG.contexts.icon} iconColor={SECTION_CONFIG.contexts.color} isDark={isDark}>
                    <ContextInfoSection isDark={isDark} isMobile={isMobile} sidebarOpen={sidebarOpen} mounted={mounted} theme={theme} toggleTheme={toggleTheme} />
                </SectionBlock>

                <SectionBlock id="stats" number="02" title="Stats Cards" description="Componente de estatísticas com múltiplas variantes e paletas" icon={SECTION_CONFIG.stats.icon} iconColor={SECTION_CONFIG.stats.color} isDark={isDark}>
                    <StatsCardSection isDark={isDark} statsExamples={STATS_EXAMPLES} />
                </SectionBlock>

                <SectionBlock id="progress" number="03" title="Progress Statistics" description="Barras de progresso interativas com drag and drop" icon={SECTION_CONFIG.progress.icon} iconColor={SECTION_CONFIG.progress.color} isDark={isDark}>
                    <ProgressStatSection isDark={isDark} interactiveItems={interactiveItems} setInteractiveItems={setInteractiveItems} />
                </SectionBlock>

                <SectionBlock id="sortable" number="04" title="Sortable Dashboard" description="Dashboard com cards reordenáveis via drag and drop" icon={SECTION_CONFIG.sortable.icon} iconColor={SECTION_CONFIG.sortable.color} isDark={isDark}>
                    <SortableProgressSection isDark={isDark} sortableItems={sortableItems} setSortableItems={setSortableItems} />
                </SectionBlock>

                <SectionBlock id="pdf" number="05" title="PDF Cards" description="Cards de visualização de PDFs em modos grid, lista e seleção" icon={SECTION_CONFIG.pdf.icon} iconColor={SECTION_CONFIG.pdf.color} isDark={isDark}>
                    <TelescopePDFSection isDark={isDark} pdfExamples={PDF_EXAMPLES} />
                </SectionBlock>

                <SectionBlock id="modals" number="06" title="Modais" description="Sistema de modais com tamanhos, animações e comportamentos customizáveis" icon={SECTION_CONFIG.modals.icon} iconColor={SECTION_CONFIG.modals.color} isDark={isDark}>
                    <ModalExamplesSection isDark={isDark} />
                </SectionBlock>

                <SectionBlock id="dropdown" number="07" title="Dropdown" description="Menu dropdown com avatar, itens de navegação e suporte a tema" icon={SECTION_CONFIG.dropdown.icon} iconColor={SECTION_CONFIG.dropdown.color} isDark={isDark}>
                    <DropdownTest isDark={isDark} />
                </SectionBlock>

                <SectionBlock id="premium-metrics" number="08" title="Premium Metrics" description="Cards de métricas com sparklines animadas, glassmorphism e micro-interações" icon={SECTION_CONFIG.premiumMetrics.icon} iconColor={SECTION_CONFIG.premiumMetrics.color} isDark={isDark}>
                    <PremiumMetricsShowcase isDark={isDark} />
                </SectionBlock>

                <SectionBlock id="modern-table" number="09" title="Modern Table" description="Tabela moderna com busca, status pills, barras de progresso e paginação animada" icon={SECTION_CONFIG.modernTable.icon} iconColor={SECTION_CONFIG.modernTable.color} isDark={isDark}>
                    <ModernTableShowcase isDark={isDark} />
                </SectionBlock>

                <SectionBlock id="bento-grid" number="10" title="Bento Grid" description="Dashboard estilo Bento com cards de receita, performance, equipe, tarefas e metas" icon={SECTION_CONFIG.bentoGrid.icon} iconColor={SECTION_CONFIG.bentoGrid.color} isDark={isDark}>
                    <BentoGridShowcase isDark={isDark} />
                </SectionBlock>

                <SectionBlock id="activity-timeline" number="11" title="Activity Timeline" description="Timeline de atividades com eventos tipados, ícones coloridos e animações stagger" icon={SECTION_CONFIG.activityTimeline.icon} iconColor={SECTION_CONFIG.activityTimeline.color} isDark={isDark}>
                    <ActivityTimelineShowcase isDark={isDark} />
                </SectionBlock>

                <SectionBlock id="command-palette" number="12" title="Command Palette" description="Spotlight search estilo Linear/Raycast com navegação por teclado e busca fuzzy" icon={SECTION_CONFIG.commandPalette.icon} iconColor={SECTION_CONFIG.commandPalette.color} isDark={isDark}>
                    <CommandPaletteShowcase isDark={isDark} />
                </SectionBlock>

                <SectionBlock id="notification-center" number="13" title="Notification Center" description="Central de notificações com filtros, ações inline, animações stagger e estados interativos" icon={SECTION_CONFIG.notificationCenter.icon} iconColor={SECTION_CONFIG.notificationCenter.color} isDark={isDark}>
                    <NotificationCenterShowcase isDark={isDark} />
                </SectionBlock>

                <SectionBlock id="pricing-cards" number="14" title="Pricing Cards" description="Cards de planos SaaS com toggle mensal/anual, glassmorphism e micro-interações" icon={SECTION_CONFIG.pricingCards.icon} iconColor={SECTION_CONFIG.pricingCards.color} isDark={isDark}>
                    <PricingCardsShowcase isDark={isDark} />
                </SectionBlock>
            </div>
        </div>
    )
}
