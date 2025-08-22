import { useQuery } from '@tanstack/react-query'
import type { AssetType } from '@/types/commonTypes'
import { assetQueries } from '../queries/assetQueries'

export const useAssetSearch = (query: string, assetType: AssetType) => {
    return useQuery({
        ...assetQueries.assetSearch(query, assetType),
        enabled: query.length >= 2 && !!assetType,
    })
}
