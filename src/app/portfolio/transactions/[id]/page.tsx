// import { getTransactionListServer } from '@/api/server/stockTransactions.server'
// import TransactionClient from '@/components/transactions/transactionClient'
// import type { Transaction, TransactionListResponse } from '@/types/transactionTypes/stockTransaction.types'
// import type { Metadata } from 'next'
// import { notFound } from 'next/navigation'

// interface ITransactionPageProps {
//     params: Promise<{
//         id: string
//     }>
// }

// export async function generateMetadata({ params }: ITransactionPageProps): Promise<Metadata> {
//     const { id } = await params // params, searchParams, cookies, headers should be awaited

//     return {
//         title: `Transaction ${id}`,
//     }
// }

// // ssg params which are used to create pages during build
// export async function generateStaticParams() {
//     const transactions: TransactionListResponse = await getTransactionListServer('stock')

//     return transactions.map((t: Transaction) => ({
//         id: String(t.transaction_id),
//     }))
// }

// // server TransactionPage component: for quick first render of existing transaction pages
// export default async function TransactionPage({ params }: ITransactionPageProps) {
//     const { id } = await params // params should be awaited

//     const transactions = await getTransactionListServer('stock')

//     const transaction = transactions.find((t) => String(t.transaction_id) === id)

//     if (!transaction) notFound()

//     // client component to allow user modify transaction
//     return <TransactionClient initialTransaction={transaction} />
// }

// USE getTransactionByIdServer FOR DYNAMIC RENDER AFTER IT IS CREATED BY BACKEND
// import { getTransactionByIdServer } from '@/api/server/stockTransactions.server'
// import TransactionClient from '@/components/transactions/transactionClient'
// import type { Metadata } from 'next'
// import { notFound } from 'next/navigation'

// interface ITransactionPageProps {
//     params: Promise<{
//         id: string
//     }>
// }

// export const dynamic = 'force-dynamic'

// export async function generateMetadata({ params }: ITransactionPageProps): Promise<Metadata> {
//     const { id } = await params // params, searchParams, cookies, headers should be awaited

//     return {
//         title: `Transaction ${id}`,
//     }
// }

// // server TransactionPage component: for quick first render of existing transaction pages
// export default async function TransactionPage({ params }: ITransactionPageProps) {
//     const { id } = await params // params should be awaited

//     const transaction = await getTransactionByIdServer('stock', id)

//     if (!transaction) notFound()

//     // client component to allow user modify transaction
//     return <TransactionClient initialTransaction={transaction} />
// }

export default function TransactionPage() {
    return <div>Dummy div</div>
}
