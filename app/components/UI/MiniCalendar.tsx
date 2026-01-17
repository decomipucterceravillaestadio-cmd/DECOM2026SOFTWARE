'use client'

import React, { useState } from 'react'
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
import { cn } from '@/lib/utils'

interface MiniCalendarEvent {
  id: string
  event_name: string
  event_date: string
  status: string
}

interface MiniCalendarProps {
  events?: MiniCalendarEvent[]
  onDateSelect?: (date: Date) => void
  selectedDate?: Date
  className?: string
}

export default function MiniCalendar({
  events = [],
  onDateSelect,
  selectedDate,
  className = ""
}: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Obtener el día de la semana del primer día (0 = domingo, ajustar a lunes = 0)
  const firstDayOfWeek = (monthStart.getDay() + 6) % 7

  // Crear array con días vacíos al inicio
  const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => null)

  // Combinar días vacíos con días del mes
  const calendarDays = [...emptyDays, ...daysInMonth]

  // Función para obtener el conteo de eventos de un día
  const getEventCount = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.event_date), date)).length
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev =>
      direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1)
    )
  }

  return (
    <div className={cn(
      "bg-dashboard-card rounded-2xl border border-dashboard-card-border p-5 shadow-sm transition-all",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-decom-secondary/10 rounded-lg text-decom-secondary">
            <IconCalendar className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-dashboard-text-primary">
            Calendario
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-1.5 hover:bg-dashboard-bg rounded-lg transition-colors text-dashboard-text-secondary"
            aria-label="Mes anterior"
          >
            <IconChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-1.5 hover:bg-dashboard-bg rounded-lg transition-colors text-dashboard-text-secondary"
            aria-label="Mes siguiente"
          >
            <IconChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Month/Year */}
      <div className="text-left mb-4 px-1">
        <h4 className="text-sm font-bold text-dashboard-text-primary capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h4>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map((day, idx) => (
          <div key={idx} className="text-center">
            <span className="text-[10px] font-bold text-dashboard-text-muted uppercase">
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
          const isSelected = selectedDate && isSameDay(day, selectedDate)

          return (
            <button
              key={idx}
              onClick={() => onDateSelect?.(day)}
              className={cn(
                "aspect-square text-[11px] relative flex items-center justify-center rounded-xl transition-all",
                "hover:bg-decom-secondary/10 hover:text-decom-secondary",
                isCurrentDay && !isSelected && "bg-decom-secondary/10 text-decom-secondary font-bold ring-1 ring-decom-secondary/30",
                isSelected && "bg-decom-secondary text-white font-bold shadow-lg shadow-decom-secondary/20",
                !isCurrentDay && !isSelected && "text-dashboard-text-secondary"
              )}
            >
              {format(day, 'd')}
              {dayEvents > 0 && !isSelected && (
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-decom-secondary rounded-full shadow-sm" />
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      {events.length > 0 && (
        <div className="mt-4 pt-4 border-t border-dashboard-card-border">
          <div className="flex items-center gap-2 text-xs text-dashboard-text-secondary">
            <div className="w-2 h-2 bg-decom-secondary rounded-full" />
            <span className="font-medium">{events.length} evento{events.length !== 1 ? 's' : ''} este mes</span>
          </div>
        </div>
      )}
    </div>
  )
}