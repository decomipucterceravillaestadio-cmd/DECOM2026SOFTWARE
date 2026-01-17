'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconFolderOpen, IconPlus, IconSparkles } from '@tabler/icons-react'
import { Button } from '@/app/components/UI/Button'
import { cn } from '@/lib/utils'

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
        scale: isHovered ? 1.05 : 1,
        rotate: isHovered ? 2 : 0
      }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-decom-secondary/10 rounded-full blur-3xl transform scale-150" />

      <div className="relative bg-dashboard-card rounded-3xl p-8 shadow-2xl border border-dashboard-card-border overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-decom-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <IconFolderOpen className="w-20 h-20 text-decom-secondary relative z-10" />
      </div>
    </motion.div>
  )

  if (variant === 'minimal') {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="mb-6">
          {icon || defaultIcon}
        </div>
        <h3 className="text-xl font-bold text-dashboard-text-primary mb-2">{title}</h3>
        <p className="text-dashboard-text-secondary mb-8 max-w-md">{description}</p>
        {onAction && (
          <Button onClick={onAction} className="inline-flex items-center gap-2" variant="secondary">
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
        className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-4xl mx-auto"
      >
        <div
          className="mb-10 cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {icon || defaultIcon}
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl font-black text-dashboard-text-primary mb-5 tracking-tight"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl text-dashboard-text-secondary mb-12 max-w-2xl leading-relaxed"
        >
          {description}
        </motion.p>

        {/* Benefits grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
              className="bg-dashboard-card rounded-2xl p-6 shadow-sm border border-dashboard-card-border hover:shadow-xl hover:border-decom-secondary/30 hover:-translate-y-1 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-decom-secondary/10 rounded-2xl p-4 mb-4 text-decom-secondary group-hover:bg-decom-secondary group-hover:text-white transition-all">
                  {benefit.icon}
                </div>
                <p className="text-sm font-bold text-dashboard-text-primary">{benefit.text}</p>
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
              variant="secondary"
              className="px-10 py-5 text-lg font-bold shadow-2xl shadow-decom-secondary/30"
            >
              <IconPlus className="w-6 h-6 mr-1" />
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
      className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-3xl mx-auto"
    >
      <div
        className="mb-8"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {icon || defaultIcon}
      </div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-3xl font-black text-dashboard-text-primary mb-4"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-lg text-dashboard-text-secondary mb-10 max-w-md leading-relaxed"
      >
        {description}
      </motion.p>

      {/* Benefits card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-dashboard-card rounded-2xl p-8 shadow-sm border border-dashboard-card-border mb-10 w-full max-w-md"
      >
        <div className="space-y-5">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
              className="flex items-center gap-4 group"
            >
              <div className="flex-shrink-0 bg-decom-secondary/10 rounded-xl p-2.5 text-decom-secondary group-hover:bg-decom-secondary group-hover:text-white transition-all">
                {benefit.icon}
              </div>
              <p className="text-base font-bold text-dashboard-text-primary text-left">{benefit.text}</p>
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
            variant="secondary"
            size="lg"
            className="px-8 py-4 font-bold shadow-xl shadow-decom-secondary/20"
          >
            <IconPlus className="w-5 h-5 mr-1" />
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}