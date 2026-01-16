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
  IconUsers,
  IconSearch,
  IconMenu2,
  IconX
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import StatsGrid from '@/app/components/Dashboard/StatsGrid'
import RequestsTable from '@/app/components/Dashboard/RequestsTable'
import RequestDetailModal from '@/app/components/Dashboard/RequestDetailModal'
import { useAuth, useHasPermission } from '@/app/contexts/AuthContext'
import { Permission } from '@/app/lib/permissions'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function AdminDashboard() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()
  const canManageUsers = useHasPermission(Permission.VIEW_USERS)
  const [open, setOpen] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  const baseLinks = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: <IconLayoutDashboard className="h-5 w-5" />,
    },
    {
      label: 'Nueva Solicitud',
      href: '/new-request',
      icon: <IconPlus className="h-5 w-5" />,
    },
    {
      label: 'Solicitudes',
      href: '/admin/list',
      icon: <IconClipboardList className="h-5 w-5" />,
    },
    {
      label: 'Calendario',
      href: '/admin/calendar',
      icon: <IconCalendar className="h-5 w-5" />,
    },
  ]

  const adminLinks = canManageUsers ? [
    {
      label: 'Gestión de Usuarios',
      href: '/admin/users',
      icon: <IconUsers className="h-5 w-5" />,
    }
  ] : []

  const links = [
    ...baseLinks,
    ...adminLinks,
    {
      label: 'Perfil',
      href: '/admin/profile',
      icon: <IconUser className="h-5 w-5" />,
    },
  ]

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  if (!mounted || loading) return null

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#16233B] text-[#F8FAFC] flex-row font-sans">

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
              className="fixed inset-y-0 left-0 w-72 bg-[#1a2847] shadow-2xl z-[70] md:hidden flex flex-col p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#15539C] flex items-center justify-center border border-[#F49E2C]/30 shadow-[0_0_15px_rgba(244,158,44,0.1)]">
                    <IconLayoutDashboard className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold tracking-tight text-white uppercase mt-0.5">DECOM</span>
                </div>
                <button onClick={() => setOpen(false)} className="p-2 text-white/50 hover:text-[#F49E2C] transition-colors">
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
                      pathname === link.href
                        ? "bg-[#15539C]/20 text-[#F49E2C] shadow-sm border border-[#F49E2C]/20"
                        : "text-white/60 hover:bg-[#15539C]/10 hover:text-white"
                    )}
                  >
                    {link.icon}
                    <span className="mt-0.5">{link.label}</span>
                  </button>
                ))}
              </div>

              <div className="pt-6 border-t border-white/10 mt-auto">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 px-4 py-4 text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all w-full"
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
      <nav className="hidden md:flex w-64 flex-col bg-[#1a2847] border-r border-white/10 transition-all duration-300 shadow-xl z-30">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-[#15539C] flex items-center justify-center border border-[#F49E2C]/30 shadow-[0_0_15px_rgba(244,158,44,0.1)]">
            <IconLayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white uppercase mt-0.5">DECOM</span>
        </div>

        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {links.map((link, idx) => (
            <button
              key={idx}
              onClick={() => router.push(link.href)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group w-full text-left",
                pathname === link.href
                  ? "bg-[#15539C]/20 text-[#F49E2C] shadow-sm border border-[#F49E2C]/20"
                  : "text-white/60 hover:bg-[#15539C]/10 hover:text-white"
              )}
            >
              <div className={cn("transition-colors", pathname === link.href ? "text-[#F49E2C]" : "group-hover:text-white")}>
                {link.icon}
              </div>
              <span className="mt-0.5">{link.label}</span>
              {pathname === link.href && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#F49E2C] shadow-[0_0_8px_rgba(244,158,44,0.5)]" />
              )}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all w-full"
          >
            <IconLogout className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Top Header Bar */}
        <header className="h-16 shrink-0 bg-[#1a2847]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 md:px-8 z-40 transition-colors">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-white/50 hover:text-[#F49E2C] transition-colors" aria-label="Menu">
              <IconMenu2 className="w-6 h-6" />
            </button>
            <h2 className="text-white font-bold text-lg hidden sm:block tracking-tight uppercase">Dashboard</h2>

            {/* Global Search */}
            <div className="max-w-md w-full ml-4 relative hidden lg:block">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <IconSearch className="w-4 h-4 text-white/30" />
              </div>
              <input
                type="text"
                placeholder="Buscar solicitudes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 bg-[#16233B]/80 border border-white/10 rounded-xl pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#F49E2C]/50 focus:ring-1 focus:ring-[#F49E2C]/30 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-5">
            <button className="relative p-2.5 rounded-xl text-white/50 hover:text-[#F49E2C] hover:bg-white/5 transition-all group" aria-label="Notificaciones">
              <IconBell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#F49E2C] rounded-full border-2 border-[#1a2847] shadow-[0_0_8px_rgba(244,158,44,0.5)]" />
            </button>

            <div className="h-6 w-[1px] bg-white/10 mx-1 hidden sm:block" />

            <div className="flex items-center gap-3 p-1 pl-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
              <div className="hidden sm:text-right">
                <p className="text-xs font-bold text-white leading-tight group-hover:text-[#F49E2C] transition-colors">{user?.full_name}</p>
                <p className="text-[10px] text-[#F49E2C]/70 font-bold uppercase tracking-wider">{user?.role}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#15539C] to-[#16233B] flex items-center justify-center font-black text-sm text-white shadow-lg ring-2 ring-white/10 group-hover:ring-[#F49E2C]/30 transition-all">
                {user?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scroll-smooth bg-gradient-to-br from-transparent via-transparent to-[#15539C]/5">

          {/* Welcome Section */}
          <div className="space-y-1">
            <h1 className="text-3xl md:text-[32px] font-bold text-white tracking-tight">
              {getGreeting()}, <span className="font-extrabold text-[#F49E2C]">{user?.full_name?.split(' ')[0] || 'Administrador'}</span>
            </h1>
            <div className="flex items-center justify-between">
              <p className="text-white/60 text-sm font-medium">
                {format(new Date(), "eeee, d 'de' MMMM", { locale: es })}
              </p>
              {/* Breadcrumbs */}
              <nav className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
                <span className="hover:text-[#F49E2C] cursor-pointer transition-colors">Home</span>
                <span className="text-white/10">/</span>
                <span className="text-[#F49E2C]/80">Dashboard</span>
              </nav>
            </div>
          </div>

          {/* Quick Action Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Nueva Solicitud', icon: <IconPlus className="w-10 h-10" />, href: '/new-request' },
              { label: 'Calendario', icon: <IconCalendar className="w-10 h-10" />, href: '/admin/calendar' },
              { label: 'Lista Completa', icon: <IconClipboardList className="w-10 h-10" />, href: '/admin/list' },
              { label: 'Usuarios', icon: <IconUsers className="w-10 h-10" />, href: '/admin/users' }
            ].filter(item => item.label !== 'Usuarios' || canManageUsers).map((action, i) => (
              <button
                key={i}
                onClick={() => router.push(action.href)}
                className="group relative flex items-center gap-5 p-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-[12px] transition-all duration-300 hover:bg-[#15539C]/20 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/40 active:scale-95 text-left overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity translate-x-4 -translate-y-4">
                  {action.icon}
                </div>
                <div className="p-3 rounded-xl bg-[#16233B] text-[#F49E2C] group-hover:bg-[#F49E2C] group-hover:text-[#16233B] transition-all shadow-inner group-hover:scale-110 border border-white/5">
                  <div className="w-6 h-6 flex items-center justify-center">
                    {action.icon}
                  </div>
                </div>
                <div className="z-10">
                  <p className="text-white font-bold text-lg leading-tight tracking-tight group-hover:text-white transition-colors">{action.label}</p>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-0.5">Acceso Rápido</p>
                </div>
              </button>
            ))}
          </section>

          <div className="grid grid-cols-12 gap-6 pb-10">
            {/* Stats area */}
            <section className="col-span-12" key={`stats-${refreshKey}`}>
              <StatsGrid />
            </section>

            {/* Recent Requests Table Section */}
            <section className="col-span-12 space-y-4" key={`table-${refreshKey}`}>
              <div className="flex items-center justify-between px-2">
                <h2 className="text-[20px] font-bold text-white tracking-tight flex items-center gap-3">
                  <div className="w-1 h-5 bg-[#F49E2C] rounded-full" />
                  Solicitudes Recientes
                </h2>
                <button
                  onClick={() => router.push('/admin/list')}
                  className="px-5 py-2 rounded-[10px] bg-white/5 border border-white/10 text-white/70 text-xs font-bold hover:bg-[#15539C] hover:text-white hover:border-[#F49E2C]/50 transition-all active:scale-95 shadow-lg shadow-black/20"
                >
                  VER TODAS
                </button>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-[16px] border border-white/10 shadow-2xl overflow-hidden p-1">
                <RequestsTable onSelectRequest={setSelectedRequestId} searchTerm={searchTerm} />
              </div>
            </section>
          </div>
        </main>
      </div>

      <RequestDetailModal
        requestId={selectedRequestId}
        onClose={() => setSelectedRequestId(null)}
        onUpdate={handleRefresh}
      />
    </div>
  )
}
