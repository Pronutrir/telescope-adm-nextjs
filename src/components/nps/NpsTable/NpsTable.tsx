'use client'

import { cn } from '@/lib/utils'
import type { NpsColumn, Order } from '@/types/nps'
import { NpsTableHeader } from './NpsTableHeader'
import { NpsTableBody } from './NpsTableBody'
import { NpsTableFooter } from './NpsTableFooter'
import { useNpsTable } from './useNpsTable'
import { PackageOpen } from 'lucide-react'

interface NpsTableProps<T> {
  columns: NpsColumn<T>[]
  data: T[]
  title?: string
  stickyHeader?: boolean
  order: Order
  orderBy: keyof T
  page: number
  onChangePage: (page: number) => void
  rowsPerPageOptions?: number[]
  selectedCount?: number
  isSelectedRow?: (item: T) => boolean
  keyExtractor: (item: T) => string
  className?: string
}

export function NpsTable<T>({
  columns,
  data,
  title,
  stickyHeader = true,
  order,
  orderBy,
  page,
  onChangePage,
  rowsPerPageOptions,
  selectedCount,
  isSelectedRow,
  keyExtractor,
  className,
}: NpsTableProps<T>) {
  const { slice, range, rowsPerPage, setRowsPerPage } = useNpsTable({
    data,
    order,
    orderBy,
    page,
    initialRowsPerPage: rowsPerPageOptions?.[0] ?? 25,
  })

  if (!slice.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-500 dark:text-gray-400">
        <PackageOpen size={60} strokeWidth={1} />
        <p className="font-[Poppins]">Não existem itens a serem exibidos</p>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col', className)}>
      {title && (
        <div className="flex items-center justify-between py-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
          {selectedCount != null && selectedCount > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400">{selectedCount} selecionado(s)</span>
          )}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="max-h-[550px] overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <table className="w-full border-collapse">
            <NpsTableHeader columns={columns} stickyHeader={stickyHeader} />
            <NpsTableBody
              data={slice}
              columns={columns}
              isSelectedRow={isSelectedRow}
              keyExtractor={keyExtractor}
            />
          </table>
        </div>

        <NpsTableFooter
          page={page}
          range={range}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions ? [...rowsPerPageOptions, data.length] : undefined}
          totalItems={data.length}
          onChangePage={onChangePage}
          onChangeRowsPerPage={setRowsPerPage}
        />
      </div>
    </div>
  )
}
