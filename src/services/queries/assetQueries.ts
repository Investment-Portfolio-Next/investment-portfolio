import { queryClient } from '../queryClient'
import type { AssetIdentifier, APIProvider, TransactionDate } from '../ISINsearchApi/ISINsearch.types'
import { searchAssets, searchCurrentPrice, searchHistoricalPrice } from '../ISINsearchApi/apiSearchISIN'
import type { AssetType } from '@/types/commonTypes.types'

export const assetQueries = {
    assetSearch: (query: string, assetType: AssetType) => ({
        queryKey: ['assetSearch', query, assetType],
        queryFn: () => searchAssets(query, assetType),
    }),

    currentPrice: (assetIdentifier: AssetIdentifier, provider: APIProvider) => ({
        queryKey: ['currentPriceSearch', assetIdentifier, provider],
        queryFn: () => searchCurrentPrice(assetIdentifier, provider),
    }),

    historicalPrice: (assetIdentifier: AssetIdentifier, provider: APIProvider, date: TransactionDate) => ({
        queryKey: ['historicalPriceSearch', assetIdentifier, provider, date],
        queryFn: () => searchHistoricalPrice(assetIdentifier, provider, date),
    }),

    // Method to fetch current price and return the result
    fetchCurrentPrice: async (assetIdentifier: AssetIdentifier, provider: APIProvider) => {
        return queryClient.fetchQuery(assetQueries.currentPrice(assetIdentifier, provider))
    },
    // Method to fetch historical price and return the result
    fetchHistoricalPrice: async (assetIdentifier: AssetIdentifier, provider: APIProvider, date: TransactionDate) => {
        return queryClient.fetchQuery(assetQueries.historicalPrice(assetIdentifier, provider, date))
    },

    // Method to invalidate price queries
    invalidateCurrentPrice: (assetIdentifier: AssetIdentifier, provider: APIProvider) => {
        return queryClient.invalidateQueries({
            queryKey: ['currentPriceSearch', assetIdentifier, provider].filter(Boolean),
        })
    },

    // Method to invalidate historical price queries
    invalidateHistoricalPrice: (assetIdentifier: AssetIdentifier, provider: APIProvider, date: TransactionDate) => {
        return queryClient.invalidateQueries({
            queryKey: ['historicalPriceSearch', assetIdentifier, provider, date].filter(Boolean),
        })
    },
}
