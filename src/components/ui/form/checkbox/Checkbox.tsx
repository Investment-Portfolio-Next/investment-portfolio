import React from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import type { InputHTMLAttributes } from 'react'
import { Check } from 'lucide-react'

type CheckboxVariant = 'primary' | 'secondary'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    registration: UseFormRegisterReturn
    error?: string
    variant?: CheckboxVariant
}

const variantStyles: Record<CheckboxVariant, { box: string; icon: string }> = {
    primary: {
        box: 'border-primaryLight peer-checked:bg-primaryDark peer-checked:border-primaryDark',
        icon: 'text-white',
    },
    secondary: {
        box: 'border-secondaryLight peer-checked:bg-secondaryDark peer-checked:border-secondaryDark',
        icon: 'text-white',
    },
}

export function Checkbox({ label, registration, error, variant = 'primary', ...props }: CheckboxProps) {
    const styles = variantStyles[variant]

    return (
        <div>
            <label className="relative flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" id={registration.name} {...registration} {...props} className="peer hidden" />
                <div
                    className={`relative h-5 w-5 rounded border flex items-center justify-center transition-all duration-200 ${
                        error ? 'border-error peer-checked:bg-error peer-checked:border-error' : styles.box
                    }`}
                ></div>
                <Check
                    size={14}
                    strokeWidth={3}
                    className={`absolute top-1 left-1 transition-opacity duration-200 opacity-0 peer-checked:opacity-100 ${styles.icon}`}
                />
                <span className="block text-sm text-white/60">{label}</span>
            </label>
            <p className="text-error text-xs ml-2 min-h-[1rem]">{error || '\u00A0'}</p>
        </div>
    )
}
