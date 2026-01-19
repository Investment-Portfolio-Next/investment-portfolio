// PAGE MODIFIED FOR TESTING!

'use client'
import { useGetTransactionById } from '@/services/clientQueries/query-hooks/useGetTransactionById'
// import type { Metadata } from 'next'

// export const metadata: Metadata = {
//     title: 'Setup',
// }

export default function Setup() {
    const assetType = 'stock'
    const id = '0'
    const { data, isPending, error } = useGetTransactionById(assetType, id)
    console.log(data)
    if (isPending) return <div> Pending... </div>
    if (error) return <div> ERROR! </div>
    return <div>SetUp - настройки портфолио: удаление добавление портфелей и счетов</div>
}
