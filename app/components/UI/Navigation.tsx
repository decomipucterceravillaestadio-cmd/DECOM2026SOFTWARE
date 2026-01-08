/**
 * Componentes de Navegación Mejorada para DECOM
 * Proporciona navegación consistente y mejora la experiencia de usuario
 */

import React from 'react'
import { useRouter } from 'next/navigation'
import { IconArrowLeft, IconHome, IconChevronRight } from '@tabler/icons-react'

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
    <div className="sticky top-0 z-40 bg-white border-b border-gray-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack ? onBack : () => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-[#15539C]"
            title="Volver atrás"
          >
            <IconArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#16233B]">{title}</h1>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
        </div>
        {showHome && (
          <button
            onClick={() => router.push('/')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-[#15539C]"
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
    <nav className="flex items-center gap-2 py-4 px-4 bg-[#F5F5F5] rounded-lg mb-6">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <IconChevronRight className="w-4 h-4 text-gray-400" />
          )}
          {item.active || !item.href ? (
            <span className="text-sm font-semibold text-[#16233B]">
              {item.label}
            </span>
          ) : (
            <button
              onClick={() => handleNavigate(item.href!)}
              className="text-sm font-medium text-[#15539C] hover:text-[#16233B] transition-colors"
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
  const Component = href ? 'a' : 'button'

  const handleClick = () => {
    if (onClick) onClick()
    if (href) router.push(href)
  }

  return (
    <Component
      onClick={handleClick}
      href={href}
      className={`
        p-4 rounded-lg bg-white border-2 border-gray-200 hover:border-[#15539C] 
        transition-all duration-200 hover:shadow-md text-left cursor-pointer
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="text-[#15539C] mt-1">{icon}</div>
        <div>
          <h3 className="font-semibold text-[#16233B]">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
      </div>
    </Component>
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
  const bgColors = {
    info: 'bg-blue-50 border-l-4 border-l-[#15539C]',
    warning: 'bg-orange-50 border-l-4 border-l-[#F49E2C]',
    success: 'bg-green-50 border-l-4 border-l-[#4CAF50]'
  }

  const textColors = {
    info: 'text-[#16233B]',
    warning: 'text-orange-900',
    success: 'text-green-900'
  }

  return (
    <div className={`${bgColors[type]} rounded-lg p-4`}>
      <h4 className={`font-semibold ${textColors[type]} mb-2`}>{title}</h4>
      <p className={`text-sm ${textColors[type]} mb-3`}>{description}</p>
      {tips && tips.length > 0 && (
        <ul className={`text-sm space-y-1 ${textColors[type]}`}>
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default {
  BackNavBar,
  Breadcrumb,
  QuickAction,
  HelpSection
}
