'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '../../UI/Button'
import { Skeleton } from '../../UI/Skeleton'
import {
  calculatePlanningStartDate,
  calculateDeliveryDate,
  daysUntilEvent,
  formatDate,
} from '../../../lib/dateUtils'
import {
  ProgressIndicator,
  FormField,
  FormSection,
  InfoCard,
  EnhancedInput,
  EnhancedTextarea,
} from '../FormComponents'

// Esquema de validación para Step 1
const step1Schema = z.object({
  committee_id: z.string().uuid('Debes seleccionar un comité').optional(),
  event_name: z
    .string()
    .min(5, 'Mínimo 5 caracteres')
    .max(200, 'Máximo 200 caracteres'),
  event_info: z
    .string()
    .min(5, 'Mínimo 5 caracteres')
    .max(500, 'Máximo 500 caracteres'),
  event_date: z
    .string()
    .refine((date) => new Date(date) > new Date(), 'La fecha debe ser futura'),
})

export type Step1Data = z.infer<typeof step1Schema>

interface Committee {
  id: string
  name: string
  description?: string
  color_badge?: string
}

interface FormStep1Props {
  onNext: (data: Step1Data) => void
  initialData?: Step1Data
}

export function FormStep1({ onNext, initialData }: FormStep1Props) {
  const [committees, setCommittees] = useState<Committee[]>([])
  const [isLoadingCommittees, setIsLoadingCommittees] = useState(true)
  const [errorCommittees, setErrorCommittees] = useState<string | null>(null)

  // Calcular fechas derivadas
  const eventDateValue = initialData?.event_date
  const eventDate = eventDateValue ? new Date(eventDateValue) : null
  const planningDate = eventDate ? calculatePlanningStartDate(eventDate) : null
  const deliveryDate = eventDate ? calculateDeliveryDate(eventDate) : null
  const daysRemaining = eventDate ? daysUntilEvent(eventDate) : 0

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: initialData,
  })

  // Cargar comités al montar el componente
  useEffect(() => {
    async function fetchCommittees() {
      try {
        setIsLoadingCommittees(true)
        setErrorCommittees(null)

        const response = await fetch('/api/committees')
        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Error al cargar comités')
        }

        setCommittees(result.data || [])
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error desconocido'
        setErrorCommittees(message)
        console.error('Error fetching committees:', error)
      } finally {
        setIsLoadingCommittees(false)
      }
    }

    fetchCommittees()
  }, [])

  const onSubmit = (data: Step1Data) => {
    onNext(data)
  }

  return (
    <motion.div
      className="space-y-6 md:space-y-8 w-full max-w-2xl mx-auto px-4 py-6 md:py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Progress Indicator */}
      <ProgressIndicator
        currentStep={1}
        totalSteps={2}
        stepTitle="Información del Evento"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
        {/* Main Section - Event Details */}
        <FormSection
          title="Detalles del Evento"
          description="Proporciona información básica sobre tu evento para iniciar el proceso de solicitud"
          icon="📋"
        >
          {/* Comité Selection */}
          <FormField
            label="Comité Solicitante"
            required
            error={errors.committee_id?.message}
            hint={isLoadingCommittees ? 'Cargando...' : undefined}
          >
            {isLoadingCommittees ? (
              <Skeleton height={50} className="w-full rounded-xl" />
            ) : errorCommittees ? (
              <motion.div
                className="p-3 md:p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm font-medium flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {errorCommittees}
              </motion.div>
            ) : (
              <select
                id="committee_id"
                {...register('committee_id')}
                className="w-full px-3 md:px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#15539C]/20 focus:border-[#15539C] bg-white text-gray-800 transition-all hover:border-gray-300 appearance-none font-medium cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2315539C' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  paddingRight: '2.5rem',
                }}
              >
                <option value="">Selecciona tu comité...</option>
                {committees.map((committee) => (
                  <option key={committee.id} value={committee.id}>
                    {committee.name}
                  </option>
                ))}
              </select>
            )}
          </FormField>

          {/* Event Name */}
          <FormField
            label="Nombre del Evento"
            required
            error={errors.event_name?.message}
            hint={`${(watch('event_name')?.length || 0)}/200`}
          >
            <EnhancedInput
              id="event_name"
              type="text"
              placeholder="Ej: Retiro de Jóvenes 2026"
              icon="🏷️"
              {...register('event_name')}
              maxLength={200}
              isValid={!errors.event_name}
            />
          </FormField>

          {/* Event Description */}
          <FormField
            label="Descripción y Detalles"
            required
            error={errors.event_info?.message}
            hint={`${(watch('event_info')?.length || 0)}/500`}
          >
            <EnhancedTextarea
              id="event_info"
              placeholder="Describe el propósito del evento, público objetivo, y cualquier detalle relevante..."
              rows={4}
              icon="📝"
              characterLimit={500}
              {...register('event_info')}
              maxLength={500}
            />
          </FormField>

          {/* Event Date */}
          <FormField
            label="Fecha del Evento"
            required
            error={errors.event_date?.message}
          >
            <EnhancedInput
              id="event_date"
              type="date"
              icon="📅"
              {...register('event_date')}
              isValid={!errors.event_date}
            />
          </FormField>
        </FormSection>

        {/* Timeline Info */}
        {eventDate && (
          <motion.div
            className="space-y-3 md:space-y-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <p className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-widest">
              Cronograma Sugerido
            </p>
            <div className="space-y-2 md:space-y-3">
              <InfoCard
                icon="🚀"
                title={planningDate ? formatDate(planningDate, 'long') : '-'}
                subtitle="Planificación Inicia"
                details="7 días antes del evento para comenzar el proceso de diseño"
                variant="primary"
              />

              <InfoCard
                icon="📦"
                title={deliveryDate ? formatDate(deliveryDate, 'long') : '-'}
                subtitle="Entrega Sugerida"
                details="2 días antes del evento para revisiones finales"
                variant="secondary"
              />

              <motion.div
                className="p-3 md:p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-xs md:text-sm text-blue-900 font-medium flex items-start gap-2">
                  <span className="text-base md:text-lg flex-shrink-0">ℹ️</span>
                  <span>
                    Tienes <strong>{daysRemaining} días</strong> para preparar tu
                    solicitud. Cuanta más información proporciones, mejor será el
                    resultado.
                  </span>
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          className="flex gap-3 pt-6 md:pt-8 flex-col sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Link href="/calendar" className="flex-1">
            <Button
              variant="outline"
              className="w-full border-2 border-[#15539C] text-[#15539C] hover:bg-[#15539C] hover:text-white font-bold py-3 md:py-3.5 transition-all"
            >
              📅 Ver Calendario
            </Button>
          </Link>
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-[#15539C] to-[#16233B] hover:shadow-lg text-white font-bold py-3 md:py-3.5 transition-all active:scale-95"
            fullWidth
          >
            Continuar →
          </Button>
        </motion.div>
      </form>
    </motion.div>
  )
}
