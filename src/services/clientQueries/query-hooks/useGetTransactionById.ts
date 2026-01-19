import { useQuery } from '@tanstack/react-query'
import type { AssetType } from '@/types/commonTypes.types'
import { transactionQueries } from '../transactionQueries'

export const useGetTransactionById = (assetType: AssetType, id: string) => {
    return useQuery({
        ...transactionQueries.getById(assetType, id),
        enabled: !!id,
    })
}
