import {
    CirclePlus,
    Briefcase,
    ArrowLeftRight,
    ChartColumn,
    // ChartNoAxesCombined, Columns3Cog
} from 'lucide-react'
import type { ISidebarItem } from '@/components/layout/LayoutPortfolio/Sidebar/SidebarMenu/sidebarMenu.types'
import { PROTECTED_PAGE } from '@/config/paths.config'

export const SIDEBAR_DATA: ISidebarItem[] = [
    {
        icon: CirclePlus,
        label: 'Quick Action',
        isAction: true,
    },
    {
        icon: Briefcase,
        label: 'Portfolio Info',
        link: PROTECTED_PAGE.PORTFOLIO,
    },
    {
        icon: ChartColumn,
        label: 'Analytics',
        link: PROTECTED_PAGE.ANALYTICS,
    },
    {
        icon: ArrowLeftRight,
        label: 'Transactions',
        link: PROTECTED_PAGE.TRANSACTIONS,
    },
    // {
    //     icon: ChartNoAxesCombined,
    //     label: 'Quotes Table',
    //     link: PROTECTED_PAGE.QUOTES,
    // },
    // {
    //     icon: Columns3Cog,
    //     label: 'Portfolio Setup',
    //     link: PROTECTED_PAGE.SETUP,
    // },
]
