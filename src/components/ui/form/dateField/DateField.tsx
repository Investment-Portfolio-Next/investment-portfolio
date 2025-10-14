import type { InputHTMLAttributes } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { Calendar } from 'lucide-react'
import type { FieldVariant } from '@/types/commonTypes'
import { variantStyles } from '@/constants/borderVariants.constants'
import type { ITransactionForm } from '@/components/ModalTransactions/TransactionForm/transactionForm.types'

interface FieldProps<TFieldName extends keyof ITransactionForm> extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    errors?: string
    registration: UseFormRegisterReturn<TFieldName>
    variant?: FieldVariant
}

export function DateField<TFieldName extends keyof ITransactionForm>({
    label,
    errors,
    registration,
    variant = 'primary',
    ...props
}: FieldProps<TFieldName>) {
    const styles = variantStyles[variant]

    return (
        <div>
            <label>
                <span className="input-label">{label}</span>
                <div className="relative">
                    <input
                        className={`h-9 input-basic ${errors ? 'border-error focus:border-error' : styles}`}
                        {...registration}
                        {...props}
                    />

                    <Calendar
                        size={16}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white pointer-events-none"
                    />
                </div>
            </label>
            <p className="text-error text-xs mt-1 min-h-[1.125rem]">{errors || '\u00A0'}</p>
        </div>
    )
}
