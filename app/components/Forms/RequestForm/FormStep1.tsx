'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  IconClipboardList,
  IconTag,
  IconFileText,
  IconCalendar,
  IconRocket,
  IconPackage,
  IconInfoCircle,
  IconCalendarEvent
} from '@tabler/icons-react'
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
  committee_id: z.string().uuid('Debes seleccionar un comité'),
  event_name: z
    .string()
    .min(5, 'Mínimo 5 caracteres')
    .max(200, 'Máximo 200 caracteres'),
  event_info: z
    .string()
    .min(5, 'Mínimo 5 caracteres')
    .max(500, 'Máximo 500 caracteres'),
  event_date: z.string(),
  event_time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'),
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
  const [searchTerm, setSearchTerm] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null)

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
    setValue,
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

  // Sincronizar selectedCommittee con el form
  useEffect(() => {
    const currentId = watch('committee_id')
    if (currentId && committees.length > 0) {
      const committee = committees.find(c => c.id === currentId)
      if (committee) {
        setSelectedCommittee(committee)
        setSearchTerm(committee.name)
      }
    }
  }, [watch('committee_id'), committees])

  const filteredCommittees = committees.filter(committee =>
    committee.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectCommittee = (committee: Committee) => {
    setSelectedCommittee(committee)
    setValue('committee_id', committee.id)
    setSearchTerm(committee.name)
    setIsDropdownOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setIsDropdownOpen(true)
    if (!value) {
      setSelectedCommittee(null)
      setValue('committee_id', '')
    }
  }

  const handleInputFocus = () => {
    setIsDropdownOpen(true)
  }

  const handleInputBlur = () => {
    // Delay to allow click on options, pero mantener dropdown abierto si hay opciones
    setTimeout(() => {
      if (!selectedCommittee) {
        setIsDropdownOpen(false)
      }
    }, 100)
  }

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
          icon={<IconClipboardList size={24} />}
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
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Busca y selecciona tu comité..."
                  className="w-full px-3 md:px-4 py-3 text-base border-2 border-dashboard-card-border rounded-xl focus:outline-none focus:ring-4 focus:ring-decom-secondary/10 focus:border-decom-secondary bg-dashboard-card text-dashboard-text-primary transition-all hover:border-dashboard-text-muted/30 font-medium"
                />
                {isDropdownOpen && filteredCommittees.length > 0 && (
                  <div
                    className="absolute z-50 w-full mt-2 bg-dashboard-card border border-dashboard-card-border rounded-xl shadow-2xl max-h-60 overflow-y-auto backdrop-blur-md"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {filteredCommittees.map((committee) => (
                      <button
                        key={committee.id}
                        type="button"
                        onClick={() => handleSelectCommittee(committee)}
                        className="w-full text-left px-4 py-3 hover:bg-dashboard-bg/80 cursor-pointer text-dashboard-text-primary border-b border-dashboard-card-border last:border-b-0 transition-colors"
                      >
                        {committee.name}
                      </button>
                    ))}
                  </div>
                )}
                {!selectedCommittee && (
                  <input type="hidden" {...register('committee_id')} />
                )}
                {selectedCommittee && (
                  <input type="hidden" {...register('committee_id')} value={selectedCommittee.id} />
                )}
              </div>
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
              icon={<IconTag size={20} />}
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
              icon={<IconFileText size={20} />}
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
              icon={<IconCalendarEvent size={20} />}
              {...register('event_date')}
              isValid={!errors.event_date}
            />
          </FormField>

          {/* Event Time */}
          <FormField
            label="Hora del Evento"
            required
            error={errors.event_time?.message}
          >
            <EnhancedInput
              id="event_time"
              type="time"
              icon={<IconCalendarEvent size={20} />}
              {...register('event_time')}
              isValid={!errors.event_time}
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
            <p className="text-xs md:text-sm font-black text-dashboard-text-muted uppercase tracking-widest">
              Cronograma Sugerido
            </p>
            <div className="space-y-2 md:space-y-3">
              <InfoCard
                icon={<IconRocket size={24} />}
                title={planningDate ? formatDate(planningDate, 'long') : '-'}
                subtitle="Planificación Inicia"
                details="7 días antes del evento para comenzar el proceso de diseño"
                variant="primary"
              />

              <InfoCard
                icon={<IconPackage size={24} />}
                title={deliveryDate ? formatDate(deliveryDate, 'long') : '-'}
                subtitle="Entrega Sugerida"
                details="2 días antes del evento para revisiones finales"
                variant="secondary"
              />

              <motion.div
                className="p-4 bg-decom-primary/5 border-l-4 border-decom-primary rounded-r-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-sm text-dashboard-text-secondary font-medium flex items-start gap-3">
                  <IconInfoCircle size={20} className="text-decom-primary flex-shrink-0 mt-0.5" />
                  <span>
                    Tienes <strong className="text-dashboard-text-primary">{daysRemaining} días</strong> para preparar tu
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
              className="w-full border-2 border-[#15539C] text-[#15539C] hover:bg-[#15539C] hover:text-white font-bold py-3 md:py-3.5 transition-all flex items-center justify-center gap-2"
            >
              <IconCalendar size={20} /> Ver Calendario
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
