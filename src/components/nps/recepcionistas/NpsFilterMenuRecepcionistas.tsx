'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import type { IOptionsFilterRecepcionistas, IOptionsFilterRecepcionistasQuests } from '@/types/nps'
import { UNIDADES } from '../npsHelpers'

const SECTION_NAMES: Record<IOptionsFilterRecepcionistasQuests, string> = {
  resp1: 'Avaliação',
  cd_pessoa_fisica: 'Recepcionista',
  unidade: 'Unidade',
  local: 'Local de trabalho',
}

const STAR_OPTIONS = ['1', '2', '3', '4', '5']

function countActiveFilters(opts: IOptionsFilterRecepcionistas): number {
  let count = opts.onlyComments ? 1 : 0
  const keys: IOptionsFilterRecepcionistasQuests[] = ['resp1', 'cd_pessoa_fisica', 'unidade', 'local']
  for (const k of keys) { if ((opts[k] ?? []).length > 0) count++ }
  return count
}

interface NpsFilterMenuRecepcionistasProps {
  optionsFilter: IOptionsFilterRecepcionistas
  onChangeFilter: (name: string, value: string, checked: boolean) => void
  onSetAll: <T>(quest: IOptionsFilterRecepcionistasQuests, checked: boolean, array: T[]) => void
  recepcionistas: { cd_pessoa_fisica: string }[]
  locais: { nr_sequencia_local: string; ds_local: string }[]
}

export function NpsFilterMenuRecepcionistas({
  optionsFilter,
  onChangeFilter,
  onSetAll,
  recepcionistas,
  locais,
}: NpsFilterMenuRecepcionistasProps) {
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

  const filterKeys: IOptionsFilterRecepcionistasQuests[] = ['resp1', 'cd_pessoa_fisica', 'unidade', 'local']

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
            {/* Somente com comentários */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/40">
              <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={optionsFilter.onlyComments ?? false}
                  onChange={(e) => onChangeFilter('onlyComments', '', e.target.checked)}
                  className="h-4 w-4 accent-cyan-500 rounded"
                />
                <span>Somente com comentários</span>
              </label>
            </div>

            {filterKeys.map((key, idx) => {
              const isLast = idx === filterKeys.length - 1
              const isOpen = openSections.has(key)
              const activeValues = optionsFilter[key] ?? []

              return (
                <div key={key} className={cn(!isLast && 'border-b border-gray-100 dark:border-gray-700/40')}>
                  <button
                    onClick={() => setOpenSections((prev) => {
                      const n = new Set(prev)
                      n.has(key) ? n.delete(key) : n.add(key)
                      return n
                    })}
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
                      {key === 'resp1' && (
                        <AvaliacaoSubFilter selected={activeValues} onChangeFilter={onChangeFilter} onSetAll={onSetAll} />
                      )}
                      {key === 'cd_pessoa_fisica' && (
                        <RecepcionistaSubFilter selected={activeValues} recepcionistas={recepcionistas} onChangeFilter={onChangeFilter} onSetAll={onSetAll} />
                      )}
                      {key === 'unidade' && (
                        <UnidadeSubFilter selected={activeValues} onChangeFilter={onChangeFilter} onSetAll={onSetAll} />
                      )}
                      {key === 'local' && (
                        <LocalSubFilter selected={activeValues} locais={locais} onChangeFilter={onChangeFilter} onSetAll={onSetAll} />
                      )}
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
      <input
        type="checkbox"
        ref={(el) => { if (el) el.indeterminate = indeterminate ?? false }}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-cyan-500 shrink-0"
      />
      <span>{label}</span>
    </label>
  )
}

function AvaliacaoSubFilter({ selected, onChangeFilter, onSetAll }: {
  selected: string[]
  onChangeFilter: (n: string, v: string, c: boolean) => void
  onSetAll: <T>(q: IOptionsFilterRecepcionistasQuests, c: boolean, arr: T[]) => void
}) {
  return (
    <>
      <CheckItem
        label="Todos"
        checked={selected.length === STAR_OPTIONS.length}
        indeterminate={selected.length > 0 && selected.length < STAR_OPTIONS.length}
        onChange={(c) => onSetAll('resp1', c, STAR_OPTIONS)}
      />
      {STAR_OPTIONS.map((star) => (
        <CheckItem
          key={star}
          label={'⭐️'.repeat(parseInt(star))}
          checked={selected.includes(star)}
          onChange={(c) => onChangeFilter('resp1', star, c)}
        />
      ))}
    </>
  )
}

function RecepcionistaSubFilter({ selected, recepcionistas, onChangeFilter, onSetAll }: {
  selected: string[]
  recepcionistas: { cd_pessoa_fisica: string }[]
  onChangeFilter: (n: string, v: string, c: boolean) => void
  onSetAll: <T>(q: IOptionsFilterRecepcionistasQuests, c: boolean, arr: T[]) => void
}) {
  const unique = [...new Set(recepcionistas.map((r) => r.cd_pessoa_fisica))].sort()
  return (
    <>
      <CheckItem
        label="Todos"
        checked={selected.length === unique.length}
        indeterminate={selected.length > 0 && selected.length < unique.length}
        onChange={(c) => onSetAll('cd_pessoa_fisica', c, unique)}
      />
      {unique.map((cd) => (
        <CheckItem
          key={cd}
          label={cd}
          checked={selected.includes(cd)}
          onChange={(c) => onChangeFilter('cd_pessoa_fisica', cd, c)}
        />
      ))}
    </>
  )
}

function UnidadeSubFilter({ selected, onChangeFilter, onSetAll }: {
  selected: string[]
  onChangeFilter: (n: string, v: string, c: boolean) => void
  onSetAll: <T>(q: IOptionsFilterRecepcionistasQuests, c: boolean, arr: T[]) => void
}) {
  return (
    <>
      <CheckItem
        label="Todos"
        checked={selected.length === UNIDADES.length}
        indeterminate={selected.length > 0 && selected.length < UNIDADES.length}
        onChange={(c) => onSetAll('unidade', c, UNIDADES.map((u) => u.cdUnidade))}
      />
      {UNIDADES.map((u) => (
        <CheckItem
          key={u.cdUnidade}
          label={u.dsUnidade}
          checked={selected.includes(u.cdUnidade)}
          onChange={(c) => onChangeFilter('unidade', u.cdUnidade, c)}
        />
      ))}
    </>
  )
}

function LocalSubFilter({ selected, locais, onChangeFilter, onSetAll }: {
  selected: string[]
  locais: { nr_sequencia_local: string; ds_local: string }[]
  onChangeFilter: (n: string, v: string, c: boolean) => void
  onSetAll: <T>(q: IOptionsFilterRecepcionistasQuests, c: boolean, arr: T[]) => void
}) {
  return (
    <>
      <CheckItem
        label="Todos"
        checked={selected.length === locais.length}
        indeterminate={selected.length > 0 && selected.length < locais.length}
        onChange={(c) => onSetAll('local', c, locais.map((l) => l.nr_sequencia_local))}
      />
      {locais.map((l) => (
        <CheckItem
          key={l.nr_sequencia_local}
          label={l.ds_local}
          checked={selected.includes(l.nr_sequencia_local)}
          onChange={(c) => onChangeFilter('local', l.nr_sequencia_local, c)}
        />
      ))}
    </>
  )
}
