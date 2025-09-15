import type { CurrencyType } from '@/types/commonTypes'

export interface ITransactionForm {
    symbolID: { symbol: string; name: string }
    transactionType: 'buy' | 'sell'
    transactionQuantity: number | null
    transactionDate: string
    initialPrice: number | null
    transactionCommision: number | null
    transactionCurrency: CurrencyType
    bondNominal?: number | null
    bondAccruedInterest?: number | null
    isAccruedInterestPerBond?: boolean
    notes?: string
}
