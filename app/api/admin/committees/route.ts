/**
 * API Route: /api/admin/committees
 * Gestión administrativa de comités (CRUD completo)
 * Requiere permisos de EDIT_COMMITTEES
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { z } from 'zod'
import type { Database } from '@/app/types/database'
import { Permission } from '@/app/lib/permissions'

const createCommitteeSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'Máximo 100 caracteres'),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
  color_badge: z.string().min(1, 'El color es requerido'),
})

const updateCommitteeSchema = createCommitteeSchema

/**
 * GET /api/admin/committees
 * Lista todos los comités para administración
 */
export async function GET(request: NextRequest) {
  try {
    // Crear cliente Supabase para el usuario autenticado
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value)
            })
          },
        },
      }
    )

    // Verificar autenticación
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Verificar permisos: obtener usuario actual y sus permisos
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('auth_user_id', session.user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 403 })
    }

    // Verificar si tiene permisos para ver comités
    const userRole = userData.role
    const hasPermission = [Permission.VIEW_COMMITTEES, Permission.EDIT_COMMITTEES].some(perm =>
      userRole === 'admin' || (userRole === 'presidente')
    )

    if (!hasPermission) {
      return NextResponse.json({ error: 'No tienes permisos para ver comités' }, { status: 403 })
    }

    // Obtener comités
    const { data: committees, error } = await supabase
      .from('committees')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching committees:', error)
      return NextResponse.json(
        { error: 'Error al obtener comités' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      committees: committees || [],
    })
  } catch (error) {
    console.error('Error en GET /api/admin/committees:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/committees
 * Crear un nuevo comité
 */
export async function POST(request: NextRequest) {
  try {
    // Crear cliente Supabase para el usuario autenticado
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value)
            })
          },
        },
      }
    )

    // Verificar autenticación
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Verificar permisos
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('auth_user_id', session.user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 403 })
    }

    const userRole = userData.role
    const hasPermission = userRole === 'admin' || userRole === 'presidente'

    if (!hasPermission) {
      return NextResponse.json({ error: 'No tienes permisos para crear comités' }, { status: 403 })
    }

    // Parse y validar el body
    const body = await request.json()
    const validatedData = createCommitteeSchema.parse(body)

    // Verificar que el nombre no exista
    const { data: existingCommittee } = await supabase
      .from('committees')
      .select('id')
      .eq('name', validatedData.name)
      .single()

    if (existingCommittee) {
      return NextResponse.json(
        { error: 'Ya existe un comité con ese nombre' },
        { status: 400 }
      )
    }

    // Crear el comité
    const { data: committee, error: createError } = await supabase
      .from('committees')
      .insert({
        name: validatedData.name,
        description: validatedData.description || null,
        color_badge: validatedData.color_badge,
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating committee:', createError)
      return NextResponse.json(
        { error: 'Error al crear el comité' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      committee,
    })
  } catch (error) {
    console.error('Error en POST /api/admin/committees:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}