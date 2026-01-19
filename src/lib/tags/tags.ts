import type { AssetType } from '@/types/commonTypes.types'

export const transactionListTag = (assetType: AssetType) => `transactions:${assetType}`
