'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  IconArrowLeft,
  IconUsers,
  IconCalendar,
  IconPalette,
  IconCheck,
  IconClock,
  IconBook,
  IconMessageCircle,
  IconChevronDown,
  IconRefresh
} from '@tabler/icons-react'
import { Badge } from '@/app/components/UI/Badge'
import { Button } from '@/app/components/UI/Button'
import { Card } from '@/app/components/UI/Card'

interface RequestDetail {
  id: string
  event_name: string
  description: string
  status: string
  material_type: string
  event_date: string
  committee_name: string
  committee_color?: string
  created_at: string
  requester_name: string
  requester_phone: string
  timeline: Array<{
    id: string
    title: string
    date: string
    status: 'completed' | 'current' | 'pending'
  }>
  bible_verse?: {
    text: string
    reference: string
  }
}

const STATUS_OPTIONS = [
  { value: 'pendiente', label: 'Pendiente', icon: IconClock, color: 'gray' },
  { value: 'en_planificacion', label: 'En Planificación', icon: IconRefresh, color: 'blue' },
  { value: 'en_diseño', label: 'En Diseño', icon: IconPalette, color: 'yellow' },
  { value: 'lista', label: 'Lista', icon: IconCheck, color: 'green' },
  { value: 'entregada', label: 'Entregada', icon: IconCheck, color: 'green' }
]

export default function RequestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [request, setRequest] = useState<RequestDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const loadRequestDetail = async () => {
      try {
        const mockRequest: RequestDetail = {
          id: '1',
          event_name: 'CULTO ESPECAIAL',
          description: 'QWDWQDQW',
          status: 'pendiente',
          material_type: 'flyer',
          event_date: '2026-01-22T10:00:00Z',
          committee_name: 'Damas',
          requester_name: 'María González',
          requester_phone: '+573113678555',
          created_at: '2026-01-15T10:30:00Z',
          timeline: [
            {
              id: '1',
              title: 'Solicitud creada',
              date: '2026-01-15',
              status: 'completed'
            },
            {
              id: '2',
              title: 'Inicio de planificación',
              date: '2026-01-15',
              status: 'current'
            },
            {
              id: '3',
              title: 'Fecha de entrega',
              date: '2026-01-20',
              status: 'pending'
            },
            {
              id: '4',
              title: 'Fecha del evento',
              date: '2026-01-22',
              status: 'pending'
            }
          ]
        }

        console.log('Loading request detail:', mockRequest)
        setRequest(mockRequest)
        setSelectedStatus(mockRequest.status)
      } catch (error) {
        console.error('Error loading request detail:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      loadRequestDetail()
    }
  }, [params.id])

  const handleStatusUpdate = async () => {
    if (!request) return

    setIsUpdating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setRequest(prev => prev ? { ...prev, status: selectedStatus } : null)
      setShowStatusDropdown(false)
      alert('Estado actualizado correctamente')
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Error al actualizar el estado')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleWhatsAppContact = () => {
    if (!request?.requester_phone) return

    // Limpiar el número de teléfono (remover espacios, guiones, etc.)
    const cleanPhone = request.requester_phone.replace(/\D/g, '')

    // Obtener el estado actual en español
    const statusLabels: Record<string, string> = {
      'pendiente': 'Pendiente',
      'en_planificacion': 'En Planificación',
      'en_diseño': 'En Diseño',
      'lista': 'Lista',
      'entregada': 'Entregada'
    }
    const currentStatus = statusLabels[request.status] || request.status

    // Crear mensaje predefinido con información completa de la solicitud
    const message = encodeURIComponent(
      `Dios le bendiga ${request.requester_name},\n\nSoy del equipo DECOM. Te contacto respecto a tu solicitud:\n\n📋 *DETALLES DE LA SOLICITUD #${request.id}*\n\n🎯 *Evento:* ${request.event_name}\n📝 *Descripción:* ${request.description}\n📅 *Fecha del evento:* ${formatDate(request.event_date)}\n🏢 *Comité:* ${request.committee_name}\n🎨 *Tipo de material:* ${request.material_type}\n📊 *Estado actual:* ${currentStatus}\n📅 *Fecha de creación:* ${formatDate(request.created_at)}\n\n${request.bible_verse ? `📖 *Versículo bíblico:* "${request.bible_verse.text}" - ${request.bible_verse.reference}\n\n` : ''}💬 ¿Podemos conversar sobre el progreso de tu solicitud?`
    )

    // Abrir WhatsApp con el mensaje
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  const getStatusVariant = (status: string): 'pending' | 'planning' | 'design' | 'ready' | 'delivered' | 'default' => {
    const statusLower = status.toLowerCase().trim()
    if (statusLower.includes('pendiente')) return 'pending'
    if (statusLower.includes('planificaci')) return 'planning'
    if (statusLower.includes('diseño')) return 'design'
    if (statusLower.includes('lista')) return 'ready'
    if (statusLower.includes('entregada')) return 'delivered'
    return 'default'
  }

  const getMaterialIcon = (materialType: string) => {
    const icons: Record<string, string> = {
      flyer: '📄',
      banner: '🏴',
      video: '🎥',
      redes_sociales: '📱',
      otro: '📦'
    }
    const type = Object.keys(icons).find(key =>
      materialType.toLowerCase().includes(key)
    )
    return icons[type || 'otro'] || '📦'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getCurrentStatusOption = () => {
    return STATUS_OPTIONS.find(option => option.value === selectedStatus) || STATUS_OPTIONS[0]
  }

  const formatPhoneNumber = (phone: string) => {
    // Formatear número colombiano: +57 311 367 8555
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.startsWith('57') && cleaned.length === 12) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`
    }
    return phone
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-20 bg-gradient-to-r from-primary-dark to-primary-light"></div>
          <div className="p-4 space-y-4">
            <div className="h-32 bg-gray-300 rounded-xl"></div>
            <div className="h-48 bg-gray-300 rounded-xl"></div>
            <div className="h-24 bg-gray-300 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Solicitud no encontrada</p>
          <Button onClick={() => router.back()} className="mt-4">
            Volver
          </Button>
        </div>
      </div>
    )
  }

  const currentStatusOption = getCurrentStatusOption()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 bg-gradient-to-r from-primary-dark to-primary shadow-md">
        <div className="flex items-center justify-between p-4 h-[72px]">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center text-white w-10 h-10 -ml-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <IconArrowLeft className="w-6 h-6" />
          </button>

          <div className="flex-1 px-2">
            <h1 className="text-white text-lg font-bold leading-tight truncate">
              {request.event_name}
            </h1>
            <p className="text-white/80 text-xs font-medium">
              Solicitud #{request.id}
            </p>
          </div>

          <Badge
            variant={getStatusVariant(request.status)}
            className="bg-secondary/20 border-secondary text-secondary backdrop-blur-sm bg-white/10 text-white shadow-sm"
          >
            {request.status.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        <Card className="border-t-4 border-secondary overflow-hidden">
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shrink-0">
                  <IconUsers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-bold text-base leading-tight">
                    {request.requester_name}
                  </h3>
                  <p className="text-gray-500 text-sm">{request.committee_name}</p>
                  {request.requester_phone && (
                    <p className="text-green-600 text-xs font-medium mt-1">
                      📱 {formatPhoneNumber(request.requester_phone)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* BOTÓN DE WHATSAPP - DEBUG VERSION */}
            <div className="bg-red-100 border-4 border-red-500 p-4 mb-4 rounded-lg">
              <h3 className="text-red-800 font-bold text-lg mb-2">🚨 BOTÓN DE WHATSAPP DEBUG 🚨</h3>
              <div className="text-red-700 text-sm mb-3">
                <p>Request ID: {request?.id}</p>
                <p>Requester Phone: {request?.requester_phone || 'NO PHONE'}</p>
                <p>Requester Name: {request?.requester_name}</p>
                <p>Status: {request?.status}</p>
              </div>
              {request?.requester_phone ? (
                <button
                  onClick={() => {
                    console.log('WhatsApp button clicked!');
                    handleWhatsAppContact();
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-xl border-4 border-green-700 shadow-lg"
                  style={{ backgroundColor: '#25D366', borderColor: '#128C7E' }}
                >
                  📱📱📱 WHATSAPP BUTTON - CLICK ME! 📱📱📱
                </button>
              ) : (
                <div className="bg-yellow-200 border-2 border-yellow-500 p-3 rounded">
                  <p className="text-yellow-800 font-bold">⚠️ NO PHONE NUMBER FOUND ⚠️</p>
                </div>
              )}
            </div>

            <div className="mb-5">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Descripción
              </h4>
              <p className="text-gray-900 text-sm leading-relaxed">
                {request.description}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <IconCalendar className="w-5 h-5 text-secondary" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    Fecha del Evento
                  </span>
                  <span className="text-gray-900 text-sm font-semibold">
                    {formatDate(request.event_date)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-xl">{getMaterialIcon(request.material_type)}</span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    Tipo de Recurso
                  </span>
                  <span className="text-gray-900 text-sm font-semibold">
                    {request.material_type}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-gray-900 text-lg font-bold mb-5">Timeline de Trabajo</h3>
          <div className="relative pl-2">
            <div className="absolute left-[7px] top-2 bottom-4 w-[2px] bg-gray-200"></div>
            <div
              className="absolute left-[7px] top-2 w-[2px] bg-secondary"
              style={{
                height: `${(request.timeline.findIndex(item => item.status === 'current') + 1) / request.timeline.length * 100}%`
              }}
            ></div>

            <div className="space-y-6">
              {request.timeline.map((item, index) => (
                <div key={item.id} className="relative flex items-start gap-4">
                  <div className={`relative z-10 flex items-center justify-center w-4 h-4 mt-1 rounded-full ring-4 ring-white ${
                    item.status === 'completed'
                      ? 'bg-secondary'
                      : item.status === 'current'
                      ? 'bg-white border-2 border-secondary'
                      : 'bg-gray-200'
                  }`}>
                    {item.status === 'completed' && (
                      <IconCheck className="w-2.5 h-2.5 text-white" />
                    )}
                    {item.status === 'current' && (
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                    )}
                  </div>
                  <div className="flex flex-col -mt-1">
                    <span className={`text-sm font-bold text-gray-900 ${
                      item.status === 'pending' ? 'opacity-60' : ''
                    }`}>
                      {item.title}
                    </span>
                    <span className={`text-xs ${
                      item.status === 'current'
                        ? 'text-secondary font-semibold'
                        : item.status === 'completed'
                        ? 'text-gray-600'
                        : 'text-gray-500'
                    }`}>
                      {item.status === 'current' ? 'En proceso' : formatShortDate(item.date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {request.bible_verse && (
          <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100 relative overflow-hidden">
            <div className="absolute top-2 right-4 text-secondary/20 text-6xl font-serif leading-none select-none">
              "
            </div>
            <div className="flex gap-3 relative z-10">
              <div className="shrink-0 text-primary">
                <IconBook className="w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-900 text-sm italic font-medium leading-relaxed">
                  "{request.bible_verse.text}"
                </p>
                <p className="text-primary text-xs font-bold mt-2">
                  — {request.bible_verse.reference}
                </p>
              </div>
            </div>
          </div>
        )}

        <Card className="p-5 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900 block">
              Actualizar Estado
            </label>
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center justify-between w-full p-3 bg-white border border-primary/30 rounded-lg shadow-sm hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStatusOption.color === 'gray' ? 'bg-gray-100 text-gray-600' :
                    currentStatusOption.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    currentStatusOption.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <currentStatusOption.icon className="w-4 h-4" />
                  </div>
                  <span className="text-gray-900 font-medium">
                    {currentStatusOption.label}
                  </span>
                </div>
                <IconChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                  showStatusDropdown ? 'rotate-180' : ''
                }`} />
              </button>

              {showStatusDropdown && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-xl z-20">
                  {STATUS_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedStatus(option.value)
                        setShowStatusDropdown(false)
                      }}
                      className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        option.color === 'gray' ? 'bg-gray-100 text-gray-600' :
                        option.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                        option.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        <option.icon className="w-4 h-4" />
                      </div>
                      <span className="text-gray-900 font-medium">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={handleWhatsAppContact}
            disabled={!request?.requester_phone}
            className="w-full group relative flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1DA851] disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3.5 rounded-xl shadow-lg shadow-green-200 transition-all active:scale-[0.98]"
          >
            <IconMessageCircle className="w-5 h-5" />
            <span className="font-bold">
              {request?.requester_phone ? 'Contactar por WhatsApp' : 'Número no disponible'}
            </span>
          </Button>

          <Button
            onClick={handleStatusUpdate}
            disabled={isUpdating || selectedStatus === request.status}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold p-4 rounded-xl border-b-4 border-secondary shadow-md active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </Card>
      </div>
    </div>
  )
}