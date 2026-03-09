'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Search, Download, Loader2 } from 'lucide-react'
import { useAnswersDashboard } from './useAnswersDashboard'
import { DashboardCards } from './DashboardCards'
import { SubclassificationGrid } from './SubclassificationGrid'
import { SubclassificationFilter } from './SubclassificationFilter'
import { UNIDADES } from './npsHelpers'

const AnswersDashboard: React.FC = () => {
  const {
    formik, printRef, periodLegend, dashboardValues,
    filteredSubclassifications, isFetching, isSuccess,
    filter, handleChangeFilter, handleCaptureClick,
  } = useAnswersDashboard()

  return (
    <div className="flex flex-col gap-6">
      {/* Barra de filtros */}
      <div className="bg-white dark:bg-[#212845] rounded-xl p-6 border border-gray-200 dark:border-gray-700/20 shadow-sm">
        <form onSubmit={formik.handleSubmit} className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[140px]">
            <label className="text-gray-700 dark:text-white text-sm mb-1 block">Período inicial</label>
            <input
              type="date"
              name="startDate"
              value={formik.values.startDate ?? ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={cn(
                'w-full rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border',
                formik.errors.startDate && formik.touched.startDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
              )}
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="text-gray-700 dark:text-white text-sm mb-1 block">Período final</label>
            <input
              type="date"
              name="endDate"
              value={formik.values.endDate ?? ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={cn(
                'w-full rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border',
                formik.errors.endDate && formik.touched.endDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
              )}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-gray-700 dark:text-white text-sm mb-1 block">Unidade</label>
            <select
              name="cdUnidade"
              value={formik.values.cdUnidade}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={cn(
                'w-full rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border',
                formik.errors.cdUnidade && formik.touched.cdUnidade ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
              )}
            >
              <option value="" disabled>Selecione</option>
              {UNIDADES.map((u) => (
                <option key={u.cdUnidade} value={u.cdUnidade}>{u.dsUnidade}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isFetching}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              {isFetching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              Pesquisar
            </button>
            <button
              type="button"
              onClick={handleCaptureClick}
              disabled={!isSuccess}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 text-white text-sm font-medium hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <Download size={16} />
              Exportar
            </button>
          </div>
        </form>
      </div>

      {/* Área do dashboard (exportável) */}
      <div ref={printRef} className="bg-white dark:bg-[#212845] rounded-xl p-6 border border-gray-200 dark:border-gray-700/20 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl 2xl:text-3xl font-semibold text-gray-800 dark:text-white font-[Poppins]">
              Pesquisa de Satisfação Consultas
            </h1>
            {periodLegend && (
              <p className="text-lg 2xl:text-xl font-bold text-cyan-400 font-[Poppins]">
                {periodLegend}
              </p>
            )}
          </div>
        </div>

        <DashboardCards data={dashboardValues} />

        <div className="flex items-center gap-3 mt-8">
          <h2 className="text-lg 2xl:text-2xl font-semibold text-gray-800 dark:text-white font-[Poppins]">
            Quantitativo de classificações por motivos
          </h2>
          <SubclassificationFilter values={filter} onChange={handleChangeFilter} />
        </div>

        <SubclassificationGrid data={filteredSubclassifications} />
      </div>
    </div>
  )
}

export default AnswersDashboard
