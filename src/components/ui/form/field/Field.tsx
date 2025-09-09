import type { InputHTMLAttributes } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import type { FieldVariant } from '@/types/commonTypes'
import { variantStyles } from '@/constants/borderVariants.constants'
import { X, LoaderCircle } from 'lucide-react'
import type { ITransactionForm } from '@/components/ModalTransactions/TransactionForm/transactionForm.types'

interface FieldProps<TFieldName extends keyof ITransactionForm> extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    errors?: string
    registration: UseFormRegisterReturn<TFieldName>
    isLoadingPrice?: boolean
    handleClearValue: (fieldName: keyof ITransactionForm) => void
    variant?: FieldVariant
    fieldValue?: number | null
}

export function Field<TFieldName extends keyof ITransactionForm>({
    label,
    errors,
    registration,
    isLoadingPrice = false,
    handleClearValue,
    variant = 'primary',
    fieldValue,
    onKeyDown,
    onPaste,
    ...props
}: FieldProps<TFieldName>) {
    const styles = variantStyles[variant]

    const isNotNullValue = fieldValue?.valueOf()

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.ctrlKey || e.altKey || e.metaKey) {
            onKeyDown?.(e)
            return
        }
        if (['.', '-', 'e', 'E'].includes(e.key)) {
            e.preventDefault()
        }
        onKeyDown?.(e)
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        onPaste?.(e)
    }

    return (
        <div>
            <label>
                <span className="input-label">{label}</span>
                <div className="relative">
                    <input
                        className={`h-9 input-basic ${errors ? 'border-error focus:border-error' : styles}`}
                        {...registration}
                        {...props}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        autoComplete="off"
                    />

                    <div className="absolute inset-y-0 right-2 flex items-center justify-center">
                        {!isLoadingPrice && isNotNullValue && (
                            <button
                                type="button"
                                onClick={() => handleClearValue(registration.name)}
                                className="text-white/80 hover:text-primary "
                                aria-label="Clear search field"
                            >
                                <X size={16} />
                            </button>
                        )}
                        {isLoadingPrice && <LoaderCircle className="animate-spin h-4 w-4 text-primaryDark" />}
                    </div>
                </div>
            </label>
            <p className="text-error text-xs mt-1 min-h-[1.125rem]">{errors || '\u00A0'}</p>
        </div>
    )
}
