'use client'

import React, { useState, useEffect } from 'react'
import { PowerBIEmbed } from 'powerbi-client-react'
import { models } from 'powerbi-client'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import { cn } from '@/lib/utils'
import { getPowerBIEmbedToken } from '@/app/actions/powerbi/embed'
import { ReportLoading, ReportError } from './ReportStates'

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

  if (isLoading) {
    return <ReportLoading isDark={isDark} reportName={reportName} height={height} className={className} />
  }

  if (error || !embedToken || !embedUrl) {
    return <ReportError isDark={isDark} error={error || 'Erro ao carregar relatório'} height={height} className={className} />
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
    <div className={cn('relative w-full h-full', className)}>
      <PowerBIEmbed
        embedConfig={embedConfig}
        cssClassName={cn('powerbi-report', isDark ? 'dark-theme' : 'light-theme')}
        getEmbeddedComponent={(embeddedReport) => {
          console.log('✅ [PowerBI] Relatório carregado:', embeddedReport)
        }}
      />
    </div>
  )
}
