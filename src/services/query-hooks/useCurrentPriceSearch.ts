import { useQuery } from '@tanstack/react-query'
import type { AssetIdentifier, APIProvider } from '../../api/public/public.types'
import { assetQueries } from '../assetQueries'

export const useCurrentPriceSearch = (assetIdentifier: AssetIdentifier, provider: APIProvider) => {
    return useQuery({
        ...assetQueries.currentPrice(assetIdentifier, provider),
        enabled: !!assetIdentifier && !!provider,
    })
}
