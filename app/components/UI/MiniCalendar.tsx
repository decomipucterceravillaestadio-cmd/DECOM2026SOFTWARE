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
import { IconChevronLeft, IconChevronRight, IconCalendar } from '@tabler/icons-react'

interface MiniCalendarEvent {
  id: string
  event_name: string
  event_date: string
  status: string
}

interface MiniCalendarProps {
  events?: MiniCalendarEvent[]
  onDateSelect?: (date: Date) => void
  className?: string
}

export default function MiniCalendar({ events = [], onDateSelect, className = "" }: MiniCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Obtener el día de la semana del primer día (0 = domingo, ajustar a lunes = 0)
  const firstDayOfWeek = (monthStart.getDay() + 6) % 7

  // Crear array con días vacíos al inicio
  const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => null)

  // Combinar días vacíos con días del mes
  const calendarDays = [...emptyDays, ...daysInMonth]

  // Función para verificar si un día tiene eventos
  const hasEvents = (date: Date) => {
    return events.some(event => isSameDay(new Date(event.event_date), date))
  }

  // Función para obtener el conteo de eventos de un día
  const getEventCount = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.event_date), date)).length
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev =>
      direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1)
    )
  }

  return (
    <div className={`bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <IconCalendar className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
          <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            Calendario
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors"
          >
            <IconChevronLeft className="h-3 w-3 text-neutral-600 dark:text-neutral-400" />
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors"
          >
            <IconChevronRight className="h-3 w-3 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Month/Year */}
      <div className="text-center mb-3">
        <h4 className="text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
          {format(currentDate, 'MMMM yyyy', { locale: es })}
        </h4>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, idx) => (
          <div key={idx} className="text-center">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, idx) => {
          if (!day) {
            return <div key={idx} className="aspect-square" />
          }

          const dayEvents = getEventCount(day)
          const isCurrentDay = isToday(day)

          return (
            <button
              key={idx}
              onClick={() => onDateSelect?.(day)}
              className={`
                aspect-square text-xs relative flex items-center justify-center rounded
                hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors
                ${isCurrentDay
                  ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-medium'
                  : 'text-neutral-700 dark:text-neutral-300'
                }
                ${dayEvents > 0 ? 'font-medium' : ''}
              `}
            >
              {format(day, 'd')}
              {dayEvents > 0 && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-violet-500 rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      {events.length > 0 && (
        <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
            <div className="w-2 h-2 bg-violet-500 rounded-full" />
            <span>{events.length} evento{events.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}
    </div>
  )
}