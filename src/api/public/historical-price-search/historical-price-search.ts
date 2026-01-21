import { publicAxios } from '@/lib/api/public'
import type { APIProvider, AssetIdentifier, AssetPrice, TransactionDate } from '../public.types'
import { transformHistoricalPriceSearchResults, transformDataForUrl } from '../public.utils'

export const searchHistoricalPrice = async (
    assetIdentifier: AssetIdentifier,
    provider: APIProvider,
    date: TransactionDate,
): Promise<AssetPrice> => {
    const url = transformDataForUrl(assetIdentifier, provider, date)
    if (!url) {
        if (process.env.NODE_ENV === 'development') {
            console.log(`Historical price is not supported for provider ${provider}`)
        }
        throw new Error('No price is available on this date')
    }

    const { data } = await publicAxios.get(url)

    const historicalPrice = transformHistoricalPriceSearchResults(data, date, provider)

    if (historicalPrice === null) {
        throw new Error('No price is available on this date')
    }

    return historicalPrice
}
