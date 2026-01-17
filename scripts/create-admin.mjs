// Script para crear usuario admin usando la API de Supabase Admin
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://smxuepknugdhzejstmtd.supabase.co'
// Lee el service role key desde argumentos o variable de entorno
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.argv[2]

if (!serviceRoleKey) {
  console.error('❌ Error: Se requiere SUPABASE_SERVICE_ROLE_KEY')
  console.log('Uso: SUPABASE_SERVICE_ROLE_KEY="tu-key" node scripts/create-admin.mjs')
  console.log(' O:  node scripts/create-admin.mjs "tu-service-role-key"')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createAdminUser() {
  const email = 'aquilarjuan123@gmail.com'
  const password = 'Juanda0506**'
  
  console.log('🔐 Creando usuario admin:', email)
  
  // Usar la API admin de Supabase para crear el usuario
  const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Marcar email como confirmado
    user_metadata: {
      full_name: 'Juan David Aguilar',
    },
  })
  
  if (createError) {
    console.error('❌ Error creando usuario en auth:', createError.message)
    
    // Si el usuario ya existe, intentar actualizarlo
    if (createError.message.includes('already been registered')) {
      console.log('⚠️ Usuario ya existe, intentando obtenerlo...')
      
      // Listar usuarios para encontrarlo
      const { data: users, error: listError } = await supabase.auth.admin.listUsers()
      
      if (listError) {
        console.error('❌ Error listando usuarios:', listError.message)
        return
      }
      
      const existingUser = users.users.find(u => u.email === email)
      
      if (existingUser) {
        console.log('📧 Usuario encontrado:', existingUser.id)
        
        // Actualizar la contraseña
        const { data: updated, error: updateError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          { password }
        )
        
        if (updateError) {
          console.error('❌ Error actualizando contraseña:', updateError.message)
        } else {
          console.log('✅ Contraseña actualizada correctamente')
        }
        
        // Verificar/crear en public.users
        await ensurePublicUser(existingUser.id, email)
      }
      return
    }
    return
  }
  
  console.log('✅ Usuario auth creado:', authUser.user.id)
  
  // Crear entrada en public.users
  await ensurePublicUser(authUser.user.id, email)
}

async function ensurePublicUser(authUserId, email) {
  console.log('📋 Verificando/creando entrada en public.users...')
  
  // Verificar si ya existe
  const { data: existing } = await supabase
    .from('users')
    .select('id, email, role')
    .eq('email', email)
    .single()
  
  if (existing) {
    console.log('✅ Usuario ya existe en public.users:', existing.id)
    
    // Actualizar el auth_user_id si no está configurado
    const { error: updateError } = await supabase
      .from('users')
      .update({ auth_user_id: authUserId })
      .eq('email', email)
    
    if (updateError) {
      console.error('⚠️ Error actualizando auth_user_id:', updateError.message)
    } else {
      console.log('✅ auth_user_id actualizado')
    }
    return
  }
  
  // Crear nuevo registro
  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert({
      auth_user_id: authUserId,
      email: email,
      full_name: 'Juan David Aguilar',
      role: 'admin',
      role_level: 5,
      is_active: true,
    })
    .select()
    .single()
  
  if (insertError) {
    console.error('❌ Error creando en public.users:', insertError.message)
    return
  }
  
  console.log('✅ Usuario creado en public.users:', newUser.id)
}

createAdminUser()
  .then(() => {
    console.log('\n🎉 Proceso completado')
    process.exit(0)
  })
  .catch((err) => {
    console.error('❌ Error fatal:', err)
    process.exit(1)
  })
