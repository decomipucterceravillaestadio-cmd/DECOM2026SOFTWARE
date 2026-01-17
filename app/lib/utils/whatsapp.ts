interface WhatsAppMessageData {
  eventName: string
  committeeName: string
  eventDate: string
  statusLabel: string
  materialType: string
}

/**
 * Genera un enlace de WhatsApp con mensaje detallado
 * @param phoneNumber - Número de teléfono
 * @param data - Objeto con datos de la solicitud
 * @returns URL completa
 */
export function generateWhatsAppLink(
  phoneNumber: string,
  data: WhatsAppMessageData
): string {
  // Limpiar número
  let cleanNumber = phoneNumber?.replace(/[\s\-\(\)]/g, '') || ''

  if (cleanNumber.startsWith('+')) {
    cleanNumber = cleanNumber.substring(1)
  }
  if (!cleanNumber.startsWith('57') && cleanNumber.length === 10) {
    cleanNumber = `57${cleanNumber}`
  }

  const message = `Dios le bendiga grandemente! Actualización sobre tu solicitud DECOM:

*Evento:* ${data.eventName}
*Comité:* ${data.committeeName}
*Fecha:* ${data.eventDate}
*Material:* ${data.materialType}
*Estado actual:* ${data.statusLabel}

¡Estamos pendientes!`

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
}

/**
 * Valida si un número de teléfono es válido para WhatsApp
 * @param phoneNumber - Número a validar
 * @returns true si el formato es válido
 */
export function isValidWhatsAppNumber(phoneNumber: string): boolean {
  const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '')

  // Regex para validar formato colombiano
  const regex = /^\+?57[3]\d{9}$/

  return regex.test(cleanNumber)
}
