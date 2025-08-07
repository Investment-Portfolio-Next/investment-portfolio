import type { InputHTMLAttributes } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { Calendar } from 'lucide-react'
import type { FieldVariant } from '@/types/commonTypes'
import { variantStyles } from '@/constants/borderVariants.constants'
interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    registration: UseFormRegisterReturn
    variant?: FieldVariant
}

export function Field({ label, error, registration, variant = 'primary', ...props }: FieldProps) {
    const styles = variantStyles[variant]
    const isDate = props.type === 'date'
    const isNumber = props.type === 'number'

    const handleNumberBlur = (e: React.FocusEvent<HTMLInputElement>) => {
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
                </div>
            </label>
            <p className="text-error text-xs mt-1 min-h-[1.125rem]">{error || '\u00A0'}</p>
        </div>
    )
}
