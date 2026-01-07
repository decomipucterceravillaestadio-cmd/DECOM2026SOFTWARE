'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormStep1, FormStep2, type Step1Data, type Step2Data } from '../components/Forms/RequestForm'
import { Layout } from '../components/Layout'
import { Card } from '../components/UI/Card'

export default function NewRequestPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStep1Next = (data: Step1Data) => {
    setStep1Data(data)
    setStep(2)
    window.scrollTo(0, 0)
  }

  const handleStep2Back = () => {
    setStep(1)
    window.scrollTo(0, 0)
  }

  const handleStep2Submit = async (data: Step1Data & Step2Data) => {
    setIsLoading(true)
    setError(null)

    try {
      // Preparar los datos para el API
      const requestData = {
        committee_id: data.committee_id,
        event_name: data.event_name,
        event_info: data.event_info,
        event_date: data.event_date,
        material_type: data.material_type,
        contact_whatsapp: `+57${data.contact_whatsapp}`,
        include_bible_verse: data.include_bible_verse,
        bible_verse_text: data.bible_verse_text || null,
      }

      // Enviar la solicitud
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Error al crear la solicitud')
      }

      // Redireccionar a página de confirmación con ID de solicitud
      router.push(`/confirmation?requestId=${result.data.id}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      console.error('Error submitting request:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout title={step === 1 ? 'Nueva Solicitud' : 'Detalles del Material'}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header Informativo */}
          <Card padding="lg" className="mb-8 border-l-4 border-l-decom-primary bg-gradient-to-r from-decom-primary/5 to-transparent">
            <h2 className="text-lg font-bold text-decom-primary mb-2">
              📝 Crear Nueva Solicitud de Material
            </h2>
            <p className="text-sm text-gray-700">
              Completa los siguientes pasos para solicitar diseño de material publicitario para tu evento.
              El equipo de DECOM revisará tu solicitud y se contactará por WhatsApp.
            </p>
          </Card>

          {/* Contenedor del Formulario */}
          <Card padding="lg" className="space-y-6">
            {step === 1 ? (
              <FormStep1 onNext={handleStep1Next} initialData={step1Data || undefined} />
            ) : (
              <FormStep2
                step1Data={step1Data!}
                onBack={handleStep2Back}
                onSubmit={handleStep2Submit}
                isLoading={isLoading}
                error={error || undefined}
              />
            )}
          </Card>

          {/* Footer con información */}
          <div className="mt-8 text-center text-sm text-gray-600 space-y-2">
            <p>
              ¿Dudas? Contacta a DECOM directamente en nuestro{' '}
              <a href="/calendar" className="text-decom-primary font-semibold hover:underline">
                calendario público
              </a>
            </p>
            <p className="text-xs text-gray-500">
              Todos los datos enviados serán procesados de manera confidencial y segura.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
