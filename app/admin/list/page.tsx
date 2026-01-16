'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  IconLayoutDashboard,
  IconCalendar,
  IconLogout,
  IconPlus,
  IconBell,
  IconClipboardList,
  IconUsers,
  IconUser,
  IconSearch,
  IconMenu2,
  IconX,
  IconBuildingChurch,
  IconFilter
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth, useHasPermission } from '@/app/contexts/AuthContext'
import { Permission } from '@/app/lib/permissions'
import RequestCard from '@/app/components/Dashboard/RequestCard'
import FilterChips from '@/app/components/UI/FilterChips'

interface Request {
  id: string
  event_name: string
  event_date: string
  status: string
  priority_score: number | null
  material_type: string
  committee: {
    name: string
    color_badge: string
  }
  created_at: string
}

type FilterType = 'all' | 'pending' | 'in_progress' | 'urgent'

export default function AdminListPage() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading: authLoading } = useAuth()
  const canManageUsers = useHasPermission(Permission.VIEW_USERS)

  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [open, setOpen] = useState(false)
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

  const getNormalizedStatus = (status: string) => {
    const s = status?.toLowerCase().trim()
    if (['in_progress', 'approved', 'completed', 'rejected'].includes(s)) return s
    return 'pending'
  }

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/requests?limit=100')
      if (response.ok) {
        const data = await response.json()
        setRequests(data.requests || [])
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (mounted) fetchRequests()
  }, [mounted])

  const filteredRequests = requests.filter(request => {
    const matchesFilter = (() => {
      switch (activeFilter) {
        case 'pending':
          return getNormalizedStatus(request.status) === 'pending'
        case 'in_progress':
          return getNormalizedStatus(request.status) === 'in_progress'
        case 'urgent':
          return request.priority_score && request.priority_score >= 8
        default:
          return true
      }
    })()

    const matchesSearch = searchTerm.trim() === '' || 
      request.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.committee.name.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const filters = [
    { id: 'all' as FilterType, label: 'Todas', count: requests.length },
    { id: 'pending' as FilterType, label: 'Pendientes', count: requests.filter(r => getNormalizedStatus(r.status) === 'pending').length },
    { id: 'in_progress' as FilterType, label: 'En proceso', count: requests.filter(r => getNormalizedStatus(r.status) === 'in_progress').length },
    { id: 'urgent' as FilterType, label: 'Urgentes', count: requests.filter(r => r.priority_score && r.priority_score >= 8).length },
  ]

  const isActive = (href: string) => pathname === href || (href !== '/admin' && pathname?.startsWith(href))

  if (!mounted || authLoading) return null

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
                    <IconBuildingChurch className="h-5 w-5 text-white" />
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
                      isActive(link.href)
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
            <IconBuildingChurch className="h-5 w-5 text-white" />
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
                isActive(link.href)
                  ? "bg-[#15539C]/20 text-[#F49E2C] shadow-sm border border-[#F49E2C]/20"
                  : "text-white/60 hover:bg-[#15539C]/10 hover:text-white"
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
            <h2 className="text-white font-bold text-lg hidden sm:block tracking-tight uppercase">Solicitudes</h2>

            {/* Global Search */}
            <div className="max-w-md w-full ml-4 relative hidden lg:block">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <IconSearch className="w-4 h-4 text-white/30" />
              </div>
              <input
                type="text"
                placeholder="Buscar en solicitudes..."
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
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#15539C] to-[#16233B] flex items-center justify-center font-black text-sm text-white shadow-lg ring-2 ring-white/10 group-hover:ring-[#F49E2C]/30 transition-all">
                {user?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth bg-gradient-to-br from-transparent via-transparent to-[#15539C]/5">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#F49E2C]">
                <span onClick={() => router.push('/admin')} className="hover:underline cursor-pointer">Dashboard</span>
                <span className="text-white/10">/</span>
                <span className="text-white/40 font-medium tracking-normal capitalize">Lista de Solicitudes</span>
              </nav>
              <h1 className="text-2xl font-bold text-white tracking-tight">Todas las Solicitudes</h1>
            </div>
            <button
              onClick={() => router.push('/new-request')}
              className="px-5 py-2.5 bg-[#F49E2C] text-[#16233B] rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#F49E2C]/20 shrink-0"
            >
              <IconPlus className="w-5 h-5" />
              NUEVA SOLICITUD
            </button>
          </div>

          {/* Filters Bar */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-[#15539C]/20 p-2 rounded-lg text-[#F49E2C]">
                <IconFilter className="w-4 h-4" />
              </div>
              <FilterChips
                filters={filters}
                activeFilter={activeFilter}
                onFilterChange={(filterId) => setActiveFilter(filterId as FilterType)}
              />
            </div>
            <div className="text-[10px] font-black text-white/30 uppercase tracking-widest bg-white/5 px-3 py-2 rounded-full border border-white/5">
              {filteredRequests.length} RESULTADOS ENCONTRADOS
            </div>
          </div>

          {/* Results Grid */}
          <div className="space-y-4 pb-20">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-40 bg-white/5 rounded-2xl animate-pulse border border-white/5" />
                ))}
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center opacity-30">
                <div className="size-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <IconClipboardList className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No se encontraron resultados</h3>
                <p className="text-sm">Intenta ajustar los filtros para encontrar lo que buscas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRequests.map((request, idx) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <RequestCard
                      request={request}
                      onClick={() => router.push(`/admin/requests/${request.id}`)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}