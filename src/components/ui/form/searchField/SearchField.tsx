import type { UseFormRegisterReturn } from 'react-hook-form'
import type { AssetType, FieldVariant } from '@/types/commonTypes'
import type { InputHTMLAttributes } from 'react'
import { variantStyles } from '@/constants/borderVariants.constants'

interface SearchFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    registration: UseFormRegisterReturn
    variant?: FieldVariant
    assetType: AssetType
}

export function SearchField({ label, registration, error, variant = 'primary', assetType }: SearchFieldProps) {
    const styles = variantStyles[variant]

    return (
        <div>
            <label>
                <span className="input-label">{label}</span>
                <div className="relative">
                    <input
                        className={`h-9 input-basic ${error ? 'border-error focus:border-error' : styles}`}
                        {...registration}
                    />
                </div>
            </label>
            <p className="text-error text-xs mt-1 min-h-[1.125rem]">{error || '\u00A0'}</p>
        </div>
    )
}
