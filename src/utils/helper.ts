import type { CurrencyType } from '@/types/commonTypes'
import { currencyOptions } from '@/constants/currencies.constants'

// Преобразует объект Date в строку формата 'YYYY-MM-DD'
export function formatDateToInput(date: Date): string {
    return date.toISOString().split('T')[0]
}

// Функция для получения символа валюты по value (US Dollar -> $)
export function getCurrencySymbol(currency: CurrencyType): string {
    const found = currencyOptions.find((c) => c.value === currency)
    return found?.symbol || ''
}
