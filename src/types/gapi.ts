// Tipagens centralizadas para Google API (GAPI)

export interface GapiClient {
    init: (config: {
        apiKey: string
        discoveryDocs: string[]
        scope: string
    }) => Promise<void>
    setApiKey: (key: string) => void
    load: (url: string) => Promise<void>
    analyticsdata?: {
        properties: {
            batchRunReports: (params: {
                property: string
                resource: { requests: unknown[] }
            }) => Promise<{ status: number; result: GoogleAnalyticsResponse }>
        }
    }
}

export interface GapiAuth {
    init: (config: {
        client_id: string
        scope: string
    }) => Promise<void>
    getAuthInstance: () => {
        signIn: (options: { scope: string }) => Promise<void>
    }
}

export interface GoogleAnalyticsResponse {
    reports: Array<{
        rows?: Array<{
            dimensionValues: Array<{ value: string }>
            metricValues: Array<{ value: string }>
        }>
        totals?: Array<{
            metricValues: Array<{ value: string }>
        }>
    }>
}

export interface GapiError {
    result?: {
        error: {
            code: number
            message: string
        }
    }
    message?: string
}
