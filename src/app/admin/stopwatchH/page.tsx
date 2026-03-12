'use client'

import React, { useState } from 'react'
import { Timer, Wifi, WifiOff, AlertTriangle, Monitor, CalendarDays, Settings, Home, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useStopwatchHub } from '@/hooks/useStopwatchHub'
import { ContentStopwatchH } from '@/components/stopwatch/ContentStopwatchH'
import { AlertNotification } from '@/components/stopwatch/AlertNotification'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const STATUS_LABEL: Record<string, string> = {
  connected: 'Conectado',
  connecting: 'Conectando...',
  disconnected: 'Desconectado',
  error: 'Erro de conexão',
}

const DEFAULT_METRICS: Record<string, { label: string; value: number }> = {
  AC_RE: { label: 'Acolhimento → Recepção', value: 10 },
  RE_TR: { label: 'Recepção → Triagem', value: 15 },
  TR_ACM: { label: 'Triagem → Acomodação', value: 10 },
  FA_SAT_TT: { label: 'Farmácia Satélite → TT', value: 30 },
  FA_TT: { label: 'Farmácia Produção → TT', value: 30 },
  PE_TT: { label: 'Posto de enfermagem → TT', value: 20 },
}

export default function StopwatchHPage() {
  const { hubData, status, hasDelays } = useStopwatchHub()
  const { user } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<'realtime' | 'history'>('realtime')
  const [showSettings, setShowSettings] = useState(false)
  const [metrics, setMetrics] = useState<Record<string, number>>(() =>
    Object.fromEntries(Object.entries(DEFAULT_METRICS).map(([k, v]) => [k, v.value]))
  )

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

  return (
    <div className="min-h-screen p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20">
            <Timer className="w-6 h-6 text-orange-500 dark:text-orange-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Stopwatch Hospitalar</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Cronometragem de processos e atendimentos</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toolbar icons */}
          <div className="flex items-center gap-1 mr-2">
            <ToolbarButton icon={Monitor} tooltip="Tela cheia" onClick={toggleFullscreen} />
            <ToolbarButton
              icon={CalendarDays}
              tooltip="Histórico"
              active={tab === 'history'}
              onClick={() => setTab(tab === 'history' ? 'realtime' : 'history')}
            />
            <ToolbarButton
              icon={Settings}
              tooltip="Configurações de limiares"
              active={showSettings}
              onClick={() => setShowSettings(s => !s)}
            />
            <ToolbarButton icon={Home} tooltip="Dashboard" onClick={() => router.push('/admin/dashboard')} />
          </div>

          {/* Delay warning */}
          {hasDelays && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              Atrasos detectados
            </div>
          )}

          {/* Alert notification bell */}
          {user?.tipoUsuario && <AlertNotification setor={user.tipoUsuario} userId={String(user.id)} />}

          {/* Connection status */}
          <div
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border',
              status === 'connected'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : status === 'connecting'
                  ? 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-300 dark:border-yellow-500/30 text-yellow-600 dark:text-yellow-400'
                  : 'bg-red-50 dark:bg-red-500/10 border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400'
            )}
          >
            {status === 'connected'
              ? <Wifi className="w-3.5 h-3.5" />
              : <WifiOff className="w-3.5 h-3.5" />
            }
            {STATUS_LABEL[status]}
          </div>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-[#1b2030] p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Configurações de Limiares</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tempo máximo (minutos) antes de considerar atraso</p>
            </div>
            <button onClick={() => setShowSettings(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(DEFAULT_METRICS).map(([key, def]) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">{def.label}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={metrics[key]}
                    onChange={e => setMetrics(prev => ({ ...prev, [key]: parseInt(e.target.value) || def.value }))}
                    className="w-20 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-xs text-gray-400">min</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <ContentStopwatchH
        hubData={hubData}
        isConnected={status === 'connected'}
        tab={tab}
        onTabChange={setTab}
      />
    </div>
  )
}

function ToolbarButton({
  icon: Icon,
  tooltip,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  tooltip: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={cn(
        'p-2 rounded-lg transition-colors',
        active
          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50',
      )}
    >
      <Icon className="w-5 h-5" />
    </button>
  )
}
