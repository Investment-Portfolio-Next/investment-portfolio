import type {
    SearchResult,
    TwelveDataSearchResult,
    FinnhubSearchResult,
    AlphaVantageSearchResult,
    DataSearchResults,
    SearchResultUnion,
    CoinGeckoSearchResult,
    CoinPaprikaSearchResult,
    APIProvider,
    TwelveDataSearchResponse,
    FinnhubSearchResponse,
    AlphaVantageSearchResponse,
    CoinGeckoSearchResponse,
    CoinPaprikaSearchResponse,
    AssetPrice,
    AssetIdentifier,
    CurrentPriceSearchUnion,
    TwelveDataCurrentPriceSearchResponse,
    FinnhubCurrentPriceSearchResponse,
    AlphaVantageCurrentPriceSearchResponse,
    CoinGeckoCurrentPriceSearchResponse,
    CoinPaprikaCurrentPriceSearchResponse,
    TransactionDate,
    SearchHistoricalPriceResultUnion,
    HistoricalPriceResultTwelvedata,
    HistoricalPriceResultAlphavantage,
    HistoricalPriceResultCoingecko,
} from './public.types'
import type { AssetType } from '@/types/commonTypes.types'
import { formatDateToInput } from '@/utils/helper'
import { API_CONFIGS, API_KEYS } from './public.config'

const matchesAssetType = (instrumentType: string, assetType: AssetType): boolean => {
    const type = instrumentType.toLowerCase()

    if (assetType === 'stock') {
        return (
            type.includes('common stock') ||
            type.includes('equity') ||
            type.includes('preferred stock') ||
            type.includes('ordinary shares') ||
            type.includes('common share') ||
            type.includes('depositary receipt') ||
            type.includes('american depositary receipt') ||
            type.includes('canadian depositary receipt') ||
            type.includes('global depositary receipt') ||
            type.includes('canadian dr') ||
            type.includes('adr')
        )
    }

    if (assetType === 'etf') {
        return (
            type.includes('etf') ||
            type.includes('exchange-traded note') ||
            type.includes('mutual fund') ||
            type.includes('bond fund') ||
            type.includes('closed-end fund') ||
            type.includes('fund') ||
            type.includes('trust') ||
            type.includes('reit') ||
            type.includes('warrant') ||
            type.includes('bond') ||
            type.includes('etp')
        )
    }

    return false
}

const isTwelveDataResponse = (data: DataSearchResults): data is TwelveDataSearchResponse => {
    return 'data' in data && Array.isArray((data as TwelveDataSearchResponse).data)
}

const isFinnhubResponse = (data: DataSearchResults): data is FinnhubSearchResponse => {
    return 'result' in data && Array.isArray((data as FinnhubSearchResponse).result)
}

const isAlphaVantageResponse = (data: DataSearchResults): data is AlphaVantageSearchResponse => {
    return 'bestMatches' in data && Array.isArray((data as AlphaVantageSearchResponse).bestMatches)
}

const isCoinGeckoResponse = (data: DataSearchResults): data is CoinGeckoSearchResponse => {
    return 'coins' in data && Array.isArray((data as CoinGeckoSearchResponse).coins)
}

const isCoinPaprikaResponse = (data: DataSearchResults): data is CoinPaprikaSearchResponse => {
    return 'currencies' in data && Array.isArray((data as CoinPaprikaSearchResponse).currencies)
}
//TODO: add isBondsResponse for bonds

const extractResultArray = (results: DataSearchResults, provider: APIProvider): SearchResultUnion[] => {
    const resultArray = {
        twelvedata: () => (isTwelveDataResponse(results) ? results.data : []),
        finnhub: () => (isFinnhubResponse(results) ? results.result : []),
        alphavantage: () => (isAlphaVantageResponse(results) ? results.bestMatches : []),
        coingecko: () => (isCoinGeckoResponse(results) ? results.coins : []),
        coinpaprika: () => (isCoinPaprikaResponse(results) ? results.currencies : []),
        bondbase: () => [], //TODO: add for bonds
    }

    return resultArray[provider]?.() || []
}

const shouldShowSearchItem = (result: SearchResultUnion, assetType: AssetType, provider: APIProvider): boolean => {
    if (provider === 'coingecko' || provider === 'coinpaprika' || provider === 'bondbase') {
        return true
    }

    let instrumentType: string

    if (provider === 'twelvedata') {
        instrumentType = (result as TwelveDataSearchResult).instrument_type
    } else if (provider === 'finnhub') {
        instrumentType = (result as FinnhubSearchResult).type
    } else if (provider === 'alphavantage') {
        instrumentType = (result as AlphaVantageSearchResult)['3. type']
    } else {
        return false
    }

    return matchesAssetType(instrumentType, assetType)
}

const transformSearchResult = (result: SearchResultUnion, provider: APIProvider): SearchResult => {
    switch (provider) {
        case 'twelvedata': {
            const res = result as TwelveDataSearchResult
            return {
                id: null,
                symbol: res.symbol,
                name: res.instrument_name,
                type: res.instrument_type,
                provider: provider,
            }
        }
        case 'finnhub': {
            const res = result as FinnhubSearchResult
            return {
                id: null,
                symbol: res.symbol,
                name: res.description,
                type: res.type,
                provider: provider,
            }
        }
        case 'alphavantage': {
            const res = result as AlphaVantageSearchResult
            return {
                id: null,
                symbol: res['1. symbol'],
                name: res['2. name'],
                type: res['3. type'],
                provider: provider,
            }
        }
        case 'coingecko': {
            const res = result as CoinGeckoSearchResult
            return {
                id: res.id,
                symbol: res.symbol,
                name: res.name,
                type: 'crypto',
                provider: provider,
            }
        }
        case 'coinpaprika': {
            const res = result as CoinPaprikaSearchResult
            return {
                id: res.id,
                symbol: res.symbol,
                name: res.name,
                type: res.type,
                provider: provider,
            }
        }
        //TODO: add for bonds
        default:
            throw new Error(`Unknown provider: ${provider}`)
    }
}

export const transformSearchResults = (
    results: DataSearchResults,
    assetType: AssetType,
    provider: APIProvider,
): SearchResult[] => {
    const resultArr = extractResultArray(results, provider)

    return resultArr
        .filter((result) => shouldShowSearchItem(result, assetType, provider))
        .map((result) => transformSearchResult(result, provider))
}

// --------------------------------------------------
const parsePrice = (value: unknown): number | null => {
    if (value === null || value === undefined || value === '') {
        return null
    }

    const price = typeof value === 'string' ? parseFloat(value) : Number(value)

    if (isNaN(price) || !isFinite(price) || price <= 0) {
        return null
    }

    return price
}

const isValidPrice = (price: unknown): price is number => {
    return typeof price === 'number' && isFinite(price) && price > 0
}

export const transformCurrentPriceSearchResults = (
    priceData: CurrentPriceSearchUnion,
    assetIdentifier: AssetIdentifier,
    provider: APIProvider,
): AssetPrice => {
    if (!priceData || typeof priceData !== 'object') {
        console.warn(`Invalid price data received for ${provider}`)
        return null
    }
    try {
        switch (provider) {
            case 'twelvedata': {
                const data = priceData as TwelveDataCurrentPriceSearchResponse
                if (!data.price) return null
                return parsePrice(data.price)
            }
            case 'finnhub': {
                const data = priceData as FinnhubCurrentPriceSearchResponse
                if (data.c === undefined || data.c === null) return null
                return parsePrice(data.c)
            }
            case 'alphavantage': {
                const data = priceData as AlphaVantageCurrentPriceSearchResponse
                if (!data['Global Quote'] || !data['Global Quote']['05. price']) return null
                return parsePrice(data['Global Quote']['05. price'])
            }
            case 'coingecko': {
                const data = priceData as CoinGeckoCurrentPriceSearchResponse
                const coinData = data[assetIdentifier as keyof typeof data]
                if (!coinData || typeof coinData !== 'object' || !('usd' in coinData) || !isValidPrice(coinData.usd))
                    return null
                return coinData.usd
            }
            case 'coinpaprika': {
                const data = priceData as CoinPaprikaCurrentPriceSearchResponse
                if (!data.quotes?.USD?.price) return null
                const price = data.quotes.USD.price
                return isValidPrice(price) ? price : null
            }
            default:
                console.warn(`Unknown provider: ${provider}`)
                return null
        }
    } catch (error) {
        console.warn(`Error transforming price data for ${provider}:`, error)
        return null
    }
}

//---------------------------------------------------------

export const transformDataForUrl = (
    assetIdentifier: AssetIdentifier,
    provider: APIProvider,
    date: TransactionDate,
): string | null => {
    if (!assetIdentifier || !provider || !date) {
        console.warn('Missing required parameters for URL transformation')
        return null
    }

    const config = API_CONFIGS[provider]
    const apiKey = API_KEYS[provider]

    switch (provider) {
        case 'twelvedata': {
            const nextDateObj = new Date(date)
            nextDateObj.setDate(nextDateObj.getDate() + 1)
            const nextDate = formatDateToInput(nextDateObj)

            if (!config.endpoints.historicalPrice) return null

            return config.endpoints.historicalPrice(assetIdentifier, date, nextDate, apiKey)
        }
        case 'finnhub': {
            console.warn('Historical prices not supported for Finnhub')
            return null
        }
        case 'alphavantage': {
            if (!config.endpoints.historicalPrice) return null

            return config.endpoints.historicalPrice(assetIdentifier, apiKey)
        }
        case 'coingecko': {
            if (!config.endpoints.historicalPrice) return null

            return config.endpoints.historicalPrice(assetIdentifier, date)
        }
        case 'coinpaprika': {
            console.warn('Historical prices not supported for CoinPaprika')
            return null
        }
        default:
            console.warn(`Error creating URL for ${provider}`)
            return null
    }
}

export const transformHistoricalPriceSearchResults = (
    historicalData: SearchHistoricalPriceResultUnion,
    date: TransactionDate,
    provider: APIProvider,
) => {
    if (!historicalData || typeof historicalData !== 'object' || !date) return null

    try {
        switch (provider) {
            case 'twelvedata': {
                const data = historicalData as HistoricalPriceResultTwelvedata

                if (
                    !data.values ||
                    !Array.isArray(data.values) ||
                    !data.values[0].close ||
                    data.values[0].datetime !== date
                )
                    return null
                return parsePrice(data.values[0].close)
            }

            case 'alphavantage': {
                const data = historicalData as HistoricalPriceResultAlphavantage

                if (!data['Time Series (Daily)']) return null
                const dayData = data['Time Series (Daily)'][date]

                if (!dayData || !dayData['4. close']) return null

                return parsePrice(dayData['4. close'])
            }
            case 'coingecko': {
                const data = historicalData as HistoricalPriceResultCoingecko

                if (!data.market_data?.current_price?.usd) return null

                const price = data.market_data.current_price.usd
                return isValidPrice(price) ? price : null
            }

            default:
                console.warn(`Unknown provider for historical data: ${provider}`)
                return null
        }
    } catch (error) {
        console.warn(`Error transforming historical price data for ${provider}:`, error)
        return null
    }
}
