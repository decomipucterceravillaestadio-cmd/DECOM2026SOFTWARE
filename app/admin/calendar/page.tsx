'use client'

import { useState, useEffect } from 'react'
import { format, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
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
  IconDots
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
  const [canManageUsers, setCanManageUsers] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  // Suprimir errores de extension listeners
  useEffect(() => {
    const handleMessage = (request: any, sender: any, sendResponse: any) => {
      sendResponse({ received: true })
      return false
    }

    if (typeof window !== 'undefined' && (window as any).chrome?.runtime) {
      (window as any).chrome.runtime.onMessage.addListener(handleMessage)

      return () => {
        if ((window as any).chrome?.runtime?.onMessage?.removeListener) {
          (window as any).chrome.runtime.onMessage.removeListener(handleMessage)
        }
      }
    }
  }, [])

  // Verificar permisos del usuario
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          // Admin o Presidente pueden gestionar usuarios
          setCanManageUsers(data.user?.role_level >= 4)
        }
      } catch (error) {
        console.error('Error checking permissions:', error)
      }
    }
    checkPermissions()
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
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-[#F5F5F5]">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <div className="mb-8">
              <div className="flex items-center gap-2 px-2">
                <IconCalendar className="h-7 w-7 text-[#15539C]" />
                <span className="text-xl font-bold text-[#16233B]">
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
              <IconLogout className="h-5 w-5" />
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
            <div className="p-2 sm:p-4">
              <div className="bg-gradient-to-r from-decom-primary to-[#1e2e4a] rounded-xl shadow-lg p-1 flex items-center justify-between relative overflow-hidden">
                {/* Decorative element */}
                <div className="absolute right-0 top-0 h-full w-2 bg-secondary/80 skew-x-[-10deg] translate-x-1"></div>
                <button
                  onClick={handlePreviousMonth}
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors z-10 touch-manipulation"
                >
                  <IconChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <h2 className="text-white text-sm sm:text-lg font-bold tracking-wide z-10 capitalize">
                  {format(currentDate, 'MMMM yyyy', { locale: es })}
                </h2>

                <button
                  onClick={handleNextMonth}
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors z-10 touch-manipulation"
                >
                  <IconChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Calendario */}
            <div className="px-2 sm:px-4 pb-4">
              {loading ? (
                <div className="h-64 sm:h-96 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse" />
              ) : (
                <CalendarGrid
                  selectedDate={currentDate}
                  events={events}
                  onDaySelect={handleDaySelect}
                  selectedDay={selectedDayEvents.length > 0 ? selectedDay : null}
                />
              )}\n            </div>

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
                <div className="fixed bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-20" />

                {/* Bottom Sheet */}
                <div className="fixed bottom-0 left-0 w-full z-30 pointer-events-none md:left-[280px] md:w-[calc(100%-280px)]">
                  <div className="bg-white dark:bg-[#1e1e2d] rounded-t-3xl shadow-[0_-5px_30px_-10px_rgba(0,0,0,0.1)] w-full h-auto min-h-[300px] max-h-[70vh] pointer-events-auto transform transition-transform relative flex flex-col">
                    {/* Drag Handle */}
                    <div className="w-full flex items-center justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-manipulation">
                      <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    </div>

                    {/* Content */}
                    <div className="px-3 sm:px-5 pt-2 pb-safe pb-4 sm:pb-8 flex-1 flex flex-col gap-3 overflow-hidden">
                      {/* Date Header */}
                      <div className="flex flex-col gap-1 border-b border-gray-100 dark:border-gray-700 pb-2 shrink-0">
                        <h3 className="text-base sm:text-lg font-bold text-decom-primary dark:text-white">
                          Eventos del día {selectedDay ? format(selectedDay, 'd MMMM', { locale: es }) : ''}
                        </h3>
                        <div className="h-1 w-12 bg-secondary rounded-full"></div>
                      </div>

                      {/* Events List */}
                      <div className="flex flex-col gap-2 sm:gap-3 overflow-y-auto flex-1">
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
                              className={`
                                bg-white dark:bg-[#252538] border border-gray-100 dark:border-gray-700 rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-sm 
                                flex items-start gap-2 sm:gap-3 relative
                                ${isInProgress ? 'relative' : ''}
                                ${openMenuId === event.id ? 'z-20' : ''}
                              `}
                            >
                              {isInProgress && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-decom-primary-light rounded-l-lg sm:rounded-l-xl"></div>
                              )}

                              <div
                                onClick={() => router.push(`/admin/requests/${event.id}`)}
                                className="flex-1 flex items-start gap-2 sm:gap-3 cursor-pointer hover:opacity-80 transition-opacity active:opacity-60 touch-manipulation"
                              >
                                <div className={`flex flex-col items-center justify-center min-w-[40px] sm:min-w-[50px] pt-1 ${isInProgress ? 'pl-1' : ''}`}>
                                  <span className="text-[10px] sm:text-xs text-gray-400 font-semibold mb-1">HORA</span>
                                  <span className="text-xs sm:text-sm font-bold text-decom-primary dark:text-white">
                                    {event.event_date ? format(new Date(event.event_date), 'HH:mm') : 'TBD'}
                                  </span>
                                  <span className="text-[10px] sm:text-xs text-gray-500">
                                    {event.event_date ? (parseInt(format(new Date(event.event_date), 'H')) >= 12 ? 'PM' : 'AM') : ''}
                                  </span>
                                </div>

                                <div className="w-[1px] h-10 sm:h-12 bg-gray-200 dark:bg-gray-600 self-center"></div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-decom-primary dark:text-white text-xs sm:text-sm truncate pr-2">
                                      {event.event_name}
                                    </h4>
                                    <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold ${statusConfig.bgColor} text-${statusConfig.color} border ${statusConfig.borderColor} whitespace-nowrap`}>
                                      {statusConfig.label}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${statusConfig.dotColor}`}></span>
                                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium truncate">
                                      {event.committee.name}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Menú de acciones */}
                              <div className="relative shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setOpenMenuId(openMenuId === event.id ? null : event.id)
                                  }}
                                  className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors active:scale-95 touch-manipulation"
                                >
                                  <IconDots className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                                </button>

                                {openMenuId === event.id && (
                                  <>
                                    <div
                                      className="fixed inset-0 z-40"
                                      onClick={() => setOpenMenuId(null)}
                                    />
                                    <div className="absolute right-0 top-full mt-1 w-44 sm:w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          router.push(`/admin/requests/${event.id}`)
                                        }}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-left text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 touch-manipulation flex items-center gap-2"
                                      >
                                        <IconEye className="w-4 h-4 shrink-0" />
                                        <span className="truncate">Ver detalle completo</span>
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          // Aquí puedes agregar modal de edición rápida
                                          alert('Función de edición rápida - próximamente')
                                          setOpenMenuId(null)
                                        }}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-left text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 touch-manipulation flex items-center gap-2"
                                      >
                                        <IconEdit className="w-4 h-4 shrink-0" />
                                        <span className="truncate">Editar estado</span>
                                      </button>
                                      <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          if (confirm(`¿Estás seguro de eliminar "${event.event_name}"?`)) {
                                            // Aquí puedes agregar lógica de eliminación
                                            alert('Función de eliminación - próximamente')
                                          }
                                          setOpenMenuId(null)
                                        }}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-left text-xs sm:text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 active:bg-red-100 dark:active:bg-red-900/30 touch-manipulation flex items-center gap-2"
                                      >
                                        <IconTrash className="w-4 h-4 shrink-0" />
                                        <span className="truncate">Eliminar solicitud</span>
                                      </button>
                                    </div>
                                  </>
                                )}
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
