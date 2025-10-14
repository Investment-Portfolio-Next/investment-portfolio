'use client'

import { useState } from 'react'
import { QUICK_ACTION_DATA } from './quickactionSubmenu.data'
import { ModalTransactions } from '../../../../ModalTransactions/ModalTransaction'
import type { IQuickActionItem } from './quickactionSubmenu.types'
import { useAsset } from '@/store/useAsset'

interface QuickActionSubmenuProps {
    closeSubmenu: () => void
}

export function QuickActionSubmenu({ closeSubmenu }: QuickActionSubmenuProps) {
    const [openModalId, setOpenModalId] = useState<string | null>(null)
    const clearAsset = useAsset((state) => state.clearAsset)

    const activeItem = QUICK_ACTION_DATA.find((item) => item.id === openModalId)

    const handleOnClose = () => {
        setOpenModalId(null)
        closeSubmenu()
        clearAsset()
    }

    return (
        <>
            <ul className="bg-sidebar flex flex-col py-4 px-layout border-l-2 border-l-primaryLight rounded-tr-md rounded-br-md pl-5 ">
                {QUICK_ACTION_DATA.map((item: IQuickActionItem) => (
                    <li key={item.id} className="whitespace-nowrap py-2 hover:text-primaryLight">
                        <button onClick={() => setOpenModalId(item.id)}>{item.label}</button>
                    </li>
                ))}
            </ul>

            {activeItem && (
                <ModalTransactions
                    isOpen={!!openModalId}
                    onClose={() => handleOnClose()}
                    modalTitle={activeItem.label}
                    assetType={activeItem.type}
                />
            )}
        </>
    )
}
