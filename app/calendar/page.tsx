'use client'

import { useState, useEffect } from 'react'
import { format, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import { 
  IconChevronLeft, 
  IconChevronRight,
  IconCalendar,
  IconAlertCircle,
  IconInfoCircle
} from '@tabler/icons-react'
import CalendarGrid from '@/app/components/Calendar/CalendarGrid'
import { Badge } from '@/app/components/UI/Badge'
import { Button } from '@/app/components/UI/Button'
import { Card } from '@/app/components/UI/Card'

interface PublicCalendarEvent {
  id: string
  event_date: string
  status: string
  priority_score: number | null
  material_type: string
}

interface PublicDayEvents {
  date: string
  count: number
  events: PublicCalendarEvent[]
}

interface Stats {
  total: number
  byStatus: {
    pending: number
    in_progress: number
    completed: number
  }
  byType: {
    flyer: number
    banner: number
    video: number
    redes_sociales: number
    otro: number
  }
}

export default function PublicCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<PublicDayEvents[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchCalendar = async () => {
    setLoading(true)
    try {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      
      const response = await fetch(`/api/public/calendar?year=${year}&month=${month}`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data.calendar)
        setStats(data.stats)
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

  const getMaterialTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      flyer: 'Flyer',
      banner: 'Banner',
      video: 'Video',
      redes_sociales: 'Redes Sociales',
      otro: 'Otro'
    }
    return labels[type] || type
  }

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <IconCalendar className="h-10 w-10 text-violet-500" />
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
              Calendario Público DECOM
            </h1>
          </div>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Visualiza la carga de trabajo del Departamento de Comunicaciones
          </p>
        </div>

        {/* Card informativa */}
        <Card className="mb-8 bg-violet-50 dark:bg-violet-950 border-violet-200 dark:border-violet-800">
          <div className="flex gap-4">
            <IconInfoCircle className="h-6 w-6 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-violet-900 dark:text-violet-100 mb-2">
                ¿Cómo funciona este calendario?
              </h3>
              <p className="text-sm text-violet-800 dark:text-violet-200">
                Este calendario muestra la carga de trabajo actual del equipo DECOM. 
                Puedes ver cuántas solicitudes hay pendientes cada día del mes. 
                Te sugerimos elegir fechas con menor carga para una respuesta más rápida.
              </p>
            </div>
          </div>
        </Card>

        {/* Estadísticas */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <div className="text-center">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  Total Solicitudes
                </p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {stats.total}
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  Pendientes
                </p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.byStatus.pending}
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  En Progreso
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.byStatus.in_progress}
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  Completadas
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.byStatus.completed}
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Controles del calendario */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePreviousMonth}
              className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            >
              <IconChevronLeft className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 capitalize">
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
            events={events.map(e => ({
              date: e.date,
              count: e.count,
              events: e.events.map(evt => ({
                id: evt.id,
                event_name: `Evento ${evt.id.slice(0, 8)}`,
                event_date: evt.event_date,
                status: evt.status,
                priority_score: evt.priority_score,
                material_type: evt.material_type,
                committee: {
                  name: getMaterialTypeLabel(evt.material_type),
                  color_badge: 'neutral'
                }
              }))
            }))}
            onDaySelect={() => {}}
          />
        )}

        {/* Leyenda */}
        <div className="mt-8 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Leyenda de Estados
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Pendiente de revisión
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                En proceso de diseño
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Completada
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Card className="bg-gradient-to-r from-violet-500 to-purple-600 border-0">
            <div className="text-white py-8">
              <h3 className="text-2xl font-bold mb-2">
                ¿Necesitas material gráfico?
              </h3>
              <p className="mb-6 text-violet-100">
                Envía tu solicitud y nosotros nos encargamos del resto
              </p>
              <Button
                onClick={() => window.location.href = '/new-request'}
                variant="primary"
                className="bg-white text-violet-600 hover:bg-neutral-100"
              >
                Crear Nueva Solicitud
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
