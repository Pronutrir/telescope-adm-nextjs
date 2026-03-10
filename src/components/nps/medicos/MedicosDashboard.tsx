'use client'

import React from 'react'
import { Search, Download, Loader2 } from 'lucide-react'
import { useMedicosDashboard } from './useMedicosDashboard'
import { MedicosDashboardCards } from './MedicosDashboardCards'
import { MedicosSatisfacaoCharts } from './MedicosSatisfacaoCharts'
import MedicosMultiSelect from './MedicosMultiSelect'
import { NpsDatePicker } from '../NpsDatePicker'

const MedicosDashboard: React.FC = () => {
  const {
    formik, printRef, periodLegend, selectedMedicos, setSelectedMedicos,
    medicoOptions, isLoadingMedicos, aggregated, isFetching, isSuccess, handleCaptureClick,
  } = useMedicosDashboard()

  const noMedico = selectedMedicos.length === 0

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
          <div className="flex-1 min-w-[200px]">
            <label className="text-gray-700 dark:text-white text-sm mb-1 block">Médico(s)</label>
            <MedicosMultiSelect
              options={medicoOptions}
              value={selectedMedicos}
              onChange={setSelectedMedicos}
              disabled={isLoadingMedicos}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isFetching || noMedico}
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
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white font-[Poppins]">
          NPS Médicos
        </h1>
        {periodLegend && (
          <p className="text-lg font-bold text-cyan-400 font-[Poppins]">{periodLegend}</p>
        )}
        <MedicosDashboardCards data={aggregated} mode="medico" />
        {aggregated && (
          <MedicosSatisfacaoCharts
            satisfacaoAtendimento={aggregated.satisfacaO_MEDICO}
            satisfacaoTempoEspera={aggregated.satisfacaO_TEMPO_ESPERA}
          />
        )}
      </div>
    </div>
  )
}

export default MedicosDashboard
