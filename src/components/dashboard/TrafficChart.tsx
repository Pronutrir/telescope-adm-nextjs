'use client'

import React from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'

interface TrafficData {
    month: string
    visits: number
    users: number
}

interface TrafficChartProps {
    data?: TrafficData[]
    height?: number
    isDark?: boolean
    showUsers?: boolean
}

export const TrafficChart: React.FC<TrafficChartProps> = ({
    data = [],
    height = 400,
    isDark = false,
    showUsers = true
}) => {
    // Dados de exemplo se não houver dados
    const defaultData: TrafficData[] = [
        { month: 'Jan', visits: 120, users: 80 },
        { month: 'Fev', visits: 190, users: 130 },
        { month: 'Mar', visits: 150, users: 100 },
        { month: 'Abr', visits: 220, users: 180 },
        { month: 'Mai', visits: 180, users: 140 },
        { month: 'Jun', visits: 250, users: 200 },
        { month: 'Jul', visits: 290, users: 240 },
        { month: 'Ago', visits: 320, users: 280 },
        { month: 'Set', visits: 280, users: 230 },
        { month: 'Out', visits: 350, users: 300 },
        { month: 'Nov', visits: 380, users: 320 },
        { month: 'Dez', visits: 420, users: 360 }
    ]

    const chartData = data.length > 0 ? data : defaultData

    const colors = {
        primary: isDark ? '#3b82f6' : '#2563eb',
        secondary: isDark ? '#10b981' : '#059669',
        grid: isDark ? '#374151' : '#e5e7eb',
        text: isDark ? '#d1d5db' : '#6b7280'
    }

    return (
        <div className="w-full" style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                    }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={colors.grid}
                        opacity={0.3}
                    />
                    <XAxis
                        dataKey="month"
                        stroke={colors.text}
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke={colors.text}
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value: number) => `${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: isDark ? '#1f2937' : '#ffffff',
                            border: `1px solid ${colors.grid}`,
                            borderRadius: '8px',
                            color: isDark ? '#f9fafb' : '#111827'
                        }}
                        labelStyle={{
                            color: isDark ? '#f9fafb' : '#111827'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="visits"
                        stroke={colors.primary}
                        strokeWidth={3}
                        dot={{
                            fill: colors.primary,
                            strokeWidth: 2,
                            r: 4
                        }}
                        activeDot={{
                            r: 6,
                            stroke: colors.primary,
                            strokeWidth: 2,
                            fill: isDark ? '#1f2937' : '#ffffff'
                        }}
                        name="Visitas"
                    />
                    {showUsers && (
                        <Line
                            type="monotone"
                            dataKey="users"
                            stroke={colors.secondary}
                            strokeWidth={3}
                            dot={{
                                fill: colors.secondary,
                                strokeWidth: 2,
                                r: 4
                            }}
                            activeDot={{
                                r: 6,
                                stroke: colors.secondary,
                                strokeWidth: 2,
                                fill: isDark ? '#1f2937' : '#ffffff'
                            }}
                            name="Usuários"
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default TrafficChart
