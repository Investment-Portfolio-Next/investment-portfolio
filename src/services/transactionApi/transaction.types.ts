export type APIProvider = 'twelvedata' | 'finnhub' | 'alphavantage' | 'coingecko' | 'coinpaprika' | 'bondbase'

export type StockSymbol = string // e.g., "AAPL", "TSLA"
export type CryptoId = string // e.g., "btc-bitcoin-1", "eth-ethereum"

export type AssetIdentifier = StockSymbol | CryptoId
export interface APIConfig {
    provider: APIProvider
    name: string
    limit: number
    endpoints: {
        search: (query: string, apiKey: string) => string
        currentPrice: (symbol: string, apiKey: string) => string
        historicalPrice?: (identifier: AssetIdentifier, dateBefore?: string, date?: string, apiKey?: string) => string
    }
}

export interface SearchResult {
    id?: string
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

export type DataSearchResults =
    | TwelveDataSearchResult[]
    | FinnhubSearchResult[]
    | AlphaVantageSearchResult[]
    | CoinGeckoSearchResult[]
    | CoinPaprikaSearchResult[]

export type SearchResultUnion =
    | TwelveDataSearchResult
    | FinnhubSearchResult
    | AlphaVantageSearchResult
    | CoinGeckoSearchResult
    | CoinPaprikaSearchResult

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

// crypto
// coingecko
export interface CoinGeckoSearchResult {
    id: string // should be used for further requests
    name: string
    symbol: string
}

export interface CoinGeckoSearchResponse {
    coins: CoinGeckoSearchResult[]
}

// coinpaprika
export interface CoinPaprikaSearchResult {
    id: string // should be used for further requests
    name: string
    symbol: string
    type: string
}

export interface CoinPaprikaSearchResponse {
    currencies: CoinPaprikaSearchResult[]
}
