'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Check, X, Sparkles, Zap, Building2, Crown,
    ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ───────── Types ───────── */

type BillingCycle = 'monthly' | 'yearly'

interface PricingFeature {
    label: string
    included: boolean
    highlight?: boolean
}

interface PricingPlan {
    id: string
    name: string
    description: string
    icon: React.ElementType
    accentColor: string
    accentGradient: string
    price: { monthly: number; yearly: number }
    features: PricingFeature[]
    popular?: boolean
    cta: string
}

/* ───────── Data ───────── */

const PLANS: PricingPlan[] = [
    {
        id: 'starter',
        name: 'Starter',
        description: 'Para equipes pequenas começando agora',
        icon: Zap,
        accentColor: '#64748b',
        accentGradient: 'from-slate-500 to-slate-600',
        price: { monthly: 29, yearly: 24 },
        cta: 'Começar Grátis',
        features: [
            { label: 'Até 5 usuários', included: true },
            { label: '10 GB de armazenamento', included: true },
            { label: 'Relatórios básicos', included: true },
            { label: 'Suporte por email', included: true },
            { label: 'Integrações avançadas', included: false },
            { label: 'API personalizada', included: false },
            { label: 'SLA garantido', included: false },
        ],
    },
    {
        id: 'pro',
        name: 'Professional',
        description: 'Tudo que times em crescimento precisam',
        icon: Sparkles,
        accentColor: '#6366f1',
        accentGradient: 'from-indigo-500 to-violet-500',
        price: { monthly: 79, yearly: 66 },
        cta: 'Assinar Pro',
        popular: true,
        features: [
            { label: 'Até 25 usuários', included: true },
            { label: '100 GB de armazenamento', included: true },
            { label: 'Relatórios avançados', included: true, highlight: true },
            { label: 'Suporte prioritário', included: true, highlight: true },
            { label: 'Integrações avançadas', included: true },
            { label: 'API personalizada', included: false },
            { label: 'SLA garantido', included: false },
        ],
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'Controle total para grandes organizações',
        icon: Building2,
        accentColor: '#f59e0b',
        accentGradient: 'from-amber-500 to-orange-500',
        price: { monthly: 199, yearly: 166 },
        cta: 'Falar com Vendas',
        features: [
            { label: 'Usuários ilimitados', included: true },
            { label: 'Armazenamento ilimitado', included: true },
            { label: 'Relatórios customizados', included: true, highlight: true },
            { label: 'Suporte 24/7 dedicado', included: true, highlight: true },
            { label: 'Integrações avançadas', included: true },
            { label: 'API personalizada', included: true, highlight: true },
            { label: 'SLA 99.99% garantido', included: true, highlight: true },
        ],
    },
]

/* ───────── Toggle ───────── */

const BillingToggle: React.FC<{ cycle: BillingCycle; onChange: (c: BillingCycle) => void; isDark: boolean }> = ({
    cycle, onChange, isDark,
}) => (
    <div className="flex items-center justify-center gap-3">
        <span className={cn(
            'text-sm font-medium transition-colors',
            cycle === 'monthly'
                ? isDark ? 'text-white' : 'text-slate-900'
                : isDark ? 'text-slate-500' : 'text-slate-400'
        )}>
            Mensal
        </span>

        <button
            onClick={() => onChange(cycle === 'monthly' ? 'yearly' : 'monthly')}
            className={cn(
                'relative w-12 h-6 rounded-full transition-colors duration-300',
                cycle === 'yearly'
                    ? 'bg-indigo-500'
                    : isDark ? 'bg-slate-700' : 'bg-slate-300'
            )}
        >
            <motion.div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
                animate={{ left: cycle === 'yearly' ? '26px' : '2px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
        </button>

        <span className={cn(
            'text-sm font-medium transition-colors',
            cycle === 'yearly'
                ? isDark ? 'text-white' : 'text-slate-900'
                : isDark ? 'text-slate-500' : 'text-slate-400'
        )}>
            Anual
        </span>

        <AnimatePresence>
            {cycle === 'yearly' && (
                <motion.span
                    initial={{ opacity: 0, scale: 0.8, x: -8 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -8 }}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold"
                >
                    <Crown className="w-3 h-3" />
                    -17%
                </motion.span>
            )}
        </AnimatePresence>
    </div>
)

/* ───────── Pricing Card ───────── */

interface PricingCardProps {
    plan: PricingPlan
    cycle: BillingCycle
    isDark: boolean
    delay: number
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, cycle, isDark, delay }) => {
    const Icon = plan.icon
    const price = plan.price[cycle]

    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={cn(
                'group relative flex flex-col rounded-2xl p-6',
                'border backdrop-blur-xl transition-all duration-300',
                plan.popular && 'ring-2 ring-indigo-500/50 scale-[1.02]',
                isDark
                    ? 'bg-slate-900/80 border-slate-700/50 hover:border-slate-600/80 shadow-lg shadow-black/20'
                    : 'bg-slate-50/80 border-slate-200 hover:border-slate-300 shadow-lg shadow-slate-300/20',
                'hover:-translate-y-1 hover:shadow-xl'
            )}
        >
            {/* Popular badge */}
            {plan.popular && (
                <div className={cn(
                    'absolute -top-3 left-1/2 -translate-x-1/2',
                    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold',
                    'bg-gradient-to-r', plan.accentGradient, 'text-white shadow-lg',
                )}>
                    <Sparkles className="w-3 h-3" />
                    Mais Popular
                </div>
            )}

            {/* Top glow */}
            <div
                className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                style={{ backgroundColor: plan.accentColor }}
            />

            {/* Header */}
            <div className="relative mb-6">
                <div
                    className="flex items-center justify-center w-11 h-11 rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${plan.accentColor}15`, color: plan.accentColor }}
                >
                    <Icon className="w-5 h-5" />
                </div>

                <h3 className={cn('text-lg font-bold mb-1', isDark ? 'text-white' : 'text-slate-900')}>
                    {plan.name}
                </h3>
                <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>
                    {plan.description}
                </p>
            </div>

            {/* Price */}
            <div className="mb-6">
                <div className="flex items-baseline gap-1">
                    <span className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>R$</span>
                    <AnimatePresence mode="popLayout">
                        <motion.span
                            key={price}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.25 }}
                            className={cn('text-4xl font-bold tracking-tight', isDark ? 'text-white' : 'text-slate-900')}
                        >
                            {price}
                        </motion.span>
                    </AnimatePresence>
                    <span className={cn('text-sm', isDark ? 'text-slate-500' : 'text-slate-400')}>/mês</span>
                </div>
                {cycle === 'yearly' && (
                    <p className={cn('text-xs mt-1', isDark ? 'text-slate-600' : 'text-slate-400')}>
                        Cobrado anualmente (R$ {price * 12}/ano)
                    </p>
                )}
            </div>

            {/* CTA */}
            <button
                className={cn(
                    'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold',
                    'transition-all duration-200',
                    plan.popular
                        ? cn('bg-gradient-to-r text-white shadow-lg hover:shadow-xl hover:scale-[1.02]', plan.accentGradient)
                        : cn(
                            'border',
                            isDark
                                ? 'border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-600'
                                : 'border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                        )
                )}
            >
                {plan.cta}
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>

            {/* Divider */}
            <div className={cn('my-6 h-px', isDark ? 'bg-slate-800' : 'bg-slate-100')} />

            {/* Features */}
            <ul className="space-y-3 flex-1">
                {plan.features.map((feature, i) => (
                    <motion.li
                        key={feature.label}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: delay + i * 0.04 }}
                        className="flex items-center gap-2.5"
                    >
                        {feature.included ? (
                            <div className={cn(
                                'flex items-center justify-center w-5 h-5 rounded-full shrink-0',
                                feature.highlight
                                    ? 'bg-indigo-500/10 text-indigo-500'
                                    : isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-500'
                            )}>
                                <Check className="w-3 h-3" strokeWidth={3} />
                            </div>
                        ) : (
                            <div className={cn(
                                'flex items-center justify-center w-5 h-5 rounded-full shrink-0',
                                isDark ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-400'
                            )}>
                                <X className="w-3 h-3" />
                            </div>
                        )}
                        <span className={cn(
                            'text-sm',
                            feature.included
                                ? feature.highlight
                                    ? isDark ? 'text-slate-200 font-medium' : 'text-slate-700 font-medium'
                                    : isDark ? 'text-slate-300' : 'text-slate-600'
                                : isDark ? 'text-slate-600' : 'text-slate-400'
                        )}>
                            {feature.label}
                        </span>
                    </motion.li>
                ))}
            </ul>
        </motion.div>
    )
}

/* ───────── Main Showcase ───────── */

interface Props {
    isDark: boolean
}

export const PricingCardsShowcase: React.FC<Props> = ({ isDark }) => {
    const [cycle, setCycle] = useState<BillingCycle>('monthly')

    return (
        <div className="space-y-8">
            <BillingToggle cycle={cycle} onChange={setCycle} isDark={isDark} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PLANS.map((plan, i) => (
                    <PricingCard
                        key={plan.id}
                        plan={plan}
                        cycle={cycle}
                        isDark={isDark}
                        delay={i * 0.12}
                    />
                ))}
            </div>
        </div>
    )
}
