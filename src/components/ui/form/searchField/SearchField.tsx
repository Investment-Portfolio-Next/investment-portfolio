import type { UseFormRegisterReturn } from 'react-hook-form'
import type { AssetType, FieldVariant } from '@/types/commonTypes'
import { useState, useEffect } from 'react'
import type { InputHTMLAttributes } from 'react'
import { variantStyles } from '@/constants/borderVariants.constants'
import { useQuery } from '@tanstack/react-query'

interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'onSelect'> {
    label: string
    registration: UseFormRegisterReturn
    variant?: FieldVariant
    assetType: AssetType
    onSelect?: (isin: string) => void
}

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

type SearchResult = {
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

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

// Fetch function
const fetchSearchResults = async (searchString: string, assetType: AssetType): Promise<SearchResult[]> => {
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

export function SearchField({
    label,
    registration,
    variant = 'primary',
    assetType,
    onSelect,
    ...inputProps
}: SearchFieldProps) {
    const styles = variantStyles[variant]

    const [searchString, setSearchString] = useState<string>('')
    const [showResults, setShowResults] = useState<boolean>(false)

    const debouncedSearchString = useDebounce(searchString, 1000)

    const {
        data: searchResults,
        error,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ['search', debouncedSearchString, assetType],
        queryFn: () => fetchSearchResults(debouncedSearchString, assetType),
        enabled: debouncedSearchString.length >= 2,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 3,
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchString(value)
        setShowResults(true)
        registration.onChange(e) // Update form registration value
    }

    const handleResultSelect = (result: SearchResult) => {
        const selectedValue = result.symbol // or result.name
        setSearchString(selectedValue)
        setShowResults(false)

        // Update the form registration
        registration.onChange({
            target: { value: selectedValue, name: registration.name },
        } as React.ChangeEvent<HTMLInputElement>)

        // TODO: Call onSelect callback
        onSelect?.(selectedValue)
    }

    const handleClearInput = () => {
        setSearchString('')
        setShowResults(false)

        // Clear the form registration
        registration.onChange({
            target: { value: '', name: registration.name },
        } as React.ChangeEvent<HTMLInputElement>)

        // TODO: Call onSelect callback with empty value
        onSelect?.('')
    }

    const handleInputBlur = () => {
        // Delay hiding results to allow for clicks
        setTimeout(() => setShowResults(false), 200)
    }

    const handleInputFocus = () => {
        if (searchResults && searchResults.length > 0) {
            setShowResults(true)
        }
    }

    return (
        <div className="relative">
            <label>
                <span className="input-label">{label}</span>
                <div className="relative">
                    <input
                        {...inputProps}
                        className={`h-9 input-basic ${error ? 'border-error focus:border-error' : styles}`}
                        {...registration}
                        value={searchString}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        autoComplete="off"
                    />
                    {/* {(isLoading || isFetching) && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
                        </div>
                    )} */}

                    {/* TODO: refactor clear button */}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                        {/* Clear button - only show when there's text */}
                        {searchString && (
                            <button
                                type="button"
                                onClick={handleClearInput}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                tabIndex={-1}
                            >
                                <svg
                                    className="w-4 h-4 text-gray-400 hover:text-gray-600"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        )}

                        {/* Loading spinner */}
                        {(isLoading || isFetching) && (
                            <div className="p-1">
                                <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
                            </div>
                        )}
                    </div>
                </div>
            </label>

            {/* Search Results Dropdown */}
            {showResults && searchResults && searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((result, index) => (
                        <div
                            key={`${result.symbol}-${index}`}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                            onClick={() => handleResultSelect(result)}
                        >
                            <div className="font-medium text-sm">{result.symbol}</div>
                            <div className="text-xs text-gray-600 truncate">{result.name}</div>
                            {result.type && <div className="text-xs text-gray-500">{result.type}</div>}
                        </div>
                    ))}
                </div>
            )}

            {/* Error Message */}
            <p className="text-error text-xs mt-1 min-h-[1.125rem]">
                {error ? `Search error: ${error.message}` : '\u00A0'}
            </p>
        </div>
    )
}
