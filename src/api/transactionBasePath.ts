import type { AssetType } from '@/types/commonTypes.types'

export const TRANSACTION_BASE_PATH: Record<AssetType, string> = {
    stock: '/stock_transactions',
    etf: '/etf_transactions',
    bond: '/bond_transactions',
    crypto: '/crypto_transactions',
}
