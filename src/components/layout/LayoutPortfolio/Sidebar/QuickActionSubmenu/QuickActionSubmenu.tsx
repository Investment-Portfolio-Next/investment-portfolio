'use client'

import { useState } from 'react'
import { QUICK_ACTION_DATA } from './quickactionSubmenu.data'
import type { IQuickActionItem, FlowState } from './quickactionSubmenu.types'
import { ModalTransactions } from '../../../../ModalTransactions/ModalTransaction'
import { SuccessModal } from '@/components/shared/modals/SuccessModal'
import { ErrorModal } from '@/components/shared/modals/ErrorModal'
import { useAsset } from '@/store/useAsset'
import type { IDomainError } from '@/lib/errors/domainError.types'

interface QuickActionSubmenuProps {
    closeSubmenu: () => void
}

export function QuickActionSubmenu({ closeSubmenu }: QuickActionSubmenuProps) {
    const [openModalId, setOpenModalId] = useState<string | null>(null)
    const [flow, setFlow] = useState<FlowState>(null)

    const clearAsset = useAsset((state) => state.clearAsset)

    const activeItem = QUICK_ACTION_DATA.find((item) => item.id === openModalId)

    const handleOnClose = () => {
        setOpenModalId(null)
        closeSubmenu()
        clearAsset()
    }

    const handleOnCloseOnError = () => {
        if (!openModalId) return
        setFlow({ type: 'form', actionId: openModalId })
    }

    const handleError = (error: IDomainError) => {
        setFlow({
            type: 'error',
            message: error.message,
        })
    }

    const handleSuccess = () => {
        setFlow({ type: 'success', message: 'Your transaction has been successfully saved' })
    }

    return (
        <>
            <ul className="bg-sidebar flex flex-col py-4 px-layout border-l-2 border-l-primaryLight rounded-tr-md rounded-br-md pl-5 ">
                {QUICK_ACTION_DATA.map((item: IQuickActionItem) => (
                    <li key={item.id} className="whitespace-nowrap py-2 hover:text-primaryLight">
                        <button
                            onClick={() => {
                                setOpenModalId(item.id)
                                setFlow({ type: 'form', actionId: item.id })
                            }}
                        >
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>

            {(flow?.type === 'form' || flow?.type === 'error') && activeItem && (
                <ModalTransactions
                    onClose={handleOnClose}
                    onSuccess={handleSuccess}
                    onError={handleError}
                    modalTitle={activeItem.label}
                    assetType={activeItem.type}
                />
            )}

            {flow?.type === 'success' && activeItem && (
                <SuccessModal message={flow?.message} onClose={() => handleOnClose()} />
            )}

            {flow?.type === 'error' && activeItem && (
                <ErrorModal message={flow?.message} onClose={() => handleOnCloseOnError()} />
            )}
        </>
    )
}
