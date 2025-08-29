import type { CurrencyType } from '@/types/commonTypes'

export interface ITransactionForm {
    symbolID: string
    transactionType: string
    transactionCurrency: CurrencyType
    transactionDate: string
    initialPrice: number | null
    transactionCommision: number | null
    transactionQuantity: number | null
    notes: string
    bondNominal?: number | null
    bondAccruedInterest?: number | null
    isAccruedInterestPerBond?: boolean
}
