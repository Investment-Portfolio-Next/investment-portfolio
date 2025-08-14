import type { AssetType } from '@/types/commonTypes'
import type {
    APIProvider,
    SearchResult,
    TwelveDataSearchResponse,
    FinnhubSearchResponse,
    AlphaVantageSearchResponse,
} from './transaction.types'
import { transformCoinPaprikaSearchResults, transformSearchResults } from './transaction.utils'
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

    switch (provider) {
        case 'twelvedata':
            const twelveData = data as TwelveDataSearchResponse
            return transformSearchResults(twelveData.data, assetType, provider)
        case 'finnhub':
            const finnhubData = data as FinnhubSearchResponse
            return transformSearchResults(finnhubData.result, assetType, provider)
        case 'alphavantage':
            const alphaVantageData = data as AlphaVantageSearchResponse
            return transformSearchResults(alphaVantageData.bestMatches, assetType, provider)
        case 'coinpaprika':
            return transformCoinPaprikaSearchResults(data.currencies, provider)
        default:
            return []
    }
}
