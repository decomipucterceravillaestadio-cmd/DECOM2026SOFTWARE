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
      (date) => {
        const selectedDate = new Date(date + 'T00:00:00')
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        selectedDate.setHours(0, 0, 0, 0)
        return selectedDate >= today
      },
      'La fecha del evento debe ser hoy o una fecha futura'
    ),
    event_time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'),
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

// Schema para crear usuario (Admin)
export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  full_name: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  role: z.enum(['admin', 'presidente', 'tesorero', 'secretario', 'vocal', 'decom_admin', 'comite_member']),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

// Schema para actualizar usuario (sin contraseña obligatoria)
export const updateUserSchema = z.object({
  email: z.string().email('Email inválido').optional(),
  full_name: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres').optional(),
  role: z.enum(['admin', 'presidente', 'tesorero', 'secretario', 'vocal', 'decom_admin', 'comite_member']).optional(),
  is_active: z.boolean().optional(),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>

export type CreateRequestInput = z.infer<typeof createRequestSchema>

// Alias para compatibilidad con API
export const requestSchema = createRequestSchema
export type RequestInput = CreateRequestInput
