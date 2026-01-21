import type { APIProvider, IAPIConfig } from './public.types'

// Multi-API configuration with fallback priority
export const API_CONFIGS: Record<APIProvider, IAPIConfig> = {
    twelvedata: {
        provider: 'twelvedata',
        name: 'Twelve Data',
        limit: 800, // per day
        endpoints: {
            search: (query, apiKey) =>
                `https://api.twelvedata.com/symbol_search?symbol=${encodeURIComponent(query)}&apikey=${apiKey}`,
            currentPrice: (symbol, apiKey) => `https://api.twelvedata.com/price?symbol=${symbol}&apikey=${apiKey}`,
            historicalPrice: (symbol, date, nextDate, apiKey) =>
                `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&start_date=${date}&end_date=${nextDate}&apikey=${apiKey}`,
        },
    },
    finnhub: {
        provider: 'finnhub',
        name: 'Finnhub',
        limit: 60, // Limit per minute
        endpoints: {
            search: (query, apiKey) => `https://finnhub.io/api/v1/search?q=${query}&token=${apiKey}`,
            currentPrice: (symbol, apiKey) => `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`,
        },
    },
    alphavantage: {
        provider: 'alphavantage',
        name: 'Alpha Vantage',
        limit: 25, //per day
        endpoints: {
            search: (query, apiKey) =>
                `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(
                    query,
                )}&apikey=${apiKey}`,
            currentPrice: (symbol, apiKey) =>
                `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`,
            historicalPrice: (symbol, apiKey) =>
                `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${apiKey}`,
        },
    },
    coingecko: {
        provider: 'coingecko',
        name: 'CoinGecko',
        limit: 10, // requests per minute for free tier
        endpoints: {
            search: (query) => `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`,
            currentPrice: (id) => `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`, // 'coin id from search should be used, returns {coinId: {usd: price}}'
            historicalPrice: (id, date) => `https://api.coingecko.com/api/v3/coins/${id}/history?date=${date}`, // date format: dd-mm-yyyy. returns {market_data: {current_price: {usd: price} }}
        },
    },
    coinpaprika: {
        provider: 'coinpaprika',
        name: 'CoinPaprika',
        limit: Infinity,
        endpoints: {
            search: (query) => `https://api.coinpaprika.com/v1/search?q=${encodeURIComponent(query)}`,
            currentPrice: (id) => `https://api.coinpaprika.com/v1/tickers/${id}`, // coin id from search should be used; quotes.USD.price
        },
    },
    bondbase: {
        //TODO: create db
        provider: 'bondbase',
        name: 'BondBase',
        limit: Infinity,
        endpoints: {
            search: (query) => `https://api.coinpaprika.com/v1/search?q=${encodeURIComponent(query)}`,
            currentPrice: (symbol) => `https://api.coinpaprika.com/v1/tickers/${symbol}`,
            historicalPrice: (symbol, date) =>
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
    coingecko: '',
    coinpaprika: '',
    bondbase: '',
}

// Priority order for fallbacks
export const STOCK_ETF_PROVIDERS: APIProvider[] = ['twelvedata', 'finnhub', 'alphavantage']
export const CRYPTO_PROVIDERS: APIProvider[] = ['coingecko', 'coinpaprika']
//TODO: add providers
export const BOND_PROVIDERS: APIProvider[] = ['bondbase']
