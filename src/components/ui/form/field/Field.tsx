import type { InputHTMLAttributes } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { Calendar } from 'lucide-react'
import type { FieldVariant } from '@/types/commonTypes'
import { variantStyles } from '@/constants/borderVariants.constants'
import { X, LoaderCircle } from 'lucide-react'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    errors?: string
    registration: UseFormRegisterReturn
    isLoadingPrice?: boolean
    handleClearValue?: (fieldName: string) => void
    variant?: FieldVariant
    fieldValue?: number | null
}

export function Field({
    label,
    errors,
    registration,
    isLoadingPrice = false,
    handleClearValue,
    variant = 'primary',
    fieldValue,
    ...props
}: FieldProps) {
    const styles = variantStyles[variant]
    const isDate = props.type === 'date'
    const isNumber = props.type === 'number'
    const isPrice = label === 'Price'

    // const handleNumberBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    //     if (isPrice) return

    //     const value = e.target.value
    //     if (value) {
    //         const cleaned = String(parseInt(value, 10)) || '0'
    //         e.target.value = cleaned
    //         e.target.dispatchEvent(new Event('input', { bubbles: true }))
    //     }
    // }
    const isNotNullValue = fieldValue?.valueOf()

    return (
        <div>
            <label>
                <span className="input-label">{label}</span>
                <div className="relative">
                    <input
                        className={`h-9 input-basic ${errors ? 'border-error focus:border-error' : styles}`}
                        {...registration}
                        {...props}
                        // onBlur={(e) => {
                        // if (isNumber) handleNumberBlur(e)
                        // props.onBlur?.(e)
                        // }}
                    />
                    {isDate && (
                        <Calendar
                            size={16}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white pointer-events-none"
                        />
                    )}
                    {!isDate && handleClearValue && (
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
                    )}
                </div>
            </label>
            <p className="text-error text-xs mt-1 min-h-[1.125rem]">{errors || '\u00A0'}</p>
        </div>
    )
}
