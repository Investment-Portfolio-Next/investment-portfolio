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
} from './transaction.types'
import type { AssetType } from '@/types/commonTypes'

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

const transformResult = (result: SearchResultUnion, provider: APIProvider): SearchResult => {
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
        .map((result) => transformResult(result, provider))
}
