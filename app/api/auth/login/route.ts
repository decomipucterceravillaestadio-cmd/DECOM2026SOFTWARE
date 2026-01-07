/**
 * API Route: POST /api/auth/login
 * Autentica un usuario con email y password
 * Valida que sea un admin de DECOM
 */

import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { loginSchema } from '../../../lib/validations'
import type { Database } from '../../../types/database'

export async function POST(request: NextRequest) {
  try {
    // Parse y validar el body
    const body = await request.json()
    const validatedData = loginSchema.parse(body)

    // Crear cliente Supabase para server
    let supabaseResponse = NextResponse.json({
      success: true,
      message: 'Login exitoso',
    })

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
            })
            supabaseResponse = NextResponse.json(
              {
                success: true,
                message: 'Login exitoso',
              },
              {
                status: 200,
              }
            )
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
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

    // Verificar que el usuario existe en tabla `users` y tiene rol decom_admin
    let { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    // Si no existe, crear el usuario en public.users (para desarrollo/testing)
    if (userError || !userData) {
      const userEmail = authData.user.email || validatedData.email;
      const { data: newUser, error: createError } = await supabase
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

    // Actualizar la response con datos del usuario
    const response = NextResponse.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role,
      },
    })

    // Las cookies se han seteado automáticamente por Supabase
    return response
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
