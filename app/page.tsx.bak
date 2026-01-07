'use client'

import Link from 'next/link'
import { Button } from './components/UI/Button'
import { FormStep1, FormStep2, type Step1Data, type Step2Data } from './components/Forms/RequestForm'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from './components/UI/Card'
import { AceternitiyLoginForm } from './components/Aceternity'

export default function Home() {
  const router = useRouter()
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Si no es la página de inicio, mostrar el formulario de login
  if (showLoginForm) {
    return (
      <AceternitiyLoginForm
        isLoading={isLoading}
        error={error}
        onSubmit={async (email, password) => {
          setIsLoading(true)
          setError(null)
          try {
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
            })

            if (!response.ok) {
              const data = await response.json()
              throw new Error(data.message || 'Error al iniciar sesión')
            }

            router.push('/admin/dashboard')
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
          } finally {
            setIsLoading(false)
          }
        }}
      />
    )
  }

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header con Logo y Botón de Login */}
      <header className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-decom-primary to-decom-secondary flex items-center justify-center text-white font-bold text-lg">
              D
            </div>
            <h1 className="text-xl font-bold text-decom-primary">DECOM</h1>
          </div>

          <nav className="flex items-center gap-3">
            <Link href="/calendar">
              <Button variant="ghost" className="text-sm">
                📅 Calendario Público
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="primary" className="text-sm">
                🔐 Iniciar Sesión
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Sección Informativa */}
        <div className="mb-8 text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Solicita tu Material Publicitario
          </h2>
          <p className="text-lg text-gray-600">
            Completa el formulario para que el equipo DECOM diseñe el material para tu evento
          </p>
        </div>

        {/* Tarjeta Principal con Formulario */}
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

        {/* Footer Informativo */}
        <div className="mt-8 text-center space-y-3 text-sm text-gray-600">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card padding="sm" className="text-center">
              <div className="text-2xl mb-2">⚡</div>
              <p className="font-semibold text-gray-900">Rápido</p>
              <p className="text-xs">2 pasos sencillos</p>
            </Card>
            <Card padding="sm" className="text-center">
              <div className="text-2xl mb-2">📱</div>
              <p className="font-semibold text-gray-900">Directo</p>
              <p className="text-xs">Te contactamos por WhatsApp</p>
            </Card>
            <Card padding="sm" className="text-center">
              <div className="text-2xl mb-2">✨</div>
              <p className="font-semibold text-gray-900">Profesional</p>
              <p className="text-xs">Diseño de calidad</p>
            </Card>
          </div>

          <div className="border-t pt-4 space-y-1">
            <p>
              ¿Administrador? {' '}
              <Link href="/login" className="text-decom-primary font-semibold hover:underline">
                Accede al panel
              </Link>
            </p>
            <p className="text-xs text-gray-500">
              Sistema DECOM - Gestión de Comunicaciones | {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
