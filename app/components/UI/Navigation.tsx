/**
 * Componentes de Navegación Mejorada para DECOM
 * Proporciona navegación consistente y mejora la experiencia de usuario
 */

'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { IconArrowLeft, IconHome, IconChevronRight } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

/**
 * Barra de navegación superior con botón de regreso
 */
interface BackNavBarProps {
  title: string
  subtitle?: string
  onBack?: () => void
  showHome?: boolean
}

export const BackNavBar: React.FC<BackNavBarProps> = ({
  title,
  subtitle,
  onBack,
  showHome = true
}) => {
  const router = useRouter()

  return (
    <div className="sticky top-0 z-40 bg-dashboard-header backdrop-blur-xl border-b border-dashboard-card-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack ? onBack : () => router.back()}
            className="p-2 rounded-xl hover:bg-dashboard-card border border-transparent hover:border-dashboard-card-border transition-all text-decom-secondary"
            title="Volver atrás"
          >
            <IconArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-dashboard-text-primary">{title}</h1>
            {subtitle && <p className="text-sm text-dashboard-text-secondary">{subtitle}</p>}
          </div>
        </div>
        {showHome && (
          <button
            onClick={() => router.push('/admin')}
            className="p-2 rounded-xl hover:bg-dashboard-card border border-transparent hover:border-dashboard-card-border transition-all text-decom-secondary"
            title="Ir a inicio"
          >
            <IconHome className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Migas de pan (Breadcrumb) para navegación
 */
interface BreadcrumbItem {
  label: string
  href?: string
  active?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  onNavigate?: (href: string) => void
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate }) => {
  const router = useRouter()

  const handleNavigate = (href: string) => {
    if (onNavigate) {
      onNavigate(href)
    } else {
      router.push(href)
    }
  }

  return (
    <nav className="flex items-center gap-2 py-3 px-4 bg-dashboard-card border border-dashboard-card-border rounded-xl mb-6 overflow-x-auto hide-scrollbar">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <IconChevronRight className="w-4 h-4 text-dashboard-text-muted shrink-0" />
          )}
          {item.active || !item.href ? (
            <span className="text-sm font-bold text-dashboard-text-primary whitespace-nowrap">
              {item.label}
            </span>
          ) : (
            <button
              onClick={() => handleNavigate(item.href!)}
              className="text-sm font-medium text-dashboard-text-secondary hover:text-decom-secondary transition-colors whitespace-nowrap"
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

/**
 * Tarjeta de acción rápida con icono y descripción
 */
interface QuickActionProps {
  icon: React.ReactNode
  title: string
  description?: string
  onClick?: () => void
  href?: string
  className?: string
}

export const QuickAction: React.FC<QuickActionProps> = ({
  icon,
  title,
  description,
  onClick,
  href,
  className = ''
}) => {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) onClick()
    if (href) router.push(href)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "p-5 rounded-2xl bg-dashboard-card border border-dashboard-card-border hover:border-decom-secondary/50",
        "transition-all duration-300 hover:shadow-xl hover:shadow-decom-secondary/5 text-left group overflow-hidden relative",
        className
      )}
    >
      <div className="absolute top-0 right-0 p-8 bg-decom-secondary/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />
      <div className="flex items-start gap-4 relative z-10">
        <div className="p-3 rounded-xl bg-dashboard-bg text-decom-secondary group-hover:bg-decom-secondary group-hover:text-white transition-all shadow-sm">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-dashboard-text-primary group-hover:text-decom-secondary transition-colors">{title}</h3>
          {description && (
            <p className="text-sm text-dashboard-text-secondary mt-1 line-clamp-2">{description}</p>
          )}
        </div>
      </div>
    </button>
  )
}

/**
 * Sección de ayuda/información contextual
 */
interface HelpSectionProps {
  title: string
  description: string
  tips?: string[]
  type?: 'info' | 'warning' | 'success'
}

export const HelpSection: React.FC<HelpSectionProps> = ({
  title,
  description,
  tips,
  type = 'info'
}) => {
  const styles = {
    info: 'bg-decom-info/5 border-decom-info/20 text-decom-info',
    warning: 'bg-decom-warning/5 border-decom-warning/20 text-decom-warning',
    success: 'bg-decom-success/5 border-decom-success/20 text-decom-success'
  }

  const iconColors = {
    info: 'text-decom-info',
    warning: 'text-decom-warning',
    success: 'text-decom-success'
  }

  return (
    <div className={cn("rounded-2xl p-5 border shadow-sm", styles[type])}>
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <IconChevronRight className={cn("w-5 h-5", iconColors[type])} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold mb-1">{title}</h4>
          <p className="text-sm opacity-90 mb-4">{description}</p>
          {tips && tips.length > 0 && (
            <ul className="text-sm space-y-2">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-center gap-2 opacity-85">
                  <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", iconColors[type])} style={{ backgroundColor: 'currentColor' }} />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

const Navigation = {
  BackNavBar,
  Breadcrumb,
  QuickAction,
  HelpSection
}

export default Navigation
