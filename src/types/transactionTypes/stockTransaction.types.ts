import type { AssetType, CurrencyType } from '../commonTypes.types'

export type TransactionListResponse = Transaction[]

export type Transaction = StockTransaction | EtfTransaction | CryptoTransaction | BondTransaction

type BaseTransaction = {
    asset_type: AssetType
    provider: string
    initial_price: number
    transaction_commission: number
    transaction_currency: CurrencyType
    transaction_date: string
    transaction_quantity: number
    transaction_type: 'buy' | 'sell'
    transaction_id: number
    asset_ticker: string
    notes?: string
}

export type StockTransaction = BaseTransaction & {
    asset_type: 'stock'
}

export type EtfTransaction = BaseTransaction & {
    asset_type: 'etf'
}

export type CryptoTransaction = BaseTransaction & {
    asset_type: 'crypto'
}

export type BondTransaction = BaseTransaction & {
    asset_type: 'bond'
    bondNominal: number
    bondAccruedInterest: number
    isAccruedInterestPerBond: boolean
}
