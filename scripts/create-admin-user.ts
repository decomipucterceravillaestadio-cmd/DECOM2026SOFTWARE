/**
 * Script para crear usuario admin usando la API Admin de Supabase
 * Ejecutar con: npx tsx scripts/create-admin-user.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Variables de entorno faltantes')
  console.error('Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createAdminUser() {
  const email = 'aquilarjuan123@gmail.com'
  const password = 'Juanda0506**'
  const fullName = 'Juan Aquilar'

  console.log('🔧 Creando usuario admin...')
  console.log('📧 Email:', email)

  try {
    // 1. Crear usuario en auth.users usando la API Admin
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirmar email automáticamente
      user_metadata: {
        full_name: fullName,
      },
    })

    if (authError) {
      console.error('❌ Error creando usuario en auth:', authError)
      return
    }

    console.log('✅ Usuario creado en auth.users:', authData.user?.id)

    // 2. Crear usuario en public.users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        auth_user_id: authData.user?.id,
        email,
        full_name: fullName,
        role: 'admin',
        role_level: 5,
        is_active: true,
      })
      .select()
      .single()

    if (userError) {
      console.error('❌ Error creando usuario en public.users:', userError)
      return
    }

    console.log('✅ Usuario creado en public.users:', userData)
    console.log('')
    console.log('🎉 Usuario admin creado exitosamente!')
    console.log('📧 Email:', email)
    console.log('🔑 Contraseña:', password)
  } catch (error) {
    console.error('💥 Error inesperado:', error)
  }
}

createAdminUser()
