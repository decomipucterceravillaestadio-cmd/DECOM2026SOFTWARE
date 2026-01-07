'use client'

import React from 'react'
import { motion } from 'framer-motion'

// Indicador de Progreso Profesional
interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  stepTitle: string
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  stepTitle,
}: ProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#15539C] to-[#16233B] text-white text-sm font-bold">
            {currentStep}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Paso {currentStep} de {totalSteps}
            </span>
            <span className="text-sm font-semibold text-[#16233B]">{stepTitle}</span>
          </div>
        </div>
        <span className="text-xs font-bold text-gray-400">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#15539C] via-[#F49E2C] to-[#F49E2C] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  )
}

// Campo de Formulario con Validación Visual
interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  hint?: string | number
  children: React.ReactNode
  className?: string
}

export function FormField({
  label,
  error,
  required = false,
  hint,
  children,
  className = '',
}: FormFieldProps) {
  return (
    <motion.div
      className={`space-y-2 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-baseline justify-between">
        <label className="block text-sm font-semibold text-[#16233B]">
          {label}
          {required && <span className="ml-1 text-red-500 font-bold">*</span>}
        </label>
        {hint && !error && (
          <span className="text-xs text-gray-500 font-medium">{hint}</span>
        )}
      </div>

      <div className={`relative transition-all duration-200 ${error ? 'ring-2 ring-red-400/50' : ''}`}>
        {children}
      </div>

      {error && (
        <motion.p
          className="text-sm text-red-600 font-medium flex items-center gap-1"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.586l-6.687-6.687a1 1 0 00-1.414 1.414l8.101 8.1a1 1 0 001.414 0l8.101-8.1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </motion.p>
      )}
    </motion.div>
  )
}

// Sección de Formulario con Divisor Visual
interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  icon?: React.ReactNode
}

export function FormSection({
  title,
  description,
  children,
  icon,
}: FormSectionProps) {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className="p-2 rounded-lg bg-gradient-to-br from-[#15539C]/10 to-[#F49E2C]/10">
            <span className="text-2xl">{icon}</span>
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[#16233B]">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">{description}</p>
          )}
        </div>
      </div>

      <div className="space-y-5 pt-2">{children}</div>
    </motion.div>
  )
}

// Card Info con Icono y Detalles
interface InfoCardProps {
  icon: string
  title: string
  subtitle: string
  details: string
  variant?: 'primary' | 'secondary'
  action?: React.ReactNode
}

export function InfoCard({
  icon,
  title,
  subtitle,
  details,
  variant = 'primary',
  action,
}: InfoCardProps) {
  const bgGradient =
    variant === 'primary'
      ? 'from-[#15539C]/5 to-transparent border-l-[#15539C]'
      : 'from-[#F49E2C]/5 to-transparent border-l-[#F49E2C]'

  return (
    <motion.div
      className={`bg-gradient-to-br ${bgGradient} border-l-4 p-5 rounded-lg space-y-2 hover:shadow-lg transition-shadow duration-300`}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-lg shadow-sm text-2xl flex-shrink-0">
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-600">
              {subtitle}
            </p>
            <p className="text-lg font-bold text-[#16233B] mt-1">{title}</p>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{details}</p>
          </div>
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </motion.div>
  )
}

// Select Button Group (Selector de Opciones Visual)
interface SelectButtonGroupProps {
  options: Array<{
    id: string
    label: string
    icon?: string
    description?: string
  }>
  value: string
  onChange: (value: string) => void
  columns?: number
  error?: string
}

export function SelectButtonGroup({
  options,
  value,
  onChange,
  columns = 5,
  error,
}: SelectButtonGroupProps) {
  return (
    <motion.div layout className="space-y-3">
      <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(auto-fit, minmax(80px, 1fr))` }}>
        {options.map((option) => (
          <motion.button
            key={option.id}
            onClick={() => onChange(option.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-[100px] ${
              value === option.id
                ? 'border-[#15539C] bg-gradient-to-br from-[#15539C] to-[#16233B] text-white shadow-lg'
                : 'border-gray-200 bg-white text-gray-600 hover:border-[#F49E2C] hover:shadow-md'
            }`}
          >
            {option.icon && (
              <span className="text-3xl filter drop-shadow-sm">{option.icon}</span>
            )}
            <span className="text-xs font-bold uppercase tracking-wide text-center leading-tight">
              {option.label}
            </span>
            {value === option.id && (
              <motion.div
                className="absolute -top-2 -right-2 bg-[#F49E2C] text-white rounded-full p-1 shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>
            )}
            {option.description && (
              <span className="text-[10px] text-gray-500 leading-tight hidden sm:block">
                {option.description}
              </span>
            )}
          </motion.button>
        ))}
      </div>
      {error && (
        <motion.p
          className="text-sm text-red-600 font-medium"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  )
}

// Input Mejorado con Icono
interface EnhancedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  suffix?: React.ReactNode
  isValid?: boolean
}

export const EnhancedInput = React.forwardRef<
  HTMLInputElement,
  EnhancedInputProps
>(({ icon, suffix, isValid, className = '', ...props }, ref) => {
  return (
    <div className="relative group">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#15539C] transition-colors">
          {icon}
        </div>
      )}
      <input
        ref={ref}
        className={`w-full px-4 py-3 ${icon ? 'pl-11' : ''} ${suffix ? 'pr-11' : ''} border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#15539C]/20 focus:border-[#15539C] bg-white transition-all duration-200 hover:border-gray-300 ${
          isValid === false ? 'border-red-400' : ''
        } ${className}`}
        {...props}
      />
      {suffix && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {suffix}
        </div>
      )}
    </div>
  )
})

EnhancedInput.displayName = 'EnhancedInput'

// Textarea Mejorado
interface EnhancedTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  icon?: React.ReactNode
  characterLimit?: number
}

export const EnhancedTextarea = React.forwardRef<
  HTMLTextAreaElement,
  EnhancedTextareaProps
>(({ icon, characterLimit, className = '', ...props }, ref) => {
  const [charCount, setCharCount] = React.useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length)
    props.onChange?.(e)
  }

  return (
    <div className="space-y-2 group">
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-4 text-gray-400 group-focus-within:text-[#15539C] transition-colors">
            {icon}
          </div>
        )}
        <textarea
          ref={ref}
          className={`w-full px-4 py-3 ${icon ? 'pl-11' : ''} border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#15539C]/20 focus:border-[#15539C] bg-white transition-all duration-200 hover:border-gray-300 resize-none ${className}`}
          onChange={handleChange}
          {...props}
        />
      </div>
      {characterLimit && (
        <p className="text-xs text-gray-500 font-medium text-right">
          {charCount} / {characterLimit}
        </p>
      )}
    </div>
  )
})

EnhancedTextarea.displayName = 'EnhancedTextarea'
