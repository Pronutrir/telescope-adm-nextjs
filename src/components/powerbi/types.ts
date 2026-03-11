export interface Report {
    id: string
    name: string
    webUrl: string
    embedUrl: string
    datasetId?: string
    lastRefreshTime?: string | null
}

export interface Workspace {
    id: string
    name: string
    isReadOnly: boolean
    isOnDedicatedCapacity: boolean
    capacityId?: string | null
    type: string
    state: string
    isOrphaned?: boolean
    isCurrent: boolean
}

export interface WorkspaceUser {
    identifier: string
    displayName: string
    emailAddress: string | null
    groupUserAccessRight: string
    principalType: string
}
