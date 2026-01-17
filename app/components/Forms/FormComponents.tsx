'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconCheck,
  IconAlertCircle,
  IconClipboardList,
  IconPalette,
  IconPhone,
  IconBook,
  IconRocket,
  IconPackage,
  IconCalendar,
  IconFileText,
  IconTag,
  IconQuote,
  IconChevronRight
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'

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
      className="space-y-3 md:space-y-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-decom-primary-light to-decom-primary text-white font-black shadow-lg shadow-decom-primary/20 text-sm">
            {currentStep}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-dashboard-text-muted">
              Paso {currentStep} de {totalSteps}
            </span>
            <span className="text-sm font-bold text-dashboard-text-primary">{stepTitle}</span>
          </div>
        </div>
        <div className="px-3 py-1 bg-dashboard-card border border-dashboard-card-border rounded-lg shadow-sm">
          <span className="text-[11px] font-black text-decom-secondary">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      <div className="relative h-2 bg-dashboard-card border border-dashboard-card-border rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-decom-primary-light via-decom-secondary to-decom-secondary rounded-full shadow-[0_0_10px_rgba(244,158,44,0.3)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
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
      className={cn("space-y-2", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-baseline justify-between flex-wrap gap-1 px-1">
        <label className="block text-sm font-bold text-dashboard-text-primary tracking-tight">
          {label}
          {required && <span className="ml-1 text-decom-error font-black">*</span>}
        </label>
        {hint && !error && (
          <span className="text-[11px] text-dashboard-text-muted font-bold uppercase tracking-wider">{hint}</span>
        )}
      </div>

      <div className={cn(
        "relative transition-all duration-300 rounded-2xl group",
        error ? "ring-2 ring-decom-error/30 shadow-lg shadow-decom-error/5" : "focus-within:shadow-xl focus-within:shadow-decom-primary/5"
      )}>
        {children}
      </div>

      {error && (
        <motion.p
          className="text-xs text-decom-error font-bold flex items-center gap-1.5 px-1 px-1 mt-1"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
        >
          <IconAlertCircle className="w-3.5 h-3.5" />
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
      className="space-y-6 md:space-y-8 p-6 md:p-8 rounded-2xl bg-dashboard-card/50 border border-dashboard-card-border/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div className="p-3 rounded-2xl bg-gradient-to-br from-decom-primary/10 to-decom-secondary/10 text-decom-primary shrink-0 transition-transform hover:scale-105 border border-white/10">
            {typeof icon === 'string' ? (
              <span className="text-2xl block leading-none">{icon}</span>
            ) : (
              <div className="w-6 h-6">{icon}</div>
            )}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-black text-dashboard-text-primary leading-tight tracking-tight">{title}</h3>
          {description && (
            <p className="text-sm text-dashboard-text-secondary mt-1.5 leading-relaxed font-medium">{description}</p>
          )}
        </div>
      </div>

      <div className="space-y-5 md:space-y-6">{children}</div>
    </motion.div>
  )
}

// Card Info con Icono y Detalles
interface InfoCardProps {
  icon: string | React.ReactNode
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
  const styles = {
    primary: 'border-decom-primary bg-decom-primary/5',
    secondary: 'border-decom-secondary bg-decom-secondary/5'
  }

  return (
    <motion.div
      className={cn(
        "border-l-4 p-5 rounded-2xl space-y-3 transition-all duration-300 hover:shadow-2xl hover:translate-x-1",
        styles[variant]
      )}
      whileHover={{ y: -2 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-dashboard-card rounded-2xl shadow-xl border border-dashboard-card-border shrink-0">
            {typeof icon === 'string' ? (
              <span className="text-2xl">{icon}</span>
            ) : (
              <div className="text-decom-primary w-6 h-6">{icon}</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-dashboard-text-muted">
              {subtitle}
            </p>
            <p className="text-lg font-black text-dashboard-text-primary mt-1 tracking-tight">{title}</p>
            <p className="text-sm text-dashboard-text-secondary mt-2 leading-relaxed font-medium">{details}</p>
          </div>
        </div>
        {action && <div className="shrink-0 self-end sm:self-auto">{action}</div>}
      </div>
    </motion.div>
  )
}

// Select Button Group (Selector de Opciones Visual)
interface SelectButtonGroupProps {
  options: Array<{
    id: string
    label: string
    icon?: string | React.ReactNode
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
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(100px, 1fr))` }}>
        {options.map((option) => {
          const isSelected = value === option.id
          return (
            <motion.button
              key={option.id}
              onClick={() => onChange(option.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2.5 min-h-[110px]",
                isSelected
                  ? "border-decom-secondary bg-gradient-to-br from-decom-primary-light to-decom-primary text-white shadow-2xl shadow-decom-primary/30 ring-2 ring-decom-secondary/50"
                  : "border-dashboard-card-border bg-dashboard-card text-dashboard-text-primary hover:border-decom-secondary/50 hover:bg-dashboard-bg shadow-sm"
              )}
            >
              {option.icon && (
                <div className={cn(
                  "text-3xl filter transition-transform duration-300",
                  isSelected ? "scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "drop-shadow-sm group-hover:scale-110"
                )}>
                  {typeof option.icon === 'string' ? option.icon : option.icon}
                </div>
              )}
              <span className={cn(
                "text-[11px] font-black uppercase tracking-widest text-center leading-tight",
                isSelected ? "text-white" : "text-dashboard-text-secondary"
              )}>
                {option.label}
              </span>

              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    className="absolute -top-2 -right-2 bg-decom-secondary text-white rounded-xl p-1 shadow-lg ring-2 ring-white dark:ring-dashboard-bg"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 45 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    <IconCheck className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>

              {option.description && (
                <span className={cn(
                  "text-[10px] leading-tight hidden md:block mt-1 font-medium",
                  isSelected ? "text-white/80" : "text-dashboard-text-muted"
                )}>
                  {option.description}
                </span>
              )}
            </motion.button>
          )
        })}
      </div>
      {error && (
        <motion.p
          className="text-sm text-decom-error font-bold flex items-center gap-1.5 px-1"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <IconAlertCircle className="w-4 h-4" />
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
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dashboard-text-muted group-focus-within:text-decom-secondary group-focus-within:scale-110 transition-all duration-300">
          {typeof icon === 'string' ? (
            <span className="text-xl">{icon}</span>
          ) : (
            <div className="w-5 h-5">{icon}</div>
          )}
        </div>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full px-5 py-3.5 text-base text-dashboard-text-primary placeholder-dashboard-text-muted/50",
          "border-2 border-dashboard-card-border rounded-xl bg-dashboard-card transition-all duration-300 shadow-sm",
          "hover:border-dashboard-text-muted/30 hover:shadow-md",
          "focus:outline-none focus:ring-4 focus:ring-decom-secondary/10 focus:border-decom-secondary",
          icon ? 'pl-12' : '',
          suffix ? 'pr-12' : '',
          isValid === false ? 'border-decom-error focus:ring-decom-error/10' : '',
          className
        )}
        {...props}
      />
      {suffix && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-dashboard-text-muted pointer-events-none transition-colors group-focus-within:text-decom-secondary">
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
          <div className="absolute left-4 top-4 text-dashboard-text-muted group-focus-within:text-decom-secondary group-focus-within:scale-110 transition-all duration-300">
            {typeof icon === 'string' ? (
              <span className="text-xl">{icon}</span>
            ) : (
              <div className="w-5 h-5">{icon}</div>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full px-5 py-4 text-base text-dashboard-text-primary placeholder-dashboard-text-muted/50",
            "border-2 border-dashboard-card-border rounded-xl bg-dashboard-card transition-all duration-300 shadow-sm min-h-[120px]",
            "hover:border-dashboard-text-muted/30 hover:shadow-md",
            "focus:outline-none focus:ring-4 focus:ring-decom-secondary/10 focus:border-decom-secondary",
            icon ? 'pl-12' : '',
            "resize-none",
            className
          )}
          onChange={handleChange}
          {...props}
        />
      </div>
      {characterLimit && (
        <div className="flex justify-end">
          <div className={cn(
            "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
            charCount > characterLimit ? "bg-decom-error/10 text-decom-error border-decom-error/20" : "bg-dashboard-card border-dashboard-card-border text-dashboard-text-muted"
          )}>
            {charCount} / {characterLimit}
          </div>
        </div>
      )}
    </div>
  )
})

EnhancedTextarea.displayName = 'EnhancedTextarea'
