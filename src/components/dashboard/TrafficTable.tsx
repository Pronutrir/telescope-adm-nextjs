'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
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
}

export const TrafficTable: React.FC<TrafficTableProps> = ({
    data,
    title = "Páginas Mais Visitadas"
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
        <Card variant="telescope" className="h-fit hover:shadow-2xl">
            <CardHeader>
                <CardTitle className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-primary-400" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-telescope-icon/20">
                                <th className="text-left text-telescope-icon text-sm font-medium pb-3 px-2">URL</th>
                                <th className="text-left text-telescope-icon text-sm font-medium pb-3 px-2">Visitas</th>
                                <th className="text-left text-telescope-icon text-sm font-medium pb-3 px-2">Usuários</th>
                                <th className="text-left text-telescope-icon text-sm font-medium pb-3 px-2">Taxa</th>
                                <th className="text-left text-telescope-icon text-sm font-medium pb-3 px-2">Aplicação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((item, index) => (
                                <tr key={index} className="border-b border-telescope-icon/10 hover:bg-card-elevated/50 transition-colors">
                                    <td className="py-3 px-2 text-white text-sm font-mono">{item.url}</td>
                                    <td className="py-3 px-2 text-white text-sm font-medium">{formatNumber(item.views)}</td>
                                    <td className="py-3 px-2 text-white text-sm">{formatNumber(item.users)}</td>
                                    <td className="py-3 px-2">
                                        <div className="flex items-center space-x-2">
                                            {item.rate > 40 ? (
                                                <ArrowUpRight className="w-4 h-4 text-success-400" />
                                            ) : (
                                                <ArrowDownRight className="w-4 h-4 text-warning-400" />
                                            )}
                                            <span className={`text-sm font-medium ${item.rate > 40 ? 'text-success-400' : 'text-warning-400'
                                                }`}>
                                                {item.rate.toFixed(1)}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-2 text-telescope-icon text-sm">{item.app}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-telescope-icon/20">
                        <div className="text-sm text-telescope-icon">
                            Mostrando {startIndex + 1} a {Math.min(endIndex, data.length)} de {data.length} resultados
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 0}
                                className="p-2 rounded-lg text-telescope-icon hover:text-white hover:bg-card-elevated disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <div className="flex space-x-1">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => goToPage(i)}
                                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${currentPage === i
                                            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                                            : 'text-telescope-icon hover:text-white hover:bg-card-elevated'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages - 1}
                                className="p-2 rounded-lg text-telescope-icon hover:text-white hover:bg-card-elevated disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default TrafficTable
