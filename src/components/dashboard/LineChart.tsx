'use client'

import React, { useEffect, useRef } from 'react'
import { BarChart3, TrendingUp } from 'lucide-react'

interface ChartData {
    labels: string[]
    datasets: Array<{
        label: string
        data: number[]
        borderColor: string
        backgroundColor: string
        tension?: number
    }>
}

interface LineChartProps {
    data: ChartData | null
    isLoading?: boolean
    activeTab: 'month' | 'week'
    onTabChange: (tab: 'month' | 'week') => void
    title?: string
    isDark?: boolean
    style?: React.CSSProperties
}

export const LineChart: React.FC<LineChartProps> = ({
    data,
    isLoading = false,
    activeTab,
    onTabChange,
    title = "Tráfego de Acessos",
    isDark = false,
    style
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const chartRef = useRef<any>(null)

    useEffect(() => {
        if (!canvasRef.current || !data || typeof window === 'undefined') return

        // Lazy load Chart.js
        const loadChart = async () => {
            try {
                const { Chart, registerables } = await import('chart.js')
                Chart.register(...registerables)

                // Destruir gráfico anterior se existir
                if (chartRef.current) {
                    chartRef.current.destroy()
                }

                const ctx = canvasRef.current?.getContext('2d')
                if (!ctx) return

                // Cores baseadas no tema (usando prop isDark)
                const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'
                const tickColor = isDark ? '#9ca3af' : '#64748b'
                const tooltipBg = isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)'
                const tooltipText = isDark ? '#ffffff' : '#1e293b'
                const tooltipBorder = isDark ? '#60a5fa' : '#3b82f6'

                chartRef.current = new Chart(ctx, {
                    type: 'line',
                    data: data,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                backgroundColor: tooltipBg,
                                titleColor: tooltipText,
                                bodyColor: tooltipText,
                                borderColor: tooltipBorder,
                                borderWidth: 1,
                                cornerRadius: 8,
                                displayColors: false,
                                callbacks: {
                                    title: (context: any) => {
                                        return `${context[ 0 ].label}`
                                    },
                                    label: (context: any) => {
                                        return `Visitas: ${context.parsed.y.toLocaleString('pt-BR')}`
                                    }
                                }
                            }
                        },
                        scales: {
                            x: {
                                grid: {
                                    color: gridColor
                                },
                                ticks: {
                                    color: tickColor,
                                    font: {
                                        size: 12
                                    }
                                }
                            },
                            y: {
                                grid: {
                                    color: gridColor
                                },
                                ticks: {
                                    color: tickColor,
                                    font: {
                                        size: 12
                                    },
                                    callback: function (value: any) {
                                        return Number(value).toLocaleString('pt-BR')
                                    }
                                }
                            }
                        },
                        elements: {
                            point: {
                                radius: 6,
                                hoverRadius: 8,
                                backgroundColor: '#3b82f6',
                                borderColor: '#ffffff',
                                borderWidth: 2
                            },
                            line: {
                                borderWidth: 3,
                                fill: true
                            }
                        },
                        interaction: {
                            intersect: false,
                            mode: 'index'
                        }
                    }
                })
            } catch (error) {
                console.error('Erro ao carregar Chart.js:', error)
            }
        }

        loadChart()

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy()
            }
        }
    }, [ data, isDark ]) // Adicionar isDark nas dependências

    const formatPeriodText = () => {
        if (activeTab === 'month') {
            return 'Dados mensais'
        }
        return 'Dados semanais'
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
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className={`text-2xl font-semibold leading-none tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            {title}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                            {formatPeriodText()} • Overview de visitação
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => onTabChange('month')}
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${activeTab === 'month'
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                                : isDark
                                    ? 'text-gray-300 hover:text-white hover:bg-gray-700/60 hover:shadow-lg hover:shadow-gray-900/20'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-blue-100/80 hover:shadow-lg hover:shadow-blue-500/20'
                                }`}
                        >
                            Mês
                        </button>
                        <button
                            onClick={() => onTabChange('week')}
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${activeTab === 'week'
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                                : isDark
                                    ? 'text-gray-300 hover:text-white hover:bg-gray-700/60 hover:shadow-lg hover:shadow-gray-900/20'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-blue-100/80 hover:shadow-lg hover:shadow-blue-500/20'
                                }`}
                        >
                            Semana
                        </button>
                    </div>
                </div>
            </div>
            <div className="p-6 pt-2">
                <div className="relative">
                    {isLoading ? (
                        <div className={`h-80 rounded-xl flex items-center justify-center border transition-all duration-300 ${isDark
                                ? 'bg-gradient-to-br from-gray-900/60 to-gray-800/60 border-gray-700/30'
                                : 'bg-gradient-to-br from-slate-50/80 to-blue-50/80 border-slate-200/40'
                            }`}>
                            <div className="text-center">
                                <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 ${isDark ? 'border-blue-400' : 'border-blue-600'
                                    }`}></div>
                                <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    Carregando dados...
                                </p>
                                <p className={`text-sm mt-2 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                                    Aguarde um momento
                                </p>
                            </div>
                        </div>
                    ) : data ? (
                        <div className="h-80 relative">
                            <canvas
                                ref={canvasRef}
                                className="w-full h-full rounded-xl"
                            />

                            {/* Estatísticas rápidas */}
                            <div className={`absolute top-4 right-4 backdrop-blur-sm rounded-xl p-4 border shadow-lg transition-all duration-300 ${isDark
                                    ? 'bg-gray-800/90 border-gray-600/40 shadow-gray-900/20'
                                    : 'bg-white/90 border-slate-200/60 shadow-blue-500/10'
                                }`}>
                                <div className="flex items-center space-x-3">
                                    <TrendingUp className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                    <div className="text-right">
                                        <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                                            Total de Visitas
                                        </p>
                                        <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {data.datasets[ 0 ]?.data.reduce((a, b) => a + b, 0).toLocaleString('pt-BR')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={`h-80 rounded-xl flex items-center justify-center border transition-all duration-300 ${isDark
                                ? 'bg-gradient-to-br from-gray-900/60 to-gray-800/60 border-gray-700/30'
                                : 'bg-gradient-to-br from-slate-50/80 to-blue-50/80 border-slate-200/40'
                            }`}>
                            <div className="text-center">
                                <BarChart3 className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                                <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    Nenhum dado disponível
                                </p>
                                <p className={`text-sm mt-2 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                                    Conecte-se ao Google Analytics para ver os dados
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default LineChart
