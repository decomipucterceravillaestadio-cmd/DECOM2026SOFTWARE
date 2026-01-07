/**
 * Supabase Browser Client
 * Para usar en Client Components solamente
 * Maneja autenticación desde el navegador del usuario
 */

'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '../../types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
