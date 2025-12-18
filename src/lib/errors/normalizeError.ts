import type { IDomainError, DomainErrorType } from './domainError.types'
import type { AxiosError } from 'axios'

const allowedTypes: DomainErrorType[] = ['validation', 'permission', 'authorization', 'server', 'network', 'unknown']

export function normalizeError(error: unknown): IDomainError {
    // Axios Error
    if ((error as AxiosError).isAxiosError) {
        const axiosError = error as AxiosError

        if (axiosError.response) {
            const status = axiosError.response.status
            let type: IDomainError['type'] = 'unknown'
            let message = 'Server error'

            if (status === 422) {
                type = 'validation'
                message = 'Please check the entered data.'
            } else if (status === 403) {
                type = 'permission'
                message = 'You do not have permission to perform this action.'
            } else if (status === 401) {
                type = 'authorization'
                message = 'You are not authorized.'
            } else if (status >= 500) {
                type = 'server'
                message = 'Server error. Please try again later.'
            }

            return { type, message, status, details: axiosError.response.data }
        } else if (axiosError.request) {
            return { type: 'network', message: 'Network error. Check connection', details: axiosError }
        } else {
            return { type: 'unknown', message: axiosError.message, details: axiosError }
        }
    }

    // Fetch Error
    if (isFetchError(error)) {
        const typeCandidate = error.type
        const type: DomainErrorType = allowedTypes.includes(typeCandidate as DomainErrorType)
            ? (typeCandidate as DomainErrorType)
            : 'unknown'

        return {
            type,
            message: error.message ?? 'Unknown fetch error',
            status: error.status,
            details: error.details,
        }
    }

    return { type: 'unknown', message: getUnknownErrorMessage(error), details: error }
}

// type checker
function isFetchError(
    error: unknown,
): error is { type?: string; message?: string; status?: number; details?: unknown } {
    return typeof error === 'object' && error !== null && 'message' in error
}

// helper function
function getUnknownErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Unexpected error occurred'
}
