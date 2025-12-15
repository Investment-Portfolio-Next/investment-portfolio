import { serverFetch } from '@/lib/serverFetch'
import type { Stock } from '@/types/stockTypes/stock.types'

const baseURL = process.env.API_BASE_URL

if (!baseURL) {
    throw new Error('API_BASE_URL is not defined')
}

export const getStockByIdServer = async (id: string) => {
    return serverFetch<Stock>(`${baseURL}/stocks/${id}/`, {
        next: {
            revalidate: 60,
        },
    })
}
