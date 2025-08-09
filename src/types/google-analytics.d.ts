// Declarações de tipos para Google Analytics API
declare global {
    interface Window {
        gapi: {
            load: (apis: string, callback: () => void) => void
            client: {
                init: (config: {
                    apiKey: string
                    clientId: string
                    discoveryDocs: string[]
                    scope: string
                }) => Promise<void>
                analyticsdata: {
                    properties: {
                        batchRunReports: (params: {
                            property: string
                            resource: {
                                requests: Array<{
                                    dimensions?: Array<{ name: string }>
                                    metrics: Array<{ name: string }>
                                    dateRanges: Array<{ startDate: string; endDate: string }>
                                    metricAggregations?: string[]
                                }>
                            }
                        }) => Promise<{
                            status: number
                            result: {
                                reports: Array<{
                                    totals?: Array<{
                                        metricValues?: Array<{ value: string }>
                                    }>
                                }>
                            }
                        }>
                    }
                }
            }
            auth2: {
                getAuthInstance: () => {
                    isSignedIn: {
                        get: () => boolean
                    }
                    signIn: () => Promise<void>
                }
            }
        }
    }
}

export {}
