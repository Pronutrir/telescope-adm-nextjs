'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import {
  ChevronDown, SlidersHorizontal, Frown, Annoyed, Smile, X,
  Star, Headphones, Clock, Stethoscope, TrendingUp, MapPin,
  UserRound, Shield, BookOpen, MessageSquare,
} from 'lucide-react'
import type { IOptionsFilter, IOptionsFilterQuests, IMedico, IConvenio, IEspecialidade } from '@/types/nps'
import { UNIDADES } from './npsHelpers'
import { CheckItem } from './shared/CheckItem'

// --- Types ---

interface NpsFilterMenuProps {
  optionsFilter: IOptionsFilter
  onChangeFilter: (name: string, value: string, checked: boolean) => void
  onSetAllQuestions: (quest: string, checked: boolean) => void
  onSetAll: <T>(quest: IOptionsFilterQuests, checked: boolean, array: T[]) => void
  medicos: IMedico[]
  convenios: IConvenio[]
  especialidades: IEspecialidade[]
}

const QUEST_NAMES: Record<IOptionsFilterQuests, string> = {
  quest1: 'Marcação consultas',
  quest2: 'Atendimento recepção',
  quest3: 'Tempo em espera',
  quest4: 'Médico parceiro',
  nota: 'NPS',
  unidade: 'Unidade',
  profissional: 'Médico',
  convenio: 'Convênio',
  especialidade: 'Especialidade',
}

const QUEST_ICONS: Record<IOptionsFilterQuests, React.ElementType> = {
  quest1: Star,
  quest2: Headphones,
  quest3: Clock,
  quest4: Stethoscope,
  nota: TrendingUp,
  unidade: MapPin,
  profissional: UserRound,
  convenio: Shield,
  especialidade: BookOpen,
}

const QUEST_COLORS: Record<IOptionsFilterQuests, { color: string; bg: string }> = {
  quest1: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  quest2: { color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-500/10' },
  quest3: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  quest4: { color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-500/10' },
  nota: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  unidade: { color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-500/10' },
  profissional: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  convenio: { color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
  especialidade: { color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-500/10' },
}

const STAR_OPTIONS = [
  { value: 'Muito insatisfeito', label: '1 estrela' },
  { value: 'Insatisfeito', label: '2 estrelas' },
  { value: 'Indiferente', label: '3 estrelas' },
  { value: 'Satisfeito', label: '4 estrelas' },
  { value: 'Muito satisfeito', label: '5 estrelas' },
]

function countActiveFilters(optionsFilter: IOptionsFilter): number {
  let count = 0
  if (optionsFilter.onlyComments) count++
  const keys: IOptionsFilterQuests[] = ['quest1', 'quest2', 'quest3', 'quest4', 'nota', 'unidade', 'profissional', 'convenio', 'especialidade']
  for (const key of keys) {
    if ((optionsFilter[key] ?? []).length > 0) count++
  }
  return count
}

// --- Component ---

export function NpsFilterMenu({
  optionsFilter,
  onChangeFilter,
  onSetAllQuestions,
  onSetAll,
  medicos,
  convenios,
  especialidades,
}: NpsFilterMenuProps) {
  const [open, setOpen] = useState(false)
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())
  const menuRef = useRef<HTMLDivElement>(null)

  const activeCount = countActiveFilters(optionsFilter)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function toggleSection(key: string) {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const filterKeys = (Object.keys(optionsFilter).filter(
    (k) => k !== 'onlyComments',
  ) as IOptionsFilterQuests[])

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
                {/* Toggle switch */}
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
              const Icon = QUEST_ICONS[key]
              const { color, bg } = QUEST_COLORS[key]

              return (
                <div key={key} className="rounded-xl border border-gray-100 dark:border-gray-700/40 overflow-hidden">
                  {/* Section header */}
                  <button
                    onClick={() => toggleSection(key)}
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
                        {QUEST_NAMES[key]}
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
                      {key.startsWith('quest') && (
                        <QuestSubFilter
                          quest={key}
                          selected={activeValues}
                          onChangeFilter={onChangeFilter}
                          onSetAll={onSetAllQuestions}
                          isQuest1={key === 'quest1'}
                        />
                      )}
                      {key === 'nota' && (
                        <NotaSubFilter
                          selected={activeValues}
                          onChangeFilter={onChangeFilter}
                          onSetAll={onSetAll}
                        />
                      )}
                      {key === 'unidade' && (
                        <UnidadeSubFilter
                          selected={activeValues}
                          onChangeFilter={onChangeFilter}
                          onSetAll={onSetAll}
                        />
                      )}
                      {key === 'profissional' && (
                        <ProfissionalSubFilter
                          selected={activeValues}
                          medicos={medicos}
                          onChangeFilter={onChangeFilter}
                          onSetAll={onSetAll}
                        />
                      )}
                      {key === 'convenio' && (
                        <ConvenioSubFilter
                          selected={activeValues}
                          convenios={convenios}
                          onChangeFilter={onChangeFilter}
                          onSetAll={onSetAll}
                        />
                      )}
                      {key === 'especialidade' && (
                        <EspecialidadeSubFilter
                          selected={activeValues}
                          especialidades={especialidades}
                          onChangeFilter={onChangeFilter}
                          onSetAll={onSetAll}
                        />
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

// --- Quest (stars) sub-filter ---

function QuestSubFilter({
  quest,
  selected,
  onChangeFilter,
  onSetAll,
  isQuest1,
}: {
  quest: string
  selected: string[]
  onChangeFilter: (name: string, value: string, checked: boolean) => void
  onSetAll: (quest: string, checked: boolean) => void
  isQuest1: boolean
}) {
  const opts = STAR_OPTIONS.map((o) =>
    isQuest1 && o.value === 'Muito satisfeito' ? { ...o, value: 'Muito_satisfeito' } : o,
  )

  return (
    <>
      <CheckItem
        label="Todos"
        checked={selected.length === 5}
        indeterminate={selected.length > 0 && selected.length < 5}
        onChange={(c) => onSetAll(quest, c)}
      />
      {opts.map((o) => (
        <CheckItem
          key={o.value}
          label={o.label}
          checked={selected.includes(o.value)}
          onChange={(c) => onChangeFilter(quest, o.value, c)}
        />
      ))}
    </>
  )
}

// --- Nota sub-filter ---

function NotaSubFilter({
  selected,
  onChangeFilter,
  onSetAll,
}: {
  selected: string[]
  onChangeFilter: (name: string, value: string, checked: boolean) => void
  onSetAll: <T>(quest: IOptionsFilterQuests, checked: boolean, array: T[]) => void
}) {
  return (
    <>
      <CheckItem
        label="Todos"
        checked={selected.length === 3}
        indeterminate={selected.length > 0 && selected.length < 3}
        onChange={(c) => onSetAll('nota', c, ['Detrator', 'Neutro', 'Promotor'])}
      />
      <CheckItem
        label={<span className="flex items-center gap-2"><Frown size={14} className="text-red-500" /> Detrator</span>}
        checked={selected.includes('Detrator')}
        onChange={(c) => onChangeFilter('nota', 'Detrator', c)}
      />
      <CheckItem
        label={<span className="flex items-center gap-2"><Annoyed size={14} className="text-amber-500" /> Neutro</span>}
        checked={selected.includes('Neutro')}
        onChange={(c) => onChangeFilter('nota', 'Neutro', c)}
      />
      <CheckItem
        label={<span className="flex items-center gap-2"><Smile size={14} className="text-emerald-500" /> Promotor</span>}
        checked={selected.includes('Promotor')}
        onChange={(c) => onChangeFilter('nota', 'Promotor', c)}
      />
    </>
  )
}

// --- Unidade ---

function UnidadeSubFilter({
  selected,
  onChangeFilter,
  onSetAll,
}: {
  selected: string[]
  onChangeFilter: (name: string, value: string, checked: boolean) => void
  onSetAll: <T>(quest: IOptionsFilterQuests, checked: boolean, array: T[]) => void
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

// --- Profissional ---

function ProfissionalSubFilter({
  selected,
  medicos,
  onChangeFilter,
  onSetAll,
}: {
  selected: string[]
  medicos: IMedico[]
  onChangeFilter: (name: string, value: string, checked: boolean) => void
  onSetAll: <T>(quest: IOptionsFilterQuests, checked: boolean, array: T[]) => void
}) {
  const unique = removeDuplicates(medicos, 'cD_PESSOA_FISICA')
  return (
    <>
      <CheckItem
        label="Todos"
        checked={selected.length === unique.length}
        indeterminate={selected.length > 0 && selected.length < unique.length}
        onChange={(c) => onSetAll('profissional', c, unique.map((m) => m.cD_PESSOA_FISICA))}
      />
      {unique.map((m) => (
        <CheckItem
          key={m.cD_PESSOA_FISICA}
          label={m.nM_GUERRA}
          checked={selected.includes(m.cD_PESSOA_FISICA)}
          onChange={(c) => onChangeFilter('profissional', m.cD_PESSOA_FISICA, c)}
        />
      ))}
    </>
  )
}

// --- Convênio ---

function ConvenioSubFilter({
  selected,
  convenios,
  onChangeFilter,
  onSetAll,
}: {
  selected: string[]
  convenios: IConvenio[]
  onChangeFilter: (name: string, value: string, checked: boolean) => void
  onSetAll: <T>(quest: IOptionsFilterQuests, checked: boolean, array: T[]) => void
}) {
  return (
    <>
      <CheckItem
        label="Todos"
        checked={selected.length === convenios.length}
        indeterminate={selected.length > 0 && selected.length < convenios.length}
        onChange={(c) => onSetAll('convenio', c, convenios.map((cv) => cv.cD_CONVENIO.toString()))}
      />
      {convenios.map((cv) => (
        <CheckItem
          key={cv.cD_CONVENIO}
          label={cv.dS_CONVENIO}
          checked={selected.includes(cv.cD_CONVENIO.toString())}
          onChange={(c) => onChangeFilter('convenio', cv.cD_CONVENIO.toString(), c)}
        />
      ))}
    </>
  )
}

// --- Especialidade ---

function EspecialidadeSubFilter({
  selected,
  especialidades,
  onChangeFilter,
  onSetAll,
}: {
  selected: string[]
  especialidades: IEspecialidade[]
  onChangeFilter: (name: string, value: string, checked: boolean) => void
  onSetAll: <T>(quest: IOptionsFilterQuests, checked: boolean, array: T[]) => void
}) {
  return (
    <>
      <CheckItem
        label="Todos"
        checked={selected.length === especialidades.length}
        indeterminate={selected.length > 0 && selected.length < especialidades.length}
        onChange={(c) =>
          onSetAll('especialidade', c, especialidades.map((e) => e.cD_ESPECIALIDADE.toString()))
        }
      />
      {especialidades.map((e) => (
        <CheckItem
          key={e.cD_ESPECIALIDADE}
          label={e.dS_ESPECIALIDADE}
          checked={selected.includes(e.cD_ESPECIALIDADE.toString())}
          onChange={(c) => onChangeFilter('especialidade', e.cD_ESPECIALIDADE.toString(), c)}
        />
      ))}
    </>
  )
}



// --- Utils ---

function removeDuplicates<T>(array: T[], key: keyof T): T[] {
  const seen = new Set<unknown>()
  return array.filter((item) => {
    const k = item[key]
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}
