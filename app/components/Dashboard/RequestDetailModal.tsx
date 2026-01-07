'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Badge } from '@/app/components/UI/Badge'
import { Button } from '@/app/components/UI/Button'
import { IconX, IconClock } from '@tabler/icons-react'

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
}

export default function RequestDetailModal({ 
  requestId, 
  onClose,
  onUpdate 
}: RequestDetailModalProps) {
  const [request, setRequest] = useState<RequestDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [changeReason, setChangeReason] = useState('')

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
    if (!request || newStatus === request.status) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/admin/requests/${request.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Detalle de Solicitud
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <IconX className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : request ? (
          <div className="p-6 space-y-6">
            {/* Información General */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
                Información General
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-neutral-500 dark:text-neutral-400">
                    Evento
                  </label>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {request.event_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500 dark:text-neutral-400">
                    Fecha del Evento
                  </label>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {format(new Date(request.event_date), 'dd/MM/yyyy', { locale: es })}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500 dark:text-neutral-400">
                    Comité
                  </label>
                  <p>
                    <Badge variant="default">{request.committee.name}</Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500 dark:text-neutral-400">
                    Tipo de Material
                  </label>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {request.material_type}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500 dark:text-neutral-400">
                    WhatsApp de Contacto
                  </label>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {request.contact_whatsapp}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500 dark:text-neutral-400">
                    Prioridad
                  </label>
                  <p className="font-bold text-lg text-orange-500">
                    {request.priority_score || '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="text-sm text-neutral-500 dark:text-neutral-400">
                Información del Evento
              </label>
              <p className="mt-1 text-neutral-900 dark:text-neutral-100">
                {request.event_info}
              </p>
            </div>

            {/* Versículo Bíblico */}
            {request.include_bible_verse && request.bible_verse_text && (
              <div>
                <label className="text-sm text-neutral-500 dark:text-neutral-400">
                  Versículo Bíblico
                </label>
                <p className="mt-1 text-neutral-900 dark:text-neutral-100 italic">
                  "{request.bible_verse_text}"
                </p>
              </div>
            )}

            {/* Fechas Clave */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
                Fechas Clave
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-neutral-500 dark:text-neutral-400">
                    Inicio Planificación
                  </label>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {request.planning_start_date 
                      ? format(new Date(request.planning_start_date), 'dd/MM/yyyy', { locale: es })
                      : '-'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500 dark:text-neutral-400">
                    Fecha de Entrega
                  </label>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {request.delivery_date 
                      ? format(new Date(request.delivery_date), 'dd/MM/yyyy', { locale: es })
                      : '-'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500 dark:text-neutral-400">
                    Fecha del Evento
                  </label>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {format(new Date(request.event_date), 'dd/MM/yyyy', { locale: es })}
                  </p>
                </div>
              </div>
            </div>

            {/* Actualizar Estado */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
                Actualizar Estado
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-neutral-500 dark:text-neutral-400 mb-2 block">
                    Nuevo Estado
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="in_progress">En Progreso</option>
                    <option value="completed">Completado</option>
                    <option value="approved">Aprobado</option>
                    <option value="rejected">Rechazado</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-neutral-500 dark:text-neutral-400 mb-2 block">
                    Motivo del Cambio (Opcional)
                  </label>
                  <textarea
                    value={changeReason}
                    onChange={(e) => setChangeReason(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    placeholder="Describe el motivo del cambio..."
                  />
                </div>
                <Button
                  onClick={handleUpdateStatus}
                  disabled={updating || newStatus === request.status}
                  className="w-full"
                >
                  {updating ? 'Actualizando...' : 'Actualizar Estado'}
                </Button>
              </div>
            </div>

            {/* Historial de Cambios */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
                Historial de Cambios
              </h3>
              <div className="space-y-4">
                {request.history.length === 0 ? (
                  <p className="text-neutral-500 dark:text-neutral-400 text-center py-8">
                    No hay cambios registrados
                  </p>
                ) : (
                  <div className="relative border-l-2 border-neutral-200 dark:border-neutral-800 pl-6 space-y-6">
                    {request.history.map((entry) => (
                      <div key={entry.id} className="relative">
                        <div className="absolute -left-8 mt-1">
                          <div className="w-4 h-4 bg-violet-500 rounded-full border-2 border-white dark:border-neutral-900" />
                        </div>
                        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="default">
                                {entry.old_status || 'Inicial'} → {entry.new_status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
                              <IconClock className="w-4 h-4" />
                              {format(new Date(entry.changed_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                            </div>
                          </div>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                            Por: {entry.changed_by_user?.full_name || 'Sistema'}
                          </p>
                          {entry.change_reason && (
                            <p className="text-sm text-neutral-700 dark:text-neutral-300">
                              {entry.change_reason}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-neutral-500">
            No se pudo cargar la solicitud
          </div>
        )}
      </div>
    </div>
  )
}
