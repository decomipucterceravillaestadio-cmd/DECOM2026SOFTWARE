/**
 * Funciones de cálculo de fechas para solicitudes DECOM
 * Calcula automáticamente fechas de planificación, entrega y prioridad
 */

import { subDays, differenceInDays } from 'date-fns'

/**
 * Calcula la fecha de inicio de planificación
 * @param eventDate - Fecha del evento
 * @returns Fecha 7 días antes del evento
 */
export function calculatePlanningDate(eventDate: Date): Date {
  return subDays(eventDate, 7)
}

/**
 * Calcula la fecha sugerida de entrega
 * @param eventDate - Fecha del evento
 * @returns Fecha 2 días antes del evento
 */
export function calculateDeliveryDate(eventDate: Date): Date {
  return subDays(eventDate, 2)
}

/**
 * Calcula el puntaje de prioridad basado en proximidad al evento
 * @param eventDate - Fecha del evento
 * @returns Puntaje de 1-10 (10 = más urgente)
 */
export function calculatePriorityScore(eventDate: Date): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const daysUntilEvent = differenceInDays(eventDate, today)
  
  // Muy urgente: menos de 3 días
  if (daysUntilEvent <= 2) return 10
  
  // Urgente: 3-5 días
  if (daysUntilEvent <= 5) return 8
  
  // Prioridad media: 6-7 días
  if (daysUntilEvent <= 7) return 5
  
  // Prioridad normal: más de 7 días
  return 1
}

/**
 * Valida que una fecha sea futura
 * @param date - Fecha a validar
 * @returns true si la fecha es futura
 */
export function isFutureDate(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date > today
}
