'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { SidebarMenu } from '@/components/layout/LayoutPortfolio/Sidebar/SidebarMenu/SidebarMenu'
import { PUBLIC_PAGE } from '@/config/paths.config'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Sidebar() {
    const [collapsedMenu, setCollapsedMenu] = useState<boolean>(false)
    const sidebarToggleRef = useRef<HTMLButtonElement | null>(null)

    const toggleSidebar = (): void => {
        setCollapsedMenu((prev) => !prev)
    }

    return (
        <aside
            className={`h-screen bg-sidebar flex flex-col align-start shadow-custom-green  transition-[width]  duration-300 ease-in-out ${
                collapsedMenu ? 'w-[100px]' : 'w-[240px]'
            }`}
        >
            <Link href={PUBLIC_PAGE.HOME}>
                <div className="p-layout flex items-center gap-5">
                    <Image
                        src="/assets/logo_inv_portfolio.svg"
                        alt="Invest Portfolio logo full"
                        width={36}
                        height={40}
                    />
                    <div
                        className={`sidebar-item-transition-custom ${
                            collapsedMenu
                                ? 'opacity-0 translate-x-[-10px] w-0'
                                : 'opacity-100 translate-x-0 w-auto delay-200'
                        }`}
                    >
                        <Image
                            src="/assets/logo_text_inv_portfolio.svg"
                            alt="Invest Portfolio logo full"
                            width={101}
                            height={34}
                        />
                    </div>
                </div>
            </Link>
            <div className="flex flex-col justify-center flex-grow">
                <button
                    ref={sidebarToggleRef}
                    className="px-layout py-2 hover:text-primaryLight transition-all duration-300"
                    onClick={toggleSidebar}
                >
                    {collapsedMenu ? <ChevronRight /> : <ChevronLeft />}
                </button>
                <SidebarMenu collapsedMenu={collapsedMenu} ignoreClickRef={sidebarToggleRef} />
            </div>
        </aside>
    )
}
