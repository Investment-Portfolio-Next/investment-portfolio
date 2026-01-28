import type { Metadata } from 'next'
// import { getTransactionListServer } from '@/api/server/stockTransactions.server'
import type { TransactionListResponse } from '@/types/transactionTypes/stockTransaction.types'

import TransactionListClient from '@/components/transactions/transactionListClient'

export const metadata: Metadata = {
    title: 'Transactions',
}

export default async function Transactions() {
    // const transactions: TransactionListResponse = await getTransactionListServer('stock')

    const transactions: TransactionListResponse = [] // temporarily added until server is fixed

    return (
        <>
            <h1>Transactions List</h1>
            <TransactionListClient transactions={transactions} />
        </>
    )
}
