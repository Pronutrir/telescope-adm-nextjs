'use client'

import { useState, useMemo, useCallback } from 'react'
import type { Order } from '@/types/nps'

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1
  if (b[orderBy] > a[orderBy]) return 1
  return 0
}

function getComparator<T>(order: Order, orderBy: keyof T) {
  return order === 'desc'
    ? (a: T, b: T) => descendingComparator(a, b, orderBy)
    : (a: T, b: T) => -descendingComparator(a, b, orderBy)
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number): T[] {
  const stabilized = array.map((el, index) => [el, index] as [T, number])
  stabilized.sort((a, b) => {
    const cmp = comparator(a[0], b[0])
    if (cmp !== 0) return cmp
    return a[1] - b[1]
  })
  return stabilized.map((el) => el[0])
}

interface UseNpsTableParams<T> {
  data: T[]
  order: Order
  orderBy: keyof T
  page: number
  initialRowsPerPage?: number
}

export function useNpsTable<T>({
  data,
  order,
  orderBy,
  page,
  initialRowsPerPage = 25,
}: UseNpsTableParams<T>) {
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage)

  const sortedData = useMemo(
    () => stableSort(data, getComparator(order, orderBy)),
    [data, order, orderBy],
  )

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(sortedData.length / rowsPerPage)),
    [sortedData.length, rowsPerPage],
  )

  const slice = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    return sortedData.slice(start, start + rowsPerPage)
  }, [sortedData, page, rowsPerPage])

  const range = useMemo(() => {
    const pages: number[] = []
    for (let i = 1; i <= totalPages; i++) pages.push(i)
    return pages
  }, [totalPages])

  const handleRowsPerPageChange = useCallback((newValue: number) => {
    setRowsPerPage(newValue)
  }, [])

  return { slice, range, rowsPerPage, setRowsPerPage: handleRowsPerPageChange, totalPages, sortedData }
}
