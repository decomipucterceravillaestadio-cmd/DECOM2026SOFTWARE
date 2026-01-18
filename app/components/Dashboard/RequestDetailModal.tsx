'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { parseLocalDate } from '@/app/lib/dateUtils'
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
  IconSend,
  IconTrash,
  IconEdit
} from '@tabler/icons-react'
import { generateWhatsAppLink } from '@/app/lib/utils/whatsapp'
import { useAuth, useHasPermission } from '@/app/contexts/AuthContext'
import { Permission } from '@/app/lib/permissions'
import DeleteConfirmationModal from '@/app/components/UI/DeleteConfirmationModal'
import EditRequestModal from './EditRequestModal'

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
    case 'Pendiente': return 'bg-yellow-100/10 text-yellow-600 border-yellow-200/20'
    case 'En planificación': return 'bg-blue-100/10 text-blue-600 border-blue-200/20'
    case 'En diseño': return 'bg-purple-100/10 text-purple-600 border-purple-200/20'
    case 'Lista para entrega': return 'bg-green-100/10 text-green-600 border-green-200/20'
    case 'Entregada': return 'bg-dashboard-card-border/20 text-dashboard-text-secondary border-dashboard-card-border/30'
    default: return 'bg-dashboard-card-border/20 text-dashboard-text-secondary border-dashboard-card-border/30'
  }
}

const getStatusLabel = (status: string) => {
  return status
}

const getPriorityColor = (priority: number | null) => {
  if (!priority) return 'bg-dashboard-card border border-dashboard-card-border text-dashboard-text-muted'
  if (priority >= 8) return 'bg-red-500/10 text-red-500 border border-red-500/20 font-black'
  if (priority >= 5) return 'bg-orange-500/10 text-orange-500 border border-orange-500/20 font-black'
  return 'bg-green-500/10 text-green-500 border border-green-500/20 font-black'
}

export default function RequestDetailModal({
  requestId,
  onClose,
  onUpdate,
  embedded = false
}: RequestDetailModalProps) {
  const { user } = useAuth()
  const canChangeStatus = useHasPermission(Permission.CHANGE_REQUEST_STATUS)
  const canDeleteRequests = useHasPermission(Permission.DELETE_REQUESTS)
  const canEditRequests = useHasPermission(Permission.EDIT_REQUESTS)
  const [request, setRequest] = useState<RequestDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [changeReason, setChangeReason] = useState('')
  const [visibleInPublicCalendar, setVisibleInPublicCalendar] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

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

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async (password: string, reason: string) => {
    if (!request) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/requests/${request.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password, reason })
      })

      if (response.ok) {
        onUpdate()
        onClose()
      } else {
        const errorData = await response.json()
        alert(`Error al eliminar la solicitud: ${errorData.error || 'Error desconocido'}`)
      }
    } catch (error) {
      console.error('Error deleting request:', error)
      alert('Error al eliminar la solicitud. Inténtalo de nuevo.')
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  if (!requestId) return null

  // Contenedor diferente según si está embebido o es modal
  const containerClasses = embedded
    ? "bg-dashboard-card rounded-2xl shadow-xl w-full flex flex-col border border-dashboard-card-border"
    : "fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"

  const contentClasses = embedded
    ? "w-full"
    : "bg-dashboard-card rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-dashboard-card-border"

  return (
    <div className={containerClasses}>
      <div className={contentClasses}>

        {/* Header */}
        <div className="bg-dashboard-card border-b border-dashboard-card-border px-6 py-4 flex items-center justify-between shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-dashboard-text-primary tracking-tight uppercase">
              Detalle de Solicitud
            </h2>
            {request && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>
                {getStatusLabel(request.status)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {canEditRequests && request && (
              <button
                onClick={() => setIsEditMode(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-decom-primary hover:bg-decom-primary/90 text-white rounded-xl transition-all font-bold text-sm shadow-lg shadow-decom-primary/20 hover:shadow-xl hover:shadow-decom-primary/30"
              >
                <IconEdit className="w-4 h-4" />
                Editar Solicitud
              </button>
            )}
            {!embedded && (
              <button
                onClick={onClose}
                className="p-2.5 hover:bg-dashboard-bg rounded-xl transition-all text-dashboard-text-muted hover:text-decom-secondary border border-transparent hover:border-dashboard-card-border group"
              >
                <IconX className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </button>
            )}
          </div>
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
                    {format(parseLocalDate(request.event_date), 'dd MMM yyyy', { locale: es })}
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
                    <h3 className="flex items-center gap-2 text-lg font-black text-dashboard-text-primary mb-5 uppercase tracking-tight">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                        <IconInfoCircle className="w-5 h-5" />
                      </div>
                      Información de Solicitud
                    </h3>

                    <div className="bg-dashboard-card/50 backdrop-blur-sm border border-dashboard-card-border/50 rounded-2xl p-6 md:p-8 shadow-sm space-y-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16" />
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
                    <h3 className="flex items-center gap-2 text-lg font-black text-dashboard-text-primary mb-5 uppercase tracking-tight">
                      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                        <IconHistory className="w-5 h-5" />
                      </div>
                      Historial de Cambios
                    </h3>

                    <div className="relative border-l-2 border-dashboard-card-border ml-5 pl-8 space-y-8 py-2">
                      {request.history.length === 0 ? (
                        <p className="text-sm text-dashboard-text-muted italic">No hay historial disponible.</p>
                      ) : (
                        request.history.map((entry) => (
                          <div key={entry.id} className="relative">
                            <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-dashboard-card border-2 border-purple-500 shadow-lg shadow-purple-500/20" />
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                              <span className="text-sm font-black text-dashboard-text-primary uppercase tracking-tight">
                                {entry.old_status ? (
                                  <>
                                    {getStatusLabel(entry.old_status)} <span className="text-dashboard-text-muted mx-1">→</span> {getStatusLabel(entry.new_status)}
                                  </>
                                ) : (
                                  <span className="text-decom-secondary">Solicitud Creada</span>
                                )}
                              </span>
                              <span className="text-[10px] font-black text-dashboard-text-muted uppercase tracking-[0.15em] bg-dashboard-bg px-2 py-1 rounded-lg border border-dashboard-card-border">
                                {format(new Date(entry.changed_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                              </span>
                            </div>
                            <p className="text-xs text-dashboard-text-secondary font-medium">
                              Por: <span className="text-dashboard-text-primary font-bold">{entry.changed_by_user?.full_name || 'Sistema'}</span>
                            </p>
                            {entry.change_reason && (
                              <div className="mt-3 text-sm text-dashboard-text-secondary bg-dashboard-bg/50 backdrop-blur-sm p-4 rounded-xl border border-dashboard-card-border/50 relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500/30" />
                                {entry.change_reason}
                              </div>
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
                  {canChangeStatus && (
                    <div className="bg-dashboard-card/50 backdrop-blur-sm border border-dashboard-card-border/50 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-decom-primary/5 blur-3xl -mr-16 -mt-16 group-hover:bg-decom-primary/10 transition-colors" />

                      <h3 className="font-black text-dashboard-text-primary mb-6 flex items-center gap-3 uppercase tracking-tight">
                        <div className="p-2 rounded-lg bg-decom-primary/10 text-decom-primary">
                          <IconSend className="w-5 h-5" />
                        </div>
                        Gestionar Solicitud
                      </h3>

                      <div className="space-y-5 relative z-10">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-dashboard-text-muted uppercase tracking-[0.2em] ml-1">
                            Estado actual del proceso
                          </label>
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full px-4 py-3 text-sm border-2 border-dashboard-card-border rounded-xl bg-dashboard-bg text-dashboard-text-primary focus:ring-4 focus:ring-decom-secondary/10 focus:border-decom-secondary outline-none transition-all font-bold"
                          >
                            <option value="Pendiente">Pendiente</option>
                            <option value="En planificación">En planificación</option>
                            <option value="En diseño">En diseño</option>
                            <option value="Lista para entrega">Lista para entrega</option>
                            <option value="Entregada">Entregada</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-dashboard-bg/80 rounded-xl border border-dashboard-card-border group/toggle cursor-pointer hover:border-decom-secondary/30 transition-all">
                          <div className="relative flex-shrink-0">
                            <input
                              type="checkbox"
                              id="visibleInPublicCalendar"
                              checked={visibleInPublicCalendar}
                              onChange={(e) => setVisibleInPublicCalendar(e.target.checked)}
                              className="peer sr-only"
                            />
                            <div className="w-10 h-5 bg-dashboard-card border border-dashboard-card-border rounded-full peer peer-checked:bg-decom-secondary transition-all" />
                            <div className="absolute left-1 top-1 w-3 h-3 bg-dashboard-text-muted rounded-full peer-checked:translate-x-5 peer-checked:bg-white transition-all" />
                          </div>
                          <label htmlFor="visibleInPublicCalendar" className="text-xs font-bold text-dashboard-text-secondary cursor-pointer select-none">
                            Visible en calendario público
                          </label>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-dashboard-text-muted uppercase tracking-[0.2em] ml-1">
                            Observaciones de actualización
                          </label>
                          <textarea
                            value={changeReason}
                            onChange={(e) => setChangeReason(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 text-sm border-2 border-dashboard-card-border rounded-xl bg-dashboard-bg text-dashboard-text-primary focus:ring-4 focus:ring-decom-secondary/10 focus:border-decom-secondary outline-none transition-all resize-none font-medium placeholder-dashboard-text-muted/40"
                            placeholder="Describe brevemente el porqué del cambio..."
                          />
                        </div>

                        <Button
                          onClick={handleUpdateStatus}
                          disabled={updating || (newStatus === request.status && visibleInPublicCalendar === request.visible_in_public_calendar)}
                          fullWidth
                          className="bg-gradient-to-r from-decom-primary to-decom-secondary hover:shadow-lg shadow-decom-primary/20 py-4"
                        >
                          {updating ? 'Actualizando...' : 'Guardar Cambios'}
                        </Button>
                      </div>

                      <div className="mt-6 pt-6 border-t border-dashboard-card-border/50 space-y-4">
                        <h4 className="text-[10px] font-black text-dashboard-text-muted uppercase tracking-[0.2em]">
                          Comunicación Directa
                        </h4>
                        <div className="flex items-center justify-between p-4 bg-green-500/5 rounded-xl border border-green-500/10 group/whatsapp">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500/10 text-green-500 group-hover/whatsapp:scale-110 transition-transform">
                              <IconBrandWhatsapp className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-green-600 uppercase tracking-wider">WhatsApp</span>
                              <span className="text-sm text-dashboard-text-primary font-bold font-mono">
                                {request.contact_whatsapp}
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => window.open(generateWhatsAppLink(request.contact_whatsapp, {
                              eventName: request.event_name,
                              committeeName: request.committee.name,
                              eventDate: format(parseLocalDate(request.event_date), 'dd MMM yyyy', { locale: es }),
                              statusLabel: getStatusLabel(request.status),
                              materialType: request.material_type
                            }), '_blank')}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 rounded-lg h-9 shadow-lg shadow-green-600/20"
                          >
                            Chat
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Delete Request Card */}
                  {canDeleteRequests && (
                    <div className="bg-dashboard-card/30 border border-decom-error/20 rounded-2xl p-6 shadow-sm overflow-hidden relative group transition-all hover:bg-decom-error/5">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-decom-error/5 blur-3xl -mr-12 -mt-12" />

                      <h3 className="font-black text-dashboard-text-primary mb-5 flex items-center gap-3 uppercase tracking-tight relative z-10">
                        <div className="p-2 rounded-lg bg-decom-error/10 text-decom-error">
                          <IconTrash className="w-5 h-5" />
                        </div>
                        Zona de Peligro
                      </h3>

                      <div className="space-y-4 relative z-10">
                        <div className="p-4 bg-decom-error/5 rounded-xl border border-decom-error/10">
                          <p className="text-xs text-decom-error font-medium leading-relaxed">
                            Eliminar esta solicitud la removerá permanentemente del sistema. Esta acción no se puede deshacer.
                          </p>
                        </div>

                        <Button
                          onClick={handleDeleteClick}
                          disabled={deleting}
                          fullWidth
                          variant="outline"
                          className="border-decom-error/50 text-decom-error hover:bg-decom-error hover:text-white dark:hover:bg-decom-error py-3"
                        >
                          {deleting ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              Eliminando...
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <IconTrash className="w-4 h-4" />
                              ELIMINAR SOLICITUD
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Timeline Dates Card */}
                  <div className="bg-dashboard-card/50 backdrop-blur-sm border border-dashboard-card-border/50 rounded-2xl p-6 shadow-sm overflow-hidden relative">
                    <h3 className="font-black text-dashboard-text-primary mb-6 flex items-center gap-3 uppercase tracking-tight">
                      <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                        <IconTimeline className="w-5 h-5" />
                      </div>
                      Fechas Clave
                    </h3>

                    <div className="space-y-5 relative">
                      {/* Vertical line connecting dots */}
                      <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-dashboard-card-border/50" />

                      <div className="relative pl-8">
                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-dashboard-card bg-blue-500 shadow-lg shadow-blue-500/30 z-10" />
                        <span className="text-[10px] font-black text-dashboard-text-muted uppercase tracking-[0.2em] block mb-1">Inicio Planificación</span>
                        <span className="text-sm font-bold text-dashboard-text-primary">
                          {request.planning_start_date ? format(new Date(request.planning_start_date), 'dd MMM yyyy', { locale: es }) : 'Por definir'}
                        </span>
                      </div>

                      <div className="relative pl-8">
                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-dashboard-card bg-decom-secondary shadow-lg shadow-decom-secondary/30 z-10" />
                        <span className="text-[10px] font-black text-dashboard-text-muted uppercase tracking-[0.2em] block mb-1">Entrega Material</span>
                        <span className="text-sm font-bold text-dashboard-text-primary">
                          {request.delivery_date ? format(new Date(request.delivery_date), 'dd MMM yyyy', { locale: es }) : 'Por definir'}
                        </span>
                      </div>

                      <div className="relative pl-8">
                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-dashboard-card bg-red-500 shadow-lg shadow-red-500/30 z-10" />
                        <span className="text-[10px] font-black text-dashboard-text-muted uppercase tracking-[0.2em] block mb-1">Día del Evento</span>
                        <span className="text-sm font-bold text-dashboard-text-primary">
                          {format(parseLocalDate(request.event_date), 'dd MMM yyyy', { locale: es })}
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

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        itemName={request?.event_name || 'Solicitud'}
        isDeleting={deleting}
      />

      <EditRequestModal
        requestId={requestId}
        isOpen={isEditMode}
        onClose={() => setIsEditMode(false)}
        onSuccess={() => {
          setIsEditMode(false)
          // Recargar los datos de la solicitud
          if (requestId) {
            const fetchRequest = async () => {
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
              }
            }
            fetchRequest()
          }
          onUpdate()
        }}
      />
    </div>
  )
}
