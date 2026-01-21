export type APIProvider = 'twelvedata' | 'finnhub' | 'alphavantage' | 'coingecko' | 'coinpaprika' | 'bondbase'

export type StockSymbol = string // e.g., "AAPL", "TSLA"
export type CryptoId = string // e.g., "btc-bitcoin-1", "eth-ethereum"

export type AssetIdentifier = StockSymbol | CryptoId
export interface IAPIConfig {
    provider: APIProvider
    name: string
    limit: number
    endpoints: {
        search: (query: string, apiKey?: string) => string
        currentPrice: (symbol: string, apiKey?: string) => string
        historicalPrice?: (
            identifier: AssetIdentifier,
            date: number | string,
            dateBefore?: number | string,
            apiKey?: string,
        ) => string
    }
}

//----------------------------
export interface ISearchResult {
    id: string | null
    symbol: string
    name: string
    assetType: string
    provider: APIProvider
}

//----------------------------
// API Response types for different providers
export type DataSearchResults =
    | ITwelveDataSearchResponse
    | IFinnhubSearchResponse
    | IAlphaVantageSearchResponse
    | ICoinGeckoSearchResponse
    | ICoinPaprikaSearchResponse

export type SearchResultUnion =
    | ITwelveDataSearchResult
    | IFinnhubSearchResult
    | IAlphaVantageSearchResult
    | ICoinGeckoSearchResult
    | ICoinPaprikaSearchResult

// twelvedata
export interface ITwelveDataSearchResult {
    symbol: string
    instrument_name: string
    instrument_type: string
}

export interface ITwelveDataSearchResponse {
    data: ITwelveDataSearchResult[]
}

// finnhub
export interface IFinnhubSearchResult {
    description: string
    symbol: string
    type: string
}

export interface IFinnhubSearchResponse {
    result: IFinnhubSearchResult[]
}

// alphavantage
export interface IAlphaVantageSearchResult {
    '1. symbol': string
    '2. name': string
    '3. type': string
}

export interface IAlphaVantageSearchResponse {
    bestMatches: IAlphaVantageSearchResult[]
}

// coingecko
export interface ICoinGeckoSearchResult {
    id: string // should be used for further requests
    name: string
    symbol: string
}

export interface ICoinGeckoSearchResponse {
    coins: ICoinGeckoSearchResult[]
}

// coinpaprika
export interface ICoinPaprikaSearchResult {
    id: string // should be used for further requests
    name: string
    symbol: string
    type: string
}

export interface ICoinPaprikaSearchResponse {
    currencies: ICoinPaprikaSearchResult[]
}

//----------------------------
export type AssetPrice = number | null

export type CurrentPriceSearchUnion =
    | ITwelveDataCurrentPriceSearchResponse
    | IFinnhubCurrentPriceSearchResponse
    | IAlphaVantageCurrentPriceSearchResponse
    | ICoinGeckoCurrentPriceSearchResponse
    | ICoinPaprikaCurrentPriceSearchResponse

// twelvedata
export interface ITwelveDataCurrentPriceSearchResponse {
    price: string
}

// finnhub
export interface IFinnhubCurrentPriceSearchResponse {
    c: string
}

// alphavantage
export interface IAlphaVantageCurrentPriceSearchResponse {
    'Global Quote': {
        '05. price': string
    }
}

// coingecko
export interface ICoinGeckoCurrentPriceSearchResponse {
    [key: string]: {
        usd: number
    }
}

// coinpaprika
export interface ICoinPaprikaCurrentPriceSearchResponse {
    quotes: {
        USD: {
            price: number
        }
    }
}

//---------------------
export type TransactionDate = number | string

export type SearchHistoricalPriceResultUnion =
    | IHistoricalPriceResultTwelvedata
    | IHistoricalPriceResultAlphavantage
    | IHistoricalPriceResultCoingecko

export interface IHistoricalPriceResultTwelvedata {
    values: [
        {
            datetime: string
            close: string
        },
    ]
}
export interface IHistoricalPriceResultAlphavantage {
    'Time Series (Daily)': {
        [key: string]: {
            '4. close': string
        }
    }
}
export interface IHistoricalPriceResultCoingecko {
    market_data: {
        current_price: {
            usd: number
        }
    }
}
