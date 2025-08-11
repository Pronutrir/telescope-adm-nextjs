// Global type definitions for Google API (GAPI)

declare global {
    interface Window {
        gapi: {
            load: (apis: string, callback: () => void) => void
            client: {
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
                        }) => Promise<{ 
                            status: number
                            result: {
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
                        }>
                    }
                }
            }
            auth2: {
                init: (config: {
                    client_id: string
                    scope: string
                }) => Promise<void>
                getAuthInstance: () => {
                    isSignedIn: {
                        get: () => boolean
                    }
                    signIn: (options?: { scope?: string }) => Promise<void>
                }
            }
        }
    }
}
