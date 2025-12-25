import type { AssetType } from '@/types/commonTypes.types'
import type { APIProvider, SearchResult, DataSearchResults } from '../public.types'
import { transformSearchResults } from '../public.utils'
import { CRYPTO_PROVIDERS, BOND_PROVIDERS, STOCK_ETF_PROVIDERS, API_CONFIGS, API_KEYS } from '../public.config'
import { publicAxios } from '@/lib/api/public'

// Search function with fallback
export const searchAssets = async (query: string, assetType: AssetType): Promise<SearchResult[]> => {
    if (!query.trim()) return []

    const providers =
        assetType === 'crypto' ? CRYPTO_PROVIDERS : assetType === 'bond' ? BOND_PROVIDERS : STOCK_ETF_PROVIDERS

    for (const provider of providers) {
        try {
            if (process.env.NODE_ENV === 'development') {
                console.log(`Trying search with ${provider}...`)
            }

            const results = await searchWithProvider(query, assetType, provider)

            if (results.length > 0) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(`Search SUCCESSFUL with ${provider}`)
                }
                return results
            }

            if (process.env.NODE_ENV === 'development') {
                console.log(`No results from ${provider}, trying next...`)
            }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`Search FAILED with ${provider}:`, error)
            }
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

    const { data } = await publicAxios.get<DataSearchResults>(url)

    return transformSearchResults(data, assetType, provider)
}
