'use client'

import React, { useState, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import {
    Menu,
    X,
    Home,
    User,
    Bell,
    Grid3X3,
    ChevronDown,
    Mail,
    Calendar,
    ShoppingBag,
    LogIn,
    LogOut
} from 'lucide-react'

interface FlyonSidebarProps {
    className?: string
    defaultMinified?: boolean
}

interface MenuItemProps {
    href?: string
    icon: React.ReactNode
    label: string
    isMinified?: boolean
    onClick?: () => void
}

interface DropdownMenuItemProps {
    icon: React.ReactNode
    label: string
    isMinified?: boolean
    items?: Array<{
        icon: React.ReactNode
        label: string
        href?: string
    }>
}

// Menu Item Component
const MenuItem: React.FC<MenuItemProps> = ({ href = "#", icon, label, isMinified, onClick }) => {
    return (
        <li>
            <a
                href={href}
                onClick={onClick}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-card-elevated transition-colors duration-200"
            >
                {icon}
                <span className={twMerge("transition-opacity duration-200", isMinified && "opacity-0 invisible")}>
                    {label}
                </span>
            </a>
        </li>
    )
}

// Dropdown Menu Item Component
const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ icon, label, isMinified, items = [] }) => {
    const [ isOpen, setIsOpen ] = useState(false)

    return (
        <li className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-card-elevated transition-colors duration-200"
            >
                {icon}
                <span className={twMerge("transition-opacity duration-200", isMinified && "opacity-0 invisible")}>
                    {label}
                </span>
                <ChevronDown
                    className={twMerge(
                        "w-4 h-4 ml-auto transition-transform duration-200",
                        isOpen && "rotate-180",
                        isMinified && "opacity-0 invisible"
                    )}
                />
            </button>

            {/* Dropdown Menu */}
            <div className={twMerge(
                "transition-all duration-200 overflow-hidden",
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
                isMinified && "absolute left-full top-0 ml-2 bg-card border border-border rounded-lg shadow-lg min-w-48 z-50"
            )}>
                <ul className={twMerge("mt-2 ml-6 space-y-1", isMinified && "p-2 ml-0 mt-0")}>
                    {items.map((item, index) => (
                        <li key={index}>
                            <a
                                href={item.href || "#"}
                                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-card-elevated transition-colors duration-200"
                            >
                                {item.icon}
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </li>
    )
}

// Main Sidebar Component
const FlyonSidebar: React.FC<FlyonSidebarProps> = ({
    className,
    defaultMinified = false
}) => {
    const [ isMinified, setIsMinified ] = useState(defaultMinified)
    const [ isMobileOpen, setIsMobileOpen ] = useState(false)
    const [ mounted, setMounted ] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const toggleMinified = () => {
        setIsMinified(!isMinified)
    }

    const toggleMobileMenu = () => {
        setIsMobileOpen(!isMobileOpen)
    }

    if (!mounted) {
        return null
    }

    const dropdownItems = [
        { icon: <Mail className="w-5 h-5" />, label: "Email", href: "#" },
        { icon: <Calendar className="w-5 h-5" />, label: "Calendar", href: "#" }
    ]

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={toggleMobileMenu}
                className="btn btn-circle btn-ghost sm:hidden fixed top-4 left-4 z-50"
                aria-label="Toggle mobile menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 sm:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={twMerge(
                "fixed left-0 top-0 h-full bg-card/95 backdrop-blur-xl border-r border-border/20 shadow-xl transition-all duration-300 z-40",
                "flex flex-col",
                // Mobile styles
                "sm:translate-x-0",
                isMobileOpen ? "translate-x-0 w-66" : "-translate-x-full w-66",
                // Desktop styles
                "sm:relative sm:z-0",
                isMinified ? "sm:w-17" : "sm:w-66",
                className
            )}>
                {/* Header */}
                <div className={twMerge(
                    "flex items-center justify-between gap-3 py-4 border-b border-border/20",
                    isMinified ? "px-3" : "px-6"
                )}>
                    <h3 className={twMerge(
                        "text-xl font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent transition-opacity duration-200",
                        isMinified && "opacity-0 invisible"
                    )}>
                        Telescope
                    </h3>

                    {/* Desktop Toggle Button */}
                    <button
                        onClick={toggleMinified}
                        className="hidden sm:flex btn btn-circle btn-ghost text-muted-foreground hover:text-foreground"
                        aria-label="Toggle sidebar"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Mobile Close Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="sm:hidden btn btn-circle btn-ghost text-muted-foreground hover:text-foreground"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-2 py-4">
                    <ul className="space-y-2">
                        <MenuItem
                            icon={<Home className="w-5 h-5" />}
                            label="Home"
                            isMinified={isMinified}
                        />

                        <MenuItem
                            icon={<User className="w-5 h-5" />}
                            label="Account"
                            isMinified={isMinified}
                        />

                        <MenuItem
                            icon={<Bell className="w-5 h-5" />}
                            label="Notifications"
                            isMinified={isMinified}
                        />

                        <DropdownMenuItem
                            icon={<Grid3X3 className="w-5 h-5" />}
                            label="Apps"
                            isMinified={isMinified}
                            items={dropdownItems}
                        />

                        <MenuItem
                            icon={<ShoppingBag className="w-5 h-5" />}
                            label="Product"
                            isMinified={isMinified}
                        />

                        <MenuItem
                            icon={<LogIn className="w-5 h-5" />}
                            label="Sign In"
                            isMinified={isMinified}
                        />

                        <MenuItem
                            icon={<LogOut className="w-5 h-5" />}
                            label="Sign Out"
                            isMinified={isMinified}
                        />
                    </ul>
                </div>

                {/* Footer */}
                <div className={twMerge(
                    "border-t border-border/20 p-4",
                    isMinified && "px-2"
                )}>
                    <div className={twMerge(
                        "text-xs text-muted-foreground text-center transition-opacity duration-200",
                        isMinified && "opacity-0 invisible"
                    )}>
                        Telescope ADM v2.0
                    </div>
                </div>
            </aside>
        </>
    )
}

export { FlyonSidebar, MenuItem, DropdownMenuItem }
export type { FlyonSidebarProps, MenuItemProps, DropdownMenuItemProps }
