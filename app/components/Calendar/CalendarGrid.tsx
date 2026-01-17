'use client'

import React from 'react'
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'

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

interface CalendarGridProps {
  selectedDate: Date
  events: DayEvents[]
  onDaySelect: (date: Date, events: CalendarEvent[]) => void
  selectedDay?: Date | null
}

export default function CalendarGrid({ selectedDate, events, onDaySelect, selectedDay }: CalendarGridProps) {
  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Obtener el día de la semana del primer día (0 = domingo, ajustar a lunes = 0)
  const firstDayOfWeek = (monthStart.getDay() + 6) % 7

  // Crear array con días vacíos al inicio
  const calendarDays = Array(firstDayOfWeek).fill(null).concat(daysInMonth)

  const getEventsForDay = (date: Date): CalendarEvent[] => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const dayData = events.find(e => e.date === dateStr)
    return dayData?.events || []
  }

  const getStatusDots = (dayEvents: CalendarEvent[]) => {
    if (dayEvents.length === 0) return null

    const statusColors: Record<string, string> = {
      'Pendiente': 'bg-decom-secondary shadow-[0_0_5px_rgba(244,158,44,0.5)]',
      'En planificación': 'bg-decom-primary-light shadow-[0_0_5px_rgba(21,83,156,0.5)]',
      'En diseño': 'bg-purple-500 shadow-[0_0_5px_rgba(147,51,234,0.5)]',
      'Lista para entrega': 'bg-decom-success shadow-[0_0_5px_rgba(16,185,129,0.5)]',
      'Entregada': 'bg-gray-500 shadow-[0_0_5px_rgba(107,114,128,0.5)]',
    }

    // Mostrar máximo 3 dots
    const uniqueStatuses = [...new Set(dayEvents.map(event => event.status))].slice(0, 3)

    return (
      <div className="flex gap-1.5 mt-2 justify-center">
        {uniqueStatuses.map((status) => (
          <div
            key={status}
            className={cn("w-1.5 h-1.5 rounded-full", statusColors[status] || 'bg-dashboard-text-muted')}
            title={status}
          />
        ))}
      </div>
    )
  }

  const isDaySelected = (date: Date) => {
    return selectedDay && isSameDay(date, selectedDay)
  }

  return (
    <div className="bg-dashboard-card rounded-2xl shadow-xl border border-dashboard-card-border overflow-hidden">
      <div className="min-w-[340px]">
        {/* Header de días de la semana */}
        <div className="grid grid-cols-7 bg-dashboard-bg/50 border-b border-dashboard-card-border">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
            <div
              key={day}
              className="h-12 flex items-center justify-center text-dashboard-text-muted text-[11px] font-black uppercase tracking-[0.2em]"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid de días */}
        <div className="grid grid-cols-7 p-3 gap-2">
          {calendarDays.map((day, index) => {
            if (!day) {
              return (
                <div
                  key={`empty-${index}`}
                  className="h-16 md:h-20 lg:h-24 flex flex-col items-center justify-start py-1 opacity-10"
                />
              )
            }

            const dayEvents = getEventsForDay(day)
            const isCurrentDay = isToday(day)
            const isSelected = isDaySelected(day)

            return (
              <button
                key={day.toString()}
                onClick={() => onDaySelect(day, dayEvents)}
                className={cn(
                  "h-16 md:h-20 lg:h-24 flex flex-col items-center justify-start py-3 relative group transition-all duration-300 rounded-xl overflow-hidden",
                  "border border-transparent",
                  isCurrentDay && !isSelected && "bg-decom-secondary/5 border-decom-secondary/20",
                  isSelected && "bg-decom-secondary text-white shadow-xl shadow-decom-secondary/20",
                  !isCurrentDay && !isSelected && "hover:bg-dashboard-bg hover:border-dashboard-card-border",
                  dayEvents.length > 0 && "cursor-pointer"
                )}
              >
                {/* Background number effect */}
                <span className={cn(
                  "absolute bottom-0 right-1 text-4xl font-black opacity-[0.03] select-none",
                  isSelected && "opacity-[0.1]"
                )}>
                  {format(day, 'd')}
                </span>

                <span
                  className={cn(
                    "text-sm font-bold relative z-10",
                    isCurrentDay && !isSelected && "text-decom-secondary",
                    isSelected ? "text-white" : "text-dashboard-text-primary",
                    dayEvents.length > 0 && !isSelected && "group-hover:scale-110 transition-transform"
                  )}
                >
                  {format(day, 'd')}
                </span>

                <div className="relative z-10 w-full">
                  {getStatusDots(dayEvents)}
                </div>

                {dayEvents.length > 0 && (
                  <div className={cn(
                    "absolute top-2 right-2 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-black z-20 shadow-sm",
                    isSelected ? "bg-white text-decom-secondary" : "bg-dashboard-bg text-dashboard-text-primary border border-dashboard-card-border"
                  )}>
                    {dayEvents.length}
                  </div>
                )}

                {/* Current day indicator dot */}
                {isCurrentDay && !isSelected && (
                  <div className="absolute top-1 left-1.5 w-1 h-1 bg-decom-secondary rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
