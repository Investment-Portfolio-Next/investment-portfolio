import { create } from 'zustand'
import type {
    SearchResult,
    APIProvider,
    AssetIdentifier,
    AssetPrice,
    TransactionDate,
} from '@/services/transactionApi/ISINsearch.types'
import { assetQueries } from '@/services/queries/assetQueries'
import { formatDateToInput } from '@/utils/helper'

interface Asset {
    id: string | null
    symbol: string
    name: string
    type: string
    provider: APIProvider | null
    date: TransactionDate
    price: AssetPrice
}

interface AssetState {
    asset: Asset | null
    isLoadingPrice: boolean
    priceError: string | null
    setAsset: (selectedAsset: SearchResult) => void
    setNewDate: (newDate: TransactionDate) => void
    setManualPrice: (price: AssetPrice) => void
    getCurrentPrice: () => Promise<void>
    getHistoricalPrice: (newDate: TransactionDate) => Promise<void>
    clearAsset: () => void
    clearPriceError: () => void
}

export const useAsset = create<AssetState>((set, get) => ({
    asset: null,
    isLoadingPrice: false,
    priceError: null,

    setAsset: async (selectedAsset: SearchResult) => {
        const newAsset = {
            id: selectedAsset.id ?? null,
            symbol: selectedAsset.symbol,
            name: selectedAsset.name,
            type: selectedAsset.type,
            provider: selectedAsset.provider ?? null,
            date: formatDateToInput(new Date()),
            price: null,
        }

        set({ asset: newAsset, priceError: null, isLoadingPrice: false })
        get().getCurrentPrice()
    },

    setNewDate: (newDate: TransactionDate) => {
        const { asset } = get()
        if (asset?.symbol) {
            set({ asset: { ...asset, date: newDate } })
        } else {
            return
        }

        const today = formatDateToInput(new Date())

        if (newDate < today) {
            get().getHistoricalPrice(newDate)
        } else if (newDate === today) {
            get().getCurrentPrice()
        } else {
            return
        }
    },

    setManualPrice: (price: AssetPrice) => {
        const { asset } = get()
        if (asset) {
            set({
                asset: { ...asset, price },
                priceError: null,
                isLoadingPrice: false,
            })
        }
    },

    getCurrentPrice: async () => {
        set({ isLoadingPrice: true, priceError: null })

        const { asset } = get()

        if (!asset?.symbol || !asset?.provider) {
            set({ isLoadingPrice: false, priceError: null })
            return
        }

        if ((asset.provider === 'coingecko' || asset.provider === 'coinpaprika') && !asset.id) {
            set({
                asset: { ...asset, price: null },
                isLoadingPrice: false,
                priceError: null,
            })
            return
        }

        const assetIdentifier: AssetIdentifier =
            asset.provider === 'coingecko' || asset.provider === 'coinpaprika' ? asset.id! : asset.symbol

        try {
            const priceData = await assetQueries.fetchCurrentPrice(assetIdentifier, asset.provider)

            set({
                asset: { ...asset, price: priceData },
                isLoadingPrice: false,
                priceError: null,
            })
        } catch (error) {
            console.warn('Failed to fetch current price:', error)
            set({
                asset: { ...asset, price: null },
                isLoadingPrice: false,
                priceError: 'No price is available on this date',
            })
        }
    },

    getHistoricalPrice: async (newDate: TransactionDate) => {
        set({ isLoadingPrice: true, priceError: null })

        const { asset } = get()

        if (!asset?.symbol || !asset?.provider || !asset?.date || !/^\d{4}-\d{2}-\d{2}$/.test(asset?.date.toString())) {
            set({ isLoadingPrice: false, priceError: null })
            return
        }

        if ((asset.provider === 'coingecko' || asset.provider === 'coinpaprika') && !asset.id) {
            set({
                asset: { ...asset, price: null },
                isLoadingPrice: false,
                priceError: null,
            })
            return
        }

        const assetIdentifier: AssetIdentifier =
            asset.provider === 'coingecko' || asset.provider === 'coinpaprika' ? asset.id! : asset.symbol

        try {
            const priceData = await assetQueries.fetchHistoricalPrice(assetIdentifier, asset.provider, newDate)

            set({
                asset: { ...asset, price: priceData },
                isLoadingPrice: false,
                priceError: null,
            })
        } catch (error) {
            console.warn('Failed to fetch historical price:', error)
            set({
                asset: { ...asset, price: null },
                isLoadingPrice: false,
                priceError: 'No price is available on this date',
            })
        }
    },

    clearAsset: () => set({ asset: null, isLoadingPrice: false, priceError: null }),

    clearPriceError: () => set({ isLoadingPrice: false, priceError: null }),
}))
