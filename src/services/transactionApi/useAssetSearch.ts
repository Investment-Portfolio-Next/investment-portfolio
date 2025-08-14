import { useQuery } from '@tanstack/react-query'
import type { AssetType } from '@/types/commonTypes'
import { searchAssets } from './apiSearchISIN'

export const useAssetSearch = (query: string, assetType: AssetType) => {
    return useQuery({
        queryKey: ['assetSearch', query, assetType],
        queryFn: () => searchAssets(query, assetType),
        enabled: query.length >= 2,
    })
}
