'use client'

import React from 'react'
import { IStopwatchTodayHub, ISetor, SetorKey } from '@/types/stopwatch'
import { cn } from '@/lib/utils'
import {
  Users,
  ClipboardList,
  Stethoscope,
  Pill,
  FlaskConical,
  BedDouble,
  Activity,
  XCircle,
  CalendarCheck,
  LogOut,
} from 'lucide-react'

interface RealTimeCardsProps {
  hubData: IStopwatchTodayHub
  setorFilter: SetorKey | 'all'
  margemFilter: 'P' | 'N' | 'all'
  onSetorChange: (setor: SetorKey | 'all') => void
  onMargemChange: (margem: 'P' | 'N' | 'all') => void
  onSummaryClick?: (view: 'agendados' | 'checkins' | 'altas' | 'cancelados') => void
}

interface SetorCardConfig {
  key: SetorKey
  label: string
  icon: React.ComponentType<{ className?: string }>
  getSetor: (data: IStopwatchTodayHub) => ISetor
}

const SETORES: SetorCardConfig[] = [
  { key: 'acolhimento', label: 'Acolhimento', icon: Users, getSetor: d => d.acolhimento },
  { key: 'recepcao', label: 'Recepção', icon: ClipboardList, getSetor: d => d.recepcao },
  { key: 'triagem', label: 'Triagem', icon: Stethoscope, getSetor: d => d.triagem },
  { key: 'farmacia_satelite', label: 'Fa. Satélite', icon: Pill, getSetor: d => d.farmacia.satelite },
  { key: 'farmacia_producao', label: 'Fa. Produção', icon: FlaskConical, getSetor: d => d.farmacia.producao },
  { key: 'acomodacao', label: 'Acomodação', icon: BedDouble, getSetor: d => d.acomodacao },
  { key: 'pre_tratamento', label: 'Pré-Tratamento', icon: Activity, getSetor: d => d.pre_Tratamento },
  { key: 'tratamento', label: 'Tratamento', icon: Activity, getSetor: d => d.tratamento },
]

export function RealTimeCards({ hubData, setorFilter, margemFilter, onSetorChange, onMargemChange, onSummaryClick }: RealTimeCardsProps) {
  const agendados = hubData.agendados.count
  const checkins = hubData.durationPatients.count
  const altas = hubData.durationPatients.patients?.filter(p => !!p.dT_ALTA)?.length ?? 0
  const cancelados = hubData.stopWatchHCancel.length

  return (
    <div className="space-y-4">
      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard
          label="Agendados"
          secondLabel="Check-in"
          value={agendados}
          secondValue={checkins}
          icon={CalendarCheck}
          secondIcon={Users}
          colorClass="text-blue-600 dark:text-blue-400"
          secondColorClass="text-emerald-600 dark:text-emerald-400"
          bgClass="bg-blue-50 dark:bg-blue-500/10"
          borderClass="border-blue-200 dark:border-blue-500/30"
          onClick={() => onSummaryClick?.('agendados')}
          onSecondClick={() => onSummaryClick?.('checkins')}
        />
        <SummaryCard label="Altas" value={altas} icon={LogOut} colorClass="text-violet-600 dark:text-violet-400" bgClass="bg-violet-50 dark:bg-violet-500/10" borderClass="border-violet-200 dark:border-violet-500/30" onClick={() => onSummaryClick?.('altas')} />
        <SummaryCard label="Cancelados" value={cancelados} icon={XCircle} colorClass="text-red-600 dark:text-red-400" bgClass="bg-red-50 dark:bg-red-500/10" borderClass="border-red-200 dark:border-red-500/30" onClick={() => onSummaryClick?.('cancelados')} />
      </div>

      {/* Sector cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SETORES.map(cfg => {
          const setor = cfg.getSetor(hubData)
          const isActive = setorFilter === cfg.key
          const hasDelay = setor.percent.negative > 0
          const Icon = cfg.icon
          return (
            <button
              key={cfg.key}
              onClick={() => onSetorChange(isActive ? 'all' : cfg.key)}
              className={cn(
                'relative flex flex-col p-4 rounded-xl border text-left transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5',
                'bg-white dark:bg-[#1b2030]',
                isActive
                  ? 'border-blue-500 dark:border-blue-400 ring-1 ring-blue-500 dark:ring-blue-400 bg-blue-50/50 dark:bg-blue-500/10'
                  : hasDelay
                    ? 'border-red-300 dark:border-red-500/40'
                    : 'border-gray-200 dark:border-gray-700/40',
              )}
            >
              {/* Delay indicator */}
              {hasDelay && (
                <span className="absolute top-3 right-3 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
              )}

              {/* Title */}
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
                Total em {cfg.label}
              </span>

              {/* Icon + count + circles row */}
              <div className="flex items-center justify-between w-full">
                {/* Left: icon + count */}
                <div className="flex items-center gap-2.5">
                  <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <span className="text-3xl font-bold text-gray-900 dark:text-white leading-none">
                    {setor.count}
                  </span>
                </div>

                {/* Right: green/red circles (clickable) */}
                <div className="flex flex-col gap-1.5">
                  <span
                    role="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSetorChange(cfg.key)
                      onMargemChange(margemFilter === 'P' && setorFilter === cfg.key ? 'all' : 'P')
                    }}
                    className={cn(
                      'inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-all hover:scale-110 hover:ring-2 hover:ring-emerald-300',
                      setorFilter === cfg.key && margemFilter === 'P' && 'ring-2 ring-emerald-300 scale-110',
                    )}
                  >
                    {setor.percent.positive}
                  </span>
                  <span
                    role="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSetorChange(cfg.key)
                      onMargemChange(margemFilter === 'N' && setorFilter === cfg.key ? 'all' : 'N')
                    }}
                    className={cn(
                      'inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-800 dark:bg-red-900 text-white text-xs font-bold cursor-pointer transition-all hover:scale-110 hover:ring-2 hover:ring-red-400',
                      setorFilter === cfg.key && margemFilter === 'N' && 'ring-2 ring-red-400 scale-110',
                    )}
                  >
                    {setor.percent.negative}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SummaryCard({
  label,
  secondLabel,
  value,
  secondValue,
  icon: Icon,
  secondIcon: SecondIcon,
  colorClass,
  secondColorClass,
  bgClass,
  borderClass,
  onClick,
  onSecondClick,
}: {
  label: string
  secondLabel?: string
  value: number
  secondValue?: number
  icon: React.ComponentType<{ className?: string }>
  secondIcon?: React.ComponentType<{ className?: string }>
  colorClass: string
  secondColorClass?: string
  bgClass: string
  borderClass: string
  onClick?: () => void
  onSecondClick?: () => void
}) {
  // Card combinado (Agendados x Check-in)
  if (secondLabel !== undefined && SecondIcon) {
    return (
      <div
        className={cn(
          'flex items-center justify-between px-4 py-3.5 rounded-xl border shadow-sm',
          'bg-white dark:bg-[#1b2030]',
          borderClass,
        )}
      >
        {/* Agendados */}
        <div
          role="button"
          onClick={onClick}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', bgClass)}>
            <Icon className={cn('w-5 h-5', colorClass)} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
          </div>
        </div>

        {/* Separador */}
        <div className="text-lg font-light text-gray-300 dark:text-gray-600 mx-2">×</div>

        {/* Check-in */}
        <div
          role="button"
          onClick={onSecondClick}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-emerald-50 dark:bg-emerald-500/10">
            <SecondIcon className={cn('w-5 h-5', secondColorClass)} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{secondValue ?? 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{secondLabel}</p>
          </div>
        </div>
      </div>
    )
  }

  // Card simples
  return (
    <div
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-3.5 rounded-xl border shadow-sm',
        'bg-white dark:bg-[#1b2030]',
        borderClass,
        onClick && 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all',
      )}>
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', bgClass)}>
        <Icon className={cn('w-5 h-5', colorClass)} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
      </div>
    </div>
  )
}
