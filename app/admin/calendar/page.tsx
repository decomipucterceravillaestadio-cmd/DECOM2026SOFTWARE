'use client'

import { useState, useEffect } from 'react'
import { format, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import { 
  IconChevronLeft, 
  IconChevronRight,
  IconCalendar,
  IconLayoutDashboard
} from '@tabler/icons-react'
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar'
import CalendarGrid from '@/app/components/Calendar/CalendarGrid'
import { Badge } from '@/app/components/UI/Badge'
import { Button } from '@/app/components/UI/Button'

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
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<DayEvents[]>([])
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const links = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: <IconLayoutDashboard className="h-5 w-5" />,
    },
    {
      label: 'Calendario',
      href: '/admin/calendar',
      icon: <IconCalendar className="h-5 w-5" />,
    },
  ]

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
    fetchCalendar()
  }, [currentDate])

  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1))
  }

  const handleDaySelect = (date: Date, dayEvents: CalendarEvent[]) => {
    setSelectedDayEvents(dayEvents)
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: any }> = {
      pending: { label: 'Pendiente', variant: 'warning' },
      in_progress: { label: 'En Progreso', variant: 'info' },
      completed: { label: 'Completado', variant: 'success' },
      approved: { label: 'Aprobado', variant: 'success' },
      rejected: { label: 'Rechazado', variant: 'error' },
    }
    const config = statusMap[status] || { label: status, variant: 'default' }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-neutral-100 dark:bg-neutral-950">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <div className="mb-8">
              <div className="flex items-center gap-2 px-2">
                <IconCalendar className="h-7 w-7 text-violet-500" />
                <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  DECOM
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-2 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors w-full"
            >
              Cerrar Sesión
            </button>
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                Calendario de Solicitudes
              </h1>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                Vista mensual de todas las solicitudes por fecha de evento
              </p>
            </div>

            {/* Controles del calendario */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePreviousMonth}
                  className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                >
                  <IconChevronLeft className="w-5 h-5" />
                </button>
                
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {format(currentDate, 'MMMM yyyy', { locale: es })}
                </h2>
                
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                >
                  <IconChevronRight className="w-5 h-5" />
                </button>
              </div>

              <Button
                onClick={() => setCurrentDate(new Date())}
                variant="outline"
              >
                Hoy
              </Button>
            </div>

            {/* Calendario */}
            {loading ? (
              <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse" />
            ) : (
              <CalendarGrid
                selectedDate={currentDate}
                events={events}
                onDaySelect={handleDaySelect}
              />
            )}

            {/* Panel de eventos del día seleccionado */}
            {selectedDayEvents.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
                  Eventos seleccionados ({selectedDayEvents.length})
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {selectedDayEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => router.push(`/admin/requests/${event.id}`)}
                      className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {event.event_name}
                        </h4>
                        {event.priority_score && event.priority_score >= 8 && (
                          <Badge variant="error">Urgente</Badge>
                        )}
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                        {event.committee.name}
                      </p>
                      <div className="flex items-center justify-between">
                        {getStatusBadge(event.status)}
                        <span className="text-xs text-neutral-500">
                          {event.material_type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
