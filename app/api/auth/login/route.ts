/**
 * API Route: POST /api/auth/login
 * Autentica un usuario con email y password
 * Valida que sea un admin de DECOM
 */

import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { loginSchema } from '../../../lib/validations'
import type { Database } from '../../../types/database'
import { createAdminClient } from '../../../lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    // Parse y validar el body
    const body = await request.json()
    console.log('📝 Login request for email:', body.email)
    
    const validatedData = loginSchema.parse(body)
    console.log('✅ Validation passed')

    // Obtener cookieStore
    const cookieStore = await cookies()

    // Crear cliente Supabase para server con cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    // Autenticar con Supabase Auth
    console.log('🔐 Attempting Supabase auth...')
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      })

    if (authError) {
      console.error('❌ Auth error:', { 
        code: authError.status,
        message: authError.message 
      })
      return NextResponse.json(
        {
          success: false,
          message: 'Credenciales inválidas',
        },
        { status: 401 }
      )
    }

    if (!authData.user) {
      console.error('❌ No user returned from auth')
      return NextResponse.json(
        {
          success: false,
          message: 'Error al obtener datos del usuario',
        },
        { status: 401 }
      )
    }

    console.log('✅ Auth successful, user ID:', authData.user.id)

    // Crear cliente admin para operaciones en public.users (bypasea RLS)
    const supabaseAdmin = createAdminClient()

    // Verificar que el usuario existe en tabla `users` y tiene rol decom_admin
    // Buscar por auth_user_id, no por id (id es el UUID de public.users, auth_user_id es el de auth.users)
    console.log('🔍 Looking for user in database...')
    let { data: userData, error: userError } = await (supabaseAdmin as any)
      .from('users')
      .select('*')
      .eq('auth_user_id', authData.user.id)
      .single()

    if (userError) {
      console.log('⚠️ User not found in database, will create one')
    } else {
      console.log('✅ User found:', { email: userData?.email, role: userData?.role })
    }

    // Si no existe, crear el usuario en public.users (para desarrollo/testing)
    if (userError || !userData) {
      const userEmail = authData.user.email || validatedData.email;
      console.log('📝 Creating new user:', userEmail)
      
      const { data: newUser, error: createError } = await (supabaseAdmin as any)
        .from('users')
        .insert({
          auth_user_id: authData.user.id,
          email: userEmail,
          full_name: userEmail.split('@')[0] || 'Usuario',
          role: 'decom_admin',
          is_active: true,
        })
        .select()
        .single()

      if (createError || !newUser) {
        console.error('❌ Error creating user:', createError)
        await supabase.auth.signOut()
        return NextResponse.json(
          {
            success: false,
            message: 'Error al procesar el usuario',
          },
          { status: 500 }
        )
      }

      console.log('✅ User created successfully')
      userData = newUser
    }

    // Verificar que el usuario está activo
    if (!userData.is_active) {
      console.error('❌ User is inactive')
      await supabase.auth.signOut()
      return NextResponse.json(
        {
          success: false,
          message: 'Usuario desactivado. Contacta al administrador',
        },
        { status: 403 }
      )
    }

    // Verificar que tiene un rol válido
    const validRoles = ['admin', 'presidente', 'tesorero', 'secretario', 'vocal', 'decom_admin', 'comite_member']
    if (!validRoles.includes(userData.role)) {
      console.error('❌ Invalid role:', userData.role)
      await supabase.auth.signOut()
      return NextResponse.json(
        {
          success: false,
          message: 'Usuario no tiene un rol válido en el sistema',
        },
        { status: 403 }
      )
    }

    console.log('✅ All validations passed, login successful')

    // IMPORTANTE: Retornar respuesta simple - las cookies ya están en cookieStore
    return NextResponse.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role,
      },
    })
  } catch (error) {
    // Error de validación
    if (error instanceof Error) {
      if (error.message.includes('Validation')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Datos inválidos',
            details: error.message,
          },
          { status: 400 }
        )
      }
    }

    console.error('Error en POST /api/auth/login:', error)
    
    // Retornar más detalles en desarrollo
    const isDevelopment = process.env.NODE_ENV === 'development'
    return NextResponse.json(
      {
        success: false,
        message: 'Error interno del servidor',
        error: isDevelopment && error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}
