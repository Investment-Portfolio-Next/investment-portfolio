'use client'

import type { Transaction, TransactionListResponse } from '@/types/transactionTypes/stockTransaction.types'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button/Button'

interface ITransactionListClientProps {
    transactions: TransactionListResponse
}

const PAGE_SIZE = 2 // '2' - for testing purposes; change for 20 for prod

export default function TransactionListClient({ transactions }: ITransactionListClientProps) {
    const [page, setPage] = useState(1)

    const start = (page - 1) * PAGE_SIZE
    const current = transactions.slice(start, start + PAGE_SIZE)

    return (
        <>
            {current.map((transaction) => (
                <div key={transaction.transaction_id}>
                    <TransactionListLine transaction={transaction} />
                </div>
            ))}

            <Button
                type="button"
                variant="primaryTransparent"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
            >
                Backward
            </Button>
            <Button
                type="button"
                variant="primaryTransparent"
                disabled={start + PAGE_SIZE >= transactions.length}
                onClick={() => setPage((p) => p + 1)}
            >
                Forward
            </Button>
        </>
    )
}

interface ITransactionListLineProps {
    transaction: Transaction
}
export function TransactionListLine({ transaction }: ITransactionListLineProps) {
    return (
        <Link href={`/portfolio/transactions/${transaction.transaction_id}`}>
            {transaction.asset_ticker} — {transaction.initial_price} — {transaction.transaction_quantity}
        </Link>
    )
}
