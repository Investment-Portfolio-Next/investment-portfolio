import type { Metadata } from 'next'
import { getTransactionByIdServer } from '@/api/server/stockTransactions.server'

export const metadata: Metadata = {
    title: 'Quotes',
}

export default async function Quotes() {
    const res = await getTransactionByIdServer('1', 'stock')
    console.log('res', res)

    return (
        <div>
            Quotes - страница с котировками
            <span>{res.asset_ticker}</span> - <span>{res.initial_price}</span>
        </div>
    )
}
