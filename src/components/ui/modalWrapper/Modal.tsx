'use client'

import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface IModalProps {
    onClose: () => void
    modalTitle?: string
    children: ReactNode
}

export function Modal({ onClose, modalTitle, children }: IModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        document.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [onClose])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="relative bg-modalBg border-2 border-primaryLight p-8 rounded-xl max-w-2xl shadow-custom-green">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/80 hover:text-primary"
                    aria-label="Close modal"
                >
                    <X />
                </button>
                {modalTitle && <h2 className="text-xl text-white/80 text-center mb-6">{modalTitle}</h2>}
                {children}
            </div>
        </div>
    )
}
