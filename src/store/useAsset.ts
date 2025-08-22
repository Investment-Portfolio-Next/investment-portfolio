import { create } from 'zustand'
import type {
    SearchResult,
    APIProvider,
    AssetIdentifier,
    AssetPrice,
} from '@/services/transactionApi/transaction.types'
import { assetQueries } from '@/services/queries/assetQueries'

interface Asset {
    id: string | null
    symbol: string
    name: string
    type: string
    provider: APIProvider | null
    date: number | null
    price: AssetPrice
}

interface AssetState {
    asset: Asset | null
    isLoading: boolean
    error: string | null
    setAsset: (selectedAsset: SearchResult) => void
    getCurrentPrice: () => Promise<void>
    clearAsset: () => void
}

export const useAsset = create<AssetState>((set, get) => ({
    asset: null,
    isLoading: false,
    error: null,

    setAsset: async (selectedAsset: SearchResult) => {
        const newAsset = {
            id: selectedAsset.id ?? null,
            symbol: selectedAsset.symbol,
            name: selectedAsset.name,
            type: selectedAsset.type,
            provider: selectedAsset.provider ?? null,
            date: Date.now(),
            price: null,
        }

        set({ asset: newAsset })
        get().getCurrentPrice()
    },

    getCurrentPrice: async () => {
        set({ isLoading: true, error: null })

        const { asset } = get()

        if (!asset?.symbol || !asset?.provider) {
            set({ isLoading: false, error: 'Missing asset symbol or provider' })
            return
        }

        if ((asset.provider === 'coingecko' || asset.provider === 'coinpaprika') && !asset.id) {
            set({
                asset: { ...asset, price: null },
                isLoading: false,
                error: `Missing asset ID for ${asset.provider} provider`,
            })
            return
        }

        const assetIdentifier: AssetIdentifier =
            asset.provider === 'coingecko' || asset.provider === 'coinpaprika' ? asset.id! : asset.symbol

        try {
            const priceData = await assetQueries.fetchCurrentPrice(assetIdentifier, asset.provider)
            console.log('price in state', priceData)

            set({
                asset: { ...asset, price: priceData },
                isLoading: false,
                error: null,
            })
            console.log('price in state2', get().asset)
        } catch (error) {
            console.warn('Failed to fetch current price:', error)
            set({
                asset: { ...asset, price: null },
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to fetch price',
            })
        }
    },

    clearAsset: () => set({ asset: null, isLoading: false, error: null }),
}))
