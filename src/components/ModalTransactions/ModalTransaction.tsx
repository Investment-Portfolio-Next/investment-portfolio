'use client'

import { Modal } from '@/components/ui/modal/Modal'
import { TransactionsForm } from './TransactionForm/TransactionForm'
import type { AssetType } from '@/types/commonTypes'

interface ModalTransactionsProps {
    isOpen: boolean
    onClose: () => void
    modalTitle: string
    assetType: AssetType
}

export function ModalTransactions({ isOpen, onClose, modalTitle, assetType }: ModalTransactionsProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} modalTitle={modalTitle}>
            <TransactionsForm assetType={assetType} onClose={onClose} />
        </Modal>
    )
}
