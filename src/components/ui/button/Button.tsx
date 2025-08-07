import type { ButtonHTMLAttributes, ReactNode } from 'react'
import '@/styles/custom-styles.scss'

type ButtonStyleVariant = 'primaryFull' | 'primaryTransparent' | 'secondaryFull' | 'secondaryTransparent' | 'danger'
type ButtonSizeVariant = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean
    children: ReactNode
    variant?: ButtonStyleVariant
    size?: ButtonSizeVariant
    className?: string
}

const variantClasses = {
    primaryFull: 'text-white bg-custom-green-gradient hover:opacity-90 active:opacity-80 ',
    primaryTransparent: 'text-green-gradient green-gradient-border hover:opacity-90 active:opacity-80',
    secondaryFull: 'text-white bg-custom-orange-gradient hover:opacity-90 active:opacity-80',
    secondaryTransparent: 'text-orange-gradient orange-gradient-border hover:opacity-90 active:opacity-80',
    danger: '',
}

const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
}

export function Button({
    children,
    isLoading = false,
    variant = 'primaryFull',
    size = 'md',
    className,
    disabled,
    ...props
}: ButtonProps) {
    const baseClasses = 'rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium'

    const combinedClassName = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`

    return (
        <button className={combinedClassName} disabled={isLoading || disabled} {...props}>
            {isLoading ? 'Loading...' : children}
        </button>
    )
}
