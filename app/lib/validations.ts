import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const createRequestSchema = z
  .object({
    committee_id: z.string().uuid('ID de comité inválido').optional(),
    event_name: z.string().min(5, 'Mínimo 5 caracteres').max(200),
    event_info: z.string().min(5, 'Mínimo 5 caracteres').max(500),
    event_date: z.string().refine(
      (date) => new Date(date) > new Date(),
      'La fecha debe ser futura'
    ),
    material_type: z.enum(['flyer', 'banner', 'video', 'redes_sociales', 'otro']),
    contact_whatsapp: z
      .string()
      .min(10, 'Número muy corto')
      .refine(
        (val) => {
          // Normalizar: eliminar espacios, guiones, paréntesis
          const cleaned = val.replace(/[\s\-\(\)]/g, '')
          // Debe contener solo dígitos y opcionalmente +
          const digits = cleaned.replace(/^\+/, '')
          // Validar: +57XXXXXXXXXX (12 dígitos) o XXXXXXXXXX (10 dígitos)
          // para números colombianos que empiezan con 3
          return /^3\d{9}$/.test(digits) || /^573\d{9}$/.test(digits)
        },
        'Número WhatsApp inválido (Ej: 3001234567 o +573001234567)'
      ),
    include_bible_verse: z.boolean().default(false),
    bible_verse_text: z.string().nullish(),
  })
  .refine(
    (data) => {
      if (data.include_bible_verse) {
        return data.bible_verse_text && data.bible_verse_text.length > 0
      }
      return true
    },
    {
      message: 'La cita bíblica es requerida cuando está activada',
      path: ['bible_verse_text'],
    }
  )

export type CreateRequestInput = z.infer<typeof createRequestSchema>

// Alias para compatibilidad con API
export const requestSchema = createRequestSchema
export type RequestInput = CreateRequestInput
