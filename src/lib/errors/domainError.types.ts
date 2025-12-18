export type DomainErrorType = 'validation' | 'permission' | 'authorization' | 'server' | 'network' | 'unknown'

export interface IDomainError {
    type: DomainErrorType
    message: string
    status?: number
    details?: unknown
}
