/**
 * Supabase Admin Client
 * Usa la service_role key para operaciones administrativas que bypasean RLS
 * ⚠️ SOLO usar en el servidor, NUNCA exponer en el cliente
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../types/database'

/**
 * Crea un cliente Supabase con privilegios de administrador
 * Bypasea Row Level Security (RLS)
 * Solo para uso en API routes y Server Actions
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined')
  }

  if (!supabaseServiceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not defined. Get it from Supabase Dashboard > Settings > API > service_role key'
    )
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
