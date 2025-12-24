import type { Metadata } from 'next'
import { getStockTransactionByIdServer } from '@/api/server/stockTransactions.server'

export const metadata: Metadata = {
    title: 'Quotes',
}

export default async function Quotes() {
    const res = await getStockTransactionByIdServer('0')

    return (
        <div>
            Quotes - страница с котировками
            <span>{res.asset_ticker}</span> - <span>{res.initial_price}</span>
        </div>
    )
}
