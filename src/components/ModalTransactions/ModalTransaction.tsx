'use client'

import { Modal } from '@/components/ui/modal/Modal'
import { TransactionsForm } from './TransactionForm/TransactionForm'
import type { AssetType } from '@/types/commonTypes.types'
import type { IDomainError } from '@/lib/errors/domainError.types'

interface ModalTransactionsProps {
    onClose: () => void
    onSuccess: () => void
    onError: (error: IDomainError) => void
    modalTitle: string
    assetType: AssetType
}

export function ModalTransactions({ onClose, onSuccess, onError, modalTitle, assetType }: ModalTransactionsProps) {
    return (
        <Modal onClose={onClose} modalTitle={modalTitle}>
            <TransactionsForm onClose={onClose} assetType={assetType} onSuccess={onSuccess} onError={onError} />
        </Modal>
    )
}
