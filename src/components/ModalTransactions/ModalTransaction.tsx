'use client'

import { Modal } from '../ui/modalWrapper/Modal'
import { TransactionsForm } from './TransactionForm/TransactionForm'
import type { AssetType } from '@/types/commonTypes.types'
import type { INormalizedError } from '@/lib/errors/error.types'

interface IModalTransactionsProps {
    onClose: () => void
    onSuccess: () => void
    onError: (error: INormalizedError) => void
    modalTitle: string
    assetType: AssetType
}

export function ModalTransactions({ onClose, onSuccess, onError, modalTitle, assetType }: IModalTransactionsProps) {
    return (
        <Modal onClose={onClose} modalTitle={modalTitle}>
            <TransactionsForm onClose={onClose} assetType={assetType} onSuccess={onSuccess} onError={onError} />
        </Modal>
    )
}
