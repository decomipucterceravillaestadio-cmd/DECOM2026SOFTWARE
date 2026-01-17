/**
 * API Route: /api/admin/committees/[id]
 * Gestión de un comité específico (GET, PUT, DELETE)
 * Requiere permisos de EDIT_COMMITTEES
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { z } from 'zod'
import type { Database } from '@/app/types/database'

const updateCommitteeSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'Máximo 100 caracteres'),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
  color_badge: z.string().min(1, 'El color es requerido'),
})

/**
 * GET /api/admin/committees/[id]
 * Obtener un comité específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: committeeId } = await params

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
      return NextResponse.json({ error: 'No tienes permisos para ver comités' }, { status: 403 })
    }

    // Obtener el comité
    const { data: committee, error } = await supabase
      .from('committees')
      .select('*')
      .eq('id', committeeId)
      .single()

    if (error || !committee) {
      return NextResponse.json(
        { error: 'Comité no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      committee,
    })
  } catch (error) {
    console.error('Error en GET /api/admin/committees/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/committees/[id]
 * Actualizar un comité específico
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: committeeId } = await params

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
      return NextResponse.json({ error: 'No tienes permisos para editar comités' }, { status: 403 })
    }

    // Parse y validar el body
    const body = await request.json()
    const validatedData = updateCommitteeSchema.parse(body)

    // Verificar que el comité existe
    const { data: existingCommittee, error: fetchError } = await supabase
      .from('committees')
      .select('id')
      .eq('id', committeeId)
      .single()

    if (fetchError || !existingCommittee) {
      return NextResponse.json(
        { error: 'Comité no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que el nombre no exista en otro comité
    const { data: nameCheck } = await supabase
      .from('committees')
      .select('id')
      .eq('name', validatedData.name)
      .neq('id', committeeId)
      .single()

    if (nameCheck) {
      return NextResponse.json(
        { error: 'Ya existe otro comité con ese nombre' },
        { status: 400 }
      )
    }

    // Actualizar el comité
    const { data: committee, error: updateError } = await supabase
      .from('committees')
      .update({
        name: validatedData.name,
        description: validatedData.description || null,
        color_badge: validatedData.color_badge,
        updated_at: new Date().toISOString(),
      })
      .eq('id', committeeId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating committee:', updateError)
      return NextResponse.json(
        { error: 'Error al actualizar el comité' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      committee,
    })
  } catch (error) {
    console.error('Error en PUT /api/admin/committees/[id]:', error)
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

/**
 * DELETE /api/admin/committees/[id]
 * Eliminar un comité específico
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: committeeId } = await params

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
      return NextResponse.json({ error: 'No tienes permisos para eliminar comités' }, { status: 403 })
    }

    // Verificar que el comité existe
    const { data: existingCommittee, error: fetchError } = await supabase
      .from('committees')
      .select('id')
      .eq('id', committeeId)
      .single()

    if (fetchError || !existingCommittee) {
      return NextResponse.json(
        { error: 'Comité no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que no haya solicitudes asociadas
    const { data: requests, error: requestsError } = await supabase
      .from('requests')
      .select('id')
      .eq('committee_id', committeeId)
      .limit(1)

    if (requestsError) {
      console.error('Error checking requests:', requestsError)
      return NextResponse.json(
        { error: 'Error al verificar dependencias' },
        { status: 500 }
      )
    }

    if (requests && requests.length > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar el comité porque tiene solicitudes asociadas' },
        { status: 400 }
      )
    }

    // Eliminar el comité
    const { error: deleteError } = await supabase
      .from('committees')
      .delete()
      .eq('id', committeeId)

    if (deleteError) {
      console.error('Error deleting committee:', deleteError)
      return NextResponse.json(
        { error: 'Error al eliminar el comité' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Comité eliminado exitosamente',
    })
  } catch (error) {
    console.error('Error en DELETE /api/admin/committees/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}