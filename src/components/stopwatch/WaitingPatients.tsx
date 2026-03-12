'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronDown, ChevronLeft, ChevronRight, Clock, User, FileWarning, Bell, X, ArrowLeft, Loader2, Send } from 'lucide-react'
import { IPatients, SetorKey } from '@/types/stopwatch'
import { cn } from '@/lib/utils'

interface WaitingPatientsProps {
  patients: IPatients[]
  setorFilter: SetorKey | 'all'
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

const DELAY_SECTORS = [
  { id: 'recepcao', label: 'Recepção', field: 're' },
  { id: 'triagem', label: 'Triagem', field: 'tr' },
  { id: 'farmacia_satelite', label: 'Farmácia Satélite', field: 'faSat' },
  { id: 'farmacia_producao', label: 'Farmácia Produção', field: 'fa' },
  { id: 'pre_tratamento', label: 'Pré-Tratamento', field: 'preTT' },
  { id: 'tratamento', label: 'Tratamento', field: 'tt' },
] as const

const ROWS_OPTIONS = [5, 10, 25, -1] as const

interface ReasonDelayTemplate {
  id: number
  title: string
  body: string
  re: boolean
  tr: boolean
  fa: boolean
  faSat: boolean
  preTT: boolean
  tt: boolean
}

function formatTime(dt: string | undefined | null): string {
  if (!dt) return '—'
  try {
    return format(new Date(dt), 'HH:mm:ss', { locale: ptBR })
  } catch {
    return '—'
  }
}

export function WaitingPatients({ patients, setorFilter }: WaitingPatientsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [modalPatient, setModalPatient] = useState<IPatients | null>(null)
  const [modalSetor, setModalSetor] = useState<string | null>(null)

  const totalPages = rowsPerPage === -1 ? 1 : Math.max(1, Math.ceil(patients.length / rowsPerPage))
  const paginatedPatients = rowsPerPage === -1
    ? patients
    : patients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  useEffect(() => { setPage(0) }, [patients.length])

  const handleToggle = (index: number) => {
    setExpandedIndex(prev => prev === index ? null : index)
  }

  const handleOpenModal = (patient: IPatients, setor: string) => {
    setModalPatient(patient)
    setModalSetor(setor)
  }

  return (
    <>
      <div className="rounded-xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-[#1b2030] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/40">
          <Clock className="w-4.5 h-4.5 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Pacientes em espera na clínica - Tempo real
          </span>
          {setorFilter !== 'all' && (
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full border border-blue-300 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
              {SETOR_LABELS[setorFilter]}
            </span>
          )}
        </div>

        {/* Patient list */}
        <div className="max-h-[400px] overflow-y-auto">
          {paginatedPatients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400 dark:text-gray-600" />
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-500">Nenhum paciente em espera</p>
            </div>
          ) : (
            paginatedPatients.map((patient, index) => {
              const isExpanded = expandedIndex === index
              const isPositive = patient.margem === 'P'

              return (
                <div key={patient.nR_SEQ_PACIENTE || index} className="border-b border-gray-100 dark:border-gray-800/50 last:border-b-0 my-3">
                  {/* Summary row */}
                  <button
                    onClick={() => handleToggle(index)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <span className="flex-1 text-left text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {patient.paciente}
                    </span>
                    <span
                      className={cn(
                        'px-3 py-1 rounded text-xs font-medium border border-dashed whitespace-nowrap',
                        isPositive
                          ? 'border-emerald-400 text-emerald-500 dark:text-emerald-400'
                          : 'border-red-400 text-red-500 dark:text-red-400'
                      )}
                    >
                      {isPositive ? 'Tempo Positivo' : 'Tempo Negativo'}
                    </span>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-gray-400 transition-transform flex-shrink-0',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="px-4 pt-5 pb-4 animate-in fade-in slide-in-from-top-1 duration-150">
                      {/* Timestamps grid - clickable sectors open modal */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-3">
                        <TimestampCell label="Acolhimento" time={formatTime(patient.dT_ACOLHIMENTO)} />
                        <TimestampCell
                          label="Recepção"
                          time={formatTime(patient.dT_CHEGADA)}
                          isDelay={patient.margeM_RE === 'N'}
                          onClick={patient.dT_CHEGADA ? () => handleOpenModal(patient, 'Recepção') : undefined}
                        />
                        <TimestampCell
                          label="Triagem"
                          time={formatTime(patient.dT_INICIO_TRIAGEM)}
                          isDelay={patient.margeM_TR === 'N'}
                          onClick={() => handleOpenModal(patient, 'Triagem')}
                        />
                        <TimestampCell
                          label="Acomodação"
                          time={formatTime(patient.dT_ACOMODACAO)}
                          isDelay={patient.margeM_TT === 'N'}
                          onClick={() => handleOpenModal(patient, 'Tratamento')}
                        />
                        <TimestampCell
                          label="Far. Satélite"
                          time={formatTime(patient.dT_RECEBIMENTO_FAR_SAT)}
                          isDelay={patient.margeM_FA_SAT_TT === 'N'}
                          onClick={() => handleOpenModal(patient, 'Farmácia Satélite')}
                        />
                        <TimestampCell
                          label="Farmácia"
                          time={formatTime(patient.dT_RECEBIMENTO_FAR_PROD)}
                          isDelay={patient.margeM_FA_TT === 'N'}
                          onClick={() => handleOpenModal(patient, 'Farmácia Produção')}
                        />
                        <TimestampCell label="Pré-Tratamento" time={formatTime(patient.dT_INICIO_PRE_TRATAMENTO)} />
                        <TimestampCell label="Início Tratamento" time={formatTime(patient.dT_INICIO_TRATAMENTO)} />
                        <TimestampCell label="Fim Tratamento" time={formatTime(patient.dT_FIM_TRATAMENTO)} />
                      </div>

                      {/* Intervals */}
                      <div className="rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/30 px-3 py-2 space-y-1">
                        <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Intervalos</p>
                        <IntervalRow label="Acolhimento → Recepção" value={patient.interV_AC_RE} />
                        <IntervalRow label="Recepção → Triagem" value={patient.interV_RE_TR} />
                        <IntervalRow label="Triagem → Acomodação" value={patient.interV_TR_I_AC} />
                        <IntervalRow label="Farmácia Satélite → Tratamento" value={patient.interV_FA_SAT_TT} />
                        <IntervalRow label="Farmácia → Tratamento" value={patient.interV_FA_TT} />
                        <IntervalRow label="Posto Enf. → Tratamento" value={patient.interV_ENF_TT} />
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Pagination */}
        {patients.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2.5 mt-2 border-t border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/40">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Itens por página</span>
              <select
                value={rowsPerPage}
                onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(0) }}
                className="text-xs bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-gray-700 dark:text-gray-300 focus:outline-none"
              >
                {ROWS_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt === -1 ? 'Tudo' : opt}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {rowsPerPage === -1
                  ? `1-${patients.length} de ${patients.length}`
                  : `${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, patients.length)} de ${patients.length}`
                }
              </span>
              <div className="flex gap-0.5">
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reason/Warning Modal */}
      {modalPatient && (
        <ReasonOrWarningModal
          patient={modalPatient}
          setor={modalSetor}
          onClose={() => { setModalPatient(null); setModalSetor(null) }}
        />
      )}
    </>
  )
}

/* ─── Timestamp Cell ─── */

function TimestampCell({ label, time, isDelay, onClick }: { label: string; time: string; isDelay?: boolean; onClick?: () => void }) {
  const Wrapper = onClick ? 'button' : 'div'
  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        'rounded-lg px-3 py-2 border text-left',
        isDelay
          ? 'bg-red-50/50 dark:bg-red-500/5 border-red-300 dark:border-red-500/30'
          : 'bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700/30',
        onClick && 'cursor-pointer hover:ring-1 hover:ring-blue-400 transition-all'
      )}
    >
      <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</p>
      <p className={cn(
        'text-sm font-mono font-medium',
        time === '—' ? 'text-gray-400 dark:text-gray-600' : isDelay ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'
      )}>
        {time}
      </p>
    </Wrapper>
  )
}

/* ─── Interval Row ─── */

function IntervalRow({ label, value }: { label: string; value: number }) {
  if (!value || value <= 0) return null
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className={cn(
        'text-xs font-mono font-semibold',
        value > 30 ? 'text-red-500 dark:text-red-400' : 'text-emerald-500 dark:text-emerald-400'
      )}>
        {value} min
      </span>
    </div>
  )
}

/* ─── Reason Or Warning Modal ─── */

type ModalView = 'choose' | 'reason' | 'warning'

function ReasonOrWarningModal({
  patient,
  setor,
  onClose,
}: {
  patient: IPatients
  setor: string | null
  onClose: () => void
}) {
  const [view, setView] = useState<ModalView>('choose')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-150" onClick={onClose}>
      <div className="bg-white dark:bg-[#1b2030] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700/50 w-full max-w-2xl mx-4 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center gap-2">
            {view !== 'choose' && (
              <button onClick={() => setView('choose')} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mr-1">
                <ArrowLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            )}
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {view === 'choose' ? 'Escolha uma opção' : view === 'reason' ? 'Motivo do Atraso' : 'Alertar Setor'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Patient info */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{patient.paciente}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Protocolo: {patient.protocolo} {setor && `• Setor: ${setor}`}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {view === 'choose' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setView('reason')}
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/5 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileWarning className="w-6 h-6 text-orange-500" />
                </div>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase">Motivo do Atraso</span>
              </button>
              <button
                onClick={() => setView('warning')}
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/5 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Bell className="w-6 h-6 text-blue-500" />
                </div>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase">Alertar Setor</span>
              </button>
            </div>
          )}

          {view === 'reason' && (
            <ReasonDelayForm patient={patient} preSelectedSetor={setor} onClose={onClose} />
          )}

          {view === 'warning' && (
            <WarningAlertForm patient={patient} preSelectedSetor={setor} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Reason Delay Form ─── */

function ReasonDelayForm({
  patient,
  preSelectedSetor,
  onClose,
}: {
  patient: IPatients
  preSelectedSetor: string | null
  onClose: () => void
}) {
  const [selectedSetor, setSelectedSetor] = useState(preSelectedSetor || '')
  const [templates, setTemplates] = useState<ReasonDelayTemplate[]>([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<{ userId: string; name: string } | null>(null)

  // Fetch user session + templates
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setUser({ userId: data.userId || '0', name: data.name || '' }) })
      .catch(() => {})

    fetch('/api/stopwatch/reason-delay?type=padrao')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setTemplates(data) })
      .catch(() => {})
  }, [])

  const sectorField = DELAY_SECTORS.find(s => s.label === selectedSetor)?.field || ''

  const handleTemplateSelect = (templateId: string) => {
    const tmpl = templates.find(t => t.id === parseInt(templateId))
    if (tmpl) {
      setTitle(tmpl.title)
      setBody(tmpl.body)
    }
  }

  // Group templates by sector for optgroup display
  const getTemplatesForSector = (field: string) => {
    return templates.filter(t => t[field as keyof ReasonDelayTemplate] === true)
  }

  const handleSubmit = async () => {
    if (!selectedSetor) { setError('Selecione o setor com atraso'); return }
    if (!title) { setError('Informe o motivo do atraso'); return }
    if (!body) { setError('Informe a descrição'); return }
    setError('')
    setLoading(true)

    const sectorBooleans: Record<string, boolean> = { re: false, tr: false, fa: false, faSat: false, preTT: false, tt: false }
    if (sectorField) sectorBooleans[sectorField] = true

    try {
      const res = await fetch('/api/stopwatch/reason-delay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cod_PF: user ? parseInt(user.userId) || 0 : 0,
          nr_sequencia: patient.nR_SEQ_PACIENTE,
          nomePF: user?.name || '',
          title,
          body,
          dt_registro: new Date().toISOString(),
          dt_atualizacao: new Date().toISOString(),
          ...sectorBooleans,
          defaultMsn: false,
        }),
      })
      if (res.ok) {
        onClose()
      } else {
        setError('Erro ao enviar motivo de atraso')
      }
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Sector select */}
        {!preSelectedSetor && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Setor *</label>
            <select
              value={selectedSetor}
              onChange={e => setSelectedSetor(e.target.value)}
              className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione</option>
              {DELAY_SECTORS.map(s => (
                <option key={s.id} value={s.label}>{s.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Template select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Motivos padrões</label>
          <select
            onChange={e => handleTemplateSelect(e.target.value)}
            className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione</option>
            {DELAY_SECTORS.map(sector => {
              const sectorTemplates = getTemplatesForSector(sector.field)
              if (sectorTemplates.length === 0) return null
              return (
                <optgroup key={sector.id} label={sector.label}>
                  {sectorTemplates.map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </optgroup>
              )
            })}
          </select>
        </div>
      </div>

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Motivo do atraso *</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Escreva o motivo do atraso..."
          className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Descrição *</label>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Descreva o motivo..."
          rows={3}
          className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Enviar
        </button>
      </div>
    </div>
  )
}

/* ─── Warning Alert Form ─── */

function WarningAlertForm({
  patient,
  preSelectedSetor,
  onClose,
}: {
  patient: IPatients
  preSelectedSetor: string | null
  onClose: () => void
}) {
  const [selectedSetor, setSelectedSetor] = useState(preSelectedSetor || '')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<{ userId: string; name: string } | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setUser({ userId: data.userId || '0', name: data.name || '' }) })
      .catch(() => {})
  }, [])

  const sectorField = DELAY_SECTORS.find(s => s.label === selectedSetor)?.field || ''

  const handleSubmit = async () => {
    if (!selectedSetor) { setError('Selecione o setor'); return }
    if (!title) { setError('Informe o título do alerta'); return }
    if (!body) { setError('Informe a descrição'); return }
    setError('')
    setLoading(true)

    const sectorBooleans: Record<string, boolean> = { re: false, tr: false, fa: false, tt: false }
    if (sectorField) sectorBooleans[sectorField] = true

    try {
      const res = await fetch('/api/stopwatch/delay-warning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cod_PF: user ? parseInt(user.userId) || 0 : 0,
          nomePF: user?.name || '',
          title,
          body,
          dt_registro: new Date().toISOString(),
          dt_atualizacao: new Date().toISOString(),
          ...sectorBooleans,
        }),
      })
      if (res.ok) {
        onClose()
      } else {
        setError('Erro ao enviar alerta')
      }
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Sector select */}
      {!preSelectedSetor && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Setor *</label>
          <select
            value={selectedSetor}
            onChange={e => setSelectedSetor(e.target.value)}
            className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione</option>
            {DELAY_SECTORS.map(s => (
              <option key={s.id} value={s.label}>{s.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Título do alerta *</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Título do alerta..."
          className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Descrição *</label>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Descreva o alerta..."
          rows={3}
          className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
          Alertar Setor
        </button>
      </div>
    </div>
  )
}
