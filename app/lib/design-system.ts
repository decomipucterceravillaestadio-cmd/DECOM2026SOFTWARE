/**
 * Sistema de Diseño Centralizado DECOM
 * Basado en los colores corporativos IPUC Villa Estadio
 */

export const COLORS = {
  // Colores Primarios IPUC
  primary: {
    dark: '#16233B',      // Navy Dark principal
    light: '#15539C',     // Corporate Blue
  },
  
  // Color Secundario
  secondary: '#F49E2C',   // Orange/Gold
  
  // Neutros
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Estados
  status: {
    pending: '#F49E2C',    // Naranja - Pendiente
    planning: '#2196F3',   // Azul - Planificación
    design: '#15539C',     // Azul Corporativo - Diseño
    ready: '#4CAF50',      // Verde - Listo
    delivered: '#999999',  // Gris - Entregado
  },
  
  // Semánticos
  success: '#4CAF50',
  warning: '#F49E2C',
  error: '#D32F2F',
  info: '#2196F3',
}

export const GRADIENTS = {
  // Gradientes principales
  primary: 'from-[#16233B] to-[#15539C]',
  primaryReverse: 'from-[#15539C] to-[#16233B]',
  secondary: 'from-[#F49E2C] to-[#E88D1B]',
  
  // Gradientes para backgrounds
  bgLight: 'from-gray-50 to-white',
  bgDark: 'from-[#16233B] via-[#15539C] to-[#1a2847]',
}

export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  '2xl': '2rem',
  '3xl': '3rem',
}

export const BORDER_RADIUS = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
}

export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(22, 35, 59, 0.05)',
  md: '0 4px 6px -1px rgba(22, 35, 59, 0.1), 0 2px 4px -1px rgba(22, 35, 59, 0.06)',
  lg: '0 10px 15px -3px rgba(22, 35, 59, 0.15), 0 4px 6px -2px rgba(22, 35, 59, 0.1)',
  xl: '0 20px 25px -5px rgba(22, 35, 59, 0.1), 0 10px 10px -5px rgba(22, 35, 59, 0.04)',
}

export const TRANSITIONS = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
}

// Clases Tailwind predefinidas
export const BUTTON_CLASSES = {
  primary: 'bg-gradient-to-r from-[#15539C] to-[#16233B] hover:shadow-lg text-white font-bold transition-all active:scale-95',
  secondary: 'bg-white border-2 border-[#15539C] text-[#15539C] hover:bg-[#15539C] hover:text-white font-bold transition-all',
  outline: 'border-2 border-[#15539C] text-[#15539C] hover:bg-[#15539C]/5 font-bold transition-all',
  accent: 'bg-[#F49E2C] hover:bg-[#E88D1B] text-white font-bold transition-all',
}

export const CARD_CLASSES = {
  base: 'rounded-xl shadow-md bg-white border border-gray-200',
  hover: 'hover:shadow-lg transition-shadow duration-200',
  dark: 'bg-[#16233B] border-[#15539C]/20 text-white',
}

export const INPUT_CLASSES = {
  base: 'w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#15539C]/20 focus:border-[#15539C] bg-white transition-all',
  error: 'border-red-400 focus:border-red-500 focus:ring-red-500/20',
  dark: 'bg-white/10 backdrop-blur-sm text-white placeholder-white/50 border-white/20 focus:border-[#F49E2C]',
}

export const TEXT_CLASSES = {
  heading: 'text-[#16233B] font-bold',
  headingLight: 'text-gray-900 font-bold',
  body: 'text-gray-700 font-normal',
  bodyLight: 'text-gray-600 font-normal',
  muted: 'text-gray-500 text-sm font-medium',
}

// Función helper para aplicar colores de estado
export function getStatusColor(status: string): string {
  const statusLower = status.toLowerCase().trim()
  
  if (statusLower.includes('pendiente')) return COLORS.status.pending
  if (statusLower.includes('planificacion') || statusLower.includes('planificaci')) return COLORS.status.planning
  if (statusLower.includes('diseño') || statusLower.includes('diseno')) return COLORS.status.design
  if (statusLower.includes('lista') || statusLower.includes('listo')) return COLORS.status.ready
  if (statusLower.includes('entregada') || statusLower.includes('entregado')) return COLORS.status.delivered
  
  return COLORS.gray[500]
}

// Función helper para obtener clase de fondo de estado
export function getStatusBgClass(status: string): string {
  const statusLower = status.toLowerCase().trim()
  
  if (statusLower.includes('pendiente')) return 'bg-orange-100 text-orange-800 border-orange-300'
  if (statusLower.includes('planificacion') || statusLower.includes('planificaci')) return 'bg-blue-100 text-blue-800 border-blue-300'
  if (statusLower.includes('diseño') || statusLower.includes('diseno')) return 'bg-indigo-100 text-indigo-800 border-indigo-300'
  if (statusLower.includes('lista') || statusLower.includes('listo')) return 'bg-green-100 text-green-800 border-green-300'
  if (statusLower.includes('entregada') || statusLower.includes('entregado')) return 'bg-gray-100 text-gray-800 border-gray-300'
  
  return 'bg-gray-100 text-gray-800 border-gray-300'
}
