import type { TextareaHTMLAttributes } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

type TextareaVariant = 'primary' | 'secondary'

const variantStyles = {
    primary: 'border-white focus:border-primaryDark',
    secondary: 'border-white focus:border-secondaryDark',
}

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string
    error?: string
    registration: UseFormRegisterReturn
    variant?: TextareaVariant
}
export function TextareaField({ label, error, registration, variant = 'primary', ...props }: TextareaFieldProps) {
    const styles = variantStyles[variant]
    return (
        <div>
            <label>
                <span className="input-label">{label}</span>
                <textarea
                    className={`input-basic placeholder:text-white/30 ${error ? 'border-error' : styles}`}
                    rows={4}
                    {...registration}
                    {...props}
                />
            </label>
            <p className="text-error text-xs mt-1 min-h-[1rem]">{error || '\u00A0'}</p>
        </div>
    )
}
