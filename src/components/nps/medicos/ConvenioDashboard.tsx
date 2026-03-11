'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Search, Download, Loader2 } from 'lucide-react'
import { useConvenioDashboard } from './useConvenioDashboard'
import { MedicosDashboardCards } from './MedicosDashboardCards'
import { MedicosSatisfacaoCharts } from './MedicosSatisfacaoCharts'
import { NpsDatePicker } from '../NpsDatePicker'

const ConvenioDashboard: React.FC = () => {
  const {
    formik, printRef, periodLegend,
    convenioOptions, isLoadingConvenios,
    data, isFetching, isSuccess, handleCaptureClick,
  } = useConvenioDashboard()

  return (
    <div className="flex flex-col gap-6">
      {/* Filtros */}
      <div className="bg-white dark:bg-[#212845] rounded-xl p-6 border border-gray-200 dark:border-gray-700/20 shadow-sm">
        <form onSubmit={formik.handleSubmit} className="flex flex-wrap items-end gap-4">
          <NpsDatePicker
            label="Período inicial"
            name="startDate"
            value={formik.values.startDate}
            onChange={(name, val) => formik.setFieldValue(name, val)}
            error={formik.errors.startDate}
            touched={formik.touched.startDate}
          />
          <NpsDatePicker
            label="Período final"
            name="endDate"
            value={formik.values.endDate}
            onChange={(name, val) => formik.setFieldValue(name, val)}
            error={formik.errors.endDate}
            touched={formik.touched.endDate}
          />
          <div className="flex-1 min-w-[240px]">
            <label className="text-gray-700 dark:text-white text-sm mb-1 block">Convênio</label>
            <select
              name="cdConvenio"
              value={formik.values.cdConvenio}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoadingConvenios}
              className={cn(
                'w-full rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border',
                formik.errors.cdConvenio && formik.touched.cdConvenio ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
                'disabled:opacity-50',
              )}
            >
              <option value="" disabled>Selecione um convênio</option>
              {convenioOptions.map((c) => (
                <option key={c.cD_CONVENIO} value={c.cD_CONVENIO}>{c.dS_CONVENIO}</option>
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

      {/* Dashboard exportável */}
      <div ref={printRef} className="bg-white dark:bg-[#212845] rounded-xl p-6 border border-gray-200 dark:border-gray-700/20 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          NPS por Convênio
        </h1>
        {periodLegend && (
          <p className="text-lg font-bold text-cyan-400">{periodLegend}</p>
        )}
        <MedicosDashboardCards
          data={data as any}
          mode="convenio"
          porcentagem={data?.porcentageM_CONVENIO}
        />
        {data && (
          <MedicosSatisfacaoCharts
            satisfacaoAtendimento={data.satisfacaO_CONVENIO}
            satisfacaoTempoEspera={data.satisfacaO_TEMPO_ESPERA}
          />
        )}
      </div>
    </div>
  )
}

export default ConvenioDashboard
