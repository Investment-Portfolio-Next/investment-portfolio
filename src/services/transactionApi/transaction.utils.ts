import type {
    SearchResult,
    APIProvider,
    TwelveDataSearchResult,
    FinnhubSearchResult,
    CoinPaprikaResult,
    AlphaVantageSearchResult,
    DataSearchResults,
    SearchResultUnion,
} from './transaction.types'
import type { AssetType } from '@/types/commonTypes'

const isTwelveDataResult = (result: SearchResultUnion): result is TwelveDataSearchResult => {
    return 'instrument_name' in result && 'instrument_type' in result
}

const isFinnhubResult = (result: SearchResultUnion): result is FinnhubSearchResult => {
    return 'description' in result && 'type' in result && !('instrument_type' in result)
}

const isAlphaVantageResult = (result: SearchResultUnion): result is AlphaVantageSearchResult => {
    return '1. symbol' in result && '2. name' in result && '3. type' in result
}

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

export const transformSearchResults = (
    results: DataSearchResults,
    assetType: AssetType,
    provider: APIProvider,
): SearchResult[] => {
    return results
        .filter((result) => {
            let instrumentType: string

            if (isTwelveDataResult(result)) {
                instrumentType = result.instrument_type
            } else if (isFinnhubResult(result)) {
                instrumentType = result.type
            } else if (isAlphaVantageResult(result)) {
                instrumentType = result['3. type']
            } else {
                return false
            }

            return matchesAssetType(instrumentType, assetType)
        })
        .map((result): SearchResult => {
            if (isTwelveDataResult(result)) {
                return {
                    symbol: result.symbol,
                    name: result.instrument_name,
                    type: result.instrument_type,
                    provider,
                }
            } else if (isFinnhubResult(result)) {
                return {
                    symbol: result.symbol,
                    name: result.description,
                    type: result.type,
                    provider,
                }
            } else if (isAlphaVantageResult(result)) {
                return {
                    symbol: result['1. symbol'],
                    name: result['2. name'],
                    type: result['3. type'],
                    provider,
                }
            } else {
                throw new Error('Unknown result type')
            }
        })
}

//-------------------------------

export const transformCoinPaprikaSearchResults = (
    results: CoinPaprikaResult[],
    provider: APIProvider,
): SearchResult[] => {
    return results.map((result) => ({
        symbol: result.symbol,
        name: result.name,
        type: 'cryptocurrency',
        provider,
    }))
}
