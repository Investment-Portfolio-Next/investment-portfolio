import type { ButtonHTMLAttributes, ReactNode } from 'react'
// import { Slot } from '@radix-ui/react-slot'
import '@/styles/custom-styles.scss'

type ButtonStyleVariant =
    | 'primaryFull'
    | 'primaryTransparent'
    | 'secondaryFull'
    | 'secondaryTransparent'
    | 'danger'
    | 'primaryWhite'
type ButtonSizeVariant = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    // asChild?: boolean
    isLoading?: boolean
    isSubmitting?: boolean
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
    primaryWhite:
        'text-white border border-white hover:text-primaryLight hover:border-primaryLight active:text-primary active:border-primary',
}

const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
}

export function Button({
    // asChild = false,
    children,
    // type = 'button',
    isLoading = false,
    isSubmitting = false,
    variant = 'primaryFull',
    size = 'md',
    className,
    disabled,
    ...props
}: ButtonProps) {
    // const Component = asChild ? Slot : 'button'

    const baseClasses =
        'rounded transition-colors disabled:opacity-50 disabled:cursor-default font-medium min-w-[160px]'

    const combinedClassName = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`

    return (
        <button className={combinedClassName} disabled={isLoading || isSubmitting || disabled} {...props}>
            {isLoading ? 'Loading...' : isSubmitting ? 'Submitting...' : children}
        </button>
    )

    // return (
    //     <Component
    //         className={combinedClassName}
    //         disabled={!asChild ? isLoading || isSubmitting || disabled : undefined}
    //         type={!asChild ? type : undefined}
    //         {...props}
    //     >
    //         {isLoading ? 'Loading...' : isSubmitting ? 'Submitting...' : children}
    //     </Component>
    // )
}
