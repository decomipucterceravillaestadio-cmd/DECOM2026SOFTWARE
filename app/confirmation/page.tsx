'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../components/UI/Button'
import { Card } from '../components/UI/Card'
import { Layout } from '../components/Layout'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const requestId = searchParams.get('requestId')

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Mensaje de Éxito */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
            <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Solicitud Enviada Exitosamente!
          </h1>
          <p className="text-lg text-gray-600">
            Tu solicitud ha sido registrada en nuestro sistema.
          </p>
        </div>

        {/* Tarjeta de Resumen */}
        <Card padding="lg" className="mb-8 space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold flex-shrink-0">
                1
              </span>
              <div>
                <p className="font-semibold text-gray-900">Solicitud Recibida</p>
                <p className="text-sm text-gray-600">
                  {requestId ? (
                    <>
                      Número de solicitud: <code className="bg-gray-100 px-2 py-1 rounded">{requestId.slice(0, 8)}</code>
                    </>
                  ) : (
                    'Tu solicitud ha sido registrada en nuestro sistema.'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex-shrink-0">
                2
              </span>
              <div>
                <p className="font-semibold text-gray-900">En Proceso de Revisión</p>
                <p className="text-sm text-gray-600">
                  El equipo de DECOM revisará tu solicitud y comenzará el proceso de diseño.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold flex-shrink-0">
                3
              </span>
              <div>
                <p className="font-semibold text-gray-900">Te Contactaremos por WhatsApp</p>
                <p className="text-sm text-gray-600">
                  Recibirás actualizaciones y notificaciones sobre el estado de tu solicitud.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Información Importante */}
        <Card padding="lg" className="mb-8 border-l-4 border-l-amber-500 bg-amber-50">
          <h3 className="font-semibold text-amber-900 mb-2">Información Importante</h3>
          <ul className="space-y-2 text-sm text-amber-900">
            <li>✓ Revisa el número de solicitud para referencias futuras</li>
            <li>✓ Mantén activo tu WhatsApp para recibir actualizaciones</li>
            <li>✓ El equipo te contactará próximamente</li>
            <li>✓ Puedes ver la carga de trabajo en nuestro calendario público</li>
          </ul>
        </Card>

        {/* Botones de Acción */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/calendar">
            <Button variant="outline" fullWidth className="h-12">
              Ver Calendario Público
            </Button>
          </Link>
          <Link href="/new-request">
            <Button variant="primary" fullWidth className="h-12">
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
