'use client'

import React, { useState, useEffect } from 'react'
import { PowerBIEmbed } from 'powerbi-client-react'
import { models } from 'powerbi-client'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import { twMerge } from 'tailwind-merge'
import { Loader2, AlertCircle, BarChart3 } from 'lucide-react'
import { getPowerBIEmbedToken } from '@/app/actions/powerbi/embed'

interface PowerBIReportProps {
  reportId: string
  workspaceId?: string
  reportName?: string
  className?: string
  height?: string
}

/**
 * 📊 Componente Power BI Report Embed
 * 
 * Incorpora relatórios do Power BI na aplicação
 * 
 * @example
 * ```tsx
 * <PowerBIReport 
 *   reportId="seu-report-id-aqui"
 *   workspaceId="seu-workspace-id" 
 *   reportName="Dashboard de Vendas"
 *   height="600px"
 * />
 * ```
 */
export const PowerBIReport: React.FC<PowerBIReportProps> = ({
  reportId,
  workspaceId,
  reportName,
  className = '',
  height = '100%',
}) => {
  const { isDark } = useTheme()
  const { isMobile } = useLayout()

  const [embedToken, setEmbedToken] = useState<string | null>(null)
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar token ao montar
  useEffect(() => {
    const loadToken = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await getPowerBIEmbedToken(reportId, workspaceId)

        if (result) {
          setEmbedToken(result.token)
          setEmbedUrl(result.embedUrl)
        } else {
          setError('Não foi possível carregar o relatório')
        }
      } catch (err) {
        console.error('Erro ao carregar Power BI:', err)
        setError('Erro ao conectar com Power BI')
      } finally {
        setIsLoading(false)
      }
    }

    loadToken()
  }, [reportId, workspaceId])

  // Loading state
  if (isLoading) {
    return (
      <div
        className={twMerge(
          'flex flex-col items-center justify-center rounded-lg border',
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
          className
        )}
        style={{ height }}
      >
        <Loader2
          className={twMerge(
            'w-8 h-8 animate-spin mb-3',
            isDark ? 'text-blue-400' : 'text-blue-600'
          )}
        />
        <p
          className={twMerge(
            'text-sm',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}
        >
          Carregando relatório {reportName}...
        </p>
      </div>
    )
  }

  // Error state
  if (error || !embedToken || !embedUrl) {
    return (
      <div
        className={twMerge(
          'flex flex-col items-center justify-center rounded-lg border',
          isDark
            ? 'bg-red-900/20 border-red-700'
            : 'bg-red-50 border-red-200',
          className
        )}
        style={{ height }}
      >
        <AlertCircle
          className={twMerge(
            'w-8 h-8 mb-3',
            isDark ? 'text-red-400' : 'text-red-600'
          )}
        />
        <p
          className={twMerge(
            'text-sm font-medium mb-1',
            isDark ? 'text-red-300' : 'text-red-700'
          )}
        >
          {error || 'Erro ao carregar relatório'}
        </p>
        <p
          className={twMerge(
            'text-xs',
            isDark ? 'text-red-400' : 'text-red-600'
          )}
        >
          Verifique as configurações do Power BI
        </p>
      </div>
    )
  }

  // Configuração do embed
  const embedConfig: models.IReportEmbedConfiguration = {
    type: 'report',
    id: reportId,
    embedUrl: embedUrl,
    accessToken: embedToken,
    tokenType: models.TokenType.Embed,
    settings: {
      panes: {
        filters: {
          expanded: false,
          visible: !isMobile, // Ocultar filtros no mobile
        },
        pageNavigation: {
          visible: true,
          position: models.PageNavigationPosition.Left,
        },
      },
      background: models.BackgroundType.Transparent,
      layoutType: isMobile
        ? models.LayoutType.MobilePortrait
        : models.LayoutType.Master,
    },
  }

  return (
    <div className={twMerge('relative w-full h-full', className)}>
      {/* Power BI Embed - Full Height */}
      <PowerBIEmbed
        embedConfig={embedConfig}
        cssClassName={twMerge(
          'powerbi-report',
          isDark ? 'dark-theme' : 'light-theme'
        )}
        getEmbeddedComponent={(embeddedReport) => {
          console.log('✅ [PowerBI] Relatório carregado:', embeddedReport)
        }}
      />
    </div>
  )
}
