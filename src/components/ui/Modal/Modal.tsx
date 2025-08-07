'use client'

import { useEffect } from 'react'
// import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    modalTitle: string
    children: React.ReactNode
}

export function Modal({ isOpen, onClose, modalTitle, children }: ModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="relative bg-modalBg border-2 border-primaryLight p-8 rounded-xl w-full max-w-2xl shadow-custom-green">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/80 hover:text-primary"
                    aria-label="Close modal"
                >
                    <X />
                </button>
                <h2 className="text-xl text-white/80 text-center mb-6">{modalTitle}</h2>
                {children}
            </div>
        </div>
    )
}

// export function Modal({ isOpen, onClose, modalTitle, children }: ModalProps) {
//     // Закрытие по Escape
//     useEffect(() => {
//         const handleKeyDown = (e: KeyboardEvent) => {
//             if (e.key === 'Escape') onClose()
//         }

//         if (isOpen) {
//             document.addEventListener('keydown', handleKeyDown)
//             document.body.style.overflow = 'hidden'
//         }

//         return () => {
//             document.removeEventListener('keydown', handleKeyDown)
//             document.body.style.overflow = ''
//         }
//     }, [isOpen, onClose])

//     // Если модалка не открыта или SSR
//     if (!isOpen || typeof window === 'undefined') return null

//     return createPortal(
//         <div
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
//             onClick={(e) => {
//                 if (e.target === e.currentTarget) onClose()
//             }}
//         >
//             <div
//                 className="relative bg-modalBg border-2 border-primaryLight p-8 rounded-xl w-full max-w-2xl shadow-custom-green"
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 <button
//                     onClick={onClose}
//                     className="absolute top-4 right-4 text-white/80 hover:text-primaryLight"
//                     aria-label="Close modal"
//                 >
//                     <X />
//                 </button>
//                 <h2 className="text-xl text-white/80 text-center mb-6">{modalTitle}</h2>
//                 {children}
//             </div>
//         </div>,
//         document.body,
//     )
// }
