import { create } from 'zustand'
import type { SearchResult } from '@/services/transactionApi/transaction.types'

interface AssetState {
    asset: SearchResult | null
    setAsset: (asset: SearchResult | null) => void
    clearAsset: () => void
}

export const useAsset = create<AssetState>((set) => ({
    asset: null,
    setAsset: (asset: SearchResult | null) => set({ asset: asset }),
    clearAsset: () => set({ asset: null }),
}))
