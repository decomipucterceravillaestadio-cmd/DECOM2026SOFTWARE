'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Badge } from '@/app/components/UI/Badge'
import { Button } from '@/app/components/UI/Button'
import {
  IconX,
  IconClock,
  IconBrandWhatsapp,
  IconCalendarEvent,
  IconTimeline,
  IconHistory,
  IconUser,
  IconFileText,
  IconMessageCircle,
  IconInfoCircle,
  IconFlag,
  IconPalette,
  IconSend
} from '@tabler/icons-react'
import { generateWhatsAppLink } from '@/app/lib/utils/whatsapp'

interface RequestDetail {
  id: string
  event_name: string
  event_date: string
  event_info: string
  material_type: string
  contact_whatsapp: string
  include_bible_verse: boolean
  bible_verse_text: string | null
  status: string
  priority_score: number | null
  planning_start_date: string | null
  delivery_date: string | null
  visible_in_public_calendar: boolean
  committee: {
    id: string
    name: string
    description: string | null
    color_badge: string
  }
  creator: {
    id: string
    full_name: string
    email: string
  }
  history: Array<{
    id: string
    old_status: string | null
    new_status: string
    change_reason: string | null
    changed_at: string
    changed_by_user: {
      full_name: string
      email: string
    } | null
  }>
  created_at: string
}

interface RequestDetailModalProps {
  requestId: string | null
  onClose: () => void
  onUpdate: () => void
  embedded?: boolean // Si es true, no muestra overlay y usa diseño de página
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'completed': return 'bg-green-100 text-green-700 border-green-200'
    case 'approved': return 'bg-purple-100 text-purple-700 border-purple-200'
    case 'rejected': return 'bg-red-100 text-red-700 border-red-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return 'Pendiente'
    case 'in_progress': return 'En Progreso'
    case 'completed': return 'Completado'
    case 'approved': return 'Aprobado'
    case 'rejected': return 'Rechazado'
    default: return status
  }
}

const getPriorityColor = (priority: number | null) => {
  if (!priority) return 'bg-gray-100 text-gray-600'
  if (priority >= 8) return 'bg-red-100 text-red-700 font-bold'
  if (priority >= 5) return 'bg-orange-100 text-orange-700 font-bold'
  return 'bg-green-100 text-green-700 font-bold'
}

export default function RequestDetailModal({
  requestId,
  onClose,
  onUpdate,
  embedded = false
}: RequestDetailModalProps) {
  const [request, setRequest] = useState<RequestDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [changeReason, setChangeReason] = useState('')
  const [visibleInPublicCalendar, setVisibleInPublicCalendar] = useState(true)

  useEffect(() => {
    if (!requestId) {
      setRequest(null)
      return
    }

    const fetchRequest = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/admin/requests/${requestId}`)
        if (response.ok) {
          const data = await response.json()
          setRequest(data)
          setNewStatus(data.status)
          setVisibleInPublicCalendar(data.visible_in_public_calendar ?? true)
        }
      } catch (error) {
        console.error('Error fetching request:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequest()
  }, [requestId])

  const handleUpdateStatus = async () => {
    if (!request || (newStatus === request.status && visibleInPublicCalendar === request.visible_in_public_calendar)) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/admin/requests/${request.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          visible_in_public_calendar: visibleInPublicCalendar,
          change_reason: changeReason || undefined
        })
      })

      if (response.ok) {
        onUpdate()
        onClose()
      }
    } catch (error) {
      console.error('Error updating request:', error)
    } finally {
      setUpdating(false)
    }
  }

  if (!requestId) return null

  // Contenedor diferente según si está embebido o es modal
  const Container = embedded ? 'div' : 'div'
  const containerClasses = embedded 
    ? "bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-full flex flex-col border border-neutral-200 dark:border-neutral-800"
    : "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"

  const contentClasses = embedded
    ? "w-full"
    : "bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-neutral-200 dark:border-neutral-800"

  return (
    <div className={containerClasses}>
      <div className={contentClasses}>

        {/* Header */}
        <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              Detalle de Solicitud
            </h2>
            {request && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>
                {getStatusLabel(request.status)}
              </span>
            )}
          </div>
          {!embedded && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-neutral-500 hover:text-neutral-700"
            >
              <IconX className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-neutral-100 dark:bg-neutral-800 rounded-xl animate-pulse" />
                ))}
              </div>
              <div className="h-64 bg-neutral-100 dark:bg-neutral-800 rounded-xl animate-pulse" />
            </div>
          ) : request ? (
            <div className="p-4 md:p-6 lg:p-8 space-y-8">

              {/* Top Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-3 md:p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-2 text-neutral-500 mb-1">
                    <IconCalendarEvent className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Fecha Evento</span>
                  </div>
                  <p className="text-sm md:text-base font-bold text-neutral-900 dark:text-neutral-100">
                    {format(new Date(request.event_date), 'dd MMM yyyy', { locale: es })}
                  </p>
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-3 md:p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-2 text-neutral-500 mb-1">
                    <IconUser className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Comité</span>
                  </div>
                  <p className="text-sm md:text-base font-bold text-neutral-900 dark:text-neutral-100 truncate">
                    {request.committee.name}
                  </p>
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-3 md:p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-2 text-neutral-500 mb-1">
                    <IconPalette className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Material</span>
                  </div>
                  <p className="text-sm md:text-base font-bold text-neutral-900 dark:text-neutral-100 capitalize">
                    {request.material_type}
                  </p>
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-3 md:p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-2 text-neutral-500 mb-1">
                    <IconFlag className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Prioridad</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-sm ${getPriorityColor(request.priority_score)}`}>
                      {request.priority_score || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                  {/* Event Details */}
                  <section>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                      <IconInfoCircle className="w-5 h-5 text-blue-600" />
                      Información del Solicitud
                    </h3>

                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-6">
                      <div>
                        <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-1.5">
                          Nombre del Evento
                        </label>
                        <h4 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                          {request.event_name}
                        </h4>
                      </div>

                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-1.5 no-prose">
                          Detalles y Descripción
                        </label>
                        <p className="whitespace-pre-wrap leading-relaxed text-neutral-700 dark:text-neutral-300">
                          {request.event_info}
                        </p>
                      </div>

                      {request.include_bible_verse && request.bible_verse_text && (
                        <div className="bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 p-4 rounded-r-lg">
                          <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1">
                            Versículo Bíblico
                          </label>
                          <p className="text-lg font-serif italic text-blue-900 dark:text-blue-100">
                            "{request.bible_verse_text}"
                          </p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* History Timeline - Collapsible or scrollable container could be better, for now list */}
                  <section>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                      <IconHistory className="w-5 h-5 text-purple-600" />
                      Historial de Cambios
                    </h3>

                    <div className="relative border-l-2 border-neutral-200 dark:border-neutral-800 ml-3 pl-6 space-y-6 py-2">
                      {request.history.length === 0 ? (
                        <p className="text-sm text-neutral-500 italic">No hay historial disponible.</p>
                      ) : (
                        request.history.map((entry) => (
                          <div key={entry.id} className="relative">
                            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white dark:bg-neutral-900 border-2 border-purple-500" />
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                {entry.old_status ? (
                                  <>
                                    {getStatusLabel(entry.old_status)} <span className="text-neutral-400 mx-1">→</span> {getStatusLabel(entry.new_status)}
                                  </>
                                ) : (
                                  <span>Solicitud Creada</span>
                                )}
                              </span>
                              <span className="text-xs text-neutral-500">
                                {format(new Date(entry.changed_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                              Por: <span className="font-medium">{entry.changed_by_user?.full_name || 'Sistema'}</span>
                            </p>
                            {entry.change_reason && (
                              <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 p-3 rounded-lg">
                                {entry.change_reason}
                              </p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </section>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6 md:space-y-8 lg:sticky lg:top-6 h-fit">

                  {/* Actions Card */}
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                      <IconSend className="w-5 h-5 text-indigo-600" />
                      Gestionar Estado
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">
                          Actualizar a
                        </label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="w-full px-3 py-2.5 text-base border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="in_progress">En Progreso</option>
                          <option value="completed">Completado</option>
                          <option value="approved">Aprobado</option>
                          <option value="rejected">Rechazado</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800">
                        <input
                          type="checkbox"
                          id="visibleInPublicCalendar"
                          checked={visibleInPublicCalendar}
                          onChange={(e) => setVisibleInPublicCalendar(e.target.checked)}
                          className="w-4 h-4 text-indigo-600 border-neutral-300 rounded focus:ring-2 focus:ring-indigo-500/20"
                        />
                        <label htmlFor="visibleInPublicCalendar" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer">
                          Visible en calendario público
                        </label>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">
                          Observaciones
                        </label>
                        <textarea
                          value={changeReason}
                          onChange={(e) => setChangeReason(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2.5 text-base border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                          placeholder="Motivo del cambio..."
                        />
                      </div>

                      <Button
                        onClick={handleUpdateStatus}
                        disabled={updating || (newStatus === request.status && visibleInPublicCalendar === request.visible_in_public_calendar)}
                        fullWidth
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        {updating ? 'Actualizando...' : 'Guardar Cambios'}
                      </Button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-4">
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                        Comunicación
                      </h4>
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-800">
                        <div className="flex items-center gap-3">
                          <IconBrandWhatsapp className="w-5 h-5 text-green-600" />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-green-800 dark:text-green-300">WhatsApp</span>
                            <span className="text-xs text-green-700 dark:text-green-400 font-mono truncate max-w-[120px]">
                              {request.contact_whatsapp}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => window.open(generateWhatsAppLink(request.contact_whatsapp, request.event_name), '_blank')}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 h-8"
                        >
                          Ir al Chat
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Dates Card */}
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                      <IconTimeline className="w-5 h-5 text-orange-500" />
                      Fechas Clave
                    </h3>

                    <div className="space-y-4 relative">
                      {/* Vertical line connecting dots */}
                      <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-neutral-100 dark:bg-neutral-800" />

                      <div className="relative pl-6">
                        <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-neutral-900 bg-blue-500 shadow-sm z-10" />
                        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-0.5">Inicio Planificación</span>
                        <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                          {request.planning_start_date ? format(new Date(request.planning_start_date), 'dd MMM yyyy', { locale: es }) : 'Por definir'}
                        </span>
                      </div>

                      <div className="relative pl-6">
                        <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-neutral-900 bg-orange-500 shadow-sm z-10" />
                        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-0.5">Entrega Material</span>
                        <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                          {request.delivery_date ? format(new Date(request.delivery_date), 'dd MMM yyyy', { locale: es }) : 'Por definir'}
                        </span>
                      </div>

                      <div className="relative pl-6">
                        <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-neutral-900 bg-red-500 shadow-sm z-10" />
                        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-0.5">Día del Evento</span>
                        <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                          {format(new Date(request.event_date), 'dd MMM yyyy', { locale: es })}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 mb-4">
                <IconX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                No se encontró la solicitud
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 mt-2">
                La solicitud que buscas no existe o fue eliminada.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
