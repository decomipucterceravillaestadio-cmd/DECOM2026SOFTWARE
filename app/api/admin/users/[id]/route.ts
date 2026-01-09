/**
 * API Route: /api/admin/users/[id]
 * Operaciones en un usuario específico (GET, PATCH, DELETE)
 * Requiere permisos de ADMIN o PRESIDENTE (rol_level >= 4)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { updateUserSchema } from '@/app/lib/validations'
import type { Database } from '@/app/types/database'
import { ROLE_LEVELS, type UserRole } from '@/app/types/auth'

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/admin/users/[id]
 * Obtiene los detalles de un usuario específico
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params

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
    const { data: currentUser } = await supabase
      .from('users')
      .select('role_level')
      .eq('auth_user_id', session.user.id)
      .single()

    if (!currentUser || (currentUser as any).role_level < 4) {
      return NextResponse.json(
        { error: 'No tienes permisos para ver usuarios' },
        { status: 403 }
      )
    }

    // Obtener usuario
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/users/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/users/[id]
 * Actualiza un usuario existente
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const body = await request.json()

    // Validar datos
    const validation = updateUserSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.issues },
        { status: 400 }
      )
    }

    const updateData = validation.data

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
    const { data: currentUser } = await supabase
      .from('users')
      .select('role_level, id')
      .eq('auth_user_id', session.user.id)
      .single()

    if (!currentUser || (currentUser as any).role_level < 4) {
      return NextResponse.json(
        { error: 'No tienes permisos para actualizar usuarios' },
        { status: 403 }
      )
    }

    // No permitir que un usuario se desactive a sí mismo
    if ((currentUser as any).id === id && updateData.is_active === false) {
      return NextResponse.json(
        { error: 'No puedes desactivarte a ti mismo' },
        { status: 400 }
      )
    }

    // Preparar datos para actualizar
    const updateFields: any = {}
    
    if (updateData.email) updateFields.email = updateData.email
    if (updateData.full_name) updateFields.full_name = updateData.full_name
    if (updateData.role) {
      updateFields.role = updateData.role
      updateFields.role_level = ROLE_LEVELS[updateData.role as UserRole]
    }
    if (updateData.is_active !== undefined) {
      updateFields.is_active = updateData.is_active
    }

    updateFields.updated_at = new Date().toISOString()

    // Actualizar en public.users
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating user:', updateError)
      return NextResponse.json(
        { error: 'Error al actualizar usuario', details: updateError.message },
        { status: 500 }
      )
    }

    // Si se actualizó la contraseña, usar Admin Client
    if (updateData.password && (updatedUser as any).auth_user_id) {
      const adminClient = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

      const { error: passwordError } = await adminClient.auth.admin.updateUserById(
        (updatedUser as any).auth_user_id,
        { password: updateData.password }
      )

      if (passwordError) {
        console.error('Error updating password:', passwordError)
        // No fallar la request, pero logear el error
      }
    }

    return NextResponse.json({
      message: 'Usuario actualizado exitosamente',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Unexpected error in PATCH /api/admin/users/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Desactiva un usuario (soft delete)
 * No elimina permanentemente, solo marca is_active = false
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params

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
    const { data: currentUser } = await supabase
      .from('users')
      .select('role_level, id')
      .eq('auth_user_id', session.user.id)
      .single()

    if (!currentUser || (currentUser as any).role_level < 4) {
      return NextResponse.json(
        { error: 'No tienes permisos para desactivar usuarios' },
        { status: 403 }
      )
    }

    // No permitir que un usuario se desactive a sí mismo
    if ((currentUser as any).id === id) {
      return NextResponse.json(
        { error: 'No puedes desactivarte a ti mismo' },
        { status: 400 }
      )
    }

    // Soft delete: marcar como inactivo
    const { data: deactivatedUser, error } = await supabase
      .from('users')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error deactivating user:', error)
      return NextResponse.json(
        { error: 'Error al desactivar usuario', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Usuario desactivado exitosamente',
      user: deactivatedUser,
    })
  } catch (error) {
    console.error('Unexpected error in DELETE /api/admin/users/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
