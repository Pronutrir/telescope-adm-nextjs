'use client'

import React, { useState } from 'react'
import { FileText, ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight } from 'lucide-react'

interface TrafficTableProps {
    data: Array<{
        url: string
        views: number
        users: number
        rate: number
        app: string
    }>
    title?: string
    isDark?: boolean
    style?: React.CSSProperties
}

export const TrafficTable: React.FC<TrafficTableProps> = ({
    data,
    title = "Páginas Mais Visitadas",
    isDark = false,
    style
}) => {
    const [ currentPage, setCurrentPage ] = useState(0)
    const [ itemsPerPage ] = useState(5)

    const totalPages = Math.ceil(data.length / itemsPerPage)
    const startIndex = currentPage * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = data.slice(startIndex, endIndex)

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)))
    }

    const formatNumber = (num: number) => {
        return num.toLocaleString('pt-BR')
    }

    return (
        <div
            className="rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1 card-hover-lift"
            style={{
                ...style,
                backgroundColor: style?.backgroundColor || (isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)'),
                borderColor: style?.borderColor || (isDark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.25)'),
                color: style?.color || (isDark ? 'rgb(243, 244, 246)' : 'rgb(30, 41, 59)'),
                boxShadow: style?.boxShadow || (isDark
                    ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    : '0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)')
            }}
        >
            <div className="p-6 pb-4">
                <h3 className={`text-2xl font-semibold leading-none tracking-tight mb-2 flex items-center ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <FileText className={`w-5 h-5 mr-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    {title}
                </h3>
            </div>
            <div className="p-6 pt-2">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`border-b ${isDark ? 'border-gray-600/40' : 'border-slate-300/50'}`}>
                                <th className={`text-left text-sm font-semibold pb-4 px-3 uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>URL</th>
                                <th className={`text-left text-sm font-semibold pb-4 px-3 uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>Visitas</th>
                                <th className={`text-left text-sm font-semibold pb-4 px-3 uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>Usuários</th>
                                <th className={`text-left text-sm font-semibold pb-4 px-3 uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>Taxa</th>
                                <th className={`text-left text-sm font-semibold pb-4 px-3 uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>Aplicação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((item, index) => (
                                <tr key={index} className={`border-b transition-all duration-200 ${isDark
                                    ? 'border-gray-700/20 hover:bg-gray-800/30 hover:border-gray-600/40'
                                    : 'border-slate-200/30 hover:bg-blue-50/40 hover:border-blue-200/50'
                                    }`}>
                                    <td className={`py-4 px-3 text-sm font-mono rounded-l-lg ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                                        {item.url}
                                    </td>
                                    <td className={`py-4 px-3 text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {formatNumber(item.views)}
                                    </td>
                                    <td className={`py-4 px-3 text-sm font-medium ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>
                                        {formatNumber(item.users)}
                                    </td>
                                    <td className="py-4 px-3">
                                        <div className="flex items-center space-x-2">
                                            {item.rate > 40 ? (
                                                <ArrowUpRight className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                            ) : (
                                                <ArrowDownRight className={`w-4 h-4 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                                            )}
                                            <span className={`text-sm font-bold ${item.rate > 40
                                                ? (isDark ? 'text-emerald-400' : 'text-emerald-600')
                                                : (isDark ? 'text-orange-400' : 'text-orange-600')
                                                }`}>
                                                {item.rate.toFixed(1)}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className={`py-4 px-3 text-sm font-medium rounded-r-lg ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                                        {item.app}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                    <div className={`flex items-center justify-between mt-8 pt-6 border-t ${isDark ? 'border-gray-600/40' : 'border-slate-300/50'
                        }`}>
                        <div className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                            Mostrando {startIndex + 1} a {Math.min(endIndex, data.length)} de {data.length} resultados
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 0}
                                className={`p-3 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed transform hover:scale-105 ${isDark
                                    ? 'text-gray-300 hover:text-white hover:bg-gray-700/60 hover:shadow-lg hover:shadow-gray-900/20'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-blue-100/80 hover:shadow-lg hover:shadow-blue-500/20'
                                    }`}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="flex space-x-2">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => goToPage(i)}
                                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${currentPage === i
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                                            : isDark
                                                ? 'text-gray-300 hover:text-white hover:bg-gray-700/60 hover:shadow-lg hover:shadow-gray-900/20'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-blue-100/80 hover:shadow-lg hover:shadow-blue-500/20'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages - 1}
                                className={`p-3 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed transform hover:scale-105 ${isDark
                                    ? 'text-gray-300 hover:text-white hover:bg-gray-700/60 hover:shadow-lg hover:shadow-gray-900/20'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-blue-100/80 hover:shadow-lg hover:shadow-blue-500/20'
                                    }`}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TrafficTable
