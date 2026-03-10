'use client'

import { cn } from '@/lib/utils'
import type { NpsColumn } from '@/types/nps'

interface NpsTableBodyProps<T> {
  data: T[]
  columns: NpsColumn<T>[]
  isSelectedRow?: (item: T) => boolean
  keyExtractor: (item: T) => string
}

export function NpsTableBody<T>({
  data,
  columns,
  isSelectedRow,
  keyExtractor,
}: NpsTableBodyProps<T>) {
  return (
    <tbody>
      {data.map((row) => {
        const selected = isSelectedRow?.(row) ?? false
        const rowBg = selected
          ? 'bg-blue-50 dark:bg-blue-900/20'
          : 'bg-white dark:bg-[#212845]'
        return (
          <tr
            key={keyExtractor(row)}
            className={cn(
              'border-b border-gray-100 dark:border-gray-700/30 transition-colors text-gray-700 dark:text-gray-300',
              rowBg,
              !selected && 'hover:bg-gray-50 dark:hover:bg-white/5',
            )}
          >
            {columns.map((col) =>
              col.renderValue ? (
                <td
                  key={col.id}
                  className={cn(
                    'px-3 py-2 text-sm',
                    col.sticky && cn('sticky z-10', rowBg),
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                  )}
                  style={{
                    minWidth: col.minWidth,
                    maxWidth: col.maxWidth,
                    left: col.sticky && col.stickyRight == null ? (col.stickyLeft ?? 0) : undefined,
                    right: col.stickyRight != null ? col.stickyRight : undefined,
                  }}
                >
                  {col.renderValue(row)}
                </td>
              ) : (
                <td
                  key={col.id}
                  className={cn(
                    'px-3 py-2 text-sm text-center',
                    col.sticky && cn('sticky z-10', rowBg),
                  )}
                  style={{
                    minWidth: col.minWidth,
                    maxWidth: col.maxWidth,
                    left: col.sticky && col.stickyRight == null ? (col.stickyLeft ?? 0) : undefined,
                    right: col.stickyRight != null ? col.stickyRight : undefined,
                  }}
                >
                  {String(row[col.id as keyof T] ?? '')}
                </td>
              ),
            )}
          </tr>
        )
      })}
    </tbody>
  )
}
