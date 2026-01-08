'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../components/UI/Button'
import { Card } from '../components/UI/Card'
import { Layout } from '../components/Layout'
import { IconCheck, IconClock, IconPhone } from '@tabler/icons-react'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const requestId = searchParams.get('requestId')

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
