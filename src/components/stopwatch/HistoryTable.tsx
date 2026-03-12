'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Download, Loader2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Check, Filter, Settings2, XCircle } from 'lucide-react'
import { HistoryQTStopWatchH } from '@/types/stopwatch'
import { cn } from '@/lib/utils'

interface HistoryTableProps {
  history: HistoryQTStopWatchH[]
  loading: boolean
}

type SortDir = 'asc' | 'desc'

interface Column {
  id: string
  label: string
  visible: boolean
  getValue: (row: HistoryQTStopWatchH) => string | number
  render?: (row: HistoryQTStopWatchH) => React.ReactNode
  isInterval?: boolean
}

const returnTypeFila = (nr: number) => {
  const map: Record<number, string> = { 14: 'FILA NORMAL', 19: 'FILA RÁPIDA' }
  return map[nr] ?? '-'
}

const fmtDate = (dt?: string) => {
  if (!dt) return '—'
  try { return format(new Date(dt), 'HH:mm', { locale: ptBR }) } catch { return '—' }
}

const fmtDateFull = (dt?: string) => {
  if (!dt) return ''
  try { return format(new Date(dt), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR }) } catch { return '' }
}

const THRESHOLD = 30

function IntervalCell({ val }: { val: number }) {
  if (!val || val <= 0) return <span className="text-gray-400 dark:text-gray-600">—</span>
  return (
    <span className={cn(
      'font-mono text-xs px-1.5 py-0.5 rounded',
      val > THRESHOLD
        ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10'
        : 'text-emerald-600 dark:text-emerald-400'
    )}>
      {val}m
    </span>
  )
}

const buildColumns = (): Column[] => [
  { id: 'paciente', label: 'Paciente', visible: true, getValue: r => r.paciente },
  { id: 'protocolo', label: 'Protocolo', visible: true, getValue: r => r.protocolo },
  { id: 'tipoFila', label: 'Tipo Fila', visible: true, getValue: r => returnTypeFila(r.nR_SEQ_FILA_SENHA) },
  { id: 'dT_REAL', label: 'Hora Agendada', visible: true, getValue: r => r.dT_REAL ?? '', render: r => <span className="whitespace-nowrap">{fmtDate(r.dT_REAL)}</span> },
  { id: 'dT_ACOLHIMENTO', label: 'Acolhimento', visible: true, getValue: r => r.dT_ACOLHIMENTO ?? '', render: r => <span className="whitespace-nowrap">{fmtDate(r.dT_ACOLHIMENTO)}</span> },
  { id: 'interV_AC_RE', label: 'Int.(AC-RE)', visible: true, isInterval: true, getValue: r => r.interV_AC_RE, render: r => <IntervalCell val={r.interV_AC_RE} /> },
  { id: 'dT_CHEGADA', label: 'Recepção', visible: true, getValue: r => r.dT_CHEGADA ?? '', render: r => <span className="whitespace-nowrap">{fmtDate(r.dT_CHEGADA)}</span> },
  { id: 'interV_RE_TR', label: 'Int.(RE-TR)', visible: true, isInterval: true, getValue: r => r.interV_RE_TR, render: r => <IntervalCell val={r.interV_RE_TR} /> },
  { id: 'dT_INICIO_TRIAGEM', label: 'Início Triagem', visible: false, getValue: r => r.dT_INICIO_TRIAGEM ?? '', render: r => <span className="whitespace-nowrap">{fmtDate(r.dT_INICIO_TRIAGEM)}</span> },
  { id: 'dT_FIM_TRIAGEM', label: 'Fim Triagem', visible: false, getValue: r => r.dT_FIM_TRIAGEM ?? '', render: r => <span className="whitespace-nowrap">{fmtDate(r.dT_FIM_TRIAGEM)}</span> },
  { id: 'interV_TR_I_AC', label: 'Int.(TR-Acom)', visible: true, isInterval: true, getValue: r => r.interV_TR_I_AC, render: r => <IntervalCell val={r.interV_TR_I_AC} /> },
  { id: 'dT_RECEBIMENTO_FAR_SAT', label: 'Receb. Far Sat', visible: false, getValue: r => r.dT_RECEBIMENTO_FAR_SAT ?? '', render: r => <span className="whitespace-nowrap">{fmtDate(r.dT_RECEBIMENTO_FAR_SAT)}</span> },
  { id: 'interV_FA_SAT_TT', label: 'Int.(FaSat-Enf)', visible: true, isInterval: true, getValue: r => r.interV_FA_SAT_TT, render: r => <IntervalCell val={r.interV_FA_SAT_TT} /> },
  { id: 'dT_RECEBIMENTO_FAR_PROD', label: 'Receb. Far Prod', visible: false, getValue: r => r.dT_RECEBIMENTO_FAR_PROD ?? '', render: r => <span className="whitespace-nowrap">{fmtDate(r.dT_RECEBIMENTO_FAR_PROD)}</span> },
  { id: 'interV_FA_TT', label: 'Int.(FaProd-Enf)', visible: true, isInterval: true, getValue: r => r.interV_FA_TT, render: r => <IntervalCell val={r.interV_FA_TT} /> },
  { id: 'interV_ENF_PRE_TT', label: 'Int.(Enf-PreTT)', visible: false, isInterval: true, getValue: r => r.interV_ENF_PRE_TT, render: r => <IntervalCell val={r.interV_ENF_PRE_TT} /> },
  { id: 'interV_ENF_TT', label: 'Int.(Enf-TT)', visible: true, isInterval: true, getValue: r => r.interV_ENF_TT, render: r => <IntervalCell val={r.interV_ENF_TT} /> },
  { id: 'dT_ALTA', label: 'Alta', visible: true, getValue: r => r.dT_ALTA ?? '', render: r => <span className="whitespace-nowrap">{fmtDate(r.dT_ALTA)}</span> },
  { id: 'dS_LOCAL', label: 'Poltrona', visible: false, getValue: r => r.dS_LOCAL ?? '' },
  { id: 'dS_PROFISSIONAL', label: 'Responsável', visible: false, getValue: r => r.dS_PROFISSIONAL ?? '' },
  { id: 'duration', label: 'Duração Total', visible: false, getValue: r => r.duration ?? 0 },
]

export function HistoryTable({ history, loading }: HistoryTableProps) {
  const [columns, setColumns] = useState<Column[]>(buildColumns)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [sortBy, setSortBy] = useState<string>('paciente')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filaFilter, setFilaFilter] = useState<'all' | 'normal' | 'rapida'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showColumns, setShowColumns] = useState(false)

  // Filter rows by fila type
  const filteredRows = useMemo(() => {
    if (filaFilter === 'all') return history
    const code = filaFilter === 'normal' ? 14 : 19
    return history.filter(r => r.nR_SEQ_FILA_SENHA === code)
  }, [history, filaFilter])

  // Sort
  const sortedRows = useMemo(() => {
    const col = columns.find(c => c.id === sortBy)
    if (!col) return filteredRows
    return [...filteredRows].sort((a, b) => {
      const va = col.getValue(a)
      const vb = col.getValue(b)
      if (typeof va === 'number' && typeof vb === 'number') return sortDir === 'asc' ? va - vb : vb - va
      return sortDir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
    })
  }, [filteredRows, sortBy, sortDir, columns])

  // Paginate
  const paginatedRows = useMemo(() => {
    return sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [sortedRows, page, rowsPerPage])

  const totalPages = Math.ceil(sortedRows.length / rowsPerPage)

  // Reset page on data change
  React.useEffect(() => { setPage(0); setSelected(new Set()) }, [history, filaFilter])

  const visibleColumns = useMemo(() => columns.filter(c => c.visible), [columns])

  const handleSort = useCallback((colId: string) => {
    setSortBy(prev => {
      if (prev === colId) {
        setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        return prev
      }
      setSortDir('asc')
      return colId
    })
  }, [])

  const toggleSelectAll = useCallback(() => {
    if (selected.size === sortedRows.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(sortedRows.map(r => r.nR_SEQ_PACIENTE)))
    }
  }, [selected.size, sortedRows])

  const toggleSelect = useCallback((id: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleColumn = useCallback((colId: string) => {
    setColumns(prev => prev.map(c => c.id === colId ? { ...c, visible: !c.visible } : c))
  }, [])

  const toggleAllColumns = useCallback((visible: boolean) => {
    setColumns(prev => prev.map(c => (['paciente', 'protocolo'].includes(c.id) ? c : { ...c, visible })))
  }, [])

  const selectedRows = useMemo(() => sortedRows.filter(r => selected.has(r.nR_SEQ_PACIENTE)), [sortedRows, selected])

  const exportHistoryXlsx = useCallback(async () => {
    const rowsToExport = selectedRows.length > 0 ? selectedRows : sortedRows
    if (rowsToExport.length === 0) return

    const XLSX = await import('xlsx-js-style')

    const data = rowsToExport.map(item => ({
      'Paciente': item.paciente,
      'Protocolo': item.protocolo,
      'Tipo Fila': returnTypeFila(item.nR_SEQ_FILA_SENHA),
      'Hora Agendada': fmtDateFull(item.dT_REAL),
      'Dt. Acolhimento': fmtDateFull(item.dT_ACOLHIMENTO),
      'Int.(Acolhimento - Recepção)': item.interV_AC_RE,
      'Dt. Recepção': fmtDateFull(item.dT_CHEGADA),
      'Int.(Recepção - Triagem)': item.interV_RE_TR,
      'Início da Triagem': fmtDateFull(item.dT_INICIO_TRIAGEM),
      'Fim da Triagem': fmtDateFull(item.dT_FIM_TRIAGEM),
      'Int.(Triagem - Acomodação)': item.interV_TR_I_AC,
      'Receb. Far Satélite': fmtDateFull(item.dT_RECEBIMENTO_FAR_SAT),
      'Int.(Far Satélite - Posto de Enf)': item.interV_FA_SAT_TT,
      'Receb. Far Produção': fmtDateFull(item.dT_RECEBIMENTO_FAR_PROD),
      'Int.(Far Produção - Posto de Enf)': item.interV_FA_TT,
      'Dt. Acomodação': fmtDateFull(item.dT_ACOMODACAO),
      'Int.(Posto de Enf - Pre-Tratamento)': item.interV_ENF_PRE_TT,
      'Início do Pre-Tratamento': fmtDateFull(item.dT_INICIO_PRE_TRATAMENTO),
      'Int.(Posto de Enf - Tratamento)': item.interV_ENF_TT,
      'Início do Tratamento': fmtDateFull(item.dT_INICIO_TRATAMENTO),
      'Fim do Tratamento': fmtDateFull(item.dT_FIM_TRATAMENTO),
      'Dt. Alta': fmtDateFull(item.dT_ALTA),
      'Poltrona': item.dS_LOCAL ?? '',
      'Responsável da Poltrona': item.dS_PROFISSIONAL ?? '',
      'Duração Protocolo': item.qT_DURACAO_APLICACAO,
      'Duração Protocolo Real': item.qT_DURACAO_APLICACAO_REAL,
      'Duração Total': item.duration ?? '',
    }))

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(data)

    const colWidths = data.reduce<number[]>((acc, row) => {
      Object.values(row).forEach((val, i) => {
        const len = String(val ?? '').length
        acc[i] = Math.max(acc[i] || 0, typeof val === 'number' ? 20 : len)
      })
      return acc
    }, [])
    ws['!cols'] = colWidths.map(w => ({ width: Math.max(w, 12) }))
    ws['!rows'] = Array.from({ length: data.length + 1 }, (_, i) => ({ hpt: i === 0 ? 30 : 35 }))

    const METRICS: Record<string, number> = { AC_RE: 30, RE_TR: 30, TR_ACM: 30, FA_SAT_TT: 30, FA_TT: 30, PE_TT: 30 }
    const redStyle = {
      font: { color: { rgb: 'ffffff' } },
      fill: { bgColor: { rgb: 'ff5252' }, fgColor: { rgb: 'ff5252' } },
      alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
    }

    for (const cellRef in ws) {
      if (typeof ws[cellRef] !== 'object' || cellRef.startsWith('!')) continue
      const cell = XLSX.utils.decode_cell(cellRef)
      const c = cell.c
      ws[cellRef].s = { alignment: { vertical: 'center', horizontal: 'center', wrapText: true } }
      const val = ws[cellRef].v

      if (c === 5 && val > METRICS.AC_RE) ws[cellRef].s = redStyle
      if (c === 7 && val > METRICS.RE_TR) ws[cellRef].s = redStyle
      if (c === 10 && val > METRICS.TR_ACM) ws[cellRef].s = redStyle
      if (c === 12 && val > METRICS.FA_SAT_TT) ws[cellRef].s = redStyle
      if (c === 14 && val > METRICS.FA_TT) ws[cellRef].s = redStyle
      if (c === 16 && val > METRICS.PE_TT) ws[cellRef].s = redStyle
      if (c === 18 && val > METRICS.PE_TT) ws[cellRef].s = redStyle

      if (typeof val === 'number' && val < 0) {
        ws[cellRef].s = {
          font: { color: { rgb: '000000' } },
          fill: { bgColor: { rgb: 'f5d442' }, fgColor: { rgb: 'f5d442' } },
          alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
        }
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, 'StopWatchH')
    XLSX.writeFile(wb, `StopWatch-Alertas-${format(new Date(), 'dd-MM-yyyy')}.xlsx`)
  }, [selectedRows, sortedRows])

  const allSelected = sortedRows.length > 0 && selected.size === sortedRows.length
  const someSelected = selected.size > 0 && !allSelected

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/40 overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className={cn(
        'flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700/50 transition-colors',
        selected.size > 0 ? 'bg-blue-50 dark:bg-blue-500/10' : 'bg-gray-50 dark:bg-gray-800/60'
      )}>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Listagem do histórico de intervalos
          </span>
          {selected.size > 0 ? (
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              {selected.size} selecionado{selected.size !== 1 ? 's' : ''}
            </span>
          ) : filteredRows.length > 0 ? (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {filteredRows.length} registro{filteredRows.length !== 1 ? 's' : ''}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {/* Filters button */}
          <div className="relative">
            <button
              onClick={() => { setShowFilters(p => !p); setShowColumns(false) }}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                filaFilter !== 'all'
                  ? 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  : 'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
              )}
            >
              <Filter className="w-3.5 h-3.5" />
              Filtros
            </button>
            {showFilters && (
              <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg p-2">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 px-2 py-1 font-semibold">Tipo de Fila</p>
                {(['all', 'normal', 'rapida'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => { setFilaFilter(f); setShowFilters(false) }}
                    className={cn(
                      'w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors',
                      filaFilter === f ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    )}
                  >
                    {filaFilter === f && <Check className="w-3 h-3" />}
                    <span className={filaFilter !== f ? 'ml-5' : ''}>
                      {f === 'all' ? 'Todas' : f === 'normal' ? 'Fila Normal' : 'Fila Rápida'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Columns button */}
          <div className="relative">
            <button
              onClick={() => { setShowColumns(p => !p); setShowFilters(false) }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500"
            >
              <Settings2 className="w-3.5 h-3.5" />
              Colunas
            </button>
            {showColumns && (
              <div className="absolute right-0 top-full mt-1 z-50 w-56 max-h-72 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg p-2">
                <div className="flex items-center justify-between px-2 py-1.5 mb-1 border-b border-gray-200 dark:border-gray-700/50">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Visibilidade</p>
                  <div className="flex gap-1">
                    <button onClick={() => toggleAllColumns(true)} className="px-2 py-0.5 rounded text-[10px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">Todas</button>
                    <button onClick={() => toggleAllColumns(false)} className="px-2 py-0.5 rounded text-[10px] font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Mínimo</button>
                  </div>
                </div>
                {columns.map(col => (
                  <label key={col.id} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={col.visible}
                      onChange={() => toggleColumn(col.id)}
                      disabled={['paciente', 'protocolo'].includes(col.id)}
                      className="rounded accent-blue-500 w-3.5 h-3.5"
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-300">{col.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Export button */}
          {(filteredRows.length > 0) && (
            <button
              onClick={exportHistoryXlsx}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              {selected.size > 0 ? `Exportar (${selected.size})` : 'Exportar Excel'}
            </button>
          )}
        </div>
      </div>

      {/* Active filter badge */}
      {filaFilter !== 'all' && (
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30 flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">Filtro ativo:</span>
          <span className="inline-flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
            {filaFilter === 'normal' ? 'Fila Normal' : 'Fila Rápida'}
            <button onClick={() => setFilaFilter('all')} className="hover:text-blue-900 dark:hover:text-white">
              <XCircle className="w-3 h-3" />
            </button>
          </span>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      ) : filteredRows.length === 0 ? (
        <div className="flex items-center justify-center h-32">
          <p className="text-sm text-gray-400 dark:text-gray-500">Sem dados para o período selecionado</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/60">
                  {/* Select all checkbox */}
                  <th className="px-3 py-2.5 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={el => { if (el) el.indeterminate = someSelected }}
                      onChange={toggleSelectAll}
                      className="rounded accent-blue-500 w-3.5 h-3.5"
                    />
                  </th>
                  {visibleColumns.map(col => (
                    <th
                      key={col.id}
                      onClick={() => handleSort(col.id)}
                      className="px-3 py-2.5 text-left text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide whitespace-nowrap cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none"
                    >
                      <span className="inline-flex items-center gap-1">
                        {col.label}
                        {sortBy === col.id && (
                          sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((row, i) => {
                  const isSelected = selected.has(row.nR_SEQ_PACIENTE)
                  const isCanceled = !!row.dT_CANCELAMENTO
                  return (
                    <tr
                      key={row.nR_SEQ_PACIENTE || i}
                      onClick={() => toggleSelect(row.nR_SEQ_PACIENTE)}
                      className={cn(
                        'border-b border-gray-100 dark:border-gray-800/50 transition-colors cursor-pointer',
                        isSelected ? 'bg-blue-50/50 dark:bg-blue-500/5' : 'hover:bg-gray-50 dark:hover:bg-gray-700/20',
                        isCanceled && 'opacity-60'
                      )}
                    >
                      <td className="px-3 py-2.5 w-10">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(row.nR_SEQ_PACIENTE)}
                          onClick={e => e.stopPropagation()}
                          className="rounded accent-blue-500 w-3.5 h-3.5"
                        />
                      </td>
                      {visibleColumns.map(col => (
                        <td key={col.id} className={cn(
                          'px-3 py-2.5 text-sm',
                          col.id === 'paciente' ? 'text-gray-800 dark:text-gray-200 max-w-[180px] break-words font-medium' : 'text-gray-500 dark:text-gray-400'
                        )}>
                          {col.render ? col.render(row) : String(col.getValue(row) || '—')}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Itens por página</span>
              <select
                value={rowsPerPage}
                onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(0) }}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-xs text-gray-700 dark:text-gray-300 focus:outline-none"
              >
                {[5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
                <option value={sortedRows.length}>Todos</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {page * rowsPerPage + 1}–{Math.min((page + 1) * rowsPerPage, sortedRows.length)} de {sortedRows.length}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
