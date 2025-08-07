import type { IQuickActionItem } from '@/components/layout/LayoutPortfolio/Sidebar/QuickActionSubmenu/quickactionSubmenu.types'

export const QUICK_ACTION_DATA: IQuickActionItem[] = [
    { id: '1', label: 'Add Stock Transaction', type: 'stock' },
    { id: '2', label: 'Add ETF Transaction', type: 'etf' },
    { id: '3', label: 'Add Bond Transaction', type: 'bond' },
    { id: '4', label: 'Add Crypto Transaction', type: 'crypto' },
]
