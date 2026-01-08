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
    const validatedData = loginSchema.parse(body)

    // Obtener cookieStore
    const cookieStore = await cookies()

    // Crear cliente Supabase para server con cookies()
    const supabase = createServerClient<Database>(
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
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      })

    if (authError) {
      console.error('Auth error:', authError.message)
      return NextResponse.json(
        {
          success: false,
          error: 'Credenciales inválidas',
        },
        { status: 401 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Error al obtener datos del usuario',
        },
        { status: 401 }
      )
    }

    // Crear cliente admin para operaciones en public.users (bypasea RLS)
    const supabaseAdmin = createAdminClient()

    // Verificar que el usuario existe en tabla `users` y tiene rol decom_admin
    // Buscar por auth_user_id, no por id (id es el UUID de public.users, auth_user_id es el de auth.users)
    let { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('auth_user_id', authData.user.id)
      .single()

    // Si no existe, crear el usuario en public.users (para desarrollo/testing)
    if (userError || !userData) {
      const userEmail = authData.user.email || validatedData.email;
      const { data: newUser, error: createError } = await supabaseAdmin
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
        console.error('Error creating user:', createError)
        await supabase.auth.signOut()
        return NextResponse.json(
          {
            success: false,
            error: 'Error al procesar el usuario',
          },
          { status: 500 }
        )
      }

      userData = newUser
    }

    // Verificar que tiene rol de admin
    if (userData.role !== 'decom_admin') {
      await supabase.auth.signOut()
      return NextResponse.json(
        {
          success: false,
          error: 'Usuario no tiene permisos de DECOM Admin',
        },
        { status: 403 }
      )
    }

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
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
      },
      { status: 500 }
    )
  }
}
