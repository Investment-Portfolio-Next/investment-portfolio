import { queryClient } from '../queryClient'
import type { AssetIdentifier, APIProvider } from '../transactionApi/transaction.types'
import { searchAssets, searchCurrentPrice } from '../transactionApi/apiSearchISIN'
import type { AssetType } from '@/types/commonTypes'

export const assetQueries = {
    assetSearch: (query: string, assetType: AssetType) => ({
        queryKey: ['assetSearch', query, assetType],
        queryFn: () => searchAssets(query, assetType),
    }),

    currentPrice: (assetIdentifier: AssetIdentifier, provider: APIProvider) => ({
        queryKey: ['currentPriceSearch', assetIdentifier, provider],
        queryFn: () => searchCurrentPrice(assetIdentifier, provider),
    }),

    // Method to fetch price and return the result
    fetchCurrentPrice: async (assetIdentifier: AssetIdentifier, provider: APIProvider) => {
        return queryClient.fetchQuery(assetQueries.currentPrice(assetIdentifier, provider))
    },

    // Method to invalidate price queries
    invalidateCurrentPrice: (assetIdentifier: AssetIdentifier, provider?: APIProvider) => {
        return queryClient.invalidateQueries({
            queryKey: ['currentPriceSearch', assetIdentifier, provider].filter(Boolean),
        })
    },
}
