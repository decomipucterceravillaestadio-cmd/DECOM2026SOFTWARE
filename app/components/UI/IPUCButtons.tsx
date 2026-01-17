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
 * Botón Primario - Azul corporativo
 */
export const PrimaryButton: React.FC<IPUCButtonProps> = (props) => (
  <Button variant="primary" {...props} />
)

/**
 * Botón Secundario - Naranja
 */
export const SecondaryButton: React.FC<IPUCButtonProps> = (props) => (
  <Button variant="secondary" {...props} />
)

/**
 * Botón Outline - Borde azul corporativo
 */
export const OutlineButton: React.FC<IPUCButtonProps> = (props) => (
  <Button variant="outline" {...props} />
)

/**
 * Botón Fantasma - Texto azul sin fondo
 */
export const GhostButton: React.FC<IPUCButtonProps> = (props) => (
  <Button variant="ghost" {...props} />
)

/**
 * Botón Acento - Naranja corporativo
 */
export const AccentButton: React.FC<IPUCButtonProps> = (props) => (
  <Button variant="accent" {...props} />
)

/**
 * Botón de Peligro - Rojo
 */
export const DangerButton: React.FC<IPUCButtonProps> = (props) => (
  <Button variant="danger" {...props} />
)

/**
 * Botón de Éxito - Verde
 */
export const SuccessButton: React.FC<IPUCButtonProps> = (props) => (
  <Button variant="success" {...props} />
)

/**
 * Conjunto de grupos de botones - Para pares de acciones
 */
export const ButtonGroup: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={`flex gap-3 flex-wrap items-center ${className}`}>
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
