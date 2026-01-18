'use client'

import { useState, useEffect } from 'react'
import { parseLocalDate } from '@/app/lib/dateUtils'
import { IconX, IconDeviceFloppy } from '@tabler/icons-react'
import { Button } from '@/app/components/UI/Button'

interface Committee {
  id: string
  name: string
  description?: string
  color_badge?: string
}

interface EditRequestModalProps {
  requestId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function EditRequestModal({
  requestId,
  isOpen,
  onClose,
  onSuccess,
}: EditRequestModalProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [committees, setCommittees] = useState<Committee[]>([])
  const [formData, setFormData] = useState({
    committee_id: '',
    event_name: '',
    event_info: '',
    event_date: '',
    event_time: '',
    material_type: '',
    contact_whatsapp: '',
    include_bible_verse: false,
    bible_verse_text: '',
  })

  useEffect(() => {
    if (isOpen && requestId) {
      loadRequestData()
      loadCommittees()
    }
  }, [isOpen, requestId])

  const loadCommittees = async () => {
    try {
      const response = await fetch('/api/committees')
      const result = await response.json()
      if (result.success) {
        setCommittees(result.data)
      }
    } catch (error) {
      console.error('Error loading committees:', error)
    }
  }

  const loadRequestData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/requests/${requestId}`)
      if (response.ok) {
        const data = await response.json()
        
        // Extraer fecha y hora del event_date
        const eventDateTime = parseLocalDate(data.event_date)
        const eventDate = eventDateTime.toISOString().split('T')[0]
        const eventTime = eventDateTime.toTimeString().slice(0, 5)
        
        setFormData({
          committee_id: data.committee.id,
          event_name: data.event_name,
          event_info: data.event_info,
          event_date: eventDate,
          event_time: eventTime,
          material_type: data.material_type,
          contact_whatsapp: data.contact_whatsapp,
          include_bible_verse: data.include_bible_verse,
          bible_verse_text: data.bible_verse_text || '',
        })
      }
    } catch (error) {
      console.error('Error loading request:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Normalizar el número de WhatsApp
      let whatsappNumber = formData.contact_whatsapp.trim()
      whatsappNumber = whatsappNumber.replace(/[\s\-\(\)]/g, '')
      if (!whatsappNumber.startsWith('+57')) {
        if (whatsappNumber.length === 10 && whatsappNumber.startsWith('3')) {
          whatsappNumber = `+57${whatsappNumber}`
        } else if (whatsappNumber.length === 12 && whatsappNumber.startsWith('573')) {
          whatsappNumber = `+${whatsappNumber}`
        }
      }

      const requestData = {
        ...formData,
        contact_whatsapp: whatsappNumber,
        bible_verse_text: formData.include_bible_verse ? formData.bible_verse_text : undefined,
      }

      const response = await fetch(`/api/admin/requests/${requestId}/edit`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        onSuccess()
        onClose()
      } else {
        const error = await response.json()
        console.error('Error updating request:', error)
        const errorMessage = error.details || error.error || 'Error desconocido'
        alert(`Error al actualizar la solicitud: ${errorMessage}`)
      }
    } catch (error) {
      console.error('Error updating request:', error)
      alert('Error al actualizar la solicitud. Inténtalo de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-dashboard-card rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-dashboard-card-border">
        {/* Header */}
        <div className="bg-dashboard-card border-b border-dashboard-card-border px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-black text-dashboard-text-primary tracking-tight uppercase">
            Editar Solicitud
          </h2>
          <button
            onClick={onClose}
            disabled={saving}
            className="p-2.5 hover:bg-dashboard-bg rounded-xl transition-all text-dashboard-text-muted hover:text-decom-secondary border border-transparent hover:border-dashboard-card-border group"
          >
            <IconX className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-neutral-100 dark:bg-neutral-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Comité */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-dashboard-text-primary">
                  Comité <span className="text-decom-error">*</span>
                </label>
                <select
                  value={formData.committee_id}
                  onChange={(e) => setFormData({ ...formData, committee_id: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-dashboard-card-border rounded-xl bg-dashboard-bg text-dashboard-text-primary focus:ring-4 focus:ring-decom-secondary/10 focus:border-decom-secondary outline-none transition-all"
                  required
                >
                  <option value="">Selecciona un comité</option>
                  {committees.map((committee) => (
                    <option key={committee.id} value={committee.id}>
                      {committee.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nombre del Evento */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-dashboard-text-primary">
                  Nombre del Evento <span className="text-decom-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.event_name}
                  onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-dashboard-card-border rounded-xl bg-dashboard-bg text-dashboard-text-primary focus:ring-4 focus:ring-decom-secondary/10 focus:border-decom-secondary outline-none transition-all"
                  placeholder="Ej: Charla para adolescentes"
                  required
                  minLength={5}
                  maxLength={200}
                />
              </div>

              {/* Fecha y Hora */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-dashboard-text-primary">
                    Fecha del Evento <span className="text-decom-error">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-dashboard-card-border rounded-xl bg-dashboard-bg text-dashboard-text-primary focus:ring-4 focus:ring-decom-secondary/10 focus:border-decom-secondary outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-dashboard-text-primary">
                    Hora del Evento <span className="text-decom-error">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.event_time}
                    onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-dashboard-card-border rounded-xl bg-dashboard-bg text-dashboard-text-primary focus:ring-4 focus:ring-decom-secondary/10 focus:border-decom-secondary outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Tipo de Material */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-dashboard-text-primary">
                  Tipo de Material <span className="text-decom-error">*</span>
                </label>
                <select
                  value={formData.material_type}
                  onChange={(e) => setFormData({ ...formData, material_type: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-dashboard-card-border rounded-xl bg-dashboard-bg text-dashboard-text-primary focus:ring-4 focus:ring-decom-secondary/10 focus:border-decom-secondary outline-none transition-all"
                  required
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="flyer">Flyer</option>
                  <option value="afiche">Afiche</option>
                  <option value="banner">Banner</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="presentacion">Presentación</option>
                  <option value="video">Video</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              {/* Detalles y Descripción */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-dashboard-text-primary">
                  Detalles y Descripción <span className="text-decom-error">*</span>
                </label>
                <textarea
                  value={formData.event_info}
                  onChange={(e) => setFormData({ ...formData, event_info: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-dashboard-card-border rounded-xl bg-dashboard-bg text-dashboard-text-primary focus:ring-4 focus:ring-decom-secondary/10 focus:border-decom-secondary outline-none transition-all resize-none"
                  placeholder="Describe los detalles del evento y el material que necesitas..."
                  required
                  minLength={5}
                  maxLength={500}
                />
              </div>

              {/* WhatsApp */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-dashboard-text-primary">
                  WhatsApp de Contacto <span className="text-decom-error">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.contact_whatsapp}
                  onChange={(e) => setFormData({ ...formData, contact_whatsapp: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-dashboard-card-border rounded-xl bg-dashboard-bg text-dashboard-text-primary focus:ring-4 focus:ring-decom-secondary/10 focus:border-decom-secondary outline-none transition-all"
                  placeholder="Ej: +573001234567"
                  required
                />
              </div>

              {/* Versículo Bíblico */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="include_bible_verse"
                    checked={formData.include_bible_verse}
                    onChange={(e) => setFormData({ ...formData, include_bible_verse: e.target.checked })}
                    className="w-5 h-5 rounded border-2 border-dashboard-card-border text-decom-primary focus:ring-4 focus:ring-decom-secondary/10"
                  />
                  <label htmlFor="include_bible_verse" className="text-sm font-bold text-dashboard-text-primary cursor-pointer">
                    Incluir versículo bíblico
                  </label>
                </div>

                {formData.include_bible_verse && (
                  <textarea
                    value={formData.bible_verse_text}
                    onChange={(e) => setFormData({ ...formData, bible_verse_text: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-dashboard-card-border rounded-xl bg-dashboard-bg text-dashboard-text-primary focus:ring-4 focus:ring-decom-secondary/10 focus:border-decom-secondary outline-none transition-all resize-none"
                    placeholder="Escribe el versículo bíblico aquí..."
                  />
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-decom-primary to-decom-secondary"
                >
                  {saving ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Guardando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <IconDeviceFloppy className="w-5 h-5" />
                      Guardar Cambios
                    </div>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
