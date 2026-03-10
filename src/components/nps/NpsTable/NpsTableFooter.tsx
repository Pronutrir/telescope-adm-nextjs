'use client'

import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface NpsTableFooterProps {
  page: number
  range: number[]
  rowsPerPage: number
  rowsPerPageOptions?: number[]
  totalItems: number
  onChangePage: (page: number) => void
  onChangeRowsPerPage?: (value: number) => void
}

export function NpsTableFooter({
  page,
  range,
  rowsPerPage,
  rowsPerPageOptions,
  totalItems,
  onChangePage,
  onChangeRowsPerPage,
}: NpsTableFooterProps) {
  const start = (page - 1) * rowsPerPage + 1
  const end = Math.min(page * rowsPerPage, totalItems)

  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <span>Linhas por página:</span>
        <select
          value={rowsPerPage}
          onChange={(e) => onChangeRowsPerPage?.(Number(e.target.value))}
          className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent px-2 py-1 text-sm text-gray-700 dark:text-gray-300"
        >
          {(rowsPerPageOptions ?? [10, 25, 50]).map((opt) => (
            <option key={opt} value={opt}>
              {opt === totalItems ? 'Todos' : opt}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <span>
          {totalItems > 0 ? `${start}-${end} de ${totalItems}` : '0 itens'}
        </span>

        <div className="flex items-center gap-1">
          <button
            aria-label="Página anterior"
            disabled={page <= 1}
            onClick={() => onChangePage(page - 1)}
            className={cn(
              'rounded p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer',
              page <= 1 && 'cursor-not-allowed opacity-40',
            )}
          >
            <ChevronLeft size={18} />
          </button>

          {range.length <= 7 ? (
            range.map((p) => (
              <button
                key={p}
                onClick={() => onChangePage(p)}
                className={cn(
                  'min-w-[28px] rounded px-1.5 py-0.5 text-xs transition-colors cursor-pointer',
                  p === page
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700',
                )}
              >
                {p}
              </button>
            ))
          ) : (
            <>
              <button
                onClick={() => onChangePage(1)}
                className={cn(
                  'min-w-[28px] rounded px-1.5 py-0.5 text-xs transition-colors cursor-pointer',
                  page === 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700',
                )}
              >
                1
              </button>
              {page > 3 && <span className="px-1">…</span>}
              {range
                .filter((p) => p > 1 && p < range.length && Math.abs(p - page) <= 1)
                .map((p) => (
                  <button
                    key={p}
                    onClick={() => onChangePage(p)}
                    className={cn(
                      'min-w-[28px] rounded px-1.5 py-0.5 text-xs transition-colors',
                      p === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700',
                    )}
                  >
                    {p}
                  </button>
                ))}
              {page < range.length - 2 && <span className="px-1">…</span>}
              <button
                onClick={() => onChangePage(range.length)}
                className={cn(
                  'min-w-[28px] rounded px-1.5 py-0.5 text-xs transition-colors cursor-pointer',
                  page === range.length ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700',
                )}
              >
                {range.length}
              </button>
            </>
          )}

          <button
            aria-label="Próxima página"
            disabled={page >= range.length}
            onClick={() => onChangePage(page + 1)}
            className={cn(
              'rounded p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer',
              page >= range.length && 'cursor-not-allowed opacity-40',
            )}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
