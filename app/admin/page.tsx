'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  IconLayoutDashboard,
  IconClipboardList,
  IconUser,
  IconLogout,
  IconPlus,
  IconBell
} from '@tabler/icons-react'
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar'
import StatsGrid from '@/app/components/Dashboard/StatsGrid'
import RequestsTable from '@/app/components/Dashboard/RequestsTable'
import RequestDetailModal from '@/app/components/Dashboard/RequestDetailModal'
import MiniCalendar from '@/app/components/UI/MiniCalendar'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function AdminDashboard() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [calendarEvents, setCalendarEvents] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Obtener eventos del calendario
  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        const response = await fetch('/api/public/calendar')
        if (response.ok) {
          const data = await response.json()
          setCalendarEvents(data.events || [])
        }
      } catch (error) {
        console.error('Error fetching calendar events:', error)
      }
    }

    fetchCalendarEvents()
  }, [])

  const links = [
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
      href: '/admin',
      icon: <IconClipboardList className="h-5 w-5" />,
    },
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

  if (!mounted) return null

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-neutral-950 flex-col md:flex-row">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            {/* Logo */}
            <div className="mb-8 pl-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                  <IconLayoutDashboard className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                  DECOM
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>

            {/* Mini Calendar */}
            <div className="mt-6">
              <MiniCalendar
                events={calendarEvents}
                onDateSelect={(date) => {
                  // Navegar a la página del calendario con la fecha seleccionada
                  router.push(`/admin/calendar?date=${format(date, 'yyyy-MM-dd')}`)
                }}
              />
            </div>
          </div>
          <div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors w-full group"
            >
              <IconLogout className="h-5 w-5 group-hover:stroke-red-600 dark:group-hover:stroke-red-500" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex flex-1 flex-col overflow-hidden bg-neutral-50/50 dark:bg-neutral-950 relative">
        {/* Decorative background gradient */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-violet-500/5 to-transparent pointer-events-none" />

        <div className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">
                  {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {getGreeting()}, Admin
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2.5 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors relative">
                  <IconBell className="w-5 h-5" />
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-neutral-800" />
                </button>
                <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center border-2 border-white dark:border-neutral-800 shadow-sm">
                  <span className="font-bold text-violet-700 dark:text-violet-300">A</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div key={`stats-${refreshKey}`}>
              <StatsGrid />
            </div>

            {/* Requests Table */}
            <div key={`table-${refreshKey}`} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  Solicitudes Recientes
                </h2>
                {/* Could add filters or export buttons here */}
              </div>
              <RequestsTable onSelectRequest={setSelectedRequestId} />
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <RequestDetailModal
        requestId={selectedRequestId}
        onClose={() => setSelectedRequestId(null)}
        onUpdate={handleRefresh}
      />
    </div>
  )
}
