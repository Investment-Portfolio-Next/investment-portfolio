import { normalizeError } from '@/lib/errors/normalizeError'

export const serverFetch = async <T>(input: RequestInfo, init?: RequestInit): Promise<T> => {
    let response: Response

    try {
        response = await fetch(input, init)
    } catch (error) {
        // network-level: fetch did not get any response
        throw normalizeError({
            type: 'network',
            message: 'Network error. Check connection',
            details: error,
        })
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

        // HTTP-level: fetch got response, but status ia bad
        throw normalizeError({
            type: 'server',
            status: response.status,
            message: 'Server error. Please try again later.',
            details,
        })
    }

    return response.json() as Promise<T>
}
