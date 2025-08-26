import type { InputHTMLAttributes } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { Calendar } from 'lucide-react'
import type { FieldVariant } from '@/types/commonTypes'
import { variantStyles } from '@/constants/borderVariants.constants'
import { X, LoaderCircle } from 'lucide-react'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    registration: UseFormRegisterReturn
    isLoadingPrice?: boolean
    handleClearPrice?: () => void
    variant?: FieldVariant
}

export function Field({
    label,
    error,
    registration,
    isLoadingPrice = false,
    handleClearPrice,
    variant = 'primary',
    ...props
}: FieldProps) {
    const styles = variantStyles[variant]
    const isDate = props.type === 'date'
    const isNumber = props.type === 'number'
    const isPrice = label === 'Price'

    const handleNumberBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (isPrice) return

        const value = e.target.value
        if (value) {
            const cleaned = String(parseInt(value, 10)) || '0'
            e.target.value = cleaned
            e.target.dispatchEvent(new Event('input', { bubbles: true }))
        }
    }

    return (
        <div>
            <label>
                <span className="input-label">{label}</span>
                <div className="relative">
                    <input
                        className={`h-9 input-basic ${error ? 'border-error focus:border-error' : styles}`}
                        {...registration}
                        {...props}
                        onBlur={(e) => {
                            if (isNumber) handleNumberBlur(e)
                            props.onBlur?.(e)
                        }}
                    />
                    {isDate && (
                        <Calendar
                            size={16}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-white pointer-events-none"
                        />
                    )}
                    {isPrice && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                            {!isLoadingPrice && (
                                <button
                                    type="button"
                                    onClick={handleClearPrice}
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
            <p className="text-error text-xs mt-1 min-h-[1.125rem]">{error || '\u00A0'}</p>
        </div>
    )
}
