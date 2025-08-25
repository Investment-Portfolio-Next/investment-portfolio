import type { AssetType } from '@/types/commonTypes'
import type {
    APIProvider,
    SearchResult,
    DataSearchResults,
    AssetIdentifier,
    AssetPrice,
    TransactionDate,
} from './transaction.types'
import {
    transformSearchResults,
    transformCurrentPriceSearchResults,
    transformHistoricalPriceSearchResults,
    transformDataForUrl,
} from './transaction.utils'
import { CRYPTO_PROVIDERS, BOND_PROVIDERS, STOCK_ETF_PROVIDERS, API_CONFIGS, API_KEYS } from './transaction.config'

// Search function with fallback
export const searchAssets = async (query: string, assetType: AssetType): Promise<SearchResult[]> => {
    if (!query.trim()) return []

    const providers =
        assetType === 'crypto' ? CRYPTO_PROVIDERS : assetType === 'bond' ? BOND_PROVIDERS : STOCK_ETF_PROVIDERS

    for (const provider of providers) {
        try {
            console.log(`Trying search with ${provider}...`)
            const results = await searchWithProvider(query, assetType, provider)
            if (results.length > 0) {
                console.log(`Search SUCCESSFUL with ${provider}`)
                return results
            }
        } catch (error) {
            console.warn(`Search FAILED with ${provider}:`, error)
            continue
        }
    }

    throw new Error('No data available for this search')
}

const searchWithProvider = async (
    query: string,
    assetType: AssetType,
    provider: APIProvider,
): Promise<SearchResult[]> => {
    const config = API_CONFIGS[provider]
    const apiKey = API_KEYS[provider]
    const url = config.endpoints.search(query, apiKey)

    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = await response.json()
    const results = data as DataSearchResults

    return transformSearchResults(results, assetType, provider)
}

export const searchCurrentPrice = async (
    assetIdentifier: AssetIdentifier,
    provider: APIProvider,
): Promise<AssetPrice> => {
    const config = API_CONFIGS[provider]
    const apiKey = API_KEYS[provider]
    const url = config.endpoints.currentPrice(assetIdentifier, apiKey)

    if (!url) {
        throw new Error('No price is available on this date')
    }

    try {
        const response = await fetch(url)

        if (!response.ok) {
            const errorMessage =
                response.status === 404 ? 'Asset not found' : `API request failed with status ${response.status}`

            console.warn(`${errorMessage} for ${provider}`)
            throw new Error('No price is available on this date')
        }

        const priceData = await response.json()

        const transformedPrice = transformCurrentPriceSearchResults(priceData, assetIdentifier, provider)

        if (transformedPrice === null) {
            throw new Error('No price is available on this date')
        }

        return transformedPrice
    } catch (error) {
        if (error instanceof Error) {
            throw error
        }

        console.warn(`Price search failed for ${provider}:`, error)
        throw new Error('No price is available on this date')
    }
}

export const searchHistoricalPrice = async (
    assetIdentifier: AssetIdentifier,
    provider: APIProvider,
    date: TransactionDate,
): Promise<AssetPrice> => {
    try {
        const url = transformDataForUrl(assetIdentifier, provider, date)
        if (!url) {
            console.warn(`Historical price not supported for provider ${provider}`)
            throw new Error('No price is available on this date')
        }

        const response = await fetch(url)

        if (!response.ok) {
            const errorMessage =
                response.status === 404 || response.status === 400
                    ? 'No data is available on the specified date'
                    : `API request failed with status ${response.status}`

            console.warn(`Historical price error for ${provider}:`, errorMessage)
            throw new Error('No price is available on this date')
        }

        const historicalData = await response.json()

        const historicalPrice = transformHistoricalPriceSearchResults(historicalData, date, provider)

        if (historicalPrice === null) {
            throw new Error('No price is available on this date')
        }

        return historicalPrice
    } catch (error) {
        if (error instanceof Error) {
            throw error
        }

        console.warn(`Historical price search failed for ${provider}:`, error)
        throw new Error('No price is available on this date')
    }
}
