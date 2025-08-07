import type { CurrencyType } from '@/types/commonTypes'

export interface ITransactionForm {
    symbolID: string
    transactionType: string
    transactionCurrency: CurrencyType
    transactionDate: string
    initialPrice: number
    transactionCommision: number
    transactionQuantity: number
    notes: string
    bondNominal?: number
    bondAccruedInterest?: number
    isAccruedInterestPerBond?: boolean
}
