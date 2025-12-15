import type { CurrencyType } from '../commonTypes.types'

export type StockTransaction = {
    asset_type: string
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
