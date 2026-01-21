import { useQuery } from '@tanstack/react-query'
import type { AssetType } from '@/types/commonTypes.types'
import { transactionQueries } from '../transactionQueries'

export const useGetAllTransactions = (assetType: AssetType) => {
    return useQuery({
        ...transactionQueries.getAll(assetType),
    })
}
