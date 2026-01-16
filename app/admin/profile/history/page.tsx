'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  IconArrowLeft,
  IconCalendar,
  IconFileText,
  IconCircleCheck,
  IconClock
} from '@tabler/icons-react'
import { Badge } from '@/app/components/UI/Badge'
import { Card } from '@/app/components/UI/Card'
import { EmptyState } from '@/app/components/UI'

interface RequestHistory {
  id: string
  event_name: string
  material_type: string
  status: string
  created_at: string
  event_date: string
}

export default function RequestHistoryPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<RequestHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carga del historial de solicitudes
    const loadRequestHistory = async () => {
      try {
        // En una implementación real, esto vendría de una API
        const mockRequests: RequestHistory[] = [
          {
            id: '1',
            event_name: 'Concierto de Navidad 2024',
            material_type: 'banner',
            status: 'entregada',
            created_at: '2024-11-15T10:30:00Z',
            event_date: '2024-12-20T19:00:00Z'
          },
          {
            id: '2',
            event_name: 'Retiro Juvenil',
            material_type: 'flyer',
            status: 'en_diseño',
            created_at: '2024-11-20T14:15:00Z',
            event_date: '2024-12-15T09:00:00Z'
          },
          {
            id: '3',
            event_name: 'Campaña de Amor',
            material_type: 'redes_sociales',
            status: 'lista',
            created_at: '2024-11-10T09:45:00Z',
            event_date: '2024-12-01T10:00:00Z'
          }
        ]
        setRequests(mockRequests)
      } catch (error) {
        console.error('Error loading request history:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRequestHistory()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'entregada':
        return <IconCircleCheck className="w-5 h-5 text-green-500" />
      case 'lista':
        return <IconCircleCheck className="w-5 h-5 text-blue-500" />
      case 'en_diseño':
        return <IconClock className="w-5 h-5 text-yellow-500" />
      case 'pendiente':
        return <IconClock className="w-5 h-5 text-gray-500" />
      default:
        return <IconFileText className="w-5 h-5 text-gray-500" />
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getMaterialIcon = (materialType: string) => {
    const icons: Record<string, string> = {
      flyer: '📄',
      banner: '🏴',
      video: '🎥',
      redes_sociales: '📱',
      otro: '📦'
    }
    return icons[materialType] || '📄'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-16 bg-gradient-to-r from-decom-primary to-decom-primary-light"></div>
          <div className="p-4 space-y-4">
            <div className="h-20 bg-gray-300 rounded-lg"></div>
            <div className="h-20 bg-gray-300 rounded-lg"></div>
            <div className="h-20 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center p-4 pb-4 justify-between bg-gradient-to-r from-decom-primary to-decom-primary-light shadow-sm sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="text-white flex size-12 shrink-0 items-center justify-center cursor-pointer hover:bg-white/10 rounded-full transition-colors"
        >
          <IconArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          Historial de Solicitudes
        </h2>
      </div>

      {/* Content */}
      <div className="p-4">
        {requests.length === 0 ? (
          <EmptyState
            title="No hay solicitudes aún"
            description="Cuando crees solicitudes de material gráfico, aparecerán aquí para que puedas hacer seguimiento de su progreso."
            actionLabel="Crear Primera Solicitud"
            onAction={() => router.push('/new-request')}
            variant="default"
          />
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Mostrando {requests.length} solicitud{requests.length !== 1 ? 'es' : ''}
            </div>

            {requests.map((request) => (
              <div
                key={request.id}
                onClick={() => router.push(`/requests/${request.id}`)}
              >
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  interactive
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-base mb-1">
                        {request.event_name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <span className="text-lg">{getMaterialIcon(request.material_type)}</span>
                          <span>{request.material_type.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <IconCalendar className="w-4 h-4" />
                          <span>{formatDate(request.event_date)}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(request.status)}>
                      {request.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {getStatusIcon(request.status)}
                      <span>Creada: {formatDate(request.created_at)}</span>
                    </div>
                    <div className="text-decom-primary text-sm font-medium">
                      Ver detalles →
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}