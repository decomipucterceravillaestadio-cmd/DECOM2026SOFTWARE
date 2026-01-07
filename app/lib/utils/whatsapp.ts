/**
 * Genera un enlace de WhatsApp con mensaje predefinido
 * @param phoneNumber - Número de teléfono (puede incluir +57 o solo 10 dígitos)
 * @param eventName - Nombre del evento para personalizar el mensaje
 * @returns URL completa de WhatsApp con mensaje codificado
 */
export function generateWhatsAppLink(
  phoneNumber: string,
  eventName: string
): string {
  // Limpiar número: remover espacios, guiones, paréntesis
  let cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '')
  
  // Remover el símbolo + si existe
  if (cleanNumber.startsWith('+')) {
    cleanNumber = cleanNumber.substring(1)
  }
  
  // Asegurar que tenga el código de país 57
  if (!cleanNumber.startsWith('57')) {
    if (cleanNumber.length === 10 && cleanNumber.startsWith('3')) {
      cleanNumber = `57${cleanNumber}`
    }
  }
  
  // Mensaje predefinido
  const message = `Hola, tu material para "${eventName}" está listo para entrega. ¡Bendiciones! 🙏`
  const encodedMessage = encodeURIComponent(message)
  
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`
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
