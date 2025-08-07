import type { SelectHTMLAttributes } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

type SelectVariant = 'primary' | 'secondary'

const variantStyles = {
    primary: 'border-white focus:border-primaryDark',
    secondary: 'border-white focus:border-secondaryDark',
}

interface Option {
    label: string
    value: string
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string
    error?: string
    registration: UseFormRegisterReturn
    options: Option[]
    variant?: SelectVariant
}

export function SelectField({ label, error, registration, options, variant = 'primary', ...props }: SelectFieldProps) {
    const styles = variantStyles[variant]
    return (
        <div>
            <label>
                <span className="input-label">{label}</span>
                <select
                    className={`h-9 input-basic ${error ? 'border-error focus:border-error' : styles}`}
                    {...registration}
                    {...props}
                >
                    {options.map((opt) => (
                        <option className="bg-modalBg" key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </label>
            <p className="text-error text-xs ml-2 min-h-[1rem]">{error || '\u00A0'}</p>
        </div>
    )
}
