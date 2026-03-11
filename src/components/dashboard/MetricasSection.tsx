'use client'

import type { LucideIcon } from 'lucide-react'
import { BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatsCard } from '@/components/ui/StatsCard'

type IconColor = 'primary' | 'success' | 'info' | 'warning'

interface CardData {
    title: string
    value: string
    icon: LucideIcon
    iconColor: IconColor
    trend: { value: string; isPositive: boolean }
    description: string
}

interface Props {
    isDark: boolean
    isLoading: boolean
    cards: CardData[]
}

export const MetricasSection: React.FC<Props> = ({ isDark, isLoading, cards }) => (
    <div className="mb-12">
        <h2 className={cn(
            'text-3xl font-semibold mb-6 flex items-center justify-center gap-2',
            isDark ? 'text-white' : 'text-slate-800'
        )}>
            <BarChart3 className={cn('w-7 h-7', isDark ? 'text-blue-400' : 'text-primary-600')} />
            Métricas Principais
        </h2>
        <p className={cn('text-lg mb-8 text-center', isDark ? 'text-gray-300' : 'text-muted-foreground')}>
            Estatísticas em tempo real do sistema Telescope-ADM
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => (
                <StatsCard
                    key={card.title}
                    title={card.title}
                    value={isLoading ? '...' : card.value}
                    icon={card.icon}
                    iconColor={card.iconColor}
                    trend={card.trend}
                    description={card.description}
                    variant="telescope"
                    isDark={isDark}
                    className={cn(
                        'transform hover:scale-105 transition-all duration-300',
                        isLoading && 'opacity-75'
                    )}
                />
            ))}
        </div>
    </div>
)
