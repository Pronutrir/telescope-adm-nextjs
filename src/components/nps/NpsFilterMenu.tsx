'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, SlidersHorizontal, Frown, Annoyed, Smile, X } from 'lucide-react'
import type { IOptionsFilter, IOptionsFilterQuests, IMedico, IConvenio, IEspecialidade } from '@/types/nps'
import { UNIDADES } from './npsHelpers'

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

const STAR_OPTIONS = [
  { value: 'Muito insatisfeito', label: '1 estrela' },
  { value: 'Insatisfeito', label: '2 estrelas' },
  { value: 'Indiferente', label: '3 estrelas' },
  { value: 'Satisfeito', label: '4 estrelas' },
  { value: 'Muito satisfeito', label: '5 estrelas' },
]

// Count active filters
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

      {/* Filter panel */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[300px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1b2030] shadow-2xl">

          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700/60 px-4 py-3">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filtros</span>
            <button
              onClick={() => setOpen(false)}
              className="rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">

            {/* Only comments */}
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

            {/* Filter sections */}
            {filterKeys.map((key, idx) => {
              const isLast = idx === filterKeys.length - 1
              const isOpen = openSections.has(key)
              const activeValues = optionsFilter[key] ?? []

              return (
                <div
                  key={key}
                  className={cn(!isLast && 'border-b border-gray-100 dark:border-gray-700/40')}
                >
                  {/* Section header */}
                  <button
                    onClick={() => toggleSection(key)}
                    className="flex w-full items-center justify-between px-4 py-3 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <span className={cn(
                      'font-medium',
                      isOpen ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-700 dark:text-gray-200',
                    )}>
                      {QUEST_NAMES[key]}
                    </span>
                    <div className="flex items-center gap-2">
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
                    <div className="pb-2 bg-gray-50/50 dark:bg-gray-800/20">
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
        label={
          <span className="flex items-center gap-2">
            <Frown size={15} color="rgba(255,25,1,1)" /> Detrator
          </span>
        }
        checked={selected.includes('Detrator')}
        onChange={(c) => onChangeFilter('nota', 'Detrator', c)}
      />
      <CheckItem
        label={
          <span className="flex items-center gap-2">
            <Annoyed size={15} color="rgba(200,170,0,1)" /> Neutro
          </span>
        }
        checked={selected.includes('Neutro')}
        onChange={(c) => onChangeFilter('nota', 'Neutro', c)}
      />
      <CheckItem
        label={
          <span className="flex items-center gap-2">
            <Smile size={15} color="rgba(34,197,94,1)" /> Promotor
          </span>
        }
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

// --- Shared checkbox item ---

function CheckItem({
  label,
  checked,
  indeterminate,
  onChange,
}: {
  label: React.ReactNode
  checked: boolean
  indeterminate?: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 px-5 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
      <input
        type="checkbox"
        ref={(el) => {
          if (el) el.indeterminate = indeterminate ?? false
        }}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-cyan-500 shrink-0"
      />
      <span>{label}</span>
    </label>
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
