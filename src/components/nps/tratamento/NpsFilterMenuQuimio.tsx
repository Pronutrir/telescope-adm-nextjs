'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import type { IOptionsFilterQuimio, IOptionsFilterQuimioQuests, IMedico, IConvenio } from '@/types/nps'
import { UNIDADES } from '../npsHelpers'

const SECTION_NAMES: Record<IOptionsFilterQuimioQuests, string> = {
  unidade: 'Unidade',
  profissional: 'Médico',
  convenio: 'Convênio',
}

function countActiveFilters(opts: IOptionsFilterQuimio): number {
  let count = opts.onlyComments ? 1 : 0
  const keys: IOptionsFilterQuimioQuests[] = ['unidade', 'profissional', 'convenio']
  for (const k of keys) { if ((opts[k] ?? []).length > 0) count++ }
  return count
}

interface NpsFilterMenuQuimioProps {
  optionsFilter: IOptionsFilterQuimio
  onChangeFilter: (name: string, value: string, checked: boolean) => void
  onSetAll: <T>(quest: IOptionsFilterQuimioQuests, checked: boolean, array: T[]) => void
  medicos: IMedico[]
  convenios: IConvenio[]
}

export function NpsFilterMenuQuimio({ optionsFilter, onChangeFilter, onSetAll, medicos, convenios }: NpsFilterMenuQuimioProps) {
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

  const filterKeys: IOptionsFilterQuimioQuests[] = ['unidade', 'profissional', 'convenio']

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((p) => !p)}
        className={cn(
          'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors cursor-pointer',
          open
            ? 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-600'
            : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50',
        )}
        aria-label="Abrir filtros"
      >
        <SlidersHorizontal size={15} />
        Filtros
        {activeCount > 0 && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-white leading-none">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[300px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1b2030] shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700/60 px-4 py-3">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filtros</span>
            <button onClick={() => setOpen(false)} className="rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer transition-colors">
              <X size={14} />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {/* Somente com NPS preenchido */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/40">
              <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <input type="checkbox" checked={optionsFilter.onlyComments ?? false} onChange={(e) => onChangeFilter('onlyComments', '', e.target.checked)} className="h-4 w-4 accent-cyan-500 rounded" />
                <span>Somente com NPS preenchido</span>
              </label>
            </div>

            {filterKeys.map((key, idx) => {
              const isLast = idx === filterKeys.length - 1
              const isOpen = openSections.has(key)
              const activeValues = optionsFilter[key] ?? []

              return (
                <div key={key} className={cn(!isLast && 'border-b border-gray-100 dark:border-gray-700/40')}>
                  <button
                    onClick={() => setOpenSections((prev) => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n })}
                    className="flex w-full items-center justify-between px-4 py-3 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <span className={cn('font-medium', isOpen ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-700 dark:text-gray-200')}>
                      {SECTION_NAMES[key]}
                    </span>
                    <div className="flex items-center gap-2">
                      {activeValues.length > 0 && (
                        <span className="rounded-full bg-cyan-100 dark:bg-cyan-900/40 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-700 dark:text-cyan-400 leading-none">
                          {activeValues.length}
                        </span>
                      )}
                      <ChevronDown size={14} className={cn('text-gray-400 transition-transform duration-200', isOpen && '-rotate-180')} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="pb-2 bg-gray-50/50 dark:bg-gray-800/20">
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
      )}
    </div>
  )
}

function CheckItem({ label, checked, indeterminate, onChange }: { label: React.ReactNode; checked: boolean; indeterminate?: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 px-5 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
      <input type="checkbox" ref={(el) => { if (el) el.indeterminate = indeterminate ?? false }} checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-cyan-500 shrink-0" />
      <span>{label}</span>
    </label>
  )
}

function UnidadeSubFilter({ selected, onChangeFilter, onSetAll }: { selected: string[]; onChangeFilter: (n: string, v: string, c: boolean) => void; onSetAll: <T>(q: IOptionsFilterQuimioQuests, c: boolean, arr: T[]) => void }) {
  return (
    <>
      <CheckItem label="Todos" checked={selected.length === UNIDADES.length} indeterminate={selected.length > 0 && selected.length < UNIDADES.length} onChange={(c) => onSetAll('unidade', c, UNIDADES.map((u) => u.cdUnidade))} />
      {UNIDADES.map((u) => <CheckItem key={u.cdUnidade} label={u.dsUnidade} checked={selected.includes(u.cdUnidade)} onChange={(c) => onChangeFilter('unidade', u.cdUnidade, c)} />)}
    </>
  )
}

function ProfissionalSubFilter({ selected, medicos, onChangeFilter, onSetAll }: { selected: string[]; medicos: IMedico[]; onChangeFilter: (n: string, v: string, c: boolean) => void; onSetAll: <T>(q: IOptionsFilterQuimioQuests, c: boolean, arr: T[]) => void }) {
  const seen = new Set<string>()
  const unique = medicos.filter((m) => { if (seen.has(m.cD_PESSOA_FISICA)) return false; seen.add(m.cD_PESSOA_FISICA); return true })
  return (
    <>
      <CheckItem label="Todos" checked={selected.length === unique.length} indeterminate={selected.length > 0 && selected.length < unique.length} onChange={(c) => onSetAll('profissional', c, unique.map((m) => m.cD_PESSOA_FISICA))} />
      {unique.map((m) => <CheckItem key={m.cD_PESSOA_FISICA} label={m.nM_GUERRA} checked={selected.includes(m.cD_PESSOA_FISICA)} onChange={(c) => onChangeFilter('profissional', m.cD_PESSOA_FISICA, c)} />)}
    </>
  )
}

function ConvenioSubFilter({ selected, convenios, onChangeFilter, onSetAll }: { selected: string[]; convenios: IConvenio[]; onChangeFilter: (n: string, v: string, c: boolean) => void; onSetAll: <T>(q: IOptionsFilterQuimioQuests, c: boolean, arr: T[]) => void }) {
  return (
    <>
      <CheckItem label="Todos" checked={selected.length === convenios.length} indeterminate={selected.length > 0 && selected.length < convenios.length} onChange={(c) => onSetAll('convenio', c, convenios.map((cv) => cv.cD_CONVENIO.toString()))} />
      {convenios.map((cv) => <CheckItem key={cv.cD_CONVENIO} label={cv.dS_CONVENIO} checked={selected.includes(cv.cD_CONVENIO.toString())} onChange={(c) => onChangeFilter('convenio', cv.cD_CONVENIO.toString(), c)} />)}
    </>
  )
}
