/**
 * Asegura que un usuario autenticado existe en la tabla public.users
 * Si no existe, lo crea automáticamente
 */

import { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/app/types/database'

export async function ensureUserExists(
  supabase: SupabaseClient<Database>,
  userId: string,
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Intentar obtener el usuario
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', userId)
      .single()

    // Si existe, retornar éxito
    if (existingUser && !selectError) {
      console.log('✅ User already exists in database')
      return { success: true }
    }

    // Si no existe (PGRST116 es "no rows"), crear el usuario
    if (selectError?.code === 'PGRST116') {
      console.log('📝 Creating user in database...')
      
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          auth_user_id: userId,
          email: email,
          full_name: email.split('@')[0] || 'Usuario',
          role: 'comite_member', // rol por defecto
          is_active: true,
        })
        .select()
        .single()

      if (insertError) {
        console.error('❌ Error creating user:', insertError)
        return { 
          success: false, 
          error: insertError.message 
        }
      }

      console.log('✅ User created successfully:', newUser)
      return { success: true }
    }

    // Otro tipo de error
    console.error('❌ Unexpected error:', selectError)
    return { 
      success: false, 
      error: selectError?.message || 'Unknown error' 
    }
  } catch (error) {
    console.error('💥 Error in ensureUserExists:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}
