import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const createRequestSchema = z
  .object({
    committee_id: z.string().uuid('ID de comité inválido'),
    event_name: z.string().min(5, 'Mínimo 5 caracteres').max(200),
    event_info: z.string().min(5, 'Mínimo 5 caracteres').max(500),
    event_date: z.string().refine(
      (date) => new Date(date) > new Date(),
      'La fecha debe ser futura'
    ),
    material_type: z.enum(['flyer', 'banner', 'video', 'redes_sociales', 'otro']),
    contact_whatsapp: z.string().regex(/^\+?57\d{10}$/, 'Número WhatsApp inválido'),
    include_bible_verse: z.boolean().default(false),
    bible_verse_text: z.string().optional(),
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
