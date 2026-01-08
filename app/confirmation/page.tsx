'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../components/UI/Button'
import { Card } from '../components/UI/Card'
import { Layout } from '../components/Layout'
import { IconCheck, IconClock, IconPhone, IconAlertTriangle, IconCalendar } from '@tabler/icons-react'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const requestId = searchParams.get('requestId')

  const [stats, setStats] = useState<{
    total_active: number
    pending: number
    in_progress: number
    upcoming_events: Array<{
      event_date: string
      event_name: string
      committee: { name: string }
    }>
  } | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/public/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Mensaje de Éxito */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#4CAF50] to-[#45a049] mb-4">
            <IconCheck className="w-12 h-12 text-white" size={48} strokeWidth={3} />
          </div>
          <h1 className="text-3xl font-bold text-[#16233B] mb-2">
            ¡Solicitud Enviada Exitosamente!
          </h1>
          <p className="text-lg text-gray-700">
            Tu solicitud ha sido registrada en nuestro sistema.
          </p>
        </div>

        {/* Estado Actual del Sistema - MÁS PROMINENTE */}
        <Card padding="lg" className="mb-8 border-l-4 border-l-[#F49E2C] bg-gradient-to-r from-orange-50 to-yellow-50">
          <div className="flex items-center gap-3 mb-6">
            <IconAlertTriangle className="w-7 h-7 text-[#F49E2C]" />
            <h3 className="text-xl font-bold text-[#16233B]">Carga de Trabajo Actual</h3>
          </div>

          <div className="mb-4 p-4 bg-white rounded-lg border border-orange-200">
            <p className="text-sm text-gray-700 mb-3">
              <strong>Tu solicitud se suma al trabajo pendiente.</strong> El equipo de DECOM procesa las solicitudes
              por orden de prioridad y fecha del evento. Aquí puedes ver la carga actual:
            </p>
          </div>

          {statsLoading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="text-center p-4 bg-white rounded-lg border">
                    <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : stats ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                  <div className="text-3xl font-bold text-[#15539C] mb-1">{stats.total_active}</div>
                  <div className="text-sm font-medium text-gray-700">Solicitudes Activas</div>
                  <div className="text-xs text-gray-500 mt-1">Total en proceso</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-orange-200 shadow-sm">
                  <div className="text-3xl font-bold text-orange-600 mb-1">{stats.pending}</div>
                  <div className="text-sm font-medium text-gray-700">Pendientes</div>
                  <div className="text-xs text-gray-500 mt-1">Esperando revisión</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-green-200 shadow-sm">
                  <div className="text-3xl font-bold text-green-600 mb-1">{stats.in_progress}</div>
                  <div className="text-sm font-medium text-gray-700">En Progreso</div>
                  <div className="text-xs text-gray-500 mt-1">Ya en diseño</div>
                </div>
              </div>

              {stats.upcoming_events.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-[#16233B] mb-3 flex items-center gap-2 text-lg">
                    <IconCalendar size={20} />
                    Próximos Eventos (7 días)
                  </h4>
                  <div className="space-y-3">
                    {stats.upcoming_events.slice(0, 5).map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                        <div className="flex-1">
                          <span className="font-medium text-[#16233B]">{event.event_name}</span>
                          <span className="text-gray-500 ml-2 text-sm">({event.committee?.name})</span>
                        </div>
                        <span className="text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded text-sm">
                          {new Date(event.event_date).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <IconClock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">¿Cuánto tiempo toma?</p>
                    <p className="text-sm text-blue-800">
                      El proceso típico incluye: revisión (1-2 días), diseño (3-5 días), producción (1-2 días)
                      y entrega. Los tiempos pueden variar según la complejidad y carga de trabajo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
              <IconAlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No se pudo cargar la información del sistema.</p>
              <p className="text-xs text-gray-500 mt-1">Esto no afecta tu solicitud.</p>
            </div>
          )}
        </Card>

        {/* Tarjeta de Resumen */}
        <Card padding="lg" className="mb-8 space-y-4 border-l-4 border-l-[#15539C]">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#4CAF50] to-[#45a049] text-white font-bold flex-shrink-0">
                1
              </span>
              <div>
                <p className="font-semibold text-[#16233B]">Solicitud Recibida</p>
                <p className="text-sm text-gray-700">
                  {requestId ? (
                    <>
                      Número de solicitud: <code className="bg-gray-200 text-[#16233B] px-2 py-1 rounded font-mono font-semibold">{requestId.slice(0, 8)}</code>
                    </>
                  ) : (
                    'Tu solicitud ha sido registrada en nuestro sistema.'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#15539C] to-[#0f3a6b] text-white font-bold flex-shrink-0">
                <IconClock size={24} />
              </span>
              <div>
                <p className="font-semibold text-[#16233B]">En Proceso de Revisión</p>
                <p className="text-sm text-gray-700">
                  El equipo de DECOM revisará tu solicitud y comenzará el proceso de diseño.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#F49E2C] to-[#E88D1B] text-white font-bold flex-shrink-0">
                <IconPhone size={24} />
              </span>
              <div>
                <p className="font-semibold text-[#16233B]">Te Contactaremos por WhatsApp</p>
                <p className="text-sm text-gray-700">
                  Recibirás actualizaciones y notificaciones sobre el estado de tu solicitud.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Información Importante */}
        <Card padding="lg" className="mb-8 border-l-4 border-l-[#F49E2C] bg-orange-50">
          <h3 className="font-semibold text-[#16233B] mb-2">Información Importante</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ Revisa el número de solicitud para referencias futuras</li>
            <li>✓ Mantén activo tu WhatsApp para recibir actualizaciones</li>
            <li>✓ El equipo te contactará próximamente</li>
            <li>✓ Puedes ver la carga de trabajo en nuestro calendario público</li>
          </ul>
        </Card>

        {/* Botones de Acción */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/calendar">
            <Button variant="outline" fullWidth className="h-12 border-2 border-[#15539C] text-[#15539C] hover:bg-[#15539C] hover:text-white font-semibold">
              Ver Calendario Público
            </Button>
          </Link>
          <Link href="/new-request">
            <Button variant="primary" fullWidth className="h-12 bg-gradient-to-r from-[#15539C] to-[#16233B] hover:shadow-lg text-white font-semibold">
              Crear Otra Solicitud
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-600">
          <p>
            ¿Necesitas ayuda? Contacta al equipo de DECOM directamente.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Gracias por usar el Sistema DECOM - Gestión de Comunicaciones
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Layout title="Solicitud Confirmada">
      <Suspense fallback={<div className="min-h-screen bg-gray-100" />}>
        <ConfirmationContent />
      </Suspense>
    </Layout>
  )
}
