'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import {
  ChevronDown, SlidersHorizontal, Frown, Annoyed, Smile, X,
  TrendingUp, MapPin, UserRound, Shield, MessageSquare,
} from 'lucide-react'
import type { IOptionsFilterTratamento, IOptionsFilterTratamentoQuests, IMedico, IConvenio } from '@/types/nps'
import { UNIDADES } from '../npsHelpers'
import { CheckItem } from '../shared/CheckItem'

const SECTION_NAMES: Record<IOptionsFilterTratamentoQuests, string> = {
  nota: 'NPS',
  unidade: 'Unidade',
  profissional: 'Médico',
  convenio: 'Convênio',
}

const SECTION_ICONS: Record<IOptionsFilterTratamentoQuests, React.ElementType> = {
  nota: TrendingUp,
  unidade: MapPin,
  profissional: UserRound,
  convenio: Shield,
}

const SECTION_COLORS: Record<IOptionsFilterTratamentoQuests, { color: string; bg: string }> = {
  nota: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  unidade: { color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-500/10' },
  profissional: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  convenio: { color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
}

function countActiveFilters(opts: IOptionsFilterTratamento): number {
  let count = opts.onlyComments ? 1 : 0
  const keys: IOptionsFilterTratamentoQuests[] = ['nota', 'unidade', 'profissional', 'convenio']
  for (const k of keys) { if ((opts[k] ?? []).length > 0) count++ }
  return count
}

interface NpsFilterMenuTratamentoProps {
  optionsFilter: IOptionsFilterTratamento
  onChangeFilter: (name: string, value: string, checked: boolean) => void
  onSetAll: <T>(quest: IOptionsFilterTratamentoQuests, checked: boolean, array: T[]) => void
  medicos: IMedico[]
  convenios: IConvenio[]
}

export function NpsFilterMenuTratamento({ optionsFilter, onChangeFilter, onSetAll, medicos, convenios }: NpsFilterMenuTratamentoProps) {
  const [open, setOpen] = useState(false)
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())
  const menuRef = useRef<HTMLDivElement>(null)
  const activeCount = countActiveFilters(optionsFilter)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filterKeys: IOptionsFilterTratamentoQuests[] = ['nota', 'unidade', 'profissional', 'convenio']

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className={cn(
          'relative flex items-center gap-2 rounded-lg text-sm transition-all duration-200 cursor-pointer select-none px-3 py-2 overflow-hidden',
          open
            ? 'bg-cyan-50 dark:bg-cyan-600 ring-1 ring-cyan-200 dark:ring-cyan-400/30 shadow-sm shadow-cyan-100 dark:shadow-cyan-500/20 font-semibold text-cyan-800 dark:text-white'
            : 'font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-[#212845] border border-gray-200 dark:border-gray-700/40 hover:bg-gray-50 dark:hover:bg-gray-700/40',
        )}
        aria-label="Abrir filtros"
      >
        <span className={cn(
          'flex items-center justify-center w-6 h-6 rounded-md shrink-0 transition-all duration-200',
          open ? 'bg-cyan-100 dark:bg-white/20' : 'bg-gray-100 dark:bg-white/5',
        )}>
          <SlidersHorizontal
            size={13}
            className={cn('transition-colors', open ? 'text-cyan-700 dark:text-white' : 'text-gray-500 dark:text-gray-400')}
          />
        </span>
        Filtros
        {activeCount > 0 && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 dark:bg-white text-[10px] font-bold text-white dark:text-cyan-700 leading-none">
            {activeCount}
          </span>
        )}
      </button>

      {/* Filter panel */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[290px] rounded-2xl border border-gray-200 dark:border-gray-700/40 bg-white dark:bg-[#1b2030] shadow-xl shadow-black/10 dark:shadow-black/30">

          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700/40">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-50 dark:bg-cyan-500/10">
                <SlidersHorizontal size={14} className="text-cyan-600 dark:text-cyan-400" />
              </span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filtros</span>
              {activeCount > 0 && (
                <span className="rounded-full bg-cyan-100 dark:bg-cyan-900/40 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-700 dark:text-cyan-400 leading-none">
                  {activeCount} ativos
                </span>
              )}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 p-2">

            {/* Only comments toggle */}
            <div className="px-3 py-2.5 mb-1 rounded-xl border border-gray-100 dark:border-gray-700/40">
              <label className="flex cursor-pointer items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 dark:bg-white/5">
                    <MessageSquare size={13} className="text-gray-500 dark:text-gray-400" />
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Somente comentários</span>
                </div>
                <span className={cn(
                  'relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 cursor-pointer',
                  optionsFilter.onlyComments ? 'bg-cyan-600' : 'bg-gray-200 dark:bg-gray-600',
                )}>
                  <span className={cn(
                    'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                    optionsFilter.onlyComments ? 'translate-x-4' : 'translate-x-0',
                  )} />
                </span>
                <input
                  type="checkbox"
                  checked={optionsFilter.onlyComments ?? false}
                  onChange={(e) => onChangeFilter('onlyComments', '', e.target.checked)}
                  className="sr-only"
                />
              </label>
            </div>

            {/* Filter sections */}
            <div className="flex flex-col gap-1">
              {filterKeys.map((key) => {
                const isOpen = openSections.has(key)
                const activeValues = optionsFilter[key] ?? []
                const Icon = SECTION_ICONS[key]
                const { color, bg } = SECTION_COLORS[key]

                return (
                  <div key={key} className="rounded-xl border border-gray-100 dark:border-gray-700/40 overflow-hidden">
                    {/* Section header */}
                    <button
                      onClick={() => setOpenSections((prev) => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n })}
                      className={cn(
                        'flex w-full items-center justify-between px-3 py-2.5 text-sm cursor-pointer transition-colors',
                        isOpen
                          ? 'bg-gray-50/80 dark:bg-white/[0.03]'
                          : 'hover:bg-gray-50 dark:hover:bg-white/5',
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={cn(
                          'flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-colors',
                          isOpen ? bg : 'bg-gray-100 dark:bg-white/5',
                        )}>
                          <Icon
                            size={13}
                            className={cn('transition-colors', isOpen ? color : 'text-gray-400 dark:text-gray-500')}
                          />
                        </span>
                        <span className={cn(
                          'font-medium transition-colors',
                          isOpen ? 'text-gray-800 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300',
                        )}>
                          {SECTION_NAMES[key]}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {activeValues.length > 0 && (
                          <span className="rounded-full bg-cyan-100 dark:bg-cyan-900/40 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-700 dark:text-cyan-400 leading-none">
                            {activeValues.length}
                          </span>
                        )}
                        <ChevronDown
                          size={14}
                          className={cn(
                            'text-gray-400 transition-transform duration-200',
                            isOpen && '-rotate-180',
                          )}
                        />
                      </div>
                    </button>

                    {/* Section content */}
                    {isOpen && (
                      <div className="py-1.5 px-2 bg-gray-50/50 dark:bg-white/[0.02]">
                        {key === 'nota' && <NotaSubFilter selected={activeValues} onChangeFilter={onChangeFilter} onSetAll={onSetAll} />}
                        {key === 'unidade' && <UnidadeSubFilter selected={activeValues} onChangeFilter={onChangeFilter} onSetAll={onSetAll} />}
                        {key === 'profissional' && <ProfissionalSubFilter selected={activeValues} medicos={medicos} onChangeFilter={onChangeFilter} onSetAll={onSetAll} />}
                        {key === 'convenio' && <ConvenioSubFilter selected={activeValues} convenios={convenios} onChangeFilter={onChangeFilter} onSetAll={onSetAll} />}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



function NotaSubFilter({ selected, onChangeFilter, onSetAll }: { selected: string[]; onChangeFilter: (n: string, v: string, c: boolean) => void; onSetAll: <T>(q: IOptionsFilterTratamentoQuests, c: boolean, arr: T[]) => void }) {
  return (
    <>
      <CheckItem label="Todos" checked={selected.length === 3} indeterminate={selected.length > 0 && selected.length < 3} onChange={(c) => onSetAll('nota', c, ['Detrator', 'Neutro', 'Promotor'])} />
      <CheckItem label={<span className="flex items-center gap-2"><Frown size={14} className="text-red-500" /> Detrator (0-6)</span>} checked={selected.includes('Detrator')} onChange={(c) => onChangeFilter('nota', 'Detrator', c)} />
      <CheckItem label={<span className="flex items-center gap-2"><Annoyed size={14} className="text-amber-500" /> Neutro (7-8)</span>} checked={selected.includes('Neutro')} onChange={(c) => onChangeFilter('nota', 'Neutro', c)} />
      <CheckItem label={<span className="flex items-center gap-2"><Smile size={14} className="text-emerald-500" /> Promotor (9-10)</span>} checked={selected.includes('Promotor')} onChange={(c) => onChangeFilter('nota', 'Promotor', c)} />
    </>
  )
}

function UnidadeSubFilter({ selected, onChangeFilter, onSetAll }: { selected: string[]; onChangeFilter: (n: string, v: string, c: boolean) => void; onSetAll: <T>(q: IOptionsFilterTratamentoQuests, c: boolean, arr: T[]) => void }) {
  return (
    <>
      <CheckItem label="Todos" checked={selected.length === UNIDADES.length} indeterminate={selected.length > 0 && selected.length < UNIDADES.length} onChange={(c) => onSetAll('unidade', c, UNIDADES.map((u) => u.cdUnidade))} />
      {UNIDADES.map((u) => <CheckItem key={u.cdUnidade} label={u.dsUnidade} checked={selected.includes(u.cdUnidade)} onChange={(c) => onChangeFilter('unidade', u.cdUnidade, c)} />)}
    </>
  )
}

function ProfissionalSubFilter({ selected, medicos, onChangeFilter, onSetAll }: { selected: string[]; medicos: IMedico[]; onChangeFilter: (n: string, v: string, c: boolean) => void; onSetAll: <T>(q: IOptionsFilterTratamentoQuests, c: boolean, arr: T[]) => void }) {
  const seen = new Set<string>()
  const unique = medicos.filter((m) => { if (seen.has(m.cD_PESSOA_FISICA)) return false; seen.add(m.cD_PESSOA_FISICA); return true })
  return (
    <>
      <CheckItem label="Todos" checked={selected.length === unique.length} indeterminate={selected.length > 0 && selected.length < unique.length} onChange={(c) => onSetAll('profissional', c, unique.map((m) => m.cD_PESSOA_FISICA))} />
      {unique.map((m) => <CheckItem key={m.cD_PESSOA_FISICA} label={m.nM_GUERRA} checked={selected.includes(m.cD_PESSOA_FISICA)} onChange={(c) => onChangeFilter('profissional', m.cD_PESSOA_FISICA, c)} />)}
    </>
  )
}

function ConvenioSubFilter({ selected, convenios, onChangeFilter, onSetAll }: { selected: string[]; convenios: IConvenio[]; onChangeFilter: (n: string, v: string, c: boolean) => void; onSetAll: <T>(q: IOptionsFilterTratamentoQuests, c: boolean, arr: T[]) => void }) {
  return (
    <>
      <CheckItem label="Todos" checked={selected.length === convenios.length} indeterminate={selected.length > 0 && selected.length < convenios.length} onChange={(c) => onSetAll('convenio', c, convenios.map((cv) => cv.cD_CONVENIO.toString()))} />
      {convenios.map((cv) => <CheckItem key={cv.cD_CONVENIO} label={cv.dS_CONVENIO} checked={selected.includes(cv.cD_CONVENIO.toString())} onChange={(c) => onChangeFilter('convenio', cv.cD_CONVENIO.toString(), c)} />)}
    </>
  )
}
