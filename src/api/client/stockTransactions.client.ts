import { client } from '@/lib/api/client'

export const createStockTransaction = (data: unknown) => client.post('/stock_transactions/', data).then((r) => r.data)

export const deleteStockTransaction = (id: string) => client.delete(`/stock_transactions/${id}`).then((r) => r.data)
