'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { 
  IconChevronLeft, 
  IconChevronRight,
  IconCalendar,
  IconAlertCircle,
  IconInfoCircle,
  IconArrowLeft
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
  const router = useRouter()
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
    <div className="min-h-screen bg-gradient-to-b from-[#16233B] via-[#15539C] to-[#1a2847]">
      {/* Animated Background Beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-[#F49E2C]/15 rounded-full blur-3xl"
          animate={{
            x: [0, 60, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#F49E2C]/20 rounded-full blur-3xl"
          animate={{
            x: [0, -60, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Botón de regreso y header */}
        <div className="mb-8 flex items-start justify-between">
          <div className="flex-1">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-[#F49E2C] hover:text-white font-semibold mb-4 transition-colors"
            >
              <IconArrowLeft className="w-5 h-5" />
              Volver atrás
            </button>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Calendario Público DECOM
            </h1>
            <p className="text-lg text-white/80">
              Visualiza la carga de trabajo y planifica tus solicitudes
            </p>
          </div>
        </div>

        {/* Card informativa */}
        <Card className="mb-8 bg-white/10 backdrop-blur-md border border-white/20 border-l-4 border-l-[#F49E2C]">
          <div className="flex gap-4">
            <IconInfoCircle className="h-6 w-6 text-[#F49E2C] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-white mb-2 text-lg">
                ¿Cómo funciona este calendario?
              </h3>
              <p className="text-base text-white/80">
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
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 border-t-4 border-t-[#16233B]">
              <div className="text-center">
                <p className="text-sm text-white/80 font-semibold mb-1">
                  Total Solicitudes
                </p>
                <p className="text-3xl font-bold text-white">
                  {stats.total}
                </p>
              </div>
            </Card>
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <div className="text-center">
                <p className="text-sm text-white/80 font-semibold mb-1">
                  Pendientes
                </p>
                <p className="text-3xl font-bold text-[#F49E2C]">
                  {stats.byStatus.pending}
                </p>
              </div>
            </Card>
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 border-t-4 border-t-[#15539C]">
              <div className="text-center">
                <p className="text-sm text-white/80 font-semibold mb-1">
                  En Progreso
                </p>
                <p className="text-3xl font-bold text-[#F49E2C]">
                  {stats.byStatus.in_progress}
                </p>
              </div>
            </Card>
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 border-t-4 border-t-[#4CAF50]">
              <div className="text-center">
                <p className="text-sm text-white/80 font-semibold mb-1">
                  Completadas
                </p>
                <p className="text-3xl font-bold text-[#4CAF50]">
                  {stats.byStatus.completed}
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Controles del calendario */}
        <div className="flex items-center justify-between mb-6 bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-sm border border-white/20">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePreviousMonth}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors text-[#F49E2C]"
              title="Mes anterior"
            >
              <IconChevronLeft className="w-6 h-6 font-bold" />
            </button>
            
            <h2 className="text-2xl font-bold text-white capitalize min-w-[200px]">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h2>
            
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors text-[#F49E2C]"
              title="Próximo mes"
            >
              <IconChevronRight className="w-6 h-6 font-bold" />
            </button>
          </div>

          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#15539C] to-[#16233B] hover:shadow-lg text-white font-bold transition-all"
          >
            Hoy
          </button>
        </div>

        {/* Calendario */}
        {loading ? (
          <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />
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
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
          <h3 className="font-semibold text-white mb-4 text-lg">
            Leyenda de Estados
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#F49E2C]" />
              <span className="text-sm text-white/80 font-medium">
                Pendiente de revisión
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#15539C]" />
              <span className="text-sm text-white/80 font-medium">
                En proceso de diseño
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#4CAF50]" />
              <span className="text-sm text-white/80 font-medium">
                Completada
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Card className="bg-gradient-to-r from-[#15539C] to-[#16233B] border-0">
            <div className="text-white py-8">
              <h3 className="text-2xl font-bold mb-2">
                ¿Necesitas material gráfico?
              </h3>
              <p className="mb-6 text-white/90">
                Envía tu solicitud y nosotros nos encargamos del resto
              </p>
              <button
                onClick={() => window.location.href = '/new-request'}
                className="px-8 py-3 rounded-lg bg-white text-[#15539C] hover:bg-gray-100 font-bold transition-all hover:shadow-lg active:scale-95"
              >
                Crear Nueva Solicitud
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
