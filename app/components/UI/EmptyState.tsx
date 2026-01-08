'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { IconFolderOpen, IconPlus, IconSparkles } from '@tabler/icons-react'
import { Button } from '@/app/components/UI/Button'

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
  benefits?: Array<{
    icon: React.ReactNode
    text: string
  }>
  variant?: 'default' | 'minimal' | 'featured'
}

export default function EmptyState({
  title = "No hay solicitudes aún",
  description = "Todavía no has creado ninguna solicitud de material gráfico. ¡Comienza ahora y el comité DECOM te ayudará a promocionar tu evento!",
  actionLabel = "Crear Mi Primera Solicitud",
  onAction,
  icon,
  benefits = [
    {
      icon: <IconSparkles className="w-5 h-5" />,
      text: "Proceso rápido y organizado"
    },
    {
      icon: <IconFolderOpen className="w-5 h-5" />,
      text: "Seguimiento en tiempo real"
    },
    {
      icon: <IconPlus className="w-5 h-5" />,
      text: "Material profesional garantizado"
    }
  ],
  variant = 'default'
}: EmptyStateProps) {
  const [isHovered, setIsHovered] = useState(false)

  const defaultIcon = (
    <motion.div
      animate={{
        scale: isHovered ? 1.1 : 1,
        rotate: isHovered ? 5 : 0
      }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl transform scale-150" />

      <div className="relative bg-white rounded-full p-6 shadow-xl border border-gray-100">
        <IconFolderOpen className="w-16 h-16 text-primary/60" />
      </div>
    </motion.div>
  )

  if (variant === 'minimal') {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="mb-6">
          {icon || defaultIcon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 max-w-md">{description}</p>
        {onAction && (
          <Button onClick={onAction} className="inline-flex items-center gap-2">
            <IconPlus className="w-4 h-4" />
            {actionLabel}
          </Button>
        )}
      </div>
    )
  }

  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-2xl mx-auto"
      >
        <div
          className="mb-8 cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {icon || defaultIcon}
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl font-bold text-gray-900 mb-4"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg text-gray-600 mb-8 max-w-lg"
        >
          {description}
        </motion.p>

        {/* Benefits grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 w-full max-w-3xl"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 rounded-full p-3 mb-3">
                  {benefit.icon}
                </div>
                <p className="text-sm font-medium text-gray-700">{benefit.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {onAction && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Button
              onClick={onAction}
              size="lg"
              className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-primary-light hover:from-primary/90 hover:to-primary-light/90 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <IconPlus className="w-5 h-5" />
              {actionLabel}
            </Button>
          </motion.div>
        )}
      </motion.div>
    )
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div
        className="mb-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {icon || defaultIcon}
      </div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-2xl font-bold text-gray-900 mb-3"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-gray-600 mb-8 max-w-md"
      >
        {description}
      </motion.p>

      {/* Benefits list */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8 w-full max-w-md"
      >
        <div className="space-y-4">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="flex-shrink-0 mt-0.5 bg-primary/10 rounded-full p-1">
                {benefit.icon}
              </div>
              <p className="text-sm font-medium text-gray-700 text-left">{benefit.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <Button
            onClick={onAction}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light hover:from-primary/90 hover:to-primary-light/90 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <IconPlus className="w-4 h-4" />
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}