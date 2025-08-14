import type { APIProvider, APIConfig } from './transaction.types'

// Multi-API configuration with fallback priority
export const API_CONFIGS: Record<APIProvider, APIConfig> = {
    twelvedata: {
        provider: 'twelvedata',
        name: 'Twelve Data',
        limit: 800, // per day
        endpoints: {
            search: (query: string, apiKey: string) =>
                `https://api.twelvedata.com/symbol_search?symbol=${encodeURIComponent(query)}&apikey=${apiKey}`,
            currentPrice: (symbol: string, apiKey: string) =>
                `https://api.twelvedata.com/price?symbol=${symbol}&apikey=${apiKey}`,
            historicalPrice: (symbol: string, dateBefore: string, date: string, apiKey: string) =>
                `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&start_date=${dateBefore}&end_date=${date}&apikey=${apiKey}`, // dateBefore, date - Unix timestamp
        },
    },
    finnhub: {
        provider: 'finnhub',
        name: 'Finnhub',
        limit: 60, // Limit per minute
        endpoints: {
            search: (query: string, apiKey: string) => `https://finnhub.io/api/v1/search?q=${query}&token=${apiKey}`,
            currentPrice: (symbol: string, apiKey: string) =>
                `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`,
        },
    },
    alphavantage: {
        provider: 'alphavantage',
        name: 'Alpha Vantage',
        limit: 25, //per day
        endpoints: {
            search: (query: string, apiKey: string) =>
                `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(
                    query,
                )}&apikey=${apiKey}`,
            currentPrice: (symbol: string, apiKey: string) =>
                `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`,
            historicalPrice: (symbol: string, date: string, apiKey: string) =>
                `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${apiKey}`,
        },
    },
    coinpaprika: {
        //TODO: doublechek endpoints, add fallback apis
        provider: 'coinpaprika',
        name: 'CoinPaprika',
        limit: Infinity,
        endpoints: {
            search: (query: string) => `https://api.coinpaprika.com/v1/search?q=${encodeURIComponent(query)}`,
            currentPrice: (symbol: string) => `https://api.coinpaprika.com/v1/tickers/${symbol}`,
            historicalPrice: (symbol: string, date: string) =>
                `https://api.coinpaprika.com/v1/tickers/${symbol}/historical?start=${date}&end=${date}`,
        },
    },
    bondbase: {
        //TODO: create db
        provider: 'bondbase',
        name: 'BondBase',
        limit: Infinity,
        endpoints: {
            search: (query: string) => `https://api.coinpaprika.com/v1/search?q=${encodeURIComponent(query)}`,
            currentPrice: (symbol: string) => `https://api.coinpaprika.com/v1/tickers/${symbol}`,
            historicalPrice: (symbol: string, date: string) =>
                `https://api.coinpaprika.com/v1/tickers/${symbol}/historical?start=${date}&end=${date}`,
        },
    },
}

const getApiKey = (key: string | undefined, providerName: string): string => {
    if (!key) {
        throw new Error(`${providerName} API key is not configured`)
    }
    return key
}

export const API_KEYS = {
    twelvedata: getApiKey(process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY, 'Twelve Data'),
    finnhub: getApiKey(process.env.NEXT_PUBLIC_FINNHUB_API_KEY, 'Finnhub'),
    alphavantage: getApiKey(process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY, 'Alpha Vantage'),
    coinpaprika: '',
    bondbase: '',
}

// Priority order for fallbacks
export const STOCK_ETF_PROVIDERS: APIProvider[] = ['twelvedata', 'finnhub', 'alphavantage']
//TODO: add providers
export const CRYPTO_PROVIDERS: APIProvider[] = ['coinpaprika']
//TODO: add providers
export const BOND_PROVIDERS: APIProvider[] = ['bondbase']
