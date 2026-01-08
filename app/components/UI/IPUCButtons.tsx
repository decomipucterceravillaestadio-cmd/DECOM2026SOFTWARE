/**
 * Componentes de Botones IPUC - Sistema de Diseño Centralizado
 * Botones predefinidos usando la paleta de colores corporativos IPUC Villa Estadio
 */

import React from 'react'
import { Button } from './Button'

interface IPUCButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  isLoading?: boolean
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Botón Primario - Azul corporativo #15539C
 * Uso: Acciones principales, navegación principal
 */
export const PrimaryButton: React.FC<IPUCButtonProps> = ({
  children,
  leftIcon,
  rightIcon,
  fullWidth = false,
  isLoading = false,
  size = 'md',
  ...props
}) => (
  <Button
    variant="primary"
    size={size}
    fullWidth={fullWidth}
    isLoading={isLoading}
    leftIcon={leftIcon}
    rightIcon={rightIcon}
    {...props}
  >
    {children}
  </Button>
)

/**
 * Botón Secundario - Naranja #F49E2C
 * Uso: Acciones destacadas, llamadas a la acción (CTA)
 */
export const SecondaryButton: React.FC<IPUCButtonProps> = ({
  children,
  leftIcon,
  rightIcon,
  fullWidth = false,
  isLoading = false,
  size = 'md',
  ...props
}) => (
  <Button
    variant="secondary"
    size={size}
    fullWidth={fullWidth}
    isLoading={isLoading}
    leftIcon={leftIcon}
    rightIcon={rightIcon}
    {...props}
  >
    {children}
  </Button>
)

/**
 * Botón Outline - Borde azul corporativo
 * Uso: Acciones secundarias, botones menos prominentes
 */
export const OutlineButton: React.FC<IPUCButtonProps> = ({
  children,
  leftIcon,
  rightIcon,
  fullWidth = false,
  isLoading = false,
  size = 'md',
  ...props
}) => (
  <Button
    variant="outline"
    size={size}
    fullWidth={fullWidth}
    isLoading={isLoading}
    leftIcon={leftIcon}
    rightIcon={rightIcon}
    {...props}
  >
    {children}
  </Button>
)

/**
 * Botón Fantasma - Texto azul sin fondo
 * Uso: Enlaces que se ven como botones, acciones terciarias
 */
export const GhostButton: React.FC<IPUCButtonProps> = ({
  children,
  leftIcon,
  rightIcon,
  fullWidth = false,
  isLoading = false,
  size = 'md',
  ...props
}) => (
  <Button
    variant="ghost"
    size={size}
    fullWidth={fullWidth}
    isLoading={isLoading}
    leftIcon={leftIcon}
    rightIcon={rightIcon}
    {...props}
  >
    {children}
  </Button>
)

/**
 * Botón Acento - Naranja corporativo
 * Uso: Acciones urgentes, botones de confirmación importantes
 */
export const AccentButton: React.FC<IPUCButtonProps> = ({
  children,
  leftIcon,
  rightIcon,
  fullWidth = false,
  isLoading = false,
  size = 'md',
  ...props
}) => (
  <Button
    variant="accent"
    size={size}
    fullWidth={fullWidth}
    isLoading={isLoading}
    leftIcon={leftIcon}
    rightIcon={rightIcon}
    {...props}
  >
    {children}
  </Button>
)

/**
 * Botón de Peligro - Rojo
 * Uso: Acciones destructivas, botones de eliminar/cancelar
 */
export const DangerButton: React.FC<IPUCButtonProps> = ({
  children,
  leftIcon,
  rightIcon,
  fullWidth = false,
  isLoading = false,
  size = 'md',
  ...props
}) => (
  <button
    className={`font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center gap-2
      bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] text-white hover:shadow-lg active:scale-95 focus:ring-red-600/20
      ${size === 'sm' ? 'px-3 py-1.5 text-sm min-h-[2rem]' : size === 'lg' ? 'px-6 py-3 text-lg min-h-[3rem]' : 'px-4 py-2 text-base min-h-[2.5rem]'}
      ${fullWidth ? 'w-full' : ''}
    `}
    disabled={isLoading}
    {...props}
  >
    {leftIcon && <span>{leftIcon}</span>}
    {children}
    {rightIcon && <span>{rightIcon}</span>}
  </button>
)

/**
 * Botón de Éxito - Verde
 * Uso: Acciones confirmadas, estados exitosos
 */
export const SuccessButton: React.FC<IPUCButtonProps> = ({
  children,
  leftIcon,
  rightIcon,
  fullWidth = false,
  isLoading = false,
  size = 'md',
  ...props
}) => (
  <button
    className={`font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center gap-2
      bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white hover:shadow-lg active:scale-95 focus:ring-green-600/20
      ${size === 'sm' ? 'px-3 py-1.5 text-sm min-h-[2rem]' : size === 'lg' ? 'px-6 py-3 text-lg min-h-[3rem]' : 'px-4 py-2 text-base min-h-[2.5rem]'}
      ${fullWidth ? 'w-full' : ''}
    `}
    disabled={isLoading}
    {...props}
  >
    {leftIcon && <span>{leftIcon}</span>}
    {children}
    {rightIcon && <span>{rightIcon}</span>}
  </button>
)

/**
 * Conjunto de grupos de botones - Para pares de acciones
 */
export const ButtonGroup: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={`flex gap-3 flex-wrap ${className}`}>
    {children}
  </div>
)

export default {
  Primary: PrimaryButton,
  Secondary: SecondaryButton,
  Outline: OutlineButton,
  Ghost: GhostButton,
  Accent: AccentButton,
  Danger: DangerButton,
  Success: SuccessButton,
  Group: ButtonGroup
}
