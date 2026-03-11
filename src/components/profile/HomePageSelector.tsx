'use client'

import React from 'react'
import { Home, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useHomePageSelector } from './useHomePageSelector'

export const HomePageSelector: React.FC = () => {
    const { isDark, selectedPage, setSelectedPage, isSaving, availableRoutes, handleSave, hasChanges } = useHomePageSelector()

    return (
        <div className={cn('rounded-xl border transition-colors', isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
            <div className={cn('p-6 border-b transition-colors', isDark ? 'border-gray-700' : 'border-gray-200')}>
                <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg', isDark ? 'bg-blue-900/30' : 'bg-blue-100')}>
                        <Home className={cn('w-5 h-5', isDark ? 'text-blue-400' : 'text-blue-600')} />
                    </div>
                    <div>
                        <h3 className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-gray-900')}>Página Inicial</h3>
                        <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                            Escolha a página que será exibida ao fazer login
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <div>
                    <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                        Selecione sua página inicial preferida
                    </label>
                    <select
                        value={selectedPage}
                        onChange={(e) => setSelectedPage(e.target.value)}
                        disabled={isSaving}
                        className={cn(
                            'w-full px-4 py-2.5 rounded-lg border transition-all',
                            isDark
                                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
                            isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                        )}
                    >
                        {availableRoutes.map((route) => (
                            <option key={route.layout + route.path} value={route.layout + route.path}>
                                {route.name}
                            </option>
                        ))}
                    </select>
                </div>

                {hasChanges && (
                    <div className={cn('p-3 rounded-lg border', isDark ? 'bg-blue-900/20 border-blue-800 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700')}>
                        <p className="text-sm">💡 Ao salvar, esta será sua página inicial em próximos acessos</p>
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all',
                            !hasChanges || isSaving
                                ? (isDark ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed')
                                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95',
                        )}
                    >
                        {isSaving
                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</>
                            : <><Check className="w-4 h-4" /> Salvar Preferência</>
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}
