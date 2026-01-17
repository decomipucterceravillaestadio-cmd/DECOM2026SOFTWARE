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
  IconCamera
} from '@tabler/icons-react'
import { Button } from '../../UI/Button'
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
            <div className="flex gap-0 rounded-xl overflow-hidden border-2 border-gray-300 focus-within:border-[#15539C] focus-within:ring-2 focus-within:ring-[#15539C]/20 transition-all">
              <div className="flex items-center px-3 md:px-4 bg-gradient-to-r from-gray-100 to-gray-50 border-r border-gray-300">
                <span className="font-bold text-gray-900 text-sm md:text-base">🇨🇴 +57</span>
              </div>
              <input
                type="tel"
                placeholder="300 123 4567"
                maxLength={10}
                {...register('contact_whatsapp')}
                className="flex-1 px-3 md:px-4 py-3 text-base text-gray-900 placeholder-gray-500 border-0 focus:outline-none w-full font-medium"
              />
            </div>
            <p className="text-xs text-gray-700 font-semibold mt-1.5 md:mt-2">
              Te notificaremos el estado de tu solicitud por WhatsApp
            </p>
          </FormField>
        </FormSection>

        {/* Bible Verse Optional Section */}
        <motion.div
          layout
          className={`border-2 rounded-xl p-4 md:p-6 transition-all duration-300 ${includeBibleVerse
            ? 'border-[#15539C] bg-gradient-to-br from-[#15539C]/5 to-transparent'
            : 'border-dashed border-gray-300 bg-white hover:border-[#15539C]/40'
            }`}
        >
          <div className="space-y-4 md:space-y-5">
            {/* Toggle */}
            <label className="flex items-center justify-between cursor-pointer group select-none">
              <div className="flex items-center gap-3">
                <motion.div
                  className="relative flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <input
                    type="checkbox"
                    {...register('include_bible_verse')}
                    className="peer sr-only"
                  />
                  <div className="w-10 h-6 md:w-12 md:h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#15539C]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] md:after:top-[3px] after:left-[2px] md:after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-300 peer-checked:bg-[#15539C] shadow-inner"></div>
                </motion.div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-gray-900 flex flex-wrap items-center gap-1 md:gap-2 text-sm md:text-base">
                    <IconBook size={20} className="flex-shrink-0" /> Incluir Cita Bíblica
                  </span>
                  <p className="text-[10px] md:text-xs text-gray-700 font-medium mt-0.5">
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
                  className="space-y-3 pt-3 md:pt-4 border-t border-[#15539C]/20"
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
              className="p-3 md:p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm font-medium flex items-start gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <svg
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
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
