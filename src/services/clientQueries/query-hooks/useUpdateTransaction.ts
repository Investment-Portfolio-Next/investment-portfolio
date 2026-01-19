import { useMutation } from '@tanstack/react-query'
import type { AssetType } from '@/types/commonTypes.types'
import { transactionMutations } from '../transactionQueries'
import { usePathname, useRouter } from 'next/navigation'

export const useUpdateTransaction = (assetType: AssetType, id: string) => {
    const router = useRouter()
    const pathname = usePathname()

    return useMutation({
        ...transactionMutations.update(assetType, id),
        onSuccess: async () => {
            if (pathname.startsWith('/portfolio/transactions')) {
                await fetch('/api/revalidate/transactions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ assetType }),
                })

                router.refresh()
            }
        },
    })
}
