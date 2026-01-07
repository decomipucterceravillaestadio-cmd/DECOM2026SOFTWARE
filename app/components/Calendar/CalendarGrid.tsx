'use client'

import { useState, useEffect } from 'react'
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  isSameDay,
  isToday,
  addMonths,
  subMonths
} from 'date-fns'
import { es } from 'date-fns/locale'

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
}

export default function CalendarGrid({ selectedDate, events, onDaySelect }: CalendarGridProps) {
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
      pending: 'bg-yellow-500',
      in_progress: 'bg-blue-500',
      completed: 'bg-green-500',
      approved: 'bg-green-600',
      rejected: 'bg-red-500',
    }

    // Agrupar por estado
    const statusCounts = dayEvents.reduce((acc, event) => {
      acc[event.status] = (acc[event.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Mostrar máximo 3 dots
    const statuses = Object.keys(statusCounts).slice(0, 3)

    return (
      <div className="flex gap-1 mt-1 justify-center">
        {statuses.map((status) => (
          <div
            key={status}
            className={`w-1.5 h-1.5 rounded-full ${statusColors[status]}`}
            title={`${statusCounts[status]} ${status}`}
          />
        ))}
        {dayEvents.length > 3 && (
          <span className="text-[10px] text-neutral-500">
            +{dayEvents.length - 3}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      {/* Header de días de la semana */}
      <div className="grid grid-cols-7 gap-px bg-neutral-200 dark:bg-neutral-800">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
          <div
            key={day}
            className="bg-neutral-50 dark:bg-neutral-900 px-2 py-3 text-center text-xs font-semibold text-neutral-600 dark:text-neutral-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid de días */}
      <div className="grid grid-cols-7 gap-px bg-neutral-200 dark:bg-neutral-800">
        {calendarDays.map((day, index) => {
          if (!day) {
            return (
              <div
                key={`empty-${index}`}
                className="bg-neutral-50 dark:bg-neutral-900 aspect-square min-h-[80px]"
              />
            )
          }

          const dayEvents = getEventsForDay(day)
          const isCurrentDay = isToday(day)

          return (
            <button
              key={day.toString()}
              onClick={() => onDaySelect(day, dayEvents)}
              className={`
                bg-white dark:bg-neutral-900 
                aspect-square min-h-[80px] p-2
                flex flex-col items-center justify-start
                hover:bg-neutral-50 dark:hover:bg-neutral-800
                transition-colors cursor-pointer
                ${isCurrentDay ? 'ring-2 ring-violet-500 ring-inset' : ''}
              `}
            >
              <span
                className={`
                  text-sm font-medium
                  ${isCurrentDay 
                    ? 'bg-violet-500 text-white rounded-full w-6 h-6 flex items-center justify-center' 
                    : 'text-neutral-900 dark:text-neutral-100'
                  }
                `}
              >
                {format(day, 'd')}
              </span>
              {getStatusDots(dayEvents)}
              {dayEvents.length > 0 && (
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-auto">
                  {dayEvents.length} evento{dayEvents.length !== 1 ? 's' : ''}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
