import type { ServerFetchError } from '@/types/serverError.types'

export const serverFetch = async <T>(input: RequestInfo, init?: RequestInit): Promise<T> => {
    let response: Response

    try {
        response = await fetch(input, init)
    } catch (error) {
        throw {
            type: 'fetch',
            message: 'Network error',
            details: error,
        } satisfies ServerFetchError
    }

    if (!response.ok) {
        let details: unknown = null

        try {
            details = await response.json()
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.warn('Failed to parse error response JSON', error)
            }
        }

        throw {
            type: 'fetch',
            status: response.status,
            message: 'Server responded with an error',
            details,
        } satisfies ServerFetchError
    }

    return response.json() as Promise<T>
}
