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
                            className="fixed inset-y-0 left-0 w-72 bg-dashboard-sidebar shadow-2xl z-[70] md:hidden flex flex-col p-6 transition-colors duration-300"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#15539C] flex items-center justify-center border border-[#F49E2C]/30 shadow-[0_0_15px_rgba(244,158,44,0.1)]">
                                        <IconLayoutDashboard className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-lg font-bold tracking-tight text-dashboard-text-primary uppercase mt-0.5">DECOM</span>
                                </div>
                                <button onClick={() => setOpen(false)} className="p-2 text-dashboard-text-secondary hover:text-[#F49E2C] transition-colors">
                                    <IconX className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 space-y-2 overflow-y-auto">
                                {links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => { router.push(link.href); setOpen(false); }}
                                        className={cn(
                                            "flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-medium transition-all group w-full text-left",
                                            isActive(link.href)
                                                ? "bg-[#15539C]/20 text-[#F49E2C] shadow-sm border border-[#F49E2C]/20"
                                                : "text-dashboard-text-secondary hover:bg-decom-primary/10 hover:text-dashboard-text-primary"
                                        )}
                                    >
                                        {link.icon}
                                        <span className="mt-0.5">{link.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-dashboard-card-border mt-auto">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-4 px-4 py-4 text-sm font-medium text-dashboard-text-secondary hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all w-full"
                                >
                                    <IconLogout className="h-5 w-5" />
                                    <span>Cerrar Sesión</span>
                                </button>
                            </div>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>

            {/* Sidebar - Desktop */}
            <nav className="hidden md:flex w-64 flex-col bg-dashboard-sidebar border-r border-dashboard-card-border transition-all duration-300 shadow-xl z-30">
                <div className="h-16 flex items-center gap-3 px-6 border-b border-dashboard-card-border">
                    <div className="w-8 h-8 rounded-lg bg-[#15539C] flex items-center justify-center border border-[#F49E2C]/30 shadow-[0_0_15px_rgba(244,158,44,0.1)]">
                        <IconLayoutDashboard className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-dashboard-text-primary uppercase mt-0.5">DECOM</span>
                </div>

                <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    {links.map((link, idx) => (
                        <button
                            key={idx}
                            onClick={() => router.push(link.href)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group w-full text-left",
                                isActive(link.href)
                                    ? "bg-[#15539C]/20 text-[#F49E2C] shadow-sm border border-[#F49E2C]/20"
                                    : "text-dashboard-text-secondary hover:bg-decom-primary/10 hover:text-dashboard-text-primary"
                            )}
                        >
                            <div className={cn("transition-colors", isActive(link.href) ? "text-[#F49E2C]" : "group-hover:text-white")}>
                                {link.icon}
                            </div>
                            <span className="mt-0.5">{link.label}</span>
                            {isActive(link.href) && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#F49E2C] shadow-[0_0_8px_rgba(244,158,44,0.5)]" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-dashboard-card-border">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-dashboard-text-secondary hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all w-full"
                    >
                        <IconLogout className="h-5 w-5" />
                        <span>Cerrar Sesión</span>
                    </button>
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
                </main>
            </div>
        </div>
    )
}
