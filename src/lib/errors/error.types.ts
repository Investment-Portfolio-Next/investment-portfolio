export type NormalizedErrorType =
    | 'validation'
    | 'permission'
    | 'authorization'
    | 'server'
    | 'network'
    | 'unknown'
    | 'unexpected'

export interface INormalizedError {
    type: NormalizedErrorType
    message: string
    status?: number
    details?: unknown
    originalError?: unknown
}
