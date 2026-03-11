'use client'

import React from 'react'
import { X, Eye, EyeOff, RotateCcw, Settings } from 'lucide-react'
import { useMenuVisibility } from '@/contexts/MenuVisibilityContext'
import { routes } from '@/config/routes'

const MenuVisibilityModal = () => {
    const {
        routeVisibility,
        toggleRouteVisibility,
        resetToDefaults,
        isConfigModalOpen,
        setConfigModalOpen
    } = useMenuVisibility()

    if (!isConfigModalOpen) return null

    // Filtrar apenas rotas principais (não submenus)
    const mainRoutes = routes.filter(route => route.type !== 'submenu')

    const handleClose = () => {
        setConfigModalOpen(false)
    }

    const handleReset = () => {
        resetToDefaults()
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Configurar Visibilidade do Menu
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        aria-label="Fechar"
                    >
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Selecione quais opções do menu devem ser exibidas no sidebar:
                    </p>

                    <div className="space-y-3">
                        {mainRoutes.map((route) => {
                            const isVisible = routeVisibility[ route.name ] !== false
                            const IconComponent = route.icon

                            return (
                                <div
                                    key={route.name}
                                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        {IconComponent && (
                                            <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                        )}
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {route.name}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => toggleRouteVisibility(route.name)}
                                        className={`
                                            flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                                            ${isVisible
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                                            }
                                        `}
                                    >
                                        {isVisible ? (
                                            <>
                                                <Eye className="w-4 h-4" />
                                                <span className="text-sm font-medium">Visível</span>
                                            </>
                                        ) : (
                                            <>
                                                <EyeOff className="w-4 h-4" />
                                                <span className="text-sm font-medium">Oculto</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={handleReset}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>Restaurar Padrão</span>
                    </button>

                    <div className="flex space-x-3">
                        <button
                            onClick={handleClose}
                            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleClose}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MenuVisibilityModal
