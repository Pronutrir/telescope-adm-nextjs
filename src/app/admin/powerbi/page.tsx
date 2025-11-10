import React from 'react'
import { PageWrapper } from '@/components/layout'
import { BarChart3, AlertCircle } from 'lucide-react'
import { listPowerBIReports } from '@/app/actions/powerbi/embed'
import { PowerBIClient } from './PowerBIClient'

/**
 * 📊 Página de Relatórios Power BI (Server Component)
 * 
 * Busca dados do Power BI no servidor de forma segura
 * - ✅ Lista de relatórios carregada no servidor
 * - ✅ Credenciais do Power BI nunca expostas ao cliente
 * - ✅ Embed tokens gerados sob demanda
 * - ✅ Seleção dinâmica de workspace
 */
export default async function PowerBIPage() {
  // Buscar relatórios do workspace padrão no servidor
  const defaultWorkspaceId = process.env.POWERBI_WORKSPACE_ID || ''
  const result = await listPowerBIReports(defaultWorkspaceId)

  return (
    <PageWrapper maxWidth="full" spacing="none">
      <div className="space-y-4 px-6 py-4">
        {/* Header */}
        <PowerBIHeader />

        {/* Conteúdo */}
        {result.sucesso ? (
          <PowerBIClient 
            initialReports={result.reports} 
            initialWorkspaceId={defaultWorkspaceId}
          />
        ) : (
          <ErrorMessage message={result.erro || 'Erro ao carregar relatórios'} />
        )}
      </div>
    </PageWrapper>
  )
}

function PowerBIHeader() {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-blue-50 dark:bg-gray-700">
        <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <h1 className="text-2xl font-bold">Relatórios Power BI</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Visualize e analise seus Dados
        </p>
      </div>
    </div>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="p-8 rounded-lg border bg-white dark:bg-gray-800 border-red-200 dark:border-red-900 text-center">
      <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
      <h3 className="text-lg font-medium mb-2 text-red-700 dark:text-red-400">
        Erro ao carregar relatórios
      </h3>
      <p className="text-red-600 dark:text-red-300 mb-4">{message}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Verifique as configurações do Power BI no arquivo .env.local
      </p>
    </div>
  )
}
