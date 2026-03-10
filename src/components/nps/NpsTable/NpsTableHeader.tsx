'use client'

import { cn } from '@/lib/utils'
import type { NpsColumn } from '@/types/nps'

interface NpsTableHeaderProps<T> {
  columns: NpsColumn<T>[]
  stickyHeader?: boolean
}

export function NpsTableHeader<T>({ columns, stickyHeader }: NpsTableHeaderProps<T>) {
  return (
    <thead className={cn(stickyHeader && 'sticky top-0 z-20')}>
      <tr className="border border-gray-200 dark:border-gray-700/30 bg-transparent">
        {columns.map((col) => (
          <th
            key={col.id}
            className={cn(
              'px-3 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide whitespace-nowrap',
              'bg-gray-100 dark:bg-[#1b2030]',
              col.align === 'center' && 'text-center',
              col.align === 'right' && 'text-right',
              col.align === 'left' && 'text-left',
              col.sticky && 'sticky z-30',
            )}
            style={{
              minWidth: col.minWidth,
              maxWidth: col.maxWidth,
              left: col.sticky && col.stickyRight == null ? (col.stickyLeft ?? 0) : undefined,
              right: col.stickyRight != null ? col.stickyRight : undefined,
            }}
          >
            {col.renderHeader ? col.renderHeader() : col.label}
          </th>
        ))}
      </tr>
    </thead>
  )
}
