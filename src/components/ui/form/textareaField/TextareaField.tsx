import type { TextareaHTMLAttributes } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

type TextareaVariant = 'primary' | 'secondary'

const variantStyles = {
    primary: 'border-white focus:border-primaryDark',
    secondary: 'border-white focus:border-secondaryDark',
}

interface ITextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string
    errors?: string
    registration: UseFormRegisterReturn
    variant?: TextareaVariant
}
export function TextareaField({ label, errors, registration, variant = 'primary', ...props }: ITextareaFieldProps) {
    const styles = variantStyles[variant]
    return (
        <div>
            <label>
                <span className="input-label">{label}</span>
                <textarea
                    className={`input-basic placeholder:text-white/30 ${errors ? 'border-error' : styles}`}
                    rows={4}
                    {...registration}
                    {...props}
                />
            </label>
            <p className="text-error text-xs mt-1 min-h-[1rem]">{errors || '\u00A0'}</p>
        </div>
    )
}
