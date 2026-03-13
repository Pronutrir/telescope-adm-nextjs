/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, User, Settings, CreditCard, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const MENU_ITEMS = [
    { label: 'My Profile', icon: User },
    { label: 'Settings', icon: Settings },
    { label: 'Billing', icon: CreditCard },
    { label: 'FAQs', icon: HelpCircle },
]

interface DropdownTestProps {
    isDark: boolean
    className?: string
}

export const DropdownTest: React.FC<DropdownTestProps> = ({ isDark, className }) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClose = (e: MouseEvent | KeyboardEvent) => {
            if (e instanceof KeyboardEvent && e.key !== 'Escape') return
            if (e instanceof MouseEvent && dropdownRef.current?.contains(e.target as Node)) return
            setIsOpen(false)
        }
        document.addEventListener('mousedown', handleClose)
        document.addEventListener('keydown', handleClose)
        return () => {
            document.removeEventListener('mousedown', handleClose)
            document.removeEventListener('keydown', handleClose)
        }
    }, [])

    return (
        <div className="flex justify-center">
        <div ref={dropdownRef} className={cn('relative inline-flex', className)}>
            <button
                id="dropdown-header"
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl border transition-all duration-200 font-medium text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2',
                    isDark
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500/50 focus:ring-indigo-500/40 focus:ring-offset-slate-900 shadow-lg shadow-indigo-500/20'
                        : 'bg-indigo-500 hover:bg-indigo-600 text-white border-indigo-400/50 focus:ring-indigo-500/30 focus:ring-offset-slate-50 shadow-lg shadow-indigo-500/15'
                )}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-label="Abrir menu dropdown"
            >
                Dropdown header
                <ChevronDown className={cn('size-4 transition-transform duration-200', isOpen && 'rotate-180')} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        initial={{ opacity: 0, y: -4, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className={cn(
                            'absolute top-full left-0 mt-2 min-w-64 rounded-xl border backdrop-blur-2xl z-50 overflow-hidden',
                            isDark
                                ? 'bg-slate-900/95 border-slate-700/60 shadow-2xl shadow-black/30'
                                : 'bg-slate-50/95 border-slate-200 shadow-2xl shadow-slate-300/30'
                        )}
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="dropdown-header"
                    >
                        <li className={cn(
                            'flex items-center gap-3 px-4 py-3.5 border-b',
                            isDark ? 'border-slate-700/60' : 'border-slate-200/80'
                        )}>
                            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-indigo-500/20">
                                <img src="https://cdn.flyonui.com/fy-assets/avatar/avatar-2.png" alt="User Avatar" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h6 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-slate-900')}>John Doe</h6>
                                <small className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>jhon@doe.com</small>
                            </div>
                        </li>
                        {MENU_ITEMS.map(({ label, icon: Icon }) => (
                            <li key={label}>
                                <a
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer',
                                        isDark
                                            ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                                            : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                                    )}
                                    href="#"
                                    role="menuitem"
                                >
                                    <Icon className="w-4 h-4 opacity-60" />
                                    {label}
                                </a>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
        </div>
    )
}
