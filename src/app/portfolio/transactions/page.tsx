import type { Metadata } from 'next'
import { getTransactionListServer } from '@/api/server/stockTransactions.server'
import type { TransactionListResponse, Transaction } from '@/types/transactionTypes/stockTransaction.types'

export const metadata: Metadata = {
    title: 'Trades',
}

export default async function Trades() {
    const transactions: TransactionListResponse = await getTransactionListServer('stock')

    console.log(transactions)
    return (
        <div>
            <h1>Trades - отображения всех сделок</h1>
            {transactions.map((t: Transaction) => (
                <div key={t.transaction_id}>
                    {t.asset_ticker} - {t.initial_price} - {t.transaction_quantity}
                    {t.asset_type === 'bond' && ` - ${t.bondNominal} - ${t.bondAccruedInterest}`}
                </div>
            ))}
        </div>
    )
}
