'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { getPowerBIWorkspaces, listPowerBIReports } from '@/app/actions/powerbi/embed'
import type { Report, Workspace } from './types'

interface UsePowerBIClientProps {
    initialReports: Report[]
    initialWorkspaceId: string
}

export const usePowerBIClient = ({ initialReports, initialWorkspaceId }: UsePowerBIClientProps) => {
    const { isDark } = useTheme()

    const [workspaces, setWorkspaces] = useState<Workspace[]>([])
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(initialWorkspaceId)
    const [loadingWorkspaces, setLoadingWorkspaces] = useState(false)

    const [reports, setReports] = useState<Report[]>(initialReports)
    const [selectedReport, setSelectedReport] = useState<string | null>(
        initialReports.length > 0 ? initialReports[0].id : null
    )
    const [loadingReports, setLoadingReports] = useState(false)

    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showUsersModal, setShowUsersModal] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const loadWorkspaces = useCallback(async () => {
        setLoadingWorkspaces(true)
        try {
            const result = await getPowerBIWorkspaces()
            if (result.sucesso) setWorkspaces(result.workspaces)
        } catch (error) {
            console.error('Erro ao carregar workspaces:', error)
        } finally {
            setLoadingWorkspaces(false)
        }
    }, [])

    const loadReports = useCallback(async (workspaceId: string) => {
        setLoadingReports(true)
        setSelectedReport(null)
        try {
            const result = await listPowerBIReports(workspaceId)
            if (result.sucesso) {
                setReports(result.reports)
                if (result.reports.length > 0) setSelectedReport(result.reports[0].id)
            } else {
                setReports([])
            }
        } catch (error) {
            console.error('Erro ao carregar relatórios:', error)
            setReports([])
        } finally {
            setLoadingReports(false)
        }
    }, [])

    const toggleFullscreen = useCallback(async () => {
        if (!containerRef.current) return
        try {
            if (!isFullscreen) {
                await containerRef.current.requestFullscreen()
                setIsFullscreen(true)
            } else {
                await document.exitFullscreen()
                setIsFullscreen(false)
            }
        } catch (error) {
            console.error('Erro ao alternar tela cheia:', error)
        }
    }, [isFullscreen])

    useEffect(() => { loadWorkspaces() }, [loadWorkspaces])

    useEffect(() => {
        if (selectedWorkspaceId) loadReports(selectedWorkspaceId)
    }, [selectedWorkspaceId, loadReports])

    useEffect(() => {
        const handleChange = () => setIsFullscreen(!!document.fullscreenElement)
        document.addEventListener('fullscreenchange', handleChange)
        document.addEventListener('webkitfullscreenchange', handleChange)
        return () => {
            document.removeEventListener('fullscreenchange', handleChange)
            document.removeEventListener('webkitfullscreenchange', handleChange)
        }
    }, [])

    return {
        isDark,
        workspaces,
        selectedWorkspaceId,
        loadingWorkspaces,
        reports,
        selectedReport,
        loadingReports,
        isFullscreen,
        showUsersModal,
        containerRef,
        selectedReportData: reports.find(r => r.id === selectedReport),
        setSelectedReport,
        setSelectedWorkspaceId,
        setShowUsersModal,
        loadReports,
        toggleFullscreen,
    }
}
