'use server'

import { cookies } from 'next/headers'

interface PowerBIToken {
  token: string
  embedUrl: string
  reportId: string
  expiresAt: string
}

interface PowerBIConfig {
  clientId: string
  clientSecret: string
  tenantId: string
  workspaceId: string
}

/**
 * 📊 Server Action: Obter Token de Acesso do Power BI
 * 
 * Gera token de embed para incorporar relatórios Power BI
 * 
 * @param reportId - ID do relatório Power BI
 * @param workspaceId - ID do workspace (opcional, usa o padrão do .env se não fornecido)
 * @returns Token de acesso e configuração do embed
 */
export async function getPowerBIEmbedToken(reportId: string, workspaceId?: string): Promise<PowerBIToken | null> {
  try {
    // Validar autenticação do usuário
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session_id')?.value

    if (!sessionId) {
      throw new Error('Usuário não autenticado')
    }

    // Configurações do Power BI
    const config: PowerBIConfig = {
      clientId: process.env.POWERBI_CLIENT_ID || '',
      clientSecret: process.env.POWERBI_CLIENT_SECRET || '',
      tenantId: process.env.POWERBI_TENANT_ID || '',
      workspaceId: workspaceId || process.env.POWERBI_WORKSPACE_ID || '',
    }

    // Validar configurações
    if (!config.clientId || !config.clientSecret || !config.tenantId) {
      throw new Error('Configurações do Power BI não encontradas')
    }

    console.log('📊 [PowerBI] Obtendo token de acesso...')

    // 1. Obter Access Token do Azure AD
    const authUrl = `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`
    const authBody = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      scope: 'https://analysis.windows.net/powerbi/api/.default',
    })

    const authResponse = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: authBody.toString(),
      cache: 'no-store',
    })

    if (!authResponse.ok) {
      const errorText = await authResponse.text()
      console.error('❌ [PowerBI] Erro ao obter token:', errorText)
      throw new Error('Falha na autenticação com Azure AD')
    }

    const authData = await authResponse.json()
    const accessToken = authData.access_token

    console.log('✅ [PowerBI] Token de acesso obtido')

    // 2. Obter detalhes do relatório
    const reportUrl = `https://api.powerbi.com/v1.0/myorg/groups/${config.workspaceId}/reports/${reportId}`
    
    const reportResponse = await fetch(reportUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    })

    if (!reportResponse.ok) {
      const errorText = await reportResponse.text()
      console.error('❌ [PowerBI] Erro ao obter relatório:', errorText)
      throw new Error('Relatório não encontrado')
    }

    const reportData = await reportResponse.json()
    const embedUrl = reportData.embedUrl

    console.log('✅ [PowerBI] Relatório encontrado:', reportData.name)

    // 3. Gerar Embed Token
    const embedTokenUrl = `https://api.powerbi.com/v1.0/myorg/groups/${config.workspaceId}/reports/${reportId}/GenerateToken`
    
    const embedTokenResponse = await fetch(embedTokenUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessLevel: 'View',
        allowSaveAs: false,
      }),
      cache: 'no-store',
    })

    if (!embedTokenResponse.ok) {
      const errorText = await embedTokenResponse.text()
      console.error('❌ [PowerBI] Erro ao gerar embed token:', errorText)
      throw new Error('Falha ao gerar token de embed')
    }

    const embedTokenData = await embedTokenResponse.json()

    console.log('✅ [PowerBI] Embed token gerado com sucesso')

    return {
      token: embedTokenData.token,
      embedUrl: embedUrl,
      reportId: reportId,
      expiresAt: embedTokenData.expiration,
    }

  } catch (error) {
    console.error('❌ [PowerBI] Erro:', error)
    return null
  }
}

/**
 * 📊 Server Action: Listar Relatórios do Workspace
 * 
 * @param workspaceId - ID do workspace (opcional, usa o padrão do .env se não fornecido)
 * @returns Lista de relatórios disponíveis
 */
export async function listPowerBIReports(workspaceId?: string) {
  try {
    // Validar autenticação
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session_id')?.value

    if (!sessionId) {
      throw new Error('Usuário não autenticado')
    }

    const config: PowerBIConfig = {
      clientId: process.env.POWERBI_CLIENT_ID || '',
      clientSecret: process.env.POWERBI_CLIENT_SECRET || '',
      tenantId: process.env.POWERBI_TENANT_ID || '',
      workspaceId: workspaceId || process.env.POWERBI_WORKSPACE_ID || '',
    }

    // Obter Access Token
    const authUrl = `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`
    const authBody = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      scope: 'https://analysis.windows.net/powerbi/api/.default',
    })

    const authResponse = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: authBody.toString(),
      cache: 'no-store',
    })

    if (!authResponse.ok) {
      const errorText = await authResponse.text()
      console.error('❌ [PowerBI] Erro na autenticação:', {
        status: authResponse.status,
        statusText: authResponse.statusText,
        error: errorText
      })
      throw new Error(`Falha na autenticação: ${authResponse.status} - ${errorText}`)
    }

    const authData = await authResponse.json()
    const accessToken = authData.access_token

    console.log('✅ [PowerBI] Token obtido com sucesso')

    // Listar relatórios
    const reportsUrl = `https://api.powerbi.com/v1.0/myorg/groups/${config.workspaceId}/reports`
    
    const reportsResponse = await fetch(reportsUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    })

    if (!reportsResponse.ok) {
      const errorText = await reportsResponse.text()
      console.error('❌ [PowerBI] Erro na API:', {
        status: reportsResponse.status,
        statusText: reportsResponse.statusText,
        error: errorText
      })
      throw new Error(`Falha ao listar relatórios: ${reportsResponse.status} - ${errorText}`)
    }

    const reportsData = await reportsResponse.json()

    // Buscar datasets para obter IDs
    const datasetsUrl = `https://api.powerbi.com/v1.0/myorg/groups/${config.workspaceId}/datasets`
    const datasetsResponse = await fetch(datasetsUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    })

    const datasetsMap = new Map()
    if (datasetsResponse.ok) {
      const datasetsData = await datasetsResponse.json()
      console.log('📊 [PowerBI] Datasets encontrados:', datasetsData.value.length)
      
      // Para cada dataset, buscar o histórico de refresh em paralelo
      const refreshPromises = datasetsData.value.map(async (ds: any) => {
        try {
          const refreshUrl = `https://api.powerbi.com/v1.0/myorg/groups/${config.workspaceId}/datasets/${ds.id}/refreshes?$top=1`
          const refreshResponse = await fetch(refreshUrl, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
            cache: 'no-store',
          })

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json()
            const lastRefresh = refreshData.value && refreshData.value.length > 0 
              ? refreshData.value[0].endTime || refreshData.value[0].startTime
              : null
            
            console.log(`  - Dataset ${ds.id}: ${ds.name}, Last Refresh: ${lastRefresh || 'Nunca atualizado'}`)
            return { id: ds.id, lastRefresh }
          } else {
            console.log(`  - Dataset ${ds.id}: ${ds.name}, Last Refresh: Sem permissão ou nunca atualizado`)
            return { id: ds.id, lastRefresh: null }
          }
        } catch (error) {
          console.log(`  - Dataset ${ds.id}: ${ds.name}, Last Refresh: Erro ao buscar`)
          return { id: ds.id, lastRefresh: null }
        }
      })

      const refreshResults = await Promise.all(refreshPromises)
      refreshResults.forEach(({ id, lastRefresh }) => {
        datasetsMap.set(id, lastRefresh)
      })
    } else {
      console.warn('⚠️ [PowerBI] Falha ao buscar datasets:', datasetsResponse.status)
    }

    console.log('📋 [PowerBI] Relatórios com datasets:')
    reportsData.value.forEach((report: any) => {
      console.log(`  - ${report.name}: datasetId=${report.datasetId}`)
    })

    const mappedReports = reportsData.value.map((report: any) => {
      const lastRefreshTime = report.datasetId ? datasetsMap.get(report.datasetId) : null
      return {
        id: report.id,
        name: report.name,
        webUrl: report.webUrl,
        embedUrl: report.embedUrl,
        datasetId: report.datasetId,
        lastRefreshTime,
      }
    })

    console.log('✅ [PowerBI] Relatórios mapeados com datas:', 
      mappedReports.map((r: any) => ({ name: r.name, lastRefresh: r.lastRefreshTime }))
    )

    return {
      sucesso: true,
      reports: mappedReports,
    }

  } catch (error) {
    console.error('❌ [PowerBI] Erro ao listar relatórios:', error)
    return {
      sucesso: false,
      reports: [],
      erro: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

/**
 * 👥 Server Action: Listar Usuários e Grupos com Acesso ao Workspace
 * 
 * Obtém lista de usuários e grupos que têm permissões no workspace do Power BI
 * 
 * @returns Lista de usuários e grupos com seus respectivos níveis de acesso
 */
export async function getPowerBIWorkspaceUsers() {
  try {
    // Validar autenticação do usuário
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session_id')?.value

    if (!sessionId) {
      throw new Error('Usuário não autenticado')
    }

    // Configurações do Power BI
    const config: PowerBIConfig = {
      clientId: process.env.POWERBI_CLIENT_ID || '',
      clientSecret: process.env.POWERBI_CLIENT_SECRET || '',
      tenantId: process.env.POWERBI_TENANT_ID || '',
      workspaceId: process.env.POWERBI_WORKSPACE_ID || '',
    }

    // Validar configurações
    if (!config.clientId || !config.clientSecret || !config.tenantId || !config.workspaceId) {
      throw new Error('Configurações do Power BI não encontradas')
    }

    console.log('👥 [PowerBI] Obtendo usuários e grupos do workspace...')

    // 1. Obter token de acesso do Azure AD
    const tokenUrl = `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`
    const tokenParams = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      scope: 'https://analysis.windows.net/powerbi/api/.default',
    })

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString(),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      throw new Error(`Falha ao obter token: ${tokenResponse.status} - ${errorText}`)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    console.log('✅ [PowerBI] Token de acesso obtido')

    // 2. Buscar usuários do workspace
    const usersUrl = `https://api.powerbi.com/v1.0/myorg/groups/${config.workspaceId}/users`
    
    const usersResponse = await fetch(usersUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!usersResponse.ok) {
      const errorText = await usersResponse.text()
      throw new Error(`Falha ao buscar usuários: ${usersResponse.status} - ${errorText}`)
    }

    const usersData = await usersResponse.json()

    console.log('✅ [PowerBI] Usuários e grupos obtidos:', usersData.value?.length || 0)

    // Mapear dados para formato mais legível
    const mappedUsers = usersData.value.map((user: any) => ({
      identifier: user.identifier || user.emailAddress || user.displayName || 'N/A',
      displayName: user.displayName || user.identifier || 'N/A',
      emailAddress: user.emailAddress || null,
      groupUserAccessRight: user.groupUserAccessRight || user.datasetUserAccessRight || 'Unknown',
      principalType: user.principalType || 'User',
    }))

    // Separar por tipo
    const users = mappedUsers.filter((u: any) => u.principalType === 'User')
    const groups = mappedUsers.filter((u: any) => u.principalType === 'Group')
    const apps = mappedUsers.filter((u: any) => u.principalType === 'App')

    console.log(`📊 [PowerBI] Usuários: ${users.length}, Grupos: ${groups.length}, Apps: ${apps.length}`)

    return {
      sucesso: true,
      users,
      groups,
      apps,
      total: mappedUsers.length,
    }

  } catch (error) {
    console.error('❌ [PowerBI] Erro ao listar usuários do workspace:', error)
    return {
      sucesso: false,
      users: [],
      groups: [],
      apps: [],
      total: 0,
      erro: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}

/**
 * 🏢 Server Action: Listar Todos os Workspaces
 * 
 * Obtém lista de todos os workspaces que o Service Principal tem acesso
 * 
 * @returns Lista de workspaces com informações básicas
 */
export async function getPowerBIWorkspaces() {
  try {
    // Validar autenticação do usuário
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session_id')?.value

    if (!sessionId) {
      throw new Error('Usuário não autenticado')
    }

    // Configurações do Power BI
    const config: PowerBIConfig = {
      clientId: process.env.POWERBI_CLIENT_ID || '',
      clientSecret: process.env.POWERBI_CLIENT_SECRET || '',
      tenantId: process.env.POWERBI_TENANT_ID || '',
      workspaceId: process.env.POWERBI_WORKSPACE_ID || '',
    }

    // Validar configurações
    if (!config.clientId || !config.clientSecret || !config.tenantId) {
      throw new Error('Configurações do Power BI não encontradas')
    }

    console.log('🏢 [PowerBI] Listando workspaces disponíveis...')

    // 1. Obter token de acesso do Azure AD
    const tokenUrl = `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`
    const tokenParams = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      scope: 'https://analysis.windows.net/powerbi/api/.default',
    })

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString(),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      throw new Error(`Falha ao obter token: ${tokenResponse.status} - ${errorText}`)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    console.log('✅ [PowerBI] Token de acesso obtido')

    // 2. Buscar todos os workspaces (grupos)
    const workspacesUrl = 'https://api.powerbi.com/v1.0/myorg/groups'
    
    const workspacesResponse = await fetch(workspacesUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!workspacesResponse.ok) {
      const errorText = await workspacesResponse.text()
      throw new Error(`Falha ao buscar workspaces: ${workspacesResponse.status} - ${errorText}`)
    }

    const workspacesData = await workspacesResponse.json()

    console.log('✅ [PowerBI] Workspaces obtidos:', workspacesData.value?.length || 0)

    // Mapear dados para formato mais legível
    const mappedWorkspaces = workspacesData.value.map((workspace: any) => ({
      id: workspace.id,
      name: workspace.name,
      isReadOnly: workspace.isReadOnly || false,
      isOnDedicatedCapacity: workspace.isOnDedicatedCapacity || false,
      capacityId: workspace.capacityId || null,
      type: workspace.type || 'Workspace',
      state: workspace.state || 'Active',
      isOrphaned: workspace.isOrphaned || false,
      isCurrent: workspace.id === config.workspaceId, // Marcar o workspace atual
    }))

    // Ordenar: workspace atual primeiro, depois alfabeticamente
    mappedWorkspaces.sort((a: any, b: any) => {
      if (a.isCurrent) return -1
      if (b.isCurrent) return 1
      return a.name.localeCompare(b.name)
    })

    console.log(`📊 [PowerBI] Total de workspaces: ${mappedWorkspaces.length}`)

    return {
      sucesso: true,
      workspaces: mappedWorkspaces,
      total: mappedWorkspaces.length,
      currentWorkspaceId: config.workspaceId,
    }

  } catch (error) {
    console.error('❌ [PowerBI] Erro ao listar workspaces:', error)
    return {
      sucesso: false,
      workspaces: [],
      total: 0,
      currentWorkspaceId: null,
      erro: error instanceof Error ? error.message : 'Erro desconhecido',
    }
  }
}
