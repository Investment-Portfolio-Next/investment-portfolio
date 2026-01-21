export const serverFetch = async <T>(input: RequestInfo, init?: RequestInit): Promise<T> => {
    let response: Response

    try {
        response = await fetch(input, init)
    } catch (error) {
        // network-level: fetch did not get any response
        throw new Error('Network error. Check connection.', {
            cause: {
                type: 'network',
                details: error,
            },
        })
    }

    if (!response.ok) {
        // HTTP-level: fetch got response, but status ia bad
        if (response.status === 401) {
            throw new Error('You are not authorized.')
        }

        if (response.status === 403) {
            throw new Error('You do not have permission to perform this action.')
        }

        if (response.status === 422) {
            throw new Error('Please check the entered data.')
        }

        if (response.status >= 500) {
            throw new Error('Server error. Please try again later.')
        }

        throw new Error('Request failed.')
    }

    return response.json() as Promise<T>
}
