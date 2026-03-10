'use client'

import React from 'react'
import {
  Settings, Hospital, UserCheck, Car, HardHat, CircleEllipsis,
  AlarmClock, Coffee, FileClock, Paintbrush, Headset, MonitorCog,
  Stethoscope, PackageOpen,
} from 'lucide-react'
import NpsCard from './NpsCard'
import type { ISubclassificacaoDashboardValues } from '@/types/nps'

const SUBCLASS_ICONS: Record<number, React.ReactNode> = {
  1: <Settings size={22} />, 2: <Hospital size={22} />, 3: <UserCheck size={22} />,
  4: <Car size={22} />, 5: <HardHat size={22} />, 6: <CircleEllipsis size={22} />,
  7: <AlarmClock size={22} />, 8: <Coffee size={22} />, 9: <FileClock size={22} />,
  10: <Paintbrush size={22} />, 11: <Headset size={22} />, 12: <MonitorCog size={22} />,
  13: <Stethoscope size={22} />,
}

function formatCategoryKey(key: string) {
  if (key === 'notificacao') return 'Notificações'
  if (key === 'sugestao') return 'Sugestões'
  return key[0].toUpperCase() + key.substring(1) + 's'
}

const CATEGORY_KEYS = ['elogio', 'queixa', 'melhoria', 'notificacao', 'sugestao', 'agradecimento', 'neutro']

interface SubclassificationGridProps {
  data: ISubclassificacaoDashboardValues[]
}

export function SubclassificationGrid({ data }: SubclassificationGridProps) {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-gray-500">
        <PackageOpen size={80} strokeWidth={1} />
        <span className="text-sm">Não há dados a serem exibidos</span>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-4 justify-center overflow-x-auto py-4">
      {data.map((item, idx) => {
        const activeEntries = CATEGORY_KEYS
          .filter((key) => (item[key as keyof typeof item] as number) > 0)
          .map((key) => [key, item[key as keyof typeof item] as number] as const)

        return (
          <NpsCard.Root
            key={idx}
            themeColor="dark"
            className="!min-w-[170px] !max-w-[215px] !min-h-[140px] flex flex-col items-center justify-center gap-1"
            height="auto"
          >
            <div className="text-cyan-400">
              {SUBCLASS_ICONS[item.subclassificacao]}
            </div>
            <span
              className="text-center text-sm text-gray-700 dark:text-gray-100 truncate w-full px-2"
              title={item.dS_SUBCLASSIFICACAO ?? 'Sem motivos'}
            >
              {item.dS_SUBCLASSIFICACAO ?? 'Sem motivos'}
            </span>
            {activeEntries.length > 0 && (
              <div className="flex flex-wrap justify-around w-full gap-x-1 mt-1">
                {activeEntries.map(([key, val]) => (
                  <div key={key} className="flex flex-col items-center text-gray-500 dark:text-gray-300 text-xs">
                    <span>{formatCategoryKey(key)}</span>
                    <span className="text-gray-800 dark:text-white font-medium">{val}</span>
                  </div>
                ))}
              </div>
            )}
          </NpsCard.Root>
        )
      })}
    </div>
  )
}
