'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconPalette,
  IconPhone,
  IconBook,
  IconFileText,
  IconVideo,
  IconBrandInstagram,
  IconPackage,
  IconQuote,
  IconArrowLeft,
  IconCheck,
  IconCamera,
  IconAlertCircle
} from '@tabler/icons-react'
import { Button } from '../../UI/Button'
import { cn } from '@/lib/utils'
import type { Step1Data } from './FormStep1'
import {
  ProgressIndicator,
  FormField,
  FormSection,
  SelectButtonGroup,
  EnhancedInput,
  EnhancedTextarea,
} from '../FormComponents'

// Esquema de validación para Step 2
const step2Schema = z
  .object({
    material_type: z.enum(['poster', 'video', 'otro']),
    contact_whatsapp: z
      .string()
      .min(10, 'Número muy corto')
      .refine(
        (val) => {
          // Normalizar: eliminar espacios, guiones, paréntesis
          const cleaned = val.replace(/[\s\-\(\)]/g, '')
          // Debe contener solo dígitos y opcionalmente +
          const digits = cleaned.replace(/^\+/, '')
          // Validar: +57XXXXXXXXXX (12 dígitos) o XXXXXXXXXX (10 dígitos)
          // para números colombianos que empiezan con 3
          return /^3\d{9}$/.test(digits) || /^573\d{9}$/.test(digits)
        },
        'Número WhatsApp inválido (Ej: 3001234567 o +573001234567)'
      ),
    include_bible_verse: z.boolean(),
    bible_verse_text: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.include_bible_verse) {
        return data.bible_verse_text && data.bible_verse_text.length > 0
      }
      return true
    },
    {
      message: 'La cita bíblica es requerida cuando está activada',
      path: ['bible_verse_text'],
    }
  )

export type Step2Data = z.infer<typeof step2Schema>

interface FormStep2Props {
  step1Data: Step1Data
  onBack: () => void
  onSubmit: (data: Step1Data & Step2Data) => void
  isLoading?: boolean
  error?: string
}

const MATERIAL_TYPES = [
  { id: 'poster', label: 'Póster', icon: <IconCamera size={28} />, description: 'Foto publicitaria del evento' },
  { id: 'video', label: 'Video', icon: <IconVideo size={28} />, description: 'Contenido video' },
  { id: 'otro', label: 'Otro', icon: <IconPackage size={28} />, description: 'Especificar' },
]

export function FormStep2({
  step1Data,
  onBack,
  onSubmit,
  isLoading = false,
  error,
}: FormStep2Props) {
  const [isLoadingRequest, setIsLoadingRequest] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setValue,
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      material_type: 'poster',
      include_bible_verse: false,
    },
  })

  const includeBibleVerse = watch('include_bible_verse')
  const selectedMaterialType = watch('material_type')

  const handleFormSubmit = async (data: Step2Data) => {
    setIsLoadingRequest(true)
    try {
      await onSubmit({ ...step1Data, ...data })
    } finally {
      setIsLoadingRequest(false)
    }
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
        currentStep={2}
        totalSteps={2}
        stepTitle="Detalles del Material"
      />

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 md:space-y-8">
        {/* Material Type Section */}
        <FormSection
          title="Tipo de Material"
          description="Selecciona qué tipo de material necesitas para tu evento"
          icon={<IconPalette size={24} />}
        >
          <SelectButtonGroup
            options={MATERIAL_TYPES}
            value={selectedMaterialType}
            onChange={(value) => {
              setValue('material_type', value as Step2Data['material_type'], {
                shouldValidate: true,
                shouldDirty: true
              })
            }}
            error={errors.material_type?.message}
          />
          {/* Render the hidden input */}
          <input
            type="hidden"
            value={selectedMaterialType}
            {...register('material_type')}
          />
        </FormSection>

        {/* Contact Section */}
        <FormSection
          title="Información de Contacto"
          description="Cómo podemos notificarte sobre el progreso de tu solicitud"
          icon={<IconPhone size={24} />}
        >
          <FormField
            label="Número de WhatsApp"
            required
            error={errors.contact_whatsapp?.message}
            hint="+57 3XX XXX XXXX"
          >
            <div className="flex gap-0 rounded-xl overflow-hidden border-2 border-dashboard-card-border focus-within:border-decom-secondary focus-within:ring-4 focus-within:ring-decom-secondary/10 transition-all">
              <div className="flex items-center px-3 md:px-4 bg-dashboard-bg border-r border-dashboard-card-border">
                <span className="font-bold text-dashboard-text-primary text-sm md:text-base">🇨🇴 +57</span>
              </div>
              <input
                type="tel"
                placeholder="300 123 4567"
                maxLength={10}
                {...register('contact_whatsapp')}
                className="flex-1 px-3 md:px-4 py-3 text-base text-dashboard-text-primary placeholder-dashboard-text-muted/50 border-0 focus:outline-none bg-dashboard-card w-full font-medium"
              />
            </div>
            <p className="text-xs text-dashboard-text-muted font-black uppercase tracking-wider mt-2.5 ml-1">
              Te notificaremos el estado de tu solicitud por WhatsApp
            </p>
          </FormField>
        </FormSection>

        {/* Bible Verse Optional Section */}
        <motion.div
          layout
          className={cn(
            "border-2 rounded-2xl p-5 md:p-8 transition-all duration-300 relative overflow-hidden",
            includeBibleVerse
              ? "border-decom-primary bg-decom-primary/5 shadow-xl shadow-decom-primary/5"
              : "border-dashed border-dashboard-card-border bg-dashboard-card/30 hover:border-decom-primary/40"
          )}
        >
          {includeBibleVerse && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-decom-primary/10 blur-3xl -mr-16 -mt-16" />
          )}

          <div className="space-y-6 relative z-10">
            {/* Toggle */}
            <label className="flex items-center justify-between cursor-pointer group select-none">
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    {...register('include_bible_verse')}
                    className="peer sr-only"
                  />
                  <div className="w-12 h-6 bg-dashboard-bg border border-dashboard-card-border rounded-full peer peer-checked:bg-decom-primary transition-all duration-300 shadow-inner" />
                  <div className="absolute left-1 top-1 w-4 h-4 bg-dashboard-text-muted rounded-full peer-checked:translate-x-6 peer-checked:bg-white transition-all duration-300 shadow-sm" />
                </div>
                <div className="flex-1">
                  <span className="font-black text-dashboard-text-primary flex items-center gap-2 text-sm md:text-base uppercase tracking-tight">
                    <IconBook size={20} className="text-decom-primary" /> Incluir Cita Bíblica
                  </span>
                  <p className="text-[10px] md:text-xs text-dashboard-text-secondary font-medium mt-0.5">
                    Opcional • Agrega un toque espiritual a tu material
                  </p>
                </div>
              </div>
            </label>

            {/* Bible Verse Input - Animated */}
            <AnimatePresence>
              {includeBibleVerse && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="space-y-4 pt-6 border-t border-decom-primary/10"
                >
                  <FormField
                    label="Texto de la Cita Bíblica"
                    required={includeBibleVerse}
                    error={errors.bible_verse_text?.message}
                  >
                    <EnhancedTextarea
                      id="bible_verse_text"
                      placeholder="Ej: 'Todo lo puedo en Cristo que me fortalece' - Filipenses 4:13"
                      rows={2}
                      icon={<IconQuote size={20} />}
                      {...register('bible_verse_text')}
                    />
                  </FormField>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Global Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="p-4 bg-decom-error/10 border-l-4 border-decom-error rounded-r-xl text-decom-error text-sm font-bold flex items-start gap-3 shadow-lg shadow-decom-error/5"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <IconAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <motion.div
          className="flex gap-3 pt-6 md:pt-8 flex-col sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isLoadingRequest}
            className="flex-1 border-2 border-[#15539C] text-[#15539C] hover:bg-[#15539C] hover:text-white font-bold py-3 md:py-3.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <IconArrowLeft size={20} /> Atrás
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-[#15539C] to-[#16233B] hover:shadow-lg text-white font-bold py-3 md:py-3.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            fullWidth
            disabled={isLoadingRequest}
          >
            {isLoadingRequest ? (
              <motion.span
                className="flex items-center justify-center gap-2"
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Enviando solicitud...
              </motion.span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <IconCheck size={20} /> Enviar Solicitud
              </span>
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  )
}
