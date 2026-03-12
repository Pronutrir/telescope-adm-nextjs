'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import {
  ChevronDown, SlidersHorizontal, X,
  Star, UserRound, MapPin, Building2, MessageSquare,
} from 'lucide-react'
import type { IOptionsFilterRecepcionistas, IOptionsFilterRecepcionistasQuests } from '@/types/nps'
import { UNIDADES } from '../npsHelpers'
import { CheckItem } from '../shared/CheckItem'

const SECTION_NAMES: Record<IOptionsFilterRecepcionistasQuests, string> = {
  resp1: 'Avaliação',
  cd_pessoa_fisica: 'Recepcionista',
  unidade: 'Unidade',
  local: 'Local de trabalho',
}

const SECTION_ICONS: Record<IOptionsFilterRecepcionistasQuests, React.ElementType> = {
  resp1: Star,
  cd_pessoa_fisica: UserRound,
  unidade: MapPin,
  local: Building2,
}

const SECTION_COLORS: Record<IOptionsFilterRecepcionistasQuests, { color: string; bg: string }> = {
  resp1: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  cd_pessoa_fisica: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  unidade: { color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-500/10' },
  local: { color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-500/10' },
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
                      onClick={() => setOpenSections((prev) => {
                        const n = new Set(prev)
                        n.has(key) ? n.delete(key) : n.add(key)
                        return n
                      })}
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
        </div>
      )}
    </div>
  )
}



function AvaliacaoSubFilter({ selected, onChangeFilter, onSetAll }: {
  selected: string[]
  onChangeFilter: (n: string, v: string, c: boolean) => void
  onSetAll: <T>(q: IOptionsFilterRecepcionistasQuests, c: boolean, arr: T[]) => void
}) {
  const starLabels = ['1 estrela', '2 estrelas', '3 estrelas', '4 estrelas', '5 estrelas']
  return (
    <>
      <CheckItem
        label="Todos"
        checked={selected.length === STAR_OPTIONS.length}
        indeterminate={selected.length > 0 && selected.length < STAR_OPTIONS.length}
        onChange={(c) => onSetAll('resp1', c, STAR_OPTIONS)}
      />
      {STAR_OPTIONS.map((star, idx) => (
        <CheckItem
          key={star}
          label={
            <span className="flex items-center gap-2">
              <span className="flex items-center gap-0.5">
                {Array.from({ length: parseInt(star) }).map((_, i) => (
                  <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                ))}
              </span>
              <span>{starLabels[idx]}</span>
            </span>
          }
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
