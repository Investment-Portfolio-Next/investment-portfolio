import type { AssetType } from '@/types/commonTypes.types'

export interface IQuickActionItem {
    id: string
    label: string
    type: AssetType
}

export type FlowState =
    | { type: 'form'; actionId: string }
    | { type: 'success'; message?: string }
    | { type: 'error'; message?: string }
    | null
