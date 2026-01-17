'use client'

import { useState, useEffect } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns'
import { es } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import {
  IconChevronLeft,
  IconChevronRight,
  IconCalendar,
  IconPlus,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/app/contexts/AuthContext'
import { DashboardLayout } from '@/app/components/Dashboard/DashboardLayout'

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
  const { user } = useAuth()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<DayEvents[]>([])
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[]>([])
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date())
  const [loading, setLoading] = useState(true)

  const fetchCalendar = async () => {
    setLoading(true)
    try {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      const response = await fetch(`/api/admin/calendar?year=${year}&month=${month}`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data.calendar)

        // Update selected day events if it's the same month
        if (selectedDay) {
          const dateStr = format(selectedDay, 'yyyy-MM-dd')
          const selectedEvents = data.calendar.find((e: DayEvents) => e.date === dateStr)?.events || []
          setSelectedDayEvents(selectedEvents)
        }
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

  const handlePreviousMonth = () => setCurrentDate(prev => subMonths(prev, 1))
  const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1))

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
    <DashboardLayout title="Calendario">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#F49E2C]">
            <span onClick={() => router.push('/admin')} className="hover:underline cursor-pointer">Dashboard</span>
            <span className="text-dashboard-card-border">/</span>
            <span className="text-dashboard-text-muted font-medium tracking-normal capitalize">Calendario</span>
          </nav>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-dashboard-text-primary tracking-tight transition-colors duration-300">Programación Mensual</h1>
            <div className="flex items-center bg-dashboard-card rounded-xl p-1 border border-dashboard-card-border shadow-sm">
              <button
                onClick={handlePreviousMonth}
                className="w-8 h-8 flex items-center justify-center text-dashboard-text-secondary hover:bg-[#F49E2C]/20 hover:text-[#F49E2C] rounded-lg transition-all"
              >
                <IconChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-4 min-w-[140px] text-center">
                <span className="text-dashboard-text-primary font-bold text-xs capitalize tracking-wider">
                  {format(currentDate, 'MMMM yyyy', { locale: es })}
                </span>
              </div>
              <button
                onClick={handleNextMonth}
                className="w-8 h-8 flex items-center justify-center text-dashboard-text-secondary hover:bg-[#F49E2C]/20 hover:text-[#F49E2C] rounded-lg transition-all"
              >
                <IconChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={() => router.push('/new-request')}
          className="px-5 py-2.5 bg-[#F49E2C] text-[#16233B] rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#F49E2C]/20 shrink-0"
        >
          <IconPlus className="w-5 h-5" />
          NUEVO EVENTO
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[600px]">
        {/* Calendar Grid Section */}
        <div className="lg:col-span-8 bg-dashboard-card backdrop-blur-md rounded-2xl border border-dashboard-card-border overflow-hidden shadow-2xl flex flex-col transition-all duration-300">
          <div className="grid grid-cols-7 border-b border-dashboard-card-border bg-dashboard-bg/50">
            {['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'].map(day => (
              <div key={day} className="py-3 text-center text-[10px] font-black text-dashboard-text-muted tracking-widest">{day}</div>
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
                    "min-h-[100px] p-2 border-r border-b border-dashboard-card-border cursor-pointer transition-all hover:bg-dashboard-card-border/10 group relative",
                    !isCurrentMonth && "opacity-20 bg-dashboard-bg",
                    isSelected && "bg-decom-primary/10 ring-1 ring-inset ring-[#F49E2C]/30"
                  )}
                >
                  <span className={cn(
                    "text-xs font-bold",
                    isToday ? "bg-[#F49E2C] text-[#16233B] px-2 py-1 rounded-md shadow-sm" : "text-dashboard-text-muted"
                  )}>
                    {format(day, 'd')}
                  </span>

                  <div className="mt-2 space-y-1">
                    {dayEvents.slice(0, 3).map(event => (
                      <div key={event.id} className="text-[10px] bg-decom-primary/20 border border-decom-primary/10 rounded-md p-1 truncate text-dashboard-text-primary font-medium transition-colors">
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
          <div className="bg-dashboard-card backdrop-blur-md rounded-2xl border border-dashboard-card-border p-6 flex-1 flex flex-col shadow-xl transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-sm font-black text-[#F49E2C] uppercase tracking-[0.2em] mb-1 transition-all">
                {selectedDay ? format(selectedDay, "eeee, d 'de' MMMM", { locale: es }) : 'Selecciona un día'}
              </h3>
              <div className="h-1 w-12 bg-[#F49E2C] rounded-full" />
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[400px] lg:max-h-none">
              {loading ? (
                [1, 2, 3].map(i => <div key={i} className="h-20 bg-dashboard-card-border/10 rounded-xl animate-pulse" />)
              ) : selectedDayEvents.length > 0 ? (
                selectedDayEvents.map(event => (
                  <div
                    key={event.id}
                    onClick={() => router.push(`/admin/requests/${event.id}`)}
                    className="p-4 bg-dashboard-bg/50 border border-dashboard-card-border rounded-xl hover:bg-decom-primary/10 group transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] font-black text-[#F49E2C] uppercase tracking-widest">{event.committee.name}</span>
                      <div className="size-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                    </div>
                    <h4 className="text-xs font-bold text-dashboard-text-primary group-hover:text-[#F49E2C] transition-colors">{event.event_name}</h4>
                    <div className="mt-2 flex items-center gap-3 text-dashboard-text-muted text-[10px]">
                      <span className="flex items-center gap-1 font-bold">
                        <IconCalendar className="w-3 h-3" />
                        EVENTO
                      </span>
                      <span className="uppercase font-bold tracking-tighter bg-dashboard-card-border/50 px-1.5 py-0.5 rounded">{event.material_type}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-20 text-center py-20">
                  <IconCalendar className="w-16 h-16 mb-4" />
                  <p className="text-xs font-black uppercase tracking-widest text-dashboard-text-primary">Sin eventos programados</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Summary Card */}
          <div className="p-5 bg-gradient-to-br from-[#15539C] to-decom-primary rounded-2xl border border-dashboard-card-border shadow-lg transition-all duration-300">
            <p className="text-[10px] font-black text-[#F49E2C] uppercase tracking-widest mb-1">Resumen del Mes</p>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-black text-white leading-none">{events.reduce((acc, curr) => acc + curr.count, 0)}</div>
              <div className="text-[10px] font-bold text-white/50 mb-1">TOTAL SOLICITUDES</div>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-[#F49E2C] transition-all duration-1000"
                style={{ width: `${Math.min(100, (events.reduce((acc, curr) => acc + curr.count, 0) / 20) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
