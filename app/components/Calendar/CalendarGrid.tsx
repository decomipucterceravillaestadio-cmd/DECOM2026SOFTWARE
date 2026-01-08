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
      pending: 'bg-decom-secondary',
      in_progress: 'bg-decom-primary-light',
      completed: 'bg-decom-success',
      approved: 'bg-decom-success',
      rejected: 'bg-red-500',
    }

    // Mostrar máximo 3 dots
    const uniqueStatuses = [...new Set(dayEvents.map(event => event.status))].slice(0, 3)

    return (
      <div className="flex gap-1 mt-1 justify-center">
        {uniqueStatuses.map((status) => (
          <div
            key={status}
            className={`w-[6px] h-[6px] rounded-full ${statusColors[status] || 'bg-gray-400'}`}
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
    <div className="bg-white dark:bg-[#1e1e2d] rounded-xl shadow-md overflow-hidden">
      {/* Header de días de la semana */}
      <div className="grid grid-cols-7 bg-decom-primary-light border-b border-decom-primary-light/10">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
          <div
            key={day}
            className="h-9 flex items-center justify-center text-white text-[11px] font-bold uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid de días */}
      <div className="grid grid-cols-7 p-2 gap-y-2">
        {calendarDays.map((day, index) => {
          if (!day) {
            return (
              <div
                key={`empty-${index}`}
                className="h-14 flex flex-col items-center justify-start py-1 opacity-30"
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
              className={`
                h-14 flex flex-col items-center justify-start py-1 relative group cursor-pointer rounded-lg
                transition-all duration-200
                ${isCurrentDay 
                  ? 'border-[2px] border-secondary bg-white dark:bg-transparent' 
                  : 'hover:bg-gray-50 dark:hover:bg-white/5'
                }
                ${isSelected 
                  ? 'bg-secondary/10 dark:bg-secondary/20 ring-1 ring-inset ring-secondary/30' 
                  : ''
                }
              `}
            >
              <span
                className={`
                  text-sm font-medium
                  ${isCurrentDay || isSelected ? 'font-bold' : ''}
                  text-decom-primary dark:text-white
                `}
              >
                {format(day, 'd')}
              </span>
              {getStatusDots(dayEvents)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
