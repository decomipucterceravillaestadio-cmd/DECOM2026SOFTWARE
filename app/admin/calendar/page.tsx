'use client'

import { useState, useEffect } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addDays, startOfWeek, endOfWeek } from 'date-fns'
import { es } from 'date-fns/locale'
import { useRouter, usePathname } from 'next/navigation'
import {
  IconChevronLeft,
  IconChevronRight,
  IconCalendar,
  IconLayoutDashboard,
  IconPlus,
  IconClipboardList,
  IconUsers,
  IconUser,
  IconLogout,
  IconEdit,
  IconEye,
  IconTrash,
  IconDots,
  IconBell,
  IconMenu2,
  IconX,
  IconSearch
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth, useHasPermission } from '@/app/contexts/AuthContext'
import { Permission } from '@/app/lib/permissions'

interface CalendarEvent {
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
}

interface DayEvents {
  date: string
  count: number
  events: CalendarEvent[]
}

export default function AdminCalendarPage() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading: authLoading } = useAuth()
  const canManageUsers = useHasPermission(Permission.VIEW_USERS)

  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<DayEvents[]>([])
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[]>([])
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

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

  const fetchCalendar = async () => {
    setLoading(true)
    try {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      const response = await fetch(`/api/admin/calendar?year=${year}&month=${month}`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data.calendar)
      }
    } catch (error) {
      console.error('Error fetching calendar:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (mounted) fetchCalendar()
  }, [currentDate, mounted])

  const handlePreviousMonth = () => setCurrentDate(prev => subMonths(prev, 1))
  const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1))

  const isActive = (href: string) => pathname === href || (href !== '/admin' && pathname?.startsWith(href))

  if (!mounted || authLoading) return null

  // Calendar Logic
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  const getDayEvents = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd')
    return events.find(e => e.date === dateStr)?.events || []
  }

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
                    <IconCalendar className="h-5 w-5 text-white" />
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
            <IconCalendar className="h-5 w-5 text-white" />
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
            <h2 className="text-white font-bold text-lg hidden sm:block tracking-tight uppercase">Calendario</h2>

            {/* Global Search */}
            <div className="max-w-md w-full ml-4 relative hidden lg:block">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <IconSearch className="w-4 h-4 text-white/30" />
              </div>
              <input
                type="text"
                placeholder="Buscar eventos..."
                className="w-full h-10 bg-[#16233B]/80 border border-white/10 rounded-xl pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#F49E2C]/50 focus:ring-1 focus:ring-[#F49E2C]/30 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-5">
            <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10">
              <button
                onClick={handlePreviousMonth}
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-[#F49E2C]/20 hover:text-[#F49E2C] rounded-lg transition-all"
              >
                <IconChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-4 min-w-[140px] text-center">
                <span className="text-white font-bold text-xs capitalize tracking-wider">
                  {format(currentDate, 'MMMM yyyy', { locale: es })}
                </span>
              </div>
              <button
                onClick={handleNextMonth}
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-[#F49E2C]/20 hover:text-[#F49E2C] rounded-lg transition-all"
              >
                <IconChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="h-6 w-[1px] bg-white/10 mx-1 hidden sm:block" />

            <div className="flex items-center gap-3 p-1 pl-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
              <div className="hidden sm:text-right">
                <p className="text-xs font-bold text-white leading-tight group-hover:text-[#F49E2C] transition-colors">{user?.full_name}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#15539C] to-[#16233B] flex items-center justify-center font-black text-sm text-white shadow-lg ring-2 ring-white/10 group-hover:ring-[#F49E2C]/30 transition-all">
                {user?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth bg-gradient-to-br from-transparent via-transparent to-[#15539C]/5">

          <div className="flex items-center justify-between">
            <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#F49E2C]">
              <span onClick={() => router.push('/admin')} className="hover:underline cursor-pointer">Dashboard</span>
              <span className="text-white/10">/</span>
              <span className="text-white/40 font-medium">Calendario</span>
            </nav>
            <button
              onClick={() => router.push('/new-request')}
              className="px-4 py-2 bg-[#F49E2C] text-[#16233B] rounded-lg font-bold text-xs flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-[#F49E2C]/20"
            >
              <IconPlus className="w-4 h-4" />
              NUEVO EVENTO
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[600px]">
            {/* Calendar Grid Section */}
            <div className="lg:col-span-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col">
              <div className="grid grid-cols-7 border-b border-white/10">
                {['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'].map(day => (
                  <div key={day} className="py-3 text-center text-[10px] font-black text-white/30 tracking-widest">{day}</div>
                ))}
              </div>

              <div className="flex-1 grid grid-cols-7">
                {calendarDays.map((day, idx) => {
                  const dayEvents = getDayEvents(day)
                  const isCurrentMonth = isSameMonth(day, monthStart)
                  const isToday = isSameDay(day, new Date())
                  const isSelected = selectedDay && isSameDay(day, selectedDay)

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedDay(day)
                        setSelectedDayEvents(dayEvents)
                      }}
                      className={cn(
                        "min-h-[100px] p-2 border-r border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 group relative",
                        !isCurrentMonth && "opacity-20",
                        isSelected && "bg-[#15539C]/20 ring-1 ring-inset ring-[#F49E2C]/30"
                      )}
                    >
                      <span className={cn(
                        "text-xs font-bold",
                        isToday ? "bg-[#F49E2C] text-[#16233B] px-2 py-1 rounded-md" : "text-white/40"
                      )}>
                        {format(day, 'd')}
                      </span>

                      <div className="mt-2 space-y-1">
                        {dayEvents.slice(0, 3).map(event => (
                          <div key={event.id} className="text-[10px] bg-[#15539C]/40 border border-[#15539C]/20 rounded-md p-1 truncate text-white/80 font-medium">
                            {event.event_name}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-[9px] text-[#F49E2C] font-black pl-1 italic">+{dayEvents.length - 3} más</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Day Details Section */}
            <div className="lg:col-span-4 space-y-4 flex flex-col h-full">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex-1 flex flex-col shadow-xl">
                <div className="mb-6">
                  <h3 className="text-sm font-black text-[#F49E2C] uppercase tracking-[0.2em] mb-1">
                    {selectedDay ? format(selectedDay, "eeee, d 'de' MMMM", { locale: es }) : 'Selecciona un día'}
                  </h3>
                  <div className="h-1 w-12 bg-[#F49E2C] rounded-full" />
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />)
                  ) : selectedDayEvents.length > 0 ? (
                    selectedDayEvents.map(event => (
                      <div
                        key={event.id}
                        onClick={() => router.push(`/admin/requests/${event.id}`)}
                        className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-[#15539C]/20 group transition-all cursor-pointer relative overflow-hidden"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[9px] font-black text-[#F49E2C] uppercase tracking-widest">{event.committee.name}</span>
                          <div className="size-1.5 rounded-full bg-[#10B981]" />
                        </div>
                        <h4 className="text-xs font-bold text-white group-hover:text-[#F49E2C] transition-colors">{event.event_name}</h4>
                        <div className="mt-2 flex items-center gap-3 text-white/40 text-[10px]">
                          <span className="flex items-center gap-1 font-bold">
                            <IconCalendar className="w-3 h-3" />
                            {format(new Date(event.event_date), 'HH:mm')}
                          </span>
                          <span className="uppercase font-bold tracking-tighter">{event.material_type}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-20 text-center py-20">
                      <IconCalendar className="w-16 h-16 mb-4" />
                      <p className="text-xs font-black uppercase tracking-widest">Sin eventos programados</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Summary Card */}
              <div className="p-5 bg-gradient-to-br from-[#15539C] to-[#16233B] rounded-2xl border border-white/10 shadow-lg">
                <p className="text-[10px] font-black text-[#F49E2C] uppercase tracking-widest mb-1">Resumen del Mes</p>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-black text-white">{events.reduce((acc, curr) => acc + curr.count, 0)}</div>
                  <div className="text-[10px] font-bold text-white/50 mb-1">TOTAL SOLICITUDES</div>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-[#F49E2C] w-[65%]" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
