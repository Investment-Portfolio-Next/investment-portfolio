export type APIProvider = 'twelvedata' | 'finnhub' | 'alphavantage' | 'coinpaprika' | 'bondbase'

export interface APIConfig {
    provider: APIProvider
    name: string
    limit: number
    endpoints: {
        search: (query: string, apiKey: string) => string
        currentPrice: (symbol: string, apiKey: string) => string
        historicalPrice?: (symbol: string, dateBefore: string, date: string, apiKey: string) => string
    }
}

export interface SearchResult {
    symbol: string
    name: string
    type: string
}

//TODO: uncomment for price fetches
// export interface PriceData {
//     symbol: string
//     price: number
//     change?: number
//     changePercent?: number
//     date: string
//     provider: APIProvider
//     timestamp: number
// }

// export interface AssetDetails extends SearchResult {
//     currentPrice?: PriceData
//     isin?: string
// }

// API Response types for different providers

export type DataSearchResults = TwelveDataSearchResult[] | FinnhubSearchResult[] | AlphaVantageSearchResult[]

export type SearchResultUnion = TwelveDataSearchResult | FinnhubSearchResult | AlphaVantageSearchResult

// twelvedata
export interface TwelveDataSearchResult {
    symbol: string
    instrument_name: string
    instrument_type: string
}

export interface TwelveDataSearchResponse {
    data: TwelveDataSearchResult[]
    status: string
}

export interface TwelveDataPrice {
    price: string
}

// finnhub
export interface FinnhubSearchResult {
    description: string
    symbol: string
    type: string
}

export interface FinnhubSearchResponse {
    count: number
    result: FinnhubSearchResult[]
}

// alphavantage
export interface AlphaVantageSearchResult {
    '1. symbol': string
    '2. name': string
    '3. type': string
}

export interface AlphaVantageSearchResponse {
    bestMatches: AlphaVantageSearchResult[]
}

// coinpaprika
export interface CoinPaprikaResult {
    id: string
    name: string
    symbol: string
    rank: number
    type: string
}
