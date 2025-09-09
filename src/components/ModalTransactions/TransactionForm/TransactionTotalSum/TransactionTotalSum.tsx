import { getCurrencySymbol } from '@/utils/helper'
import type { CurrencyType } from '@/types/commonTypes'

interface TransactionTotalSumProps {
    typeOfTransaction: string
    currency: CurrencyType
    price: number | null
    quantity: number | null
    commission: number | null
    isBond?: boolean
    accruedInterest?: number | null
    accruedPerBond?: boolean
}

export function TransactionTotalSum({
    typeOfTransaction,
    currency,
    price,
    quantity,
    commission,
    isBond = false,
    accruedInterest = 0,
    accruedPerBond = true,
}: TransactionTotalSumProps) {
    if (price === null || quantity === null || commission === null || accruedInterest === null) return
    const baseCost = price * quantity
    const aiCost = isBond ? (accruedPerBond ? accruedInterest * quantity : accruedInterest) : 0

    const hasInvalidValues = [baseCost, commission, aiCost].some((val) => isNaN(val))

    const commissionAdjusted = typeOfTransaction === 'buy' ? commission : -commission
    const total = hasInvalidValues ? 0 : +(baseCost + commissionAdjusted + aiCost).toFixed(2)

    const currencySymbol = getCurrencySymbol(currency)
    return (
        <div className="text-sm text-white/80 mt-2">
            Estimated Total:{' '}
            <span className="font-medium text-white">
                {currencySymbol}
                {'\u00A0'}
                {total}
            </span>
        </div>
    )
}
