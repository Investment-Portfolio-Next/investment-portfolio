import type { CurrencyType } from '@/types/commonTypes.types'

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
