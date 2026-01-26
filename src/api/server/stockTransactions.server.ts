import { serverFetch } from '@/lib/api/serverFetch'
import type { AssetType } from '@/types/commonTypes.types'
import type { Transaction, TransactionListResponse } from '@/types/transactionTypes/stockTransaction.types'
import { TRANSACTION_BASE_PATH } from '../transactionBasePath'
import { transactionListTag } from '@/lib/tags/tags'

const baseURL = process.env.API_BASE_URL

if (!baseURL) {
    throw new Error('API_BASE_URL is not defined')
}

export const getTransactionListServer = async (assetType: AssetType) => {
    console.log('SERVER FETCH transaction list', assetType, Date.now())

    return serverFetch<TransactionListResponse>(`${baseURL}${TRANSACTION_BASE_PATH[assetType]}/`, {
        next: {
            revalidate: 60,
            tags: [transactionListTag(assetType)],
        },
    })
}

export const getTransactionByIdServer = async (assetType: AssetType, id: string) => {
    return serverFetch<Transaction>(`${baseURL}/${TRANSACTION_BASE_PATH[assetType]}/${id}/`, {
        next: {
            revalidate: 60,
        },
    })
}
