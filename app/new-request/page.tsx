'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FormStep1, FormStep2, type Step1Data, type Step2Data } from '../components/Forms/RequestForm'
import { Layout } from '../components/Layout'
import { Card } from '../components/UI/Card'
import { IconAlertCircle, IconRocket } from '@tabler/icons-react'

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
      // Normalizar el número de WhatsApp
      let whatsappNumber = data.contact_whatsapp.trim()
      // Eliminar espacios, paréntesis, guiones
      whatsappNumber = whatsappNumber.replace(/[\s\-\(\)]/g, '')
      // Si ya tiene +57, no agregar
      if (!whatsappNumber.startsWith('+57')) {
        // Si solo tiene 10 dígitos (comienza con 3), agregar +57
        if (whatsappNumber.length === 10 && whatsappNumber.startsWith('3')) {
          whatsappNumber = `+57${whatsappNumber}`
        } else if (whatsappNumber.length === 12 && whatsappNumber.startsWith('573')) {
          // Si tiene 12 dígitos sin +, agregar +
          whatsappNumber = `+${whatsappNumber}`
        }
      }

      // Preparar los datos para el API
      const requestData = {
        committee_id: data.committee_id,
        event_name: data.event_name,
        event_info: data.event_info,
        event_date: data.event_date,
        event_time: data.event_time,
        material_type: data.material_type,
        contact_whatsapp: whatsappNumber,
        include_bible_verse: data.include_bible_verse,
        bible_verse_text: data.bible_verse_text || undefined,
      }

      console.log('Sending request data:', requestData)

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
        console.error('API Error details:', result)
        console.error('Validation details:', result.details)
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
      <div className="relative py-8">
        {/* Content */}
        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-dashboard-card border border-dashboard-card-border shadow-xl">
              <IconRocket className="w-8 h-8 text-decom-secondary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-dashboard-text-primary mb-2 tracking-tight uppercase">
              {step === 1 ? 'Nueva Solicitud' : 'Confirmar Detalles'}
            </h1>
            <p className="text-dashboard-text-secondary text-sm md:text-base font-medium">
              {step === 1
                ? 'Comienza el proceso creativo para tu próximo evento'
                : 'Revisa y completa la información de tu solicitud'
              }
            </p>
          </motion.div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-5 rounded-2xl bg-decom-error/10 border border-decom-error/20 backdrop-blur-md flex items-start gap-4 shadow-xl shadow-decom-error/5"
            >
              <div className="p-2 bg-decom-error/20 rounded-xl">
                <IconAlertCircle className="w-6 h-6 text-decom-error flex-shrink-0" />
              </div>
              <div>
                <h4 className="text-sm font-black text-decom-error uppercase tracking-wider">Error en la solicitud</h4>
                <p className="text-dashboard-text-secondary text-sm font-medium mt-1">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-dashboard-card rounded-3xl shadow-2xl p-6 md:p-10 border border-dashboard-card-border/50 relative overflow-hidden backdrop-blur-sm"
          >
            {/* Decorative gradients */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-decom-primary/5 blur-[100px] -z-10 rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-decom-secondary/5 blur-[100px] -z-10 rounded-full" />

            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-decom-secondary to-transparent" />

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
          </motion.div>

          {/* Footer Info */}
          <motion.div
            className="mt-8 text-center space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-white/90 text-sm font-medium">
              ¿Dudas?{' '}
              <a href="/calendar" className="text-[#F49E2C] font-semibold hover:text-white transition-colors">
                Ver calendario
              </a>
            </p>
            <p className="text-white/80 text-xs font-medium">
              Tus datos serán procesados de manera confidencial y segura
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}
