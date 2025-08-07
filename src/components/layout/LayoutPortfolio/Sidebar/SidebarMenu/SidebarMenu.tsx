'use client'

import { SIDEBAR_DATA } from './sidebarMenu.data'
import type { ISidebarItem } from './sidebarMenu.types'
import { useEffect, useRef, useState } from 'react'
import { QuickActionSubmenu } from '../QuickActionSubmenu/QuickActionSubmenu'
import { SidebarMenuItem } from './SidebarMenuItem/SidebarMenuItem'
import { match } from 'path-to-regexp'
import { usePathname } from 'next/navigation'

interface SidebarMenuProps {
    collapsedMenu: boolean
    ignoreClickRef?: React.RefObject<HTMLButtonElement | null>
}

export function SidebarMenu({ collapsedMenu, ignoreClickRef }: SidebarMenuProps) {
    const [submenuOpen, setSubmenuOpen] = useState<boolean>(false)
    const submenuRef = useRef<HTMLDivElement | null>(null)
    const buttonRef = useRef<HTMLButtonElement | null>(null)
    const pathname = usePathname()

    const toggleSubmenu = () => setSubmenuOpen((prev) => !prev)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node

            if (
                submenuRef.current &&
                !submenuRef.current.contains(target) &&
                buttonRef.current &&
                !buttonRef.current.contains(target) &&
                ignoreClickRef &&
                ignoreClickRef.current &&
                !ignoreClickRef.current.contains(target)
            ) {
                setSubmenuOpen(false)
            }
        }

        if (submenuOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [submenuOpen, ignoreClickRef])

    return (
        <nav className="relative px-layout flex item-start text-base w-full transition-all duration-300">
            <ul className="opacity-80">
                {SIDEBAR_DATA.map((item: ISidebarItem) => (
                    <SidebarMenuItem
                        key={item.label}
                        item={item}
                        collapsedMenu={collapsedMenu}
                        buttonRef={buttonRef}
                        toggleSubmenu={toggleSubmenu}
                        submenuOpen={submenuOpen}
                        isActive={!!(item.link && match(item.link)(pathname))}
                    />
                ))}
            </ul>
            {submenuOpen && (
                <div ref={submenuRef} className="absolute left-full top-0 z-10 text-white/80">
                    <QuickActionSubmenu closeSubmenu={() => setSubmenuOpen(false)} />
                </div>
            )}
        </nav>
    )
}
