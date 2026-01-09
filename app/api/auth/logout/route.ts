/**
 * API Route: POST /api/auth/logout
 * Cierra la sesión del usuario actual
 */

import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '../../../types/database'

export async function POST(request: NextRequest) {
  try {
    // Crear cliente Supabase para server
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            // El logout va a borrar las cookies
            cookiesToSet.forEach(({ name, value, options }) => {
              // Las cookies se limpian en la response abajo
            })
          },
        },
      }
    )

    // Logout de Supabase Auth
    const { error } = await supabase.auth.signOut()

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Error al cerrar sesión',
        },
        { status: 500 }
      )
    }

    // Crear response exitosa con cookies limpias
    const response = NextResponse.json({
      success: true,
      message: 'Sesión cerrada correctamente',
    })

    // Limpiar las cookies de autenticación
    response.cookies.delete('sb-auth-token')
    response.cookies.delete('sb-refresh-token')

    return response
  } catch (error) {
    console.error('Error en POST /api/auth/logout:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
      },
      { status: 500 }
    )
  }
}
