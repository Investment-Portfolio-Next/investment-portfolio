import { serverFetch } from '@/lib/serverFetch'
import type { StockTransaction } from '@/types/transactionTypes/stockTransaction.types'
import type { StockTransactionListResponse } from '@/types/transactionTypes/stockTransactionListResponse.types'

const baseURL = process.env.API_BASE_URL

if (!baseURL) {
    throw new Error('API_BASE_URL is not defined')
}

export const getStockTransactionListServer = async () => {
    return serverFetch<StockTransactionListResponse>(`${baseURL}/stock_transactions/`, {
        next: {
            revalidate: 60,
            tags: ['stockTransactionList'],
        },
    })
}

export const getStockTransactionByIdServer = async (id: string) => {
    return serverFetch<StockTransaction>(`${baseURL}/stock_transactions/${id}/`, {
        next: {
            revalidate: 60,
        },
    })
}
