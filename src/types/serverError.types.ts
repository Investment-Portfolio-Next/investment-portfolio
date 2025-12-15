export type ServerFetchError = {
    type: 'fetch'
    status?: number
    message: string
    details?: unknown
}
