'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { format, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Loader2, Filter, RefreshCw, X, Users, Clock } from 'lucide-react'
import { IStopwatchTodayHub, IPatients, HistoryQTStopWatchH, SetorKey, IDurationPatients, StopWatchHcancel, IPatientsAgendados } from '@/types/stopwatch'
import { RealTimeCards } from './RealTimeCards'
import { InsignDaily } from './InsignDaily'
import { WaitingPatients } from './WaitingPatients'
import { HistoryTable } from './HistoryTable'
import { cn } from '@/lib/utils'

interface ContentStopwatchHProps {
  hubData: IStopwatchTodayHub | null
  isConnected: boolean
  tab?: 'realtime' | 'history'
  onTabChange?: (tab: 'realtime' | 'history') => void
}

const SETOR_LABELS: Record<SetorKey | 'all', string> = {
  all: 'Todos',
  acolhimento: 'Acolhimento',
  recepcao: 'Recepção',
  triagem: 'Triagem',
  farmacia_satelite: 'Farmácia Satélite',
  farmacia_producao: 'Farmácia Produção',
  acomodacao: 'Acomodação',
  pre_tratamento: 'Pré-Tratamento',
  tratamento: 'Tratamento',
}

type DetailView = 'patients' | 'agendados' | 'checkins' | 'altas' | 'cancelados' | null

function getSetorData(hubData: IStopwatchTodayHub, key: SetorKey) {
  const map: Record<SetorKey, () => { count: number; percent: { positive: number; negative: number }; patients: IPatients[] }> = {
    acolhimento: () => hubData.acolhimento,
    recepcao: () => hubData.recepcao,
    triagem: () => hubData.triagem,
    farmacia_satelite: () => hubData.farmacia.satelite,
    farmacia_producao: () => hubData.farmacia.producao,
    acomodacao: () => hubData.acomodacao,
    pre_tratamento: () => hubData.pre_Tratamento,
    tratamento: () => hubData.tratamento,
  }
  return map[key]()
}

export function ContentStopwatchH({ hubData, isConnected, tab: externalTab, onTabChange }: ContentStopwatchHProps) {
  const [setorFilter, setSetorFilter] = useState<SetorKey | 'all'>('all')
  const [margemFilter, setMargemFilter] = useState<'P' | 'N' | 'all'>('all')
  const [detailView, setDetailView] = useState<DetailView>(null)
  const [dateStart, setDateStart] = useState(format(subDays(new Date(), 0), 'yyyy-MM-dd'))
  const [dateEnd, setDateEnd] = useState('')
  const [includeAltas, setIncludeAltas] = useState(false)
  const [includeCancelados, setIncludeCancelados] = useState(false)
  const [history, setHistory] = useState<HistoryQTStopWatchH[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [internalTab, setInternalTab] = useState<'realtime' | 'history'>('realtime')
  const tab = externalTab ?? internalTab
  const setTab = useCallback((t: 'realtime' | 'history') => {
    setInternalTab(t)
    onTabChange?.(t)
  }, [onTabChange])

  // Sync external tab
  useEffect(() => {
    if (externalTab) setInternalTab(externalTab)
  }, [externalTab])

  // Show patients panel when setor + margem filter is active
  useEffect(() => {
    if (setorFilter !== 'all' && margemFilter !== 'all') {
      setDetailView('patients')
    } else if (setorFilter !== 'all' && margemFilter === 'all') {
      setDetailView('patients')
    }
  }, [setorFilter, margemFilter])

  // Get filtered patients
  const filteredPatients = useMemo(() => {
    if (!hubData || setorFilter === 'all') return []
    const setor = getSetorData(hubData, setorFilter)
    if (margemFilter === 'all') return setor.patients
    return setor.patients.filter(p => p.margem === margemFilter)
  }, [hubData, setorFilter, margemFilter])

  // All waiting patients (concatenated from all sectors, or filtered by setor/margem)
  const waitingPatients = useMemo(() => {
    if (!hubData) return []
    if (setorFilter !== 'all') return filteredPatients
    const all = [
      ...hubData.acolhimento.patients,
      ...hubData.recepcao.patients,
      ...hubData.triagem.patients,
      ...hubData.farmacia.satelite.patients,
      ...hubData.farmacia.producao.patients,
      ...hubData.acomodacao.patients,
      ...hubData.pre_Tratamento.patients,
      ...hubData.tratamento.patients,
    ]
    // Deduplicate by nR_SEQ_PACIENTE
    const seen = new Set<number>()
    const unique = all.filter(p => {
      if (seen.has(p.nR_SEQ_PACIENTE)) return false
      seen.add(p.nR_SEQ_PACIENTE)
      return true
    })
    if (margemFilter === 'all') return unique
    return unique.filter(p => p.margem === margemFilter)
  }, [hubData, setorFilter, margemFilter, filteredPatients])

  const handleSetorChange = useCallback((setor: SetorKey | 'all') => {
    setSetorFilter(setor)
    if (setor === 'all') {
      setDetailView(null)
      setMargemFilter('all')
    }
  }, [])

  const handleMargemChange = useCallback((margem: 'P' | 'N' | 'all') => {
    setMargemFilter(margem)
    if (margem === 'all' && setorFilter === 'all') {
      setDetailView(null)
    }
  }, [setorFilter])

  const handleSummaryClick = useCallback((view: DetailView) => {
    setDetailView(prev => prev === view ? null : view)
    if (view !== 'patients') {
      setSetorFilter('all')
      setMargemFilter('all')
    }
  }, [])

  const closeDetail = useCallback(() => {
    setDetailView(null)
    setSetorFilter('all')
    setMargemFilter('all')
  }, [])

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true)
    try {
      const params = new URLSearchParams({ date: dateStart, altaAtendimento: String(includeAltas) })
      if (dateEnd) params.append('endDate', dateEnd)
      if (includeCancelados) params.append('atendimentosCancelados', 'true')
      const res = await fetch(`/api/stopwatch/history?${params}`)
      if (res.ok) {
        const data = await res.json()
        setHistory(Array.isArray(data) ? data : data.result ?? [])
      }
    } finally {
      setLoadingHistory(false)
    }
  }, [dateStart, dateEnd, includeAltas, includeCancelados])

  useEffect(() => {
    if (tab === 'history') fetchHistory()
  }, [tab, fetchHistory])

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/50 w-fit">
        {(['realtime', 'history'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
              tab === t
                ? 'bg-white dark:bg-blue-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            {t === 'realtime' ? 'Tempo Real' : 'Histórico'}
          </button>
        ))}
      </div>

      {tab === 'realtime' && (
        <>
          {/* Margem filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Margem:</span>
            {(['all', 'P', 'N'] as const).map(m => (
              <button
                key={m}
                onClick={() => handleMargemChange(m)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium transition-all border',
                  margemFilter === m
                    ? m === 'N' ? 'bg-red-50 dark:bg-red-500/20 border-red-400 dark:border-red-500 text-red-600 dark:text-red-400'
                      : m === 'P' ? 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-400 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'bg-blue-50 dark:bg-blue-500/20 border-blue-400 dark:border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
                )}
              >
                {m === 'all' ? 'Todos' : m === 'P' ? 'No prazo' : 'Atrasados'}
              </button>
            ))}
            {setorFilter !== 'all' && (
              <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-300 dark:border-blue-500/30 px-3 py-1 rounded-full">
                {SETOR_LABELS[setorFilter]}
                <button onClick={() => handleSetorChange('all')} className="ml-1 hover:text-blue-800 dark:hover:text-white">×</button>
              </span>
            )}
          </div>

          {/* Real-time content */}
          {!isConnected ? (
            <div className="flex items-center justify-center h-40 rounded-xl border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/30">
              <div className="text-center space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Conectando ao hub...</p>
              </div>
            </div>
          ) : !hubData ? (
            <div className="flex items-center justify-center h-40 rounded-xl border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/30">
              <p className="text-sm text-gray-500 dark:text-gray-400">Aguardando dados em tempo real...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <RealTimeCards
                hubData={hubData}
                setorFilter={setorFilter}
                margemFilter={margemFilter}
                onSetorChange={handleSetorChange}
                onMargemChange={handleMargemChange}
                onSummaryClick={handleSummaryClick}
              />

              {/* Detail panel: patients by setor + margem */}
              {detailView === 'patients' && setorFilter !== 'all' && (
                <PatientsPanel
                  patients={filteredPatients}
                  title={`${SETOR_LABELS[setorFilter]} — ${margemFilter === 'P' ? 'No prazo' : margemFilter === 'N' ? 'Atrasados' : 'Todos'}`}
                  onClose={closeDetail}
                />
              )}

              {/* Detail panel: agendados */}
              {detailView === 'agendados' && (
                <AgendadosPanel
                  agendados={hubData.agendados.listAgendaQuimioterapia}
                  onClose={() => setDetailView(null)}
                />
              )}

              {/* Detail panel: check-ins */}
              {detailView === 'checkins' && (
                <CheckinsPanel
                  patients={hubData.durationPatients.patients}
                  onClose={() => setDetailView(null)}
                />
              )}

              {/* Detail panel: altas */}
              {detailView === 'altas' && (
                <AltasPanel
                  patients={hubData.durationPatients.patients?.filter(p => !!p.dT_ALTA) ?? []}
                  onClose={() => setDetailView(null)}
                />
              )}

              {/* Detail panel: cancelados */}
              {detailView === 'cancelados' && (
                <CanceladosPanel
                  cancelados={hubData.stopWatchHCancel}
                  onClose={() => setDetailView(null)}
                />
              )}

              {/* Waiting patients list */}
              <WaitingPatients patients={waitingPatients} setorFilter={setorFilter} />

              <InsignDaily hubData={hubData} />
            </div>
          )}
        </>
      )}

      {tab === 'history' && (
        <div className="space-y-4">
          {/* History filters */}
          <div className="flex flex-wrap items-end gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/40">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Data início</label>
              <input
                type="date"
                value={dateStart}
                onChange={e => setDateStart(e.target.value)}
                className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Data fim (opcional)</label>
              <input
                type="date"
                value={dateEnd}
                onChange={e => setDateEnd(e.target.value)}
                className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeAltas}
                onChange={e => setIncludeAltas(e.target.checked)}
                className="rounded accent-blue-500"
              />
              Com alta
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCancelados}
                onChange={e => setIncludeCancelados(e.target.checked)}
                className="rounded accent-blue-500"
              />
              Cancelados
            </label>
            <button
              onClick={fetchHistory}
              disabled={loadingHistory}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm text-white transition-colors disabled:opacity-50"
            >
              {loadingHistory ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Buscar
            </button>
          </div>

          {/* InsignDaily chart with history */}
          <InsignDaily history={history} />

          {/* History table */}
          <HistoryTable history={history} loading={loadingHistory} />
        </div>
      )}
    </div>
  )
}

/* ─── Detail Panels ─── */

function DetailPanelWrapper({ title, count, onClose, children }: { title: string; count: number; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-[#1b2030] overflow-hidden shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/40">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
          <span className="text-xs bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
            {count}
          </span>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      {children}
    </div>
  )
}

function PatientsPanel({ patients, title, onClose }: { patients: IPatients[]; title: string; onClose: () => void }) {
  return (
    <DetailPanelWrapper title={title} count={patients.length} onClose={onClose}>
      {patients.length === 0 ? (
        <div className="flex items-center justify-center h-24">
          <p className="text-sm text-gray-400 dark:text-gray-500">Nenhum paciente encontrado</p>
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0">
              <tr className="border-b border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/60">
                {['Paciente', 'Protocolo', 'Margem', 'AC→RE', 'RE→TR', 'TR→Acom', 'Fa.Sat', 'Farmácia', 'Enf→TT', 'Local'].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patients.map((p, i) => (
                <tr key={p.nR_SEQ_PACIENTE || i} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                  <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 max-w-[160px] truncate font-medium">{p.paciente}</td>
                  <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">{p.protocolo}</td>
                  <td className="px-3 py-2">
                    <span className={cn(
                      'inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold',
                      p.margem === 'P'
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                        : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                    )}>
                      {p.margem === 'P' ? 'OK' : 'ATRASO'}
                    </span>
                  </td>
                  <td className="px-3 py-2"><MinCell val={p.interV_AC_RE} /></td>
                  <td className="px-3 py-2"><MinCell val={p.interV_RE_TR} /></td>
                  <td className="px-3 py-2"><MinCell val={p.interV_TR_I_AC} /></td>
                  <td className="px-3 py-2"><MinCell val={p.interV_FA_SAT_TT} /></td>
                  <td className="px-3 py-2"><MinCell val={p.interV_FA_TT} /></td>
                  <td className="px-3 py-2"><MinCell val={p.interV_ENF_TT} /></td>
                  <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 max-w-[100px] truncate">{p.dS_LOCAL || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DetailPanelWrapper>
  )
}

function AgendadosPanel({ agendados, onClose }: { agendados: IPatientsAgendados[]; onClose: () => void }) {
  return (
    <DetailPanelWrapper title="Agendados" count={agendados.length} onClose={onClose}>
      {agendados.length === 0 ? (
        <div className="flex items-center justify-center h-24">
          <p className="text-sm text-gray-400 dark:text-gray-500">Nenhum agendamento</p>
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0">
              <tr className="border-b border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/60">
                {['Paciente', 'Setor', 'Data Agenda', 'Confirmação'].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agendados.map((a, i) => (
                <tr key={a.nR_SEQUENCIA || i} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                  <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 font-medium">{a.paciente}</td>
                  <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">{a.dS_ABREV || '—'}</td>
                  <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    {a.dT_AGENDA ? format(new Date(a.dT_AGENDA), 'HH:mm', { locale: ptBR }) : '—'}
                  </td>
                  <td className="px-3 py-2 text-sm">
                    {a.dT_CONFIRMACAO ? (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {format(new Date(a.dT_CONFIRMACAO), 'HH:mm', { locale: ptBR })}
                      </span>
                    ) : (
                      <span className="text-gray-400">Pendente</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DetailPanelWrapper>
  )
}

function AltasPanel({ patients, onClose }: { patients: IDurationPatients[]; onClose: () => void }) {
  return (
    <DetailPanelWrapper title="Altas" count={patients.length} onClose={onClose}>
      {patients.length === 0 ? (
        <div className="flex items-center justify-center h-24">
          <p className="text-sm text-gray-400 dark:text-gray-500">Nenhuma alta registrada</p>
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0">
              <tr className="border-b border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/60">
                {['Paciente', 'Protocolo', 'Acolhimento', 'Alta', 'Duração'].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patients.map((p, i) => (
                <tr key={p.nR_SEQ_PACIENTE || i} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                  <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 font-medium">{p.paciente}</td>
                  <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">{p.protocolo}</td>
                  <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    {p.dT_ACOLHIMENTO ? format(new Date(p.dT_ACOLHIMENTO), 'HH:mm', { locale: ptBR }) : '—'}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    {p.dT_ALTA ? format(new Date(p.dT_ALTA), 'HH:mm', { locale: ptBR }) : '—'}
                  </td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-1 text-sm font-mono">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className={cn(p.duration > 240 ? 'text-red-500' : 'text-emerald-500')}>
                        {p.duration}m
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DetailPanelWrapper>
  )
}

function CanceladosPanel({ cancelados, onClose }: { cancelados: StopWatchHcancel[]; onClose: () => void }) {
  return (
    <DetailPanelWrapper title="Cancelados" count={cancelados.length} onClose={onClose}>
      {cancelados.length === 0 ? (
        <div className="flex items-center justify-center h-24">
          <p className="text-sm text-gray-400 dark:text-gray-500">Nenhum cancelamento</p>
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0">
              <tr className="border-b border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/60">
                {['Paciente', 'Atendimento', 'Entrada', 'Cancelamento', 'Motivo', 'Responsável'].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cancelados.map((c, i) => (
                <tr key={c.nR_ATENDIMENTO || i} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                  <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 font-medium">{c.nM_PESSOA_FISICA}</td>
                  <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">{c.nR_ATENDIMENTO}</td>
                  <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    {c.dT_ENTRADA ? format(new Date(c.dT_ENTRADA), 'HH:mm', { locale: ptBR }) : '—'}
                  </td>
                  <td className="px-3 py-2 text-sm text-red-600 dark:text-red-400">
                    {c.dT_CANCELAMENTO ? format(new Date(c.dT_CANCELAMENTO), 'HH:mm', { locale: ptBR }) : '—'}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 max-w-[200px] truncate">{c.dS_MOTIVO_CANCEL || '—'}</td>
                  <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">{c.nM_USUARIO_CANCELAMENTO || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DetailPanelWrapper>
  )
}

function CheckinsPanel({ patients, onClose }: { patients: IDurationPatients[]; onClose: () => void }) {
  return (
    <DetailPanelWrapper title="Check-in" count={patients.length} onClose={onClose}>
      {patients.length === 0 ? (
        <div className="flex items-center justify-center h-24">
          <p className="text-sm text-gray-400 dark:text-gray-500">Nenhum check-in registrado</p>
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0">
              <tr className="border-b border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/60">
                {['Paciente', 'Protocolo', 'Acolhimento', 'Alta', 'Duração'].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patients.map((p, i) => (
                <tr key={p.nR_SEQ_PACIENTE || i} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                  <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 font-medium">{p.paciente}</td>
                  <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">{p.protocolo}</td>
                  <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    {p.dT_ACOLHIMENTO ? format(new Date(p.dT_ACOLHIMENTO), 'HH:mm', { locale: ptBR }) : '—'}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    {p.dT_ALTA ? format(new Date(p.dT_ALTA), 'HH:mm', { locale: ptBR }) : '—'}
                  </td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-1 text-sm font-mono">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className={cn(p.duration > 240 ? 'text-red-500' : 'text-emerald-500')}>
                        {p.duration}m
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DetailPanelWrapper>
  )
}

function MinCell({ val }: { val: number }) {
  if (!val || val <= 0) return <span className="text-gray-400 dark:text-gray-600">—</span>
  return <span className={cn('font-mono text-xs', val > 30 ? 'text-red-500 dark:text-red-400' : 'text-emerald-500 dark:text-emerald-400')}>{val}m</span>
}
