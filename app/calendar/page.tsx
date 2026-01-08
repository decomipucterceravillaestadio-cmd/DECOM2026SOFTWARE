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
  IconArrowLeft,
  IconX,
  IconPinned,
  IconCheck,
  IconFileDescription,
  IconClock
} from '@tabler/icons-react'
import CalendarGrid from '@/app/components/Calendar/CalendarGrid'
import { Badge } from '@/app/components/UI/Badge'
import { Button } from '@/app/components/UI/Button'
import { Card } from '@/app/components/UI/Card'

interface PublicCalendarEvent {
  id: string
  event_name: string
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

export default function CalendarPage() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<PublicDayEvents[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [selectedDayEvents, setSelectedDayEvents] = useState<PublicCalendarEvent[]>([])

  useEffect(() => {
    const fetchCalendar = async () => {
      setLoading(true)
      try {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth() + 1

        const response = await fetch(`/api/public/calendar?year=${year}&month=${month}`)
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

    fetchCalendar()
  }, [currentDate])

  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1))
  }

  const handleDaySelect = (date: Date, dayEvents: PublicCalendarEvent[]) => {
    setSelectedDay(date)
    setSelectedDayEvents(dayEvents)
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

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'Pendiente': 'Pendiente',
      'En planificación': 'En Planificación',
      'En diseño': 'En Diseño',
      'Lista para entrega': 'Lista para Entrega',
      'Entregada': 'Entregada'
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Pendiente': 'bg-orange-100 text-orange-800 border-orange-200',
      'En planificación': 'bg-blue-100 text-blue-800 border-blue-200',
      'En diseño': 'bg-purple-100 text-purple-800 border-purple-200',
      'Lista para entrega': 'bg-green-100 text-green-800 border-green-200',
      'Entregada': 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
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
        <div className="mb-6 md:mb-8 flex flex-col items-start gap-4">
          <div className="w-full">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-[#F49E2C] hover:text-white font-semibold mb-4 transition-colors"
            >
              <IconArrowLeft className="w-5 h-5" />
              Volver atrás
            </button>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">
              Calendario Público DECOM
            </h1>
            <p className="text-base md:text-lg text-white/80">
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

        {/* Controles del calendario */}
        {/* Controles del calendario */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-sm border border-white/20">
          <div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:gap-4">
            <button
              onClick={handlePreviousMonth}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors text-[#F49E2C] active:scale-95"
              title="Mes anterior"
            >
              <IconChevronLeft className="w-6 h-6 font-bold" />
            </button>

            <h2 className="text-xl sm:text-2xl font-bold text-white capitalize text-center min-w-[140px] sm:min-w-[200px]">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h2>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors text-[#F49E2C] active:scale-95"
              title="Próximo mes"
            >
              <IconChevronRight className="w-6 h-6 font-bold" />
            </button>
          </div>

          <button
            onClick={() => setCurrentDate(new Date())}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-[#15539C] to-[#16233B] hover:shadow-lg text-white font-bold transition-all text-sm sm:text-base flex items-center justify-center gap-2"
            title="Ir a hoy"
          >
            <span>Hoy</span>
            <IconCalendar className="w-5 h-5" />
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
                event_name: evt.event_name || `Evento ${evt.id.slice(0, 8)}`,
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
            onDaySelect={handleDaySelect}
            selectedDay={selectedDay}
          />
        )}

        {/* Eventos del día seleccionado */}
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <Card className="bg-[#F5F5F5] backdrop-blur-2xl border border-white/40 shadow-2xl overflow-hidden rounded-3xl">
              {/* Header con gradiente */}
              <div className="relative p-6 md:p-8 bg-gradient-to-br from-[#16233B] to-[#15539C] overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 transform rotate-12" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -ml-10 -mb-10" />

                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start md:items-center gap-4 md:gap-5 w-full md:w-auto">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner flex-shrink-0">
                      <IconCalendar className="w-6 h-6 md:w-8 md:h-8 text-[#F49E2C]" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight capitalize">
                        {selectedDay && format(selectedDay, 'd \'de\' MMMM', { locale: es })} <span className="hidden md:inline md:text-xl lg:text-3xl opacity-60 font-normal">{selectedDay && format(selectedDay, 'yyyy')}</span>
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F49E2C] text-xs font-bold text-[#16233B]">
                          {selectedDayEvents.length}
                        </span>
                        <p className="text-white/90 font-medium text-sm md:text-lg">
                          {selectedDayEvents.length === 1 ? 'evento programado' : 'eventos programados'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDay(null)
                      setSelectedDayEvents([])
                    }}
                    className="absolute top-0 right-0 md:relative w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/25 transition-all flex items-center justify-center text-white border border-white/10 hover:border-white/40"
                    title="Cerrar vista"
                  >
                    <IconX className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:rotate-90" />
                  </button>
                </div>
              </div>

              {selectedDayEvents.length > 0 ? (
                <div className="p-6 md:p-8 space-y-6 bg-gradient-to-b from-white to-[#F5F5F5]">
                  {selectedDayEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#15539C]/10"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Columna Principal - Info Evento */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#16233B]/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[#15539C]/10 transition-colors">
                              <IconPinned className="w-6 h-6 text-[#15539C]" />
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-[#16233B] leading-tight mb-1 group-hover:text-[#15539C] transition-colors">
                                {event.event_name}
                              </h4>
                              <span className="inline-block px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-500 font-mono text-xs font-medium tracking-wide">
                                {event.id.slice(0, 8)}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 pt-2">
                            {/* Estado */}
                            <div className="bg-[#F8F9FB] p-3 rounded-xl border border-gray-100/50">
                              <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Estado</div>
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded-full bg-green-100 flex-shrink-0" >
                                  <IconCheck className="w-3 h-3 text-green-600" />
                                </div>
                                <span className="font-semibold text-gray-700 text-sm truncate">
                                  {getStatusLabel(event.status)}
                                </span>
                              </div>
                            </div>

                            {/* Tipo Mateial */}
                            <div className="bg-[#F8F9FB] p-3 rounded-xl border border-gray-100/50">
                              <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Material</div>
                              <div className="flex items-center gap-2">
                                <IconFileDescription className="w-4 h-4 text-[#15539C] flex-shrink-0" />
                                <span className="font-semibold text-gray-700 text-sm truncate">
                                  {getMaterialTypeLabel(event.material_type)}
                                </span>
                              </div>
                            </div>

                            {/* Fase */}
                            <div className="bg-[#F8F9FB] p-3 rounded-xl border border-gray-100/50 col-span-1 sm:col-span-2 lg:col-span-1">
                              <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Fase Actual</div>
                              <div className="flex items-center gap-2">
                                <IconClock className="w-4 h-4 text-[#F49E2C] flex-shrink-0" />
                                <span className="font-semibold text-gray-700 text-sm truncate">
                                  {getStatusLabel(event.status)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Columna Lateral - Prioridad */}
                        {event.priority_score && (
                          <div className="w-full md:w-48 flex-shrink-0 mt-4 md:mt-0">
                            <div className="h-full bg-gradient-to-br from-[#FFF8E1] to-[#FFF3E0] rounded-xl p-4 border border-[#FFE0B2] flex flex-row md:flex-col items-center justify-between md:justify-center text-center gap-3 md:gap-1">
                              <span className="text-xs font-bold text-[#F57C00] uppercase tracking-wider">Prioridad</span>
                              <div className="flex items-center gap-2 md:block">
                                <div className="text-2xl md:text-3xl font-black text-[#F49E2C] leading-none">
                                  {event.priority_score}<span className="text-sm md:text-lg text-[#FFCC80] font-bold">/10</span>
                                </div>
                              </div>
                              <div className="w-24 md:w-full h-2 md:h-1.5 bg-[#FFE0B2] rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#F49E2C] rounded-full"
                                  style={{ width: `${event.priority_score * 10}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="relative text-center py-20 px-6 bg-[#F5F5F5]">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-lg mb-6">
                    <IconCalendar className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-[#16233B] mb-2">Día libre de eventos</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    No hay solicitudes programadas para esta fecha. Es un buen momento para agendar nuevos requerimientos.
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
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
