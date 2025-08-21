import { queryClient } from '../queryClient'
import type { AssetIdentifier, APIProvider } from '../transactionApi/transaction.types'
import { searchCurrentPrice } from '../transactionApi/apiSearchISIN'

export const assetQueries = {
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
