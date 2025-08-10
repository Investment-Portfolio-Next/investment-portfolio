import type { AssetType } from '@/types/commonTypes'

interface ISearchApiData {
    id: string
    assetType: AssetType
    getUrl: (searchString: string) => string
}

// API response types for different services
interface AlphaVantageMatch {
    '1. symbol': string
    '2. name': string
    '3. type': string
    '4. region': string
    '5. marketOpen': string
    '6. marketClose': string
    '7. timezone': string
    '8. currency': string
    '9. matchScore': string
}

interface AlphaVantageResponse {
    bestMatches: AlphaVantageMatch[]
}

interface CoinPaprikaResult {
    id: string
    name: string
    symbol: string
    rank: number
    type: string
}

interface CoinPaprikaExchange {
    id: string
    name: string
}

interface CoinPaprikaIco {
    id: string
    name: string
}

interface CoinPaprikaPerson {
    id: string
    name: string
}

interface CoinPaprikaTag {
    id: string
    name: string
}

interface CoinPaprikaResponse {
    currencies: CoinPaprikaResult[]
    exchanges: CoinPaprikaExchange[]
    icos: CoinPaprikaIco[]
    people: CoinPaprikaPerson[]
    tags: CoinPaprikaTag[]
}

export type SearchResult = {
    symbol: string
    name: string
    type?: string
}

const SEARCH_API_DATA: ISearchApiData[] = [
    {
        id: '1',
        assetType: 'stock',
        getUrl: (searchString: string) =>
            `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(
                searchString,
            )}&apikey=Y3E5063QA9MVU741`,
    },
    {
        id: '2',
        assetType: 'etf',
        getUrl: (searchString: string) =>
            `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(
                searchString,
            )}&apikey=Y3E5063QA9MVU741`,
    },
    {
        id: '3',
        assetType: 'bond',
        getUrl: (searchString: string) => `https://www.someFutureApi.co/${encodeURIComponent(searchString)}`,
    },
    {
        id: '4',
        assetType: 'crypto',
        getUrl: (searchString: string) => `https://api.coinpaprika.com/v1/search?q=${encodeURIComponent(searchString)}`,
    },
]

// Fetch function
export const fetchSearchResults = async (searchString: string, assetType: AssetType): Promise<SearchResult[]> => {
    if (!searchString.trim()) {
        return []
    }

    const apiConfig = SEARCH_API_DATA.find((config) => config.assetType === assetType)
    if (!apiConfig) {
        throw new Error(`No API configuration found for asset type: ${assetType}`)
    }

    const url = apiConfig.getUrl(searchString)
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Failed to search ${assetType}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('data', data)
    // TODO: apply fallback APIs functionality

    // Transform response based on asset type
    switch (assetType) {
        case 'stock': {
            const alphaData = data as AlphaVantageResponse
            return (
                alphaData.bestMatches
                    ?.filter((match) => {
                        const type = match['3. type'].toLowerCase()

                        // Filtering for stocks only
                        return (
                            (type === 'equity' ||
                                type.includes('common stock') ||
                                type.includes('ordinary shares') ||
                                type.includes('common share')) &&
                            !type.includes('etf') &&
                            !type.includes('fund') &&
                            !type.includes('trust') &&
                            !type.includes('reit') &&
                            !type.includes('adr') &&
                            !type.includes('warrant') &&
                            !type.includes('preferred') &&
                            !type.includes('bond')
                        )
                    })
                    .map((match) => ({
                        symbol: match['1. symbol'],
                        name: match['2. name'],
                        type: match['3. type'],
                    })) || []
            )
        }

        case 'etf': {
            const alphaData = data as AlphaVantageResponse
            return (
                alphaData.bestMatches
                    ?.filter((match) => {
                        const type = match['3. type'].toLowerCase()

                        // Filtering for ETFs only
                        return (
                            type.includes('etf') ||
                            type.includes('exchange traded fund') ||
                            type.includes('exchange-traded fund') ||
                            type.includes('exchange traded') ||
                            (type.includes('fund') &&
                                (type.includes('index') || type.includes('sector') || type.includes('commodity')))
                        )
                    })
                    .map((match) => ({
                        symbol: match['1. symbol'],
                        name: match['2. name'],
                        type: match['3. type'],
                    })) || []
            )
        }

        case 'crypto': {
            const coinData = data as CoinPaprikaResponse
            return (
                coinData.currencies?.map((currency) => ({
                    symbol: currency.symbol,
                    name: currency.name,
                    type: currency.type,
                })) || []
            )
        }

        case 'bond':
            return [] // TODO: add handling future APIs

        default:
            return data || []
    }
}
