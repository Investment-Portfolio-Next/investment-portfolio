import type { ISidebarItem } from '../sidebarMenu.types'
import Link from 'next/link'

interface ISidebarMenuItem {
    item: ISidebarItem
    collapsedMenu: boolean
    buttonRef: React.RefObject<HTMLButtonElement | null>
    toggleSubmenu: () => void
    submenuOpen: boolean
    isActive: boolean
}

export function SidebarMenuItem({
    item,
    collapsedMenu,
    buttonRef,
    toggleSubmenu,
    submenuOpen,
    isActive,
}: ISidebarMenuItem) {
    return (
        <li
            className={`${isActive && 'text-primary'} ${
                !isActive && 'hover:text-primaryLight transition-color delay-0'
            }`}
        >
            {item.link ? (
                <Link href={item.link} className="sidebar-item-custom">
                    <item.icon />
                    <span
                        className={`sidebar-item-transition-custom
    ${collapsedMenu ? 'opacity-0 translate-x-[-10px] delay-0' : 'opacity-100 translate-x-0 delay-200'}
    ${isActive ? 'border-b border-primary' : 'border-b border-transparent'}
  `}
                    >
                        {item.label}
                    </span>
                </Link>
            ) : item.isAction ? (
                <button
                    ref={buttonRef}
                    onClick={toggleSubmenu}
                    className={`w-full  sidebar-item-custom ${
                        submenuOpen ? 'text-primaryLight' : 'text-white hover:text-primaryLight'
                    }`}
                >
                    <item.icon />
                    <span
                        className={`sidebar-item-transition-custom
    ${collapsedMenu ? 'opacity-0 translate-x-[-10px] delay-0' : 'opacity-100 translate-x-0 delay-200'}
  `}
                    >
                        {item.label}
                    </span>
                </button>
            ) : null}
        </li>
    )
}
