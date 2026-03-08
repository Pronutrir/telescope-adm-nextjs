'use client'

import React from 'react'
import { PageWrapper } from '@/components/layout'
import { useDashboard } from './useDashboard'
import { DashboardHeader } from './DashboardHeader'
import { DashboardControls } from './DashboardControls'
import { MetricasSection } from './MetricasSection'
import { TrafficMetricsSection } from './TrafficMetricsSection'
import { StatusSection } from './StatusSection'
import { QuickActionsSection } from './QuickActionsSection'

export const DashboardPage: React.FC = () => {
    const {
        isDark,
        mounted,
        isGAReady,
        gaError,
        GoogleAnalyticsLoader,
        stats,
        analyticsState,
        isLoading,
        dashboardCards,
        trafficMetrics,
        isLoadingTraffic,
        refreshMetrics,
        handleRefresh,
        handleGAToggle,
    } = useDashboard()

    if (!mounted) {
        return (
            <PageWrapper maxWidth="full" spacing="xl">
                <div className="w-full space-y-8">
                    <div className="text-center">
                        <div className="animate-pulse space-y-4">
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                            </div>
                        ))}
                    </div>
                </div>
            </PageWrapper>
        )
    }

    return (
        <PageWrapper maxWidth="full" spacing="xl">
            <GoogleAnalyticsLoader />
            <div className="w-full space-y-8">
                <DashboardHeader isDark={isDark} />
                <DashboardControls
                    isDark={isDark}
                    isLoading={isLoading}
                    analyticsState={analyticsState}
                    onRefresh={handleRefresh}
                    onGAToggle={handleGAToggle}
                />
                <MetricasSection isDark={isDark} isLoading={isLoading} cards={dashboardCards} />
                <TrafficMetricsSection
                    isDark={isDark}
                    trafficMetrics={trafficMetrics}
                    isLoadingTraffic={isLoadingTraffic}
                    onRefresh={refreshMetrics}
                />
                <StatusSection
                    isDark={isDark}
                    mounted={mounted}
                    isGAReady={isGAReady}
                    gaError={gaError}
                    analyticsState={analyticsState}
                    statsCount={stats.length}
                />
                <QuickActionsSection isDark={isDark} />
            </div>
        </PageWrapper>
    )
}
