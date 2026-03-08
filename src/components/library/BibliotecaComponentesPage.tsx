'use client'

import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useBibliotecaComponentes, STATS_EXAMPLES, PDF_EXAMPLES } from './useBibliotecaComponentes'
import { ContextInfoSection } from './ContextInfoSection'
import { StatsCardSection } from './StatsCardSection'
import { ProgressStatSection } from './ProgressStatSection'
import { SortableProgressSection } from './SortableProgressSection'
import { TelescopePDFSection } from './TelescopePDFSection'
import { ModalExamplesSection } from './ModalExamplesSection'

export const BibliotecaComponentesPage: React.FC = () => {
    const {
        theme, isDark, toggleTheme,
        isMobile, sidebarOpen, mounted,
        sortableItems, setSortableItems,
        interactiveItems, setInteractiveItems,
    } = useBibliotecaComponentes()

    return (
        <div className="w-full">
            {/* Page Header */}
            <div className="text-center mb-8">
                <h1 className={cn('text-4xl font-bold mb-4', isDark ? 'text-white' : 'text-slate-800')}>
                    Componentes da Aplicação
                </h1>
                <p className={cn('text-lg', isDark ? 'text-gray-300' : 'text-muted-foreground')}>
                    Exemplos de todos os componentes disponíveis no Telescope ADM
                </p>
                <div className={cn(
                    'mt-6 p-4 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4',
                    isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-accent/20 border-border/20'
                )}>
                    <p className={cn('text-sm', isDark ? 'text-gray-300' : 'text-muted-foreground')}>
                        🎨 <strong>Design System:</strong> Componentes com suporte completo a temas light/dark.
                    </p>
                    <div className="flex items-center gap-4">
                        <span className={cn('text-xs', isDark ? 'text-gray-400' : 'text-gray-600')}>
                            Tema: <strong>{theme}</strong>
                            {isMobile && ' 📱'}
                            {!sidebarOpen && ' 📁'}
                        </span>
                        <Button variant="outline" size="sm" onClick={toggleTheme} icon={isDark ? Sun : Moon}>
                            {isDark ? 'Light' : 'Dark'}
                        </Button>
                    </div>
                </div>
            </div>

            <ContextInfoSection
                isDark={isDark}
                isMobile={isMobile}
                sidebarOpen={sidebarOpen}
                mounted={mounted}
                theme={theme}
                toggleTheme={toggleTheme}
            />
            <StatsCardSection isDark={isDark} statsExamples={STATS_EXAMPLES} />
            <ProgressStatSection
                isDark={isDark}
                interactiveItems={interactiveItems}
                setInteractiveItems={setInteractiveItems}
            />
            <SortableProgressSection
                isDark={isDark}
                sortableItems={sortableItems}
                setSortableItems={setSortableItems}
            />
            <TelescopePDFSection isDark={isDark} pdfExamples={PDF_EXAMPLES} />
            <ModalExamplesSection isDark={isDark} />
        </div>
    )
}
