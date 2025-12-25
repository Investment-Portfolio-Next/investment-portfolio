import { clientAxios } from '@/lib/api/client'

export const createStockTransaction = (data: unknown) =>
    clientAxios.post('/stock_transactions/', data).then((r) => r.data)

export const deleteStockTransaction = (id: string) =>
    clientAxios.delete(`/stock_transactions/${id}`).then((r) => r.data)
