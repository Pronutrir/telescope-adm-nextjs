'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { SearchFilters, PDFCategory, PDFSortOption } from '@/types/pdf'
import {
    Search,
    Filter,
    X,
    Calendar,
    FolderOpen,
    SortAsc,
    SortDesc,
    ChevronDown,
    Check,
    FileText,
    Users,
    Building,
    Archive
} from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface SearchPDFProps {
    searchTerm: string
    filters: SearchFilters
    totalCount: number
    onSearchChange: (term: string) => void
    onFiltersChange: (filters: SearchFilters) => void
    onClearFilters: () => void
    className?: string
}

const CATEGORIES: { value: PDFCategory; label: string; icon: typeof FileText }[] = [
    { value: 'documentos', label: 'Documentos', icon: FileText },
    { value: 'contratos', label: 'Contratos', icon: Users },
    { value: 'relatorios', label: 'Relatórios', icon: Building },
    { value: 'outros', label: 'Outros', icon: Archive }
]

const SORT_OPTIONS: { value: PDFSortOption; label: string }[] = [
    { value: 'name_asc', label: 'Nome (A-Z)' },
    { value: 'name_desc', label: 'Nome (Z-A)' },
    { value: 'date_asc', label: 'Data (Mais Antigas)' },
    { value: 'date_desc', label: 'Data (Mais Recentes)' },
    { value: 'size_asc', label: 'Tamanho (Menor)' },
    { value: 'size_desc', label: 'Tamanho (Maior)' }
]

/**
 * Componente de busca e filtros para PDFs
 * Inclui campo de busca, filtros por categoria, data e ordenação
 */
export const SearchPDF: React.FC<SearchPDFProps> = ({
    searchTerm,
    filters,
    totalCount,
    onSearchChange,
    onFiltersChange,
    onClearFilters,
    className
}) => {
    const { isDark } = useTheme()
    const [ showFilters, setShowFilters ] = useState(false)
    const [ showCategoryDropdown, setShowCategoryDropdown ] = useState(false)
    const [ showSortDropdown, setShowSortDropdown ] = useState(false)

    const categoryDropdownRef = useRef<HTMLDivElement>(null)
    const sortDropdownRef = useRef<HTMLDivElement>(null)
    const filtersPanelRef = useRef<HTMLDivElement>(null)

    // Fechar dropdowns ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
                setShowCategoryDropdown(false)
            }
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
                setShowSortDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Contar filtros ativos
    const activeFiltersCount = Object.values(filters).filter(value => {
        if (Array.isArray(value)) return value.length > 0
        if (typeof value === 'string') return value.length > 0
        if (typeof value === 'object' && value !== null) {
            return Object.values(value).some(v => v !== null && v !== undefined && v !== '')
        }
        return false
    }).length

    // Handler para categoria
    const handleCategoryChange = (category: PDFCategory) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter(c => c !== category)
            : [ ...filters.categories, category ]

        onFiltersChange({
            ...filters,
            categories: newCategories
        })
    }

    // Handler para data
    const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
        onFiltersChange({
            ...filters,
            dateRange: {
                ...filters.dateRange,
                [ field ]: value
            }
        })
    }

    // Handler para ordenação
    const handleSortChange = (sortBy: PDFSortOption) => {
        onFiltersChange({
            ...filters,
            sortBy
        })
        setShowSortDropdown(false)
    }

    // Obter label da categoria selecionada
    const getSelectedCategoriesLabel = () => {
        if (filters.categories.length === 0) return 'Todas as categorias'
        if (filters.categories.length === 1) {
            const category = CATEGORIES.find(c => c.value === filters.categories[ 0 ])
            return category?.label || filters.categories[ 0 ]
        }
        return `${filters.categories.length} categorias`
    }

    // Obter label da ordenação
    const getCurrentSortLabel = () => {
        const sort = SORT_OPTIONS.find(s => s.value === filters.sortBy)
        return sort?.label || 'Ordenar por...'
    }

    return (
        <div className={twMerge('space-y-4', className)}>
            {/* Barra de busca principal */}
            <div className="flex gap-3">
                {/* Campo de busca */}
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className={twMerge(
                            'h-5 w-5',
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        )} />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar por nome, conteúdo ou tags..."
                        className={twMerge(
                            'w-full pl-10 pr-4 py-3 border rounded-lg transition-colors',
                            'focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                            isDark
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        )}
                    />
                </div>

                {/* Botão de filtros */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={twMerge(
                        'px-4 py-3 border rounded-lg transition-colors flex items-center gap-2 font-medium relative',
                        showFilters
                            ? isDark
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-blue-500 border-blue-500 text-white'
                            : isDark
                                ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    )}
                >
                    <Filter className="w-4 h-4" />
                    Filtros
                    {activeFiltersCount > 0 && (
                        <span className={twMerge(
                            'absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold',
                            'bg-red-500 text-white'
                        )}>
                            {activeFiltersCount}
                        </span>
                    )}
                </button>

                {/* Dropdown de ordenação */}
                <div className="relative" ref={sortDropdownRef}>
                    <button
                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                        className={twMerge(
                            'px-4 py-3 border rounded-lg transition-colors flex items-center gap-2 font-medium',
                            isDark
                                ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        )}
                    >
                        {filters.sortBy.includes('asc') ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                        <span className="hidden sm:inline">{getCurrentSortLabel()}</span>
                        <ChevronDown className={twMerge(
                            'w-4 h-4 transition-transform',
                            showSortDropdown && 'rotate-180'
                        )} />
                    </button>

                    {/* Menu de ordenação */}
                    {showSortDropdown && (
                        <div className={twMerge(
                            'absolute right-0 top-full mt-2 w-48 py-2 border rounded-lg shadow-lg z-20',
                            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        )}>
                            {SORT_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleSortChange(option.value)}
                                    className={twMerge(
                                        'w-full px-4 py-2 text-left transition-colors flex items-center gap-3',
                                        filters.sortBy === option.value
                                            ? isDark
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-blue-500 text-white'
                                            : isDark
                                                ? 'text-gray-300 hover:bg-gray-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                    )}
                                >
                                    {filters.sortBy === option.value && <Check className="w-4 h-4" />}
                                    <span className={filters.sortBy === option.value ? '' : 'ml-7'}>
                                        {option.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Painel de filtros */}
            {showFilters && (
                <div
                    ref={filtersPanelRef}
                    className={twMerge(
                        'p-4 border rounded-lg space-y-4',
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                    )}
                >
                    <div className="flex items-center justify-between">
                        <h3 className={twMerge(
                            'text-lg font-medium',
                            isDark ? 'text-white' : 'text-gray-900'
                        )}>
                            Filtros Avançados
                        </h3>
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={onClearFilters}
                                className={twMerge(
                                    'text-sm font-medium transition-colors flex items-center gap-1',
                                    isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'
                                )}
                            >
                                <X className="w-4 h-4" />
                                Limpar Filtros
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Filtro por categoria */}
                        <div>
                            <label className={twMerge(
                                'block text-sm font-medium mb-2',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Categoria
                            </label>
                            <div className="relative" ref={categoryDropdownRef}>
                                <button
                                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                    className={twMerge(
                                        'w-full px-3 py-2 border rounded-lg transition-colors flex items-center justify-between',
                                        isDark
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-white border-gray-300 text-gray-900'
                                    )}
                                >
                                    <span className="flex items-center gap-2">
                                        <FolderOpen className="w-4 h-4" />
                                        {getSelectedCategoriesLabel()}
                                    </span>
                                    <ChevronDown className={twMerge(
                                        'w-4 h-4 transition-transform',
                                        showCategoryDropdown && 'rotate-180'
                                    )} />
                                </button>

                                {showCategoryDropdown && (
                                    <div className={twMerge(
                                        'absolute top-full left-0 right-0 mt-1 py-2 border rounded-lg shadow-lg z-10',
                                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                                    )}>
                                        {CATEGORIES.map((category) => {
                                            const isSelected = filters.categories.includes(category.value)
                                            const IconComponent = category.icon

                                            return (
                                                <button
                                                    key={category.value}
                                                    onClick={() => handleCategoryChange(category.value)}
                                                    className={twMerge(
                                                        'w-full px-3 py-2 text-left transition-colors flex items-center gap-3',
                                                        isSelected
                                                            ? isDark
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-blue-500 text-white'
                                                            : isDark
                                                                ? 'text-gray-300 hover:bg-gray-700'
                                                                : 'text-gray-700 hover:bg-gray-50'
                                                    )}
                                                >
                                                    <IconComponent className="w-4 h-4" />
                                                    {category.label}
                                                    {isSelected && <Check className="w-4 h-4 ml-auto" />}
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Filtro por data inicial */}
                        <div>
                            <label className={twMerge(
                                'block text-sm font-medium mb-2',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Data Inicial
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className={twMerge(
                                        'h-4 w-4',
                                        isDark ? 'text-gray-400' : 'text-gray-500'
                                    )} />
                                </div>
                                <input
                                    type="date"
                                    value={filters.dateRange.start}
                                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                                    className={twMerge(
                                        'w-full pl-10 pr-3 py-2 border rounded-lg transition-colors',
                                        'focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                                        isDark
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-white border-gray-300 text-gray-900'
                                    )}
                                />
                            </div>
                        </div>

                        {/* Filtro por data final */}
                        <div>
                            <label className={twMerge(
                                'block text-sm font-medium mb-2',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Data Final
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className={twMerge(
                                        'h-4 w-4',
                                        isDark ? 'text-gray-400' : 'text-gray-500'
                                    )} />
                                </div>
                                <input
                                    type="date"
                                    value={filters.dateRange.end}
                                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                                    className={twMerge(
                                        'w-full pl-10 pr-3 py-2 border rounded-lg transition-colors',
                                        'focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                                        isDark
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-white border-gray-300 text-gray-900'
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Resumo dos resultados */}
                    {totalCount > 0 && (
                        <div className={twMerge(
                            'pt-4 border-t',
                            isDark ? 'border-gray-700' : 'border-gray-200'
                        )}>
                            <p className={twMerge(
                                'text-sm',
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            )}>
                                {totalCount} {totalCount === 1 ? 'documento encontrado' : 'documentos encontrados'}
                                {searchTerm && ` para "${searchTerm}"`}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
