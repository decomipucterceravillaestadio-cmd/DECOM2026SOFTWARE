import { isToday, isTomorrow, differenceInDays, format, addDays } from "date-fns";
import { es } from "date-fns/locale";

export function addDaysUtil(date: Date, days: number): Date {
  return addDays(date, days);
}

export function calculatePlanningStartDate(eventDate: Date): Date {
  return addDays(eventDate, -7);
}

export function calculateDeliveryDate(eventDate: Date): Date {
  return addDays(eventDate, -2);
}

export function daysUntilEvent(eventDate: Date): number {
  return differenceInDays(eventDate, new Date());
}

export function daysUntilDelivery(deliveryDate: Date): number {
  return differenceInDays(deliveryDate, new Date());
}

export function formatDate(
  date: Date,
  type: "short" | "long" = "long"
): string {
  if (isToday(date)) return "Hoy";
  if (isTomorrow(date)) return "Mañana";

  if (type === "short") {
    return format(date, "dd/MM/yyyy", { locale: es });
  }

  return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
}

export function formatDateWithTime(date: Date): string {
  return format(date, "dd/MM/yyyy HH:mm", { locale: es });
}

export function getRelativeTime(date: Date): string {
  const days = differenceInDays(new Date(), date);

  if (days === 0) return "Hoy";
  if (days === 1) return "Ayer";
  if (days < 7) return `Hace ${days} días`;
  if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`;

  return format(date, "d 'de' MMMM", { locale: es });
}

export function isDateInPast(date: Date): boolean {
  return differenceInDays(date, new Date()) < 0;
}

export function isDateInFuture(date: Date): boolean {
  return differenceInDays(date, new Date()) > 0;
}

/**
 * Calcula el score de prioridad (1-10) basado en los días hasta el evento
 * - Más de 7 días: 1 (baja prioridad)
 * - Entre 2-7 días: 5 (prioridad media)
 * - Menos de 2 días: 10 (alta prioridad urgente)
 */
export function calculatePriorityScore(eventDate: Date): number {
  const daysUntil = differenceInDays(eventDate, new Date());
  
  if (daysUntil > 7) return 1;
  if (daysUntil > 2) return 5;
  return 10;
}
