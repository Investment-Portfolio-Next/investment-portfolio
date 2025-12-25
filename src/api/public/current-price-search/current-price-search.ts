import type { APIProvider, AssetIdentifier, AssetPrice } from '../public.types'
import { transformCurrentPriceSearchResults } from '../public.utils'
import { API_CONFIGS, API_KEYS } from '../public.config'
import { publicAxios } from '@/lib/api/public'

export const searchCurrentPrice = async (
    assetIdentifier: AssetIdentifier,
    provider: APIProvider,
): Promise<AssetPrice> => {
    const config = API_CONFIGS[provider]
    const apiKey = API_KEYS[provider]
    const url = config.endpoints.currentPrice(assetIdentifier, apiKey)

    if (!url) throw new Error('No price is available on this date')

    const { data } = await publicAxios.get(url)
    const transformedPrice = transformCurrentPriceSearchResults(data, assetIdentifier, provider)

    if (transformedPrice === null) {
        throw new Error('No price is available on this date')
    }

    return transformedPrice
}
