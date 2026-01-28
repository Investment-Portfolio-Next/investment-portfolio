'use client'

import { Check, TriangleAlert } from 'lucide-react'
import { Button } from '../ui/button/Button'
import { Modal } from '../ui/modalWrapper/Modal'

interface IInfoModalWrapperProps {
    onClose: () => void
    type: 'success' | 'error'
    title?: string
    message?: string
}

const typeConfig = {
    success: {
        color: 'text-primaryDark',
        defaultTitle: 'Completed!',
        icon: Check,
        defaultMessage: 'Your request has been successfully processed.',
    },
    error: {
        color: 'text-error',
        defaultTitle: 'Error...',
        icon: TriangleAlert,
        defaultMessage: 'Something went wrong. Please try again later',
    },
} as const

export function InfoModalWrapper({ onClose, type, title, message }: IInfoModalWrapperProps) {
    const { color, defaultTitle, icon: Icon, defaultMessage } = typeConfig[type]

    return (
        <Modal onClose={onClose} modalTitle={title ?? defaultTitle}>
            <div className="flex flex-col items-center space-y-8">
                <div className="flex flex-col items-center text-center">
                    <Icon className={`w-8 h-8 text-lg ${color}`} />
                    <p className={`text-base ${color} mt-1`}>{message ?? defaultMessage}</p>
                </div>
                <Button type="button" onClick={onClose} variant="primaryWhite" className="px-12">
                    Ok
                </Button>
            </div>
        </Modal>
    )
}
