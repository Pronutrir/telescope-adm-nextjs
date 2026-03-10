'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { IMedico } from '@/types/nps'

interface Props {
  options: IMedico[]
  value: IMedico[]
  onChange: (selected: IMedico[]) => void
  disabled?: boolean
}

const MedicosMultiSelect: React.FC<Props> = ({ options, value, onChange, disabled }) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const safeOptions = Array.isArray(options) ? options : []
  const filtered = safeOptions.filter((m) =>
    m.nM_GUERRA.toLowerCase().includes(search.toLowerCase()),
  )

  const toggle = (medico: IMedico) => {
    const isSelected = value.some((m) => m.cD_PESSOA_FISICA === medico.cD_PESSOA_FISICA)
    onChange(
      isSelected
        ? value.filter((m) => m.cD_PESSOA_FISICA !== medico.cD_PESSOA_FISICA)
        : [...value, medico],
    )
  }

  const label = value.length === 0 ? 'Selecione médico(s)' : `${value.length} selecionado(s)`

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex items-center gap-2 w-full min-w-[200px] px-3 py-2 text-sm rounded-lg border',
          'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
          'disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
        )}
      >
        <span className="flex-1 text-left truncate">{label}</span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              placeholder="Buscar médico..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filtered.map((medico, idx) => {
              const selected = value.some((m) => m.cD_PESSOA_FISICA === medico.cD_PESSOA_FISICA)
              return (
                <label
                  key={`${medico.cD_PESSOA_FISICA}-${idx}`}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggle(medico)}
                    className="cursor-pointer"
                  />
                  <span className="text-sm text-gray-900 dark:text-white truncate">
                    {medico.nM_GUERRA}
                  </span>
                </label>
              )
            })}
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-sm text-gray-500">Nenhum médico encontrado</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MedicosMultiSelect
