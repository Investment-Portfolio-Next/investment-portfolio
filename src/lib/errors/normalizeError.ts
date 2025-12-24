import type { INormalizedError } from './error.types'
import type { AxiosError } from 'axios'

export function normalizeError(error: unknown): INormalizedError {
    // Axios Error
    if (isAxiosError(error)) {
        return normalizeAxiosError(error)
    }

    // already normalized error
    if (isNormalizedError(error)) {
        return error
    }

    // Native Error
    if (error instanceof Error) {
        if (isReactRenderError(error)) {
            return {
                type: 'unexpected',
                message: 'Something went wrong while displaying this page.',
                details: {
                    originalMessage: error.message,
                    stack: error.stack,
                },
                originalError: error,
            }
        }

        return {
            type: 'unexpected',
            message: 'Unexpected application error.',
            details: {
                name: error.name,
                stack: error.stack,
            },
            originalError: error,
        }
    }

    // Any other type of error (string, number, object)
    return {
        type: 'unexpected',
        message: 'Unexpected error occurred',
        details: error,
        originalError: error,
    }
}

// type guards
function isAxiosError(error: unknown): error is AxiosError {
    return typeof error === 'object' && error !== null && (error as AxiosError).isAxiosError === true
}

function isNormalizedError(error: unknown): error is INormalizedError {
    return typeof error === 'object' && error !== null && 'type' in error && 'message' in error
}

function isReactRenderError(error: Error): boolean {
    return (
        error.message.includes('Objects are not valid as a React child') ||
        error.message.includes('Cannot read properties of') ||
        error.message.includes('is not a function')
    )
}

// helpers
function normalizeAxiosError(error: AxiosError): INormalizedError {
    if (error.response) {
        const status = error.response.status

        if (status === 422) {
            return { type: 'validation', message: 'Please check the entered data.', status }
        }

        if (status === 403) {
            return { type: 'permission', message: 'You do not have permission to perform this action.', status }
        }

        if (status === 401) {
            return { type: 'authorization', message: 'You are not authorized.', status }
        }

        if (status >= 500) {
            return { type: 'server', message: 'Server error. Please try again later.', status }
        }

        return { type: 'unknown', message: 'Request failed.', status }
    } else if (error.request) {
        return { type: 'network', message: 'Network error. Check connection' }
    } else {
        return { type: 'unknown', message: error.message }
    }
}
