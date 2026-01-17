'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
    IconLayoutDashboard,
    IconClipboardList,
    IconUser,
    IconLogout,
    IconPlus,
    IconBell,
    IconCalendar,
    IconSearch,
    IconMenu2,
    IconX,
    IconUsers
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth, useHasPermission } from '@/app/contexts/AuthContext'
import { Permission } from '@/app/lib/permissions'
import { ThemeToggle } from '../ThemeToggle'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Image from 'next/image'

interface DashboardLayoutProps {
    children: React.ReactNode
    title: string
    showSearch?: boolean
    searchTerm?: string
    onSearchChange?: (term: string) => void
}

export function DashboardLayout({
    children,
    title,
    showSearch = false,
    searchTerm = '',
    onSearchChange
}: DashboardLayoutProps) {
    const router = useRouter()
    const pathname = usePathname()
    const { user, loading } = useAuth()
    const canManageUsers = useHasPermission(Permission.VIEW_USERS)
    const canManageCommittees = useHasPermission(Permission.EDIT_COMMITTEES)
    const [open, setOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const baseLinks = [
        { label: 'Dashboard', href: '/admin', icon: <IconLayoutDashboard className="h-5 w-5" /> },
        { label: 'Nueva Solicitud', href: '/new-request', icon: <IconPlus className="h-5 w-5" /> },
        { label: 'Solicitudes', href: '/admin/list', icon: <IconClipboardList className="h-5 w-5" /> },
        { label: 'Calendario', href: '/admin/calendar', icon: <IconCalendar className="h-5 w-5" /> },
    ]

    const adminLinks = canManageUsers || canManageCommittees ? [
        ...(canManageUsers ? [{ label: 'Gestión de Usuarios', href: '/admin/users', icon: <IconUsers className="h-5 w-5" /> }] : []),
        ...(canManageCommittees ? [{ label: 'Gestión de Comités', href: '/admin/committees', icon: <IconUsers className="h-5 w-5" /> }] : [])
    ] : []

    const links = [
        ...baseLinks,
        ...adminLinks,
        { label: 'Perfil', href: '/admin/profile', icon: <IconUser className="h-5 w-5" /> },
    ]

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/login')
    }

    const isActive = (href: string) => pathname === href || (href !== '/admin' && pathname?.startsWith(href))

    if (!mounted || loading) return null

    return (
        <div className="flex h-screen w-full overflow-hidden bg-dashboard-bg text-dashboard-text-primary flex-row font-sans transition-colors duration-300">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
                        />
                        <motion.nav
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-80 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-xl shadow-2xl z-[70] md:hidden flex flex-col transition-colors duration-300 border-r border-slate-200/50 dark:border-white/5"
                        >
                            <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-gradient-to-br from-[#15539C]/5 to-transparent">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-12 h-12 bg-gradient-to-br from-[#15539C] to-[#1e6ac2] rounded-xl flex items-center justify-center border border-white/20 shadow-lg shadow-blue-500/20 overflow-hidden">
                                            <Image
                                                src="/favicon.png"
                                                alt="DECOM Logo"
                                                fill
                                                className="object-contain p-2"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xl font-black tracking-tighter text-[#15539C] dark:text-white uppercase leading-none">DECOM</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setOpen(false)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-orange-50 hover:text-[#F49E2C] dark:hover:bg-orange-500/10 transition-all">
                                        <IconX className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                                {links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => { router.push(link.href); setOpen(false); }}
                                        className={cn(
                                            "flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all group w-full text-left relative overflow-hidden",
                                            isActive(link.href)
                                                ? "bg-gradient-to-r from-[#15539C] to-[#1e6ac2] text-white shadow-xl shadow-blue-500/30 active:scale-95"
                                                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-white/5 hover:text-[#15539C] dark:hover:text-white active:scale-95"
                                        )}
                                    >
                                        <div className={cn(
                                            "transition-transform duration-300 group-hover:scale-110",
                                            isActive(link.href) ? "text-white" : "group-hover:text-[#15539C] dark:group-hover:text-[#F49E2C]"
                                        )}>
                                            {link.icon}
                                        </div>
                                        <span className="mt-0.5 relative z-10">{link.label}</span>
                                        {isActive(link.href) && (
                                            <motion.div layoutId="activeIndicatorMobile" className="absolute right-4 w-1.5 h-6 rounded-full bg-white/30" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="p-6 border-t border-slate-100 dark:border-white/5 mt-auto bg-slate-50/50 dark:bg-transparent">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-4 px-5 py-4 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all w-full group overflow-hidden"
                                >
                                    <div className="p-2 rounded-lg bg-white dark:bg-white/5 shadow-sm group-hover:bg-red-100 dark:group-hover:bg-red-500/20 transition-colors">
                                        <IconLogout className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                                    </div>
                                    <span>Cerrar Sesión</span>
                                </button>
                                {/* Subtle Signature Mobile */}
                                <div className="mt-8 text-center pb-4">
                                    <p className="text-[10px] text-slate-400/40 dark:text-white/20 font-medium select-none">
                                        Software by Juan Aguilar
                                    </p>
                                </div>
                            </div>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>

            {/* Sidebar - Desktop */}
            <nav className="hidden md:flex w-72 flex-col bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-white/5 transition-all duration-300 shadow-[20px_0_40px_rgba(0,0,0,0.02)] z-30">
                <div className="h-24 flex items-center gap-4 px-8 border-b border-slate-100 dark:border-white/5 bg-gradient-to-br from-[#15539C]/5 to-transparent">
                    <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#15539C] to-[#1e6ac2] flex items-center justify-center border border-white/20 shadow-lg shadow-blue-500/20 transition-transform hover:rotate-3 duration-300 overflow-hidden">
                        <Image
                            src="/favicon.png"
                            alt="DECOM Logo"
                            fill
                            className="object-contain p-2"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black tracking-tighter text-[#15539C] dark:text-white uppercase leading-none">DECOM</span>
                    </div>
                </div>

                <div className="flex-1 py-8 px-4 space-y-1.5 overflow-y-auto mt-2">
                    <div className="px-5 mb-4 text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-[0.2em]">Navegación Principal</div>
                    {links.map((link, idx) => (
                        <button
                            key={idx}
                            onClick={() => router.push(link.href)}
                            className={cn(
                                "flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-[13px] font-bold transition-all group w-full text-left relative overflow-hidden",
                                isActive(link.href)
                                    ? "bg-gradient-to-r from-[#15539C] to-[#1e6ac2] text-white shadow-xl shadow-blue-500/25 active:scale-95"
                                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#15539C] dark:hover:text-white active:scale-95 hover:pl-6"
                            )}
                        >
                            <div className={cn(
                                "transition-all duration-300 group-hover:scale-110",
                                isActive(link.href) ? "text-white" : "group-hover:text-[#15539C] dark:group-hover:text-[#F49E2C]"
                            )}>
                                {link.icon}
                            </div>
                            <span className="mt-0.5 relative z-10">{link.label}</span>
                            {isActive(link.href) && (
                                <motion.div layoutId="activeIndicator" className="ml-auto w-2 h-2 rounded-full bg-[#F49E2C] shadow-[0_0_12px_#F49E2C]" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-transparent">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-5 py-4 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all w-full group overflow-hidden"
                    >
                        <div className="p-2.5 rounded-xl bg-white dark:bg-white/5 shadow-sm group-hover:bg-red-100 dark:group-hover:bg-red-500/20 transition-colors">
                            <IconLogout className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                        </div>
                        <span>Cerrar Sesión</span>
                    </button>
                </div>

                {/* Subtle Signature */}
                <div className="px-8 pb-6 text-center">
                    <p className="text-[10px] text-slate-400/30 dark:text-white/10 font-medium hover:text-slate-500 dark:hover:text-white/30 transition-colors cursor-default select-none">
                        Software by Juan Aguilar
                    </p>
                </div>
            </nav>

            {/* Main Container */}
            <div className="flex flex-1 flex-col overflow-hidden relative">
                {/* Top Header Bar */}
                <header className="h-16 shrink-0 bg-dashboard-header backdrop-blur-xl border-b border-dashboard-card-border flex items-center justify-between px-4 md:px-8 z-40 transition-colors duration-300">
                    <div className="flex items-center gap-4 flex-1">
                        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-dashboard-text-secondary hover:text-[#F49E2C] transition-colors" aria-label="Menu">
                            <IconMenu2 className="w-6 h-6" />
                        </button>
                        <h2 className="text-dashboard-text-primary font-bold text-lg hidden sm:block tracking-tight uppercase">{title}</h2>

                        {/* Global Search */}
                        {showSearch && (
                            <div className="max-w-md w-full ml-4 relative hidden lg:block">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <IconSearch className="w-4 h-4 text-dashboard-text-muted" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={(e) => onSearchChange?.(e.target.value)}
                                    className="w-full h-10 bg-dashboard-search-bg border border-dashboard-card-border rounded-xl pl-10 pr-4 text-sm text-dashboard-text-primary placeholder-dashboard-text-muted focus:outline-none focus:border-[#F49E2C]/50 focus:ring-1 focus:ring-[#F49E2C]/30 transition-all"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 md:gap-5">
                        <ThemeToggle />

                        <button
                            onClick={() => router.push('/admin/list')}
                            className="relative p-2.5 rounded-xl text-dashboard-text-secondary hover:text-[#F49E2C] hover:bg-white/5 transition-all group"
                            aria-label="Notificaciones"
                        >
                            <IconBell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-[#F49E2C] rounded-full border-2 border-dashboard-sidebar shadow-[0_0_8px_rgba(244,158,44,0.5)]" />
                        </button>

                        <div className="h-6 w-[1px] bg-dashboard-card-border mx-1 hidden sm:block" />

                        <div
                            onClick={() => router.push('/admin/profile')}
                            className="flex items-center gap-3 p-1 pl-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer group"
                        >
                            <div className="hidden sm:text-right">
                                <p className="text-xs font-bold text-dashboard-text-primary leading-tight group-hover:text-[#F49E2C] transition-colors">{user?.full_name}</p>
                                <p className="text-[10px] text-[#F49E2C]/70 font-bold uppercase tracking-wider">{user?.role}</p>
                            </div>
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#15539C] to-decom-primary flex items-center justify-center font-black text-sm text-white shadow-lg ring-2 ring-dashboard-card-border group-hover:ring-[#F49E2C]/30 transition-all">
                                {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Main Area */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scroll-smooth bg-gradient-to-br from-transparent via-transparent to-[#15539C]/5">
                    {children}

                    {/* Subtle Signature in Main Area */}
                    <div className="pt-8 text-center opacity-0 hover:opacity-100 transition-opacity duration-500">
                        <p className="text-[10px] text-slate-400/20 dark:text-white/5 font-medium select-none">
                            Software by Juan Aguilar
                        </p>
                    </div>
                </main>
            </div>
        </div>
    )
}
