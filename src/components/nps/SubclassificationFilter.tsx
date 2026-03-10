'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { SlidersHorizontal } from 'lucide-react'
import type { TFilter } from '@/types/nps'

interface SubclassificationFilterProps {
  values: TFilter
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SUBCLASSIFICATIONS: { id: keyof TFilter; label: string }[] = [
  { id: 'general', label: 'Geral' },
  { id: 'medicalTeam', label: 'Equipe Médica' },
  { id: 'service', label: 'Atendimento' },
  { id: 'parking', label: 'Estacionamento' },
  { id: 'infrastructure', label: 'Infraestrutura' },
  { id: 'others', label: 'Outros' },
  { id: 'delay', label: 'Atraso' },
  { id: 'coffeeWater', label: 'Café ou Água' },
  { id: 'authorizationDelay', label: 'Atraso na autorização' },
  { id: 'cleaning', label: 'Limpeza' },
  { id: 'companyComunication', label: 'Comunicação com a empresa' },
  { id: 'services', label: 'Serviços' },
  { id: 'specialty', label: 'Especialidade' },
]

export function SubclassificationFilter({ values, onChange }: SubclassificationFilterProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const items = useMemo(
    () => SUBCLASSIFICATIONS.map((s) => ({ ...s, value: values[s.id] })),
    [values],
  )

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((p) => !p)}
        aria-label="Filtrar subclassificações"
        className="rounded p-1.5 text-gray-500 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
      >
        <SlidersHorizontal size={20} />
      </button>

      {open && (
        <div
          className={cn(
            'absolute left-full top-0 z-50 ml-1 min-w-[200px] max-h-[250px]',
            'overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#191e34] p-2 shadow-xl',
            'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600',
          )}
        >
          {items.map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <input
                type="checkbox"
                name={item.id}
                checked={item.value}
                onChange={onChange}
                className="accent-blue-500"
              />
              <span className="whitespace-nowrap">{item.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
