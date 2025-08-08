'use client'

import React, { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
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
}

export const LineChart: React.FC<LineChartProps> = ({
    data,
    isLoading = false,
    activeTab,
    onTabChange,
    title = "Tráfego de Acessos"
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
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                titleColor: '#ffffff',
                                bodyColor: '#ffffff',
                                borderColor: '#3b82f6',
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
                                    color: 'rgba(255, 255, 255, 0.1)'
                                },
                                ticks: {
                                    color: '#9ca3af',
                                    font: {
                                        size: 12
                                    }
                                }
                            },
                            y: {
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                },
                                ticks: {
                                    color: '#9ca3af',
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
    }, [ data ])

    const formatPeriodText = () => {
        if (activeTab === 'month') {
            return 'Dados mensais'
        }
        return 'Dados semanais'
    }

    return (
        <Card variant="telescope" className="hover:shadow-2xl">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                            {title}
                        </CardTitle>
                        <p className="text-telescope-icon text-sm mt-1">
                            {formatPeriodText()} • Overview de visitação
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onTabChange('month')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'month'
                                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                                : 'text-telescope-icon hover:text-white hover:bg-card-elevated'
                                }`}
                        >
                            Mês
                        </button>
                        <button
                            onClick={() => onTabChange('week')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'week'
                                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                                : 'text-telescope-icon hover:text-white hover:bg-card-elevated'
                                }`}
                        >
                            Semana
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    {isLoading ? (
                        <div className="h-80 bg-gradient-to-br from-black/30 to-telescope-dark/50 rounded-xl flex items-center justify-center border border-telescope-icon/20">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
                                <p className="text-white text-lg font-medium">Carregando dados...</p>
                                <p className="text-telescope-icon text-sm mt-2">Aguarde um momento</p>
                            </div>
                        </div>
                    ) : data ? (
                        <div className="h-80 relative">
                            <canvas
                                ref={canvasRef}
                                className="w-full h-full"
                            />

                            {/* Estatísticas rápidas */}
                            <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-telescope-icon/20">
                                <div className="flex items-center space-x-2">
                                    <TrendingUp className="w-4 h-4 text-success-400" />
                                    <div className="text-right">
                                        <p className="text-xs text-telescope-icon">Total</p>
                                        <p className="text-sm font-bold text-white">
                                            {data.datasets[ 0 ]?.data.reduce((a, b) => a + b, 0).toLocaleString('pt-BR')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-80 bg-gradient-to-br from-black/30 to-telescope-dark/50 rounded-xl flex items-center justify-center border border-telescope-icon/20">
                            <div className="text-center">
                                <BarChart3 className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                                <p className="text-white text-lg font-medium">Nenhum dado disponível</p>
                                <p className="text-telescope-icon text-sm mt-2">Conecte-se ao Google Analytics para ver os dados</p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default LineChart
