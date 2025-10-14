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
    const safeNumber = (value: number | null | undefined) => (value == null || isNaN(value) ? 0 : value)

    const total = Number(
        (
            safeNumber(price) * safeNumber(quantity) +
            (typeOfTransaction === 'buy' ? safeNumber(commission) : -safeNumber(commission)) +
            (isBond
                ? accruedPerBond
                    ? safeNumber(accruedInterest) * safeNumber(quantity)
                    : safeNumber(accruedInterest)
                : 0)
        ).toFixed(9),
    )

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
