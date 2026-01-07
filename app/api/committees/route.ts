/**
 * API Route: GET /api/committees
 * Retorna lista de comités disponibles
 * 
 * Endpoint PÚBLICO (sin autenticación)
 * Retorna: id, name, description, color_badge
 */

import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '../../types/database'

export async function GET(request: NextRequest) {
  try {
    // Crear cliente Supabase
    const supabase = createSupabaseServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            // No es necesario actualizar cookies en un GET público
          },
        },
      }
    )

    // Obtener comités
    const { data: committees, error } = await supabase
      .from('committees')
      .select('id, name, description, color_badge')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching committees:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Error al obtener comités',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: committees || [],
    })
  } catch (error) {
    console.error('Error en GET /api/committees:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
      },
      { status: 500 }
    )
  }
}
