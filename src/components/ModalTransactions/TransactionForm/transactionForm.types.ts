import type { CurrencyType, AssetType } from '@/types/commonTypes.types'
import type { APIProvider } from '@/api/public/public.types'

export interface ITransactionForm {
    assetTicker: { symbol: string; name: string }
    transactionType: 'buy' | 'sell'
    transactionQuantity: number | null
    transactionDate: string
    initialPrice: number | null
    transactionCommission: number | null
    transactionCurrency: CurrencyType
    bondNominal?: number | null
    bondAccruedInterest?: number | null
    isAccruedInterestPerBond?: boolean
    notes?: string
}

export interface ITransactionSubmit extends ITransactionForm {
    assetType: AssetType
    provider: APIProvider | null
}
