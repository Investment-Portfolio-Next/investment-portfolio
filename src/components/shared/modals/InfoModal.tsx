'use client'

import * as React from 'react'
import { Modal } from '@/components/ui/modal/Modal'
import { Check, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button/Button'

interface InfoModalProps {
    isOpen: boolean
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
        iconColor: '',
        defaultMessage: 'Your request has been successfully processed.',
    },
    error: {
        color: 'text-error',
        defaultTitle: 'Error...',
        icon: TriangleAlert,
        defaultMessage: 'Something went wrong. Please try again later',
    },
} as const

export function InfoModal({ isOpen, onClose, type, title, message }: InfoModalProps) {
    const { color, defaultTitle, icon, defaultMessage } = typeConfig[type]
    const Icon = icon

    return (
        <Modal isOpen={isOpen} onClose={onClose} modalTitle={title ?? defaultTitle}>
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
