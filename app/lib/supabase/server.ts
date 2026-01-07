/**
 * Supabase Server Client
 * Para usar en Server Components y API Routes
 * Maneja la sesión con cookies de Next.js
 */

import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '../../types/database'

export async function createServerClient() {
  const cookieStore = await cookies()

  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            // El método setAll fue llamado desde un Server Component
            // Esto se puede ignorar si el middleware está refrescando las sesiones
            console.debug('Cookie setting in Server Component ignored:', error)
          }
        },
      },
    }
  )
}
