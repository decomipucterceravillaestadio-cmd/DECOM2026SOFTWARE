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
import { EmptyState } from '@/app/components/UI'

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
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
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
    setSelectedDay(date)
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
            <div className="p-4">
              <div className="bg-gradient-to-r from-decom-primary to-[#1e2e4a] rounded-xl shadow-lg p-1 flex items-center justify-between relative overflow-hidden">
                {/* Decorative element */}
                <div className="absolute right-0 top-0 h-full w-2 bg-secondary/80 skew-x-[-10deg] translate-x-1"></div>
                <button
                  onClick={handlePreviousMonth}
                  className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors z-10"
                >
                  <IconChevronLeft className="w-5 h-5" />
                </button>
                
                <h2 className="text-white text-lg font-bold tracking-wide z-10">
                  {format(currentDate, 'MMMM yyyy', { locale: es })}
                </h2>
                
                <button
                  onClick={handleNextMonth}
                  className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors z-10"
                >
                  <IconChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Calendario */}
            <div className="px-4 pb-4">
              {loading ? (
                <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse" />
              ) : (
                <CalendarGrid
                  selectedDate={currentDate}
                  events={events}
                  onDaySelect={handleDaySelect}
                  selectedDay={selectedDayEvents.length > 0 ? selectedDay : null}
                />
              )}
            </div>

            {/* Estado vacío cuando no hay eventos */}
            {!loading && events.length === 0 && (
              <div className="mt-8">
                <EmptyState
                  title="Calendario vacío"
                  description="No hay eventos programados para este mes. Los eventos aparecerán aquí cuando se aprueben las solicitudes de material gráfico."
                  actionLabel="Ver Todas las Solicitudes"
                  onAction={() => router.push('/admin')}
                  variant="default"
                />
              </div>
            )}

            {/* Panel de eventos del día seleccionado */}
            {selectedDayEvents.length > 0 && (
              <>
                {/* Overlay with gradient fade */}
                <div className="fixed bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-20" />
                
                {/* Bottom Sheet */}
                <div className="fixed bottom-0 left-0 w-full z-30 pointer-events-none">
                  <div className="bg-white dark:bg-[#1e1e2d] rounded-t-3xl shadow-[0_-5px_30px_-10px_rgba(0,0,0,0.1)] w-full h-auto min-h-[340px] pointer-events-auto transform transition-transform relative flex flex-col">
                    {/* Drag Handle */}
                    <div className="w-full flex items-center justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
                      <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="px-5 pt-2 pb-8 flex-1 flex flex-col gap-4">
                      {/* Date Header */}
                      <div className="flex flex-col gap-1 border-b border-gray-100 dark:border-gray-700 pb-3">
                        <h3 className="text-lg font-bold text-decom-primary dark:text-white">
                          Eventos del día {selectedDay ? format(selectedDay, 'd MMMM', { locale: es }) : ''}
                        </h3>
                        <div className="h-1 w-12 bg-secondary rounded-full"></div>
                      </div>
                      
                      {/* Events List */}
                      <div className="flex flex-col gap-3 overflow-y-auto">
                        {selectedDayEvents.map((event) => {
                          const statusConfig = {
                            pending: { label: 'Pendiente', color: 'decom-secondary', bgColor: 'bg-decom-secondary/10', borderColor: 'border-decom-secondary/20', dotColor: 'bg-decom-secondary' },
                            in_progress: { label: 'En Proceso', color: 'decom-primary-light', bgColor: 'bg-decom-primary-light/10', borderColor: 'border-decom-primary-light/20', dotColor: 'bg-decom-primary-light' },
                            completed: { label: 'Listo', color: 'decom-success', bgColor: 'bg-decom-success/10', borderColor: 'border-decom-success/20', dotColor: 'bg-decom-success' },
                            approved: { label: 'Aprobado', color: 'decom-success', bgColor: 'bg-decom-success/10', borderColor: 'border-decom-success/20', dotColor: 'bg-decom-success' },
                            rejected: { label: 'Rechazado', color: 'error', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20', dotColor: 'bg-red-500' },
                          }[event.status] || { label: event.status, color: 'gray', bgColor: 'bg-gray-100', borderColor: 'border-gray-200', dotColor: 'bg-gray-400' }

                          const isInProgress = event.status === 'in_progress'

                          return (
                            <div
                              key={event.id}
                              onClick={() => router.push(`/admin/requests/${event.id}`)}
                              className={`
                                bg-white dark:bg-[#252538] border border-gray-100 dark:border-gray-700 rounded-xl p-3 shadow-sm 
                                flex items-start gap-3 cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden
                                ${isInProgress ? 'relative' : ''}
                              `}
                            >
                              {isInProgress && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-decom-primary-light"></div>
                              )}
                              
                              <div className={`flex flex-col items-center justify-center min-w-[50px] pt-1 ${isInProgress ? 'pl-1' : ''}`}>
                                <span className="text-xs text-gray-400 font-semibold mb-1">HORA</span>
                                <span className="text-sm font-bold text-decom-primary dark:text-white">
                                  {event.event_date ? format(new Date(event.event_date), 'HH:mm') : 'TBD'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {event.event_date ? (parseInt(format(new Date(event.event_date), 'H')) >= 12 ? 'PM' : 'AM') : ''}
                                </span>
                              </div>
                              
                              <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-600 self-center"></div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className="font-bold text-decom-primary dark:text-white text-sm truncate pr-2">
                                    {event.event_name}
                                  </h4>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${statusConfig.bgColor} text-${statusConfig.color} border ${statusConfig.borderColor}`}>
                                    {statusConfig.label}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`}></span>
                                  <p className="text-xs text-gray-500 font-medium truncate">
                                    {event.committee.name}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
