import type { ITransactionSubmit } from '@/components/ModalTransactions/TransactionForm/transactionForm.types'
import type { AssetType } from '@/types/commonTypes.types'
import { createTransactionApi } from '@/api/client/clientTransactions'

// Query requests are left, as they can be used later in client components
export const transactionQueries = {
    getAll: (assetType: AssetType) => {
        const api = createTransactionApi(assetType)

        return {
            queryKey: ['transaction', assetType],
            queryFn: api.getAll,
        }
    },

    getById: (assetType: AssetType, id: string) => {
        const api = createTransactionApi(assetType)

        return {
            queryKey: ['transaction', assetType, id],
            queryFn: ({ signal }: { signal: AbortSignal }) => api.getById({ id, signal }),
            enabled: !!id,
        }
    },
}

// Mutation requests are used in client components
export const transactionMutations = {
    create: (assetType: AssetType) => {
        const api = createTransactionApi(assetType)

        return {
            mutationFn: (data: ITransactionSubmit) => api.create(data),
        }
    },

    update: (assetType: AssetType, id: string) => {
        const api = createTransactionApi(assetType)

        return {
            mutationFn: (data: Partial<ITransactionSubmit>) => api.update(id, data),
        }
    },

    delete: (assetType: AssetType, id: string) => {
        const api = createTransactionApi(assetType)

        return {
            mutationFn: () => api.delete(id),
        }
    },
}
