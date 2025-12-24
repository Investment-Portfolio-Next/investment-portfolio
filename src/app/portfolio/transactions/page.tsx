import type { Metadata } from 'next'
import { getStockTransactionListServer } from '@/api/server/stockTransactions.server'
import type { StockTransactionListResponse, StockTransaction } from '@/types/transactionTypes/stockTransaction.types'

export const metadata: Metadata = {
    title: 'Trades',
}

export default async function Trades() {
    const transactions: StockTransactionListResponse = await getStockTransactionListServer()

    console.log(transactions)
    return (
        <div>
            <h1>Trades - отображения всех сделок</h1>
            {transactions.map((t: StockTransaction) => (
                <div key={t.transaction_id}>
                    {t.asset_ticker} - {t.initial_price} - {t.transaction_quantity}
                </div>
            ))}
        </div>
    )
}
