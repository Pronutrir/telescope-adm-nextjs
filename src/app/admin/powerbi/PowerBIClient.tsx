'use client'

import React, { useState, useRef, useEffect } from 'react'
import { PowerBIReport } from '@/components/powerbi/PowerBIReport'
import { useTheme } from '@/contexts/ThemeContext'
import { twMerge } from 'tailwind-merge'
import { Maximize2, Minimize2, AlertCircle, Users, RefreshCw } from 'lucide-react'
import { WorkspaceUsersModal } from './WorkspaceUsersModal'
import { getPowerBIWorkspaces, listPowerBIReports } from '@/app/actions/powerbi/embed'

interface Report {
  id: string
  name: string
  webUrl: string
  embedUrl: string
  datasetId?: string
  lastRefreshTime?: string | null
}

interface Workspace {
  id: string
  name: string
  isReadOnly: boolean
  isOnDedicatedCapacity: boolean
  type: string
  state: string
  isCurrent: boolean
}

interface PowerBIClientProps {
  initialReports: Report[]
  initialWorkspaceId: string
}

/**
 * 📊 Componente Client para Visualização do Power BI
 * 
 * Gerencia a seleção de workspace e dashboards
 */
export function PowerBIClient({ initialReports, initialWorkspaceId }: PowerBIClientProps) {
  const { isDark } = useTheme()
  
  // Estados de workspace
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>(initialWorkspaceId)
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(false)
  
  // Estados de reports
  const [reports, setReports] = useState<Report[]>(initialReports)
  const [selectedReport, setSelectedReport] = useState<string | null>(
    initialReports.length > 0 ? initialReports[0].id : null
  )
  const [loadingReports, setLoadingReports] = useState(false)
  
  // Estados de UI
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showUsersModal, setShowUsersModal] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedReportData = reports.find(r => r.id === selectedReport)
  const selectedWorkspace = workspaces.find(w => w.id === selectedWorkspaceId)

  // Carregar workspaces na montagem
  useEffect(() => {
    loadWorkspaces()
  }, [])

  // Carregar reports quando o workspace mudar
  useEffect(() => {
    if (selectedWorkspaceId) {
      loadReports(selectedWorkspaceId)
    }
  }, [selectedWorkspaceId])

  const loadWorkspaces = async () => {
    setLoadingWorkspaces(true)
    try {
      const result = await getPowerBIWorkspaces()
      if (result.sucesso) {
        setWorkspaces(result.workspaces)
      }
    } catch (error) {
      console.error('Erro ao carregar workspaces:', error)
    } finally {
      setLoadingWorkspaces(false)
    }
  }

  const loadReports = async (workspaceId: string) => {
    setLoadingReports(true)
    setSelectedReport(null)
    try {
      const result = await listPowerBIReports(workspaceId)
      if (result.sucesso) {
        setReports(result.reports)
        if (result.reports.length > 0) {
          setSelectedReport(result.reports[0].id)
        }
      } else {
        setReports([])
      }
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error)
      setReports([])
    } finally {
      setLoadingReports(false)
    }
  }

  const handleWorkspaceChange = (workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId)
  }

  // Alternar tela cheia
  const toggleFullscreen = async () => {
    if (!containerRef.current) return

    try {
      if (!isFullscreen) {
        // Entrar em tela cheia
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen()
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          await (containerRef.current as any).webkitRequestFullscreen()
        } else if ((containerRef.current as any).msRequestFullscreen) {
          await (containerRef.current as any).msRequestFullscreen()
        }
        setIsFullscreen(true)
      } else {
        // Sair de tela cheia
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen()
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen()
        }
        setIsFullscreen(false)
      }
    } catch (error) {
      console.error('Erro ao alternar tela cheia:', error)
    }
  }

  // Detectar quando sai de tela cheia pelo ESC
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      )
      setIsFullscreen(isCurrentlyFullscreen)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('msfullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('msfullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className={twMerge(
        'space-y-4',
        isFullscreen && 'bg-white dark:bg-gray-900 p-6'
      )}
    >
      {/* Painel de Seleção Unificado */}
      <div
        className={twMerge(
          'p-3 border',
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
          'rounded-lg'
        )}
      >
        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-3">
          {/* Seletor de Workspace */}
          <div className="w-full xl:w-auto xl:min-w-[280px]">
            <label className={twMerge(
              'text-xs font-medium mb-1 block xl:hidden',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}>
              🏢 Workspace
            </label>
            <select
              value={selectedWorkspaceId}
              onChange={(e) => handleWorkspaceChange(e.target.value)}
              disabled={loadingWorkspaces}
              className={twMerge(
                'w-full px-3 py-2 rounded-lg border transition-colors text-sm',
                'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-800'
                  : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-100',
                loadingWorkspaces && 'cursor-wait'
              )}
            >
              {loadingWorkspaces ? (
                <option>Carregando...</option>
              ) : workspaces.length === 0 ? (
                <option>Sem workspaces</option>
              ) : (
                workspaces.map((workspace) => (
                  <option key={workspace.id} value={workspace.id}>
                    🏢 {workspace.name} {workspace.isCurrent ? '★' : ''}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Seletor de Dashboard */}
          <div className="w-full xl:w-auto xl:min-w-[240px] xl:max-w-[320px]">
            <label className={twMerge(
              'text-xs font-medium mb-1 block xl:hidden',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}>
              📊 Dashboard
            </label>
            <select
              value={selectedReport || ''}
              onChange={(e) => setSelectedReport(e.target.value)}
              disabled={loadingReports || reports.length === 0}
              className={twMerge(
                'w-full px-3 py-2 rounded-lg border transition-colors text-sm',
                'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-800'
                  : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-100',
                (loadingReports || reports.length === 0) && 'cursor-wait'
              )}
            >
              {loadingReports ? (
                <option>Carregando...</option>
              ) : reports.length === 0 ? (
                <option>Sem dashboards</option>
              ) : (
                reports.map((report) => (
                  <option key={report.id} value={report.id}>
                    📊 {report.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Info de Atualização */}
          {selectedReportData?.lastRefreshTime && (() => {
            const date = new Date(selectedReportData.lastRefreshTime)
            const formattedDate = date.toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })
            return (
              <div className={twMerge(
                'hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm whitespace-nowrap',
                isDark 
                  ? 'bg-blue-900/20 border-blue-700 text-blue-300' 
                  : 'bg-blue-50 border-blue-200 text-blue-700'
              )}>
                <span className="text-xs opacity-75">Atualizado:</span>
                <span className="font-semibold">{formattedDate}</span>
              </div>
            )
          })()}

          {/* Espaçador para empurrar botões para a direita */}
          <div className="hidden xl:flex flex-1" />

          {/* Botões de Ação - Alinhados à direita */}
          <div className="flex items-center gap-2 w-full xl:w-auto xl:ml-auto">
            {/* Botão Atualizar */}
            <button
              onClick={() => loadReports(selectedWorkspaceId)}
              disabled={loadingReports}
              className={twMerge(
                'p-2 rounded-lg border transition-all flex items-center justify-center shrink-0',
                'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                isDark
                  ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white disabled:bg-gray-800'
                  : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700 disabled:bg-gray-100',
                loadingReports && 'cursor-wait'
              )}
              title="Atualizar relatórios"
            >
              <RefreshCw className={twMerge('w-4 h-4', loadingReports && 'animate-spin')} />
            </button>

            {/* Botão Ver Usuários */}
            <button
              onClick={() => setShowUsersModal(true)}
              className={twMerge(
                'p-2 rounded-lg border transition-all flex items-center justify-center shrink-0',
                'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                isDark
                  ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white'
                  : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
              )}
              title="Ver usuários do workspace"
            >
              <Users className="w-4 h-4" />
            </button>

            {/* Botão Tela Cheia */}
            <button
              onClick={toggleFullscreen}
              disabled={!selectedReport}
              className={twMerge(
                'p-2 rounded-lg border transition-all flex items-center justify-center shrink-0',
                'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                isDark
                  ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white disabled:bg-gray-800'
                  : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700 disabled:bg-gray-100'
              )}
              title={isFullscreen ? 'Sair da tela cheia (ESC)' : 'Expandir para tela cheia'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading de Relatórios */}
      {loadingReports && (
        <div className={twMerge(
          'p-8 rounded-lg border text-center',
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        )}>
          <RefreshCw className={twMerge(
            'h-12 w-12 mx-auto mb-4 animate-spin',
            isDark ? 'text-gray-500' : 'text-gray-400'
          )} />
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Carregando dashboards do workspace...
          </p>
        </div>
      )}

      {/* Nenhum Relatório Encontrado */}
      {!loadingReports && reports.length === 0 && (
        <div className={twMerge(
          'p-8 rounded-lg border text-center',
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        )}>
          <AlertCircle className={twMerge(
            'h-12 w-12 mx-auto mb-4',
            isDark ? 'text-gray-500' : 'text-gray-400'
          )} />
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Nenhum dashboard encontrado neste workspace
          </p>
        </div>
      )}

      {/* Exibição do Relatório */}
      {selectedReport && (
        <div
          className={twMerge(
            'overflow-hidden',
            isFullscreen ? 'rounded-lg border' : 'rounded-lg border',
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          )}
          style={{ 
            height: isFullscreen ? 'calc(100vh - 150px)' : 'calc(100vh - 400px)', 
            minHeight: isFullscreen ? '800px' : '600px',
            width: '100%'
          }}
        >
          <PowerBIReport
            reportId={selectedReport}
            workspaceId={selectedWorkspaceId}
            key={`${selectedWorkspaceId}-${selectedReport}`}
          />
        </div>
      )}

      {/* Nenhum Relatório */}
      {reports.length === 0 && (
        <div
          className={twMerge(
            'p-8 rounded-lg border text-center',
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          )}
        >
          <AlertCircle
            className={twMerge(
              'h-12 w-12 mx-auto mb-4',
              isDark ? 'text-gray-500' : 'text-gray-400'
            )}
          />
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Nenhum relatório encontrado
          </p>
        </div>
      )}

      {/* Modal de Usuários do Workspace */}
      <WorkspaceUsersModal
        isOpen={showUsersModal}
        onClose={() => setShowUsersModal(false)}
      />
    </div>
  )
}
