import type { RegisterOptions } from 'react-hook-form'
import type { ITransactionForm } from './transactionForm.types'
import { isFuture, parse, isBefore, format } from 'date-fns'

type ValidationRules = {
    [K in keyof ITransactionForm]?: RegisterOptions<ITransactionForm, K>
}
interface ValidationParams {
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
}: ValidationParams): ValidationRules => {
    const rules: ValidationRules = {
        symbolID: {
            required: 'Asset ID is required',
            pattern: {
                value: /^[\w\s\-\.\,&]+$/,
                message: 'Asset ID may contain latin letters, numbers, spaces, &, dots, commas and hyphens only',
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

                if (value < 0.000000001) return 'Quantity must be at least 0.000000001'
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

                if (countDecimals(value) > 6) return 'Must have at most 6 decimal places'

                if (value < 0.000001) return 'Price must be at least 0.000001'
                if (value > 1_000_000) return 'Price must not exceed 1,000,000'

                return true
            },
        },
        transactionCommision: {
            required: 'Commission is required',
            valueAsNumber: true,
            validate: (value?: number | null) => {
                if (value == null || isNaN(value)) return 'Price is required'

                if (countDecimals(value) > 6) return 'Must have at most 6 decimal places'

                if (value < 0) return 'Commission must be non-negative'
                if (value > 1_000_000) return 'Commission must not exceed 1,000,000'

                return true
            },
        },
        notes: {
            maxLength: { value: 300, message: 'Max length is 300 characters' },
        },
    }

    if (isBond) {
        rules.bondNominal = {
            required: 'Nominal is required',
            valueAsNumber: true,
            validate: (value?: number | null) => {
                if (value == null || isNaN(value)) return 'Nominal is required'

                if (countDecimals(value) > 6) return 'Must have at most 6 decimal places'

                if (value < 0.000001) return 'Must be greater than 0'
                if (value > 100_000) return 'Must not exceed 100,000'

                return true
            },
        }
        rules.bondAccruedInterest = {
            required: 'Accrued interest is required',
            valueAsNumber: true,
            validate: (value?: number | null) => {
                if (value == null || isNaN(value)) return 'Accrued interest is required'
                if (countDecimals(value) > 6) return 'Must have at most 6 decimal places'
                if (value < 0) return 'Must be non-negative'
                if (value > 100_000) return 'Must not exceed 100,000'
                return true
            },
        }
    }

    return rules
}
