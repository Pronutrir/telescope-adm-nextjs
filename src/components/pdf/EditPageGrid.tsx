/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { FileText } from 'lucide-react'

interface PageInfo {
  pageNumber: number
  selected: boolean
  thumbnail?: string
}

interface EditPageGridProps {
  isDark: boolean
  pages: PageInfo[]
  onTogglePage: (pageNumber: number) => void
}

export const EditPageGrid: React.FC<EditPageGridProps> = ({ isDark, pages, onTogglePage }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-96 overflow-y-auto">
    {pages.map((page) => (
      <div
        key={page.pageNumber}
        onClick={() => onTogglePage(page.pageNumber)}
        className={cn(
          'relative cursor-pointer rounded-lg border-2 p-2 transition-all duration-200 hover:shadow-md',
          page.selected
            ? isDark ? 'border-green-500 bg-green-900/20' : 'border-green-500 bg-green-50'
            : isDark ? 'border-red-500 bg-red-900/20' : 'border-red-300 bg-red-50'
        )}
      >
        <div className="absolute top-1 right-1 z-10">
          <div className={cn(
            'w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold',
            page.selected ? 'bg-green-500 border-green-500 text-white' : 'bg-red-500 border-red-500 text-white'
          )}>
            {page.selected ? '✓' : '✗'}
          </div>
        </div>
        <div className="aspect-[3/4] mb-2 rounded overflow-hidden bg-white border">
          {page.thumbnail ? (
            <img src={page.thumbnail} alt={`Página ${page.pageNumber}`} className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700">
              <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-1" />
              <span className="text-xs text-gray-400 dark:text-gray-500">PDF</span>
            </div>
          )}
        </div>
        <div className="text-center space-y-1">
          <div className={cn('text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700')}>
            Página {page.pageNumber}
          </div>
          <div className={cn(
            'text-xs px-2 py-1 rounded-full font-medium',
            page.selected
              ? isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'
              : isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-700'
          )}>
            {page.selected ? 'Manter' : 'Excluir'}
          </div>
        </div>
      </div>
    ))}
  </div>
)
