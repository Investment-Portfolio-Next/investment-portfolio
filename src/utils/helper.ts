import type { CurrencyType } from '@/types/commonTypes.types'
import { currencyOptions } from '@/constants/currencies.constants'
import axios from 'axios'

// Преобразует объект Date в строку формата 'YYYY-MM-DD'
export function formatDateToInput(date: Date): string {
    return date.toISOString().split('T')[0]
}

// Функция для получения символа валюты по value (US Dollar -> $)
export function getCurrencySymbol(currency: CurrencyType): string {
    const found = currencyOptions.find((c) => c.value === currency)
    return found?.symbol || ''
}

export function getHumanReadableError(error: unknown) {
    let message: string | undefined

    if (axios.isAxiosError(error)) {
        const status = error.response?.status

        if (status === 422) {
            message = 'Please check the entered data.'
        } else if (status === 403) {
            message = 'You do not have permission to perform this action.'
        } else {
            message = 'Server error. Please try again later.'
        }
    } else {
        message = 'Unexpected error occurred.'
    }

    return message
}
