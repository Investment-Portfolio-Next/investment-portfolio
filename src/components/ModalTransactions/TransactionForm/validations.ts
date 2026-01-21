import type { RegisterOptions } from 'react-hook-form'
import type { ITransactionForm } from './transactionForm.types'
import { isFuture, parse, isBefore, format } from 'date-fns'

type ValidationRules = {
    [K in keyof ITransactionForm]?: RegisterOptions<ITransactionForm, K>
}
interface IValidationParams {
    accountOpenDate: Date
    assetQuantityLimit: number
    isBond: boolean
}

const validateDate = (value: string, accountOpenDate: Date) => {
    const formatted = format(new Date(value), 'dd.MM.yyyy')
    const parsed = parse(formatted, 'dd.MM.yyyy', new Date())
    if (isNaN(parsed.getTime())) {
        return 'Invalid date format (DD.MM.YYYY expected)'
    }
    if (isFuture(parsed)) {
        return 'Date cannot be in the future'
    }
    if (isBefore(parsed, accountOpenDate)) {
        return 'Date cannot be earlier than account opening date'
    }
    return true
}

const countDecimals = (value: number) => {
    if (Math.floor(value) === value) return 0
    const str = value.toString()
    if (str.includes('e-')) {
        const [, exp] = str.split('e-')
        return parseInt(exp, 10)
    }
    return str.split('.')[1]?.length || 0
}

export const getValidationRules = ({
    accountOpenDate,
    assetQuantityLimit,
    isBond,
}: IValidationParams): ValidationRules => {
    const rules: ValidationRules = {
        assetTicker: {
            validate: (value?: { symbol?: string; name?: string }) => {
                const symbol = value?.symbol ?? ''
                if (!symbol || symbol.trim() === '') return 'Asset ID is required'
                if (!/^[\w\s\-\.]+$/.test(symbol)) {
                    return 'Asset ID may contain latin letters, numbers, dots, spaces and hyphens only'
                }
                return true
            },
        },
        transactionType: {
            required: 'Transaction type is required',
        },
        transactionQuantity: {
            required: 'Quantity is required',
            valueAsNumber: true,
            validate: (value?: number | null) => {
                if (value == null || isNaN(value)) return 'Quantity is required'
                if (countDecimals(value) > 9) return 'Must have at most 9 decimal places'
                if (value < 0.000000001) return 'Quantity must be at least 0,000000001'
                if (value > assetQuantityLimit) return `Quantity must not exceed ${assetQuantityLimit}`
                return true
            },
        },
        transactionDate: {
            required: 'Date is required',
            validate: (value) => validateDate(value, accountOpenDate),
        },
        initialPrice: {
            required: 'Price is required',
            valueAsNumber: true,
            validate: (value?: number | null) => {
                if (value == null || isNaN(value)) return 'Price is required'
                if (countDecimals(value) > 12) return 'Must have at most 12 decimal places'
                if (value < 0.000000000001) return 'Price must be at least 0.000000000001'
                if (value > 999999999999999) return 'Price must not exceed 999999999999999'
                return true
            },
        },
        transactionCommission: {
            required: 'Commission is required',
            valueAsNumber: true,
            validate: (value?: number | null, formValues?: ITransactionForm) => {
                if (value == null || isNaN(value)) return 'Commission is required'
                if (countDecimals(value) > 6) return 'Must have at most 6 decimal places'

                const price = formValues?.initialPrice ?? 0
                const quantity = formValues?.transactionQuantity ?? 0

                if (price > 0 && quantity > 0) {
                    const transactionValue = price * quantity
                    const maxCommission = Math.min(transactionValue * 0.5, 10_000_000)

                    if (value > maxCommission)
                        return `Commission must not exceed ${maxCommission} (50% of transaction value or 10000000, whichever is lower)`
                } else {
                    if (value > 10_000_000) return 'Commission must not exceed 10000000'
                }
                return true
            },
        },
        notes: {
            maxLength: { value: 300, message: 'Maximum length is 300 characters' },
        },
    }

    if (isBond) {
        rules.bondNominal = {
            required: 'Nominal is required',
            valueAsNumber: true,
            validate: (value?: number | null) => {
                if (value == null || isNaN(value)) return 'Nominal is required'
                if (countDecimals(value) > 6) return 'Must have at most 6 decimal places'
                if (value < 0.000001) return 'Must be greater than 0,000001'
                if (value > 999999999999999) return 'Must not exceed 999999999999999 '
                return true
            },
        }
        rules.bondAccruedInterest = {
            required: 'Accrued interest is required',
            valueAsNumber: true,
            validate: (value?: number | null) => {
                if (value == null || isNaN(value)) return 'Accrued interest is required'
                if (countDecimals(value) > 6) return 'Must have at most 6 decimal places'
                if (value > 99999999999) return 'Must not exceed 99999999999'
                return true
            },
        }
    }

    return rules
}
