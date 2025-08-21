import { useQuery } from '@tanstack/react-query'
import type { AssetIdentifier, APIProvider } from './transaction.types'
import { assetQueries } from '../queries/assetQueries'

export const useCurrentPriceSearch = (assetIdentifier: AssetIdentifier, provider: APIProvider) => {
    return useQuery({
        ...assetQueries.currentPrice(assetIdentifier!, provider!),
        enabled: !!assetIdentifier && !!provider,
    })
}
