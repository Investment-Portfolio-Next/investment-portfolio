'use client'

import { useGetTransactionById } from '@/services/clientQueries/query-hooks/useGetTransactionById'
import type { Transaction } from '@/types/transactionTypes/stockTransaction.types'
import { Button } from '@/ui/button/Button'
import Link from 'next/link'
import { useState } from 'react'

interface ITransactionClientProps {
    initialTransaction: Transaction
}

// here is an example that shows just REFRESH of a transaction using useGetTransactionById
// for update purposes the component should be a form, and data should be transferred to server via useUpdateTransaction

export default function TransactionClient({ initialTransaction }: ITransactionClientProps) {
    const [transaction, setTransaction] = useState<Transaction>(initialTransaction)

    const { error, isFetching, refetch } = useGetTransactionById('stock', String(transaction.transaction_id), false)

    const refresh = async () => {
        const result = await refetch()

        if (result.data) {
            setTransaction(result.data)
        }
    }

    return (
        <div>
            <Link href="/portfolio/transactions">
                <Button type="button" variant="secondaryTransparent">
                    Back to transaction list
                </Button>
            </Link>

            <div>
                <h1>Transaction id: {transaction.transaction_id}</h1>

                <p>Asset type: {transaction.asset_type}</p>
                <p>Asset ticker: {transaction.asset_ticker}</p>
                <p>
                    Initial transaction price: <span>{transaction.transaction_currency}</span>{' '}
                    {transaction.initial_price}
                </p>
                <p>Quantity: {transaction.transaction_quantity}</p>
                <p>Transaction date: {transaction.transaction_date}</p>

                {transaction.asset_type === 'bond' && (
                    <>
                        <p>Bond nominal: {transaction.bondNominal}</p>
                        <p>Bond accrued interest: {transaction.bondAccruedInterest}</p>
                    </>
                )}
            </div>

            <Button type="button" onClick={refresh} variant="primaryTransparent" isLoading={isFetching}>
                Refresh
            </Button>

            <p className="text-error text-xs mt-1 min-h-[1.125rem]">{error ? error.message : ' '}</p>
        </div>
    )
}
