import { clientAxios } from '@/lib/api/client'
import type { ITransactionSubmit } from '@/components/ModalTransactions/TransactionForm/transactionForm.types'
import type { AssetType } from '@/types/commonTypes.types'
import { TRANSACTION_BASE_PATH } from '../transactionBasePath'

const createCrudApi = <TCreate, TUpdate = Partial<TCreate>, TResponse = unknown>(basePath: string) => ({
    //  Get requests are left, as they can be used later in client components
    getAll: ({ signal }: { signal: AbortSignal }) =>
        clientAxios.get<TResponse>(`${basePath}/`, { signal }).then((r) => r.data),

    getById: ({ id, signal }: { id: string; signal: AbortSignal }) =>
        clientAxios.get<TResponse>(`${basePath}/${id}`, { signal }).then((r) => r.data),

    create: (data: TCreate) => clientAxios.post<TResponse>(`${basePath}/`, data).then((r) => r.data),

    update: (id: string, data: TUpdate) => clientAxios.patch<TResponse>(`${basePath}/${id}`, data).then((r) => r.data),

    delete: (id: string) => clientAxios.delete<TResponse>(`${basePath}/${id}`).then((r) => r.data),
})

export const createTransactionApi = (assetType: AssetType) =>
    createCrudApi<ITransactionSubmit>(TRANSACTION_BASE_PATH[assetType])
