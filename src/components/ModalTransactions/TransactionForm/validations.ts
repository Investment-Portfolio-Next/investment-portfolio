import type { RegisterOptions } from 'react-hook-form'
import type { ITransactionForm } from './transactionForm.types'

type ValidationRules = {
    [K in keyof ITransactionForm]?: RegisterOptions<ITransactionForm, K>
}

import { isFuture, parse, isBefore, format } from 'date-fns'

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

const validateDecimals = (maxDecimals: number) => (value?: number) => {
    if (value === undefined) return 'Value is required'
    const str = value.toString()
    const decimals = str.includes('.') ? str.split('.')[1].length : 0
    return decimals <= maxDecimals || `Must have at most ${maxDecimals} decimal places`
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
                value: /^[\w\s\-]+$/,
                message: 'Asset ID may contain latin letters, numbers, spaces, and hyphens only',
            },
        },
        transactionType: {
            required: 'Transaction type is required',
        },
        transactionQuantity: {
            required: 'Quantity is required',
            min: { value: 1, message: 'Quantity must be at least 1' },
            max: { value: assetQuantityLimit, message: `Quantity must not exceed ${assetQuantityLimit}` },
            validate: (value) => Number.isInteger(Number(value)) || 'Quantity must be an integer',
            valueAsNumber: true,
        },
        transactionDate: {
            required: 'Date is required',
            validate: (value) => validateDate(value, accountOpenDate),
        },
        initialPrice: {
            required: 'Initial price is required',
            min: { value: 0.000001, message: 'Price must be greater than 0' },
            max: { value: 1_000_000, message: 'Price must not exceed 1,000,000' },
            validate: validateDecimals(6),
            valueAsNumber: true,
        },
        transactionCommision: {
            required: 'Commission is required',
            min: { value: 0, message: 'Commission must be non-negative' },
            max: { value: 1_000_000, message: 'Commission must not exceed 1,000,000' },
            validate: validateDecimals(6),
            valueAsNumber: true,
        },
        notes: {
            maxLength: { value: 300, message: 'Max length is 300 characters' },
        },
    }

    if (isBond) {
        rules.bondNominal = {
            required: 'Nominal is required',
            min: { value: 0.000001, message: 'Must be greater than 0' },
            max: { value: 100_000, message: 'Must not exceed 100,000' },
            validate: validateDecimals(6),
            valueAsNumber: true,
        }
        rules.bondAccruedInterest = {
            required: 'Accrued interest is required',
            min: { value: 0, message: 'Must be non-negative' },
            max: { value: 100_000, message: 'Must not exceed 100,000' },
            validate: validateDecimals(6),
            valueAsNumber: true,
        }
    }

    return rules
}
