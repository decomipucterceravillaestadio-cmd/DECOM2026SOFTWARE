/**
 * API Route: /api/admin/users
 * Gestión de usuarios (CRUD)
 * Requiere permisos de ADMIN o PRESIDENTE (rol_level >= 4)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createUserSchema } from '@/app/lib/validations'
import type { Database } from '@/app/types/database'
import { ROLE_LEVELS, type UserRole } from '@/app/types/auth'

/**
 * GET /api/admin/users
 * Lista todos los usuarios con filtros opcionales
 * Filtros: role, is_active, search (por nombre o email)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roleFilter = searchParams.get('role')
    const isActiveFilter = searchParams.get('is_active')
    const searchQuery = searchParams.get('search')

    // Crear cliente Supabase para el usuario autenticado
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

    // Verificar permisos: obtener usuario actual
    const { data: currentUser } = await supabase
      .from('users')
      .select('role, role_level')
      .eq('auth_user_id', session.user.id)
      .single()

    if (!currentUser || (currentUser as any).role_level < 4) {
      return NextResponse.json(
        { error: 'No tienes permisos para gestionar usuarios' },
        { status: 403 }
      )
    }

    // Construir query
    let query = supabase
      .from('users')
      .select('id, email, full_name, role, role_level, is_active, created_at, updated_at')
      .order('created_at', { ascending: false })

    // Aplicar filtros
    if (roleFilter) {
      query = query.eq('role', roleFilter)
    }

    if (isActiveFilter !== null) {
      const isActive = isActiveFilter === 'true'
      query = query.eq('is_active', isActive)
    }

    if (searchQuery) {
      query = query.or(`email.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`)
    }

    const { data: users, error } = await query

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json(
        { error: 'Error al obtener usuarios' },
        { status: 500 }
      )
    }

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/users:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/users
 * Crea un nuevo usuario en Supabase Auth y en public.users
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos
    const validation = createUserSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { email, full_name, role, password } = validation.data

    // Crear cliente para autenticación
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

    // Verificar autenticación y permisos
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { data: currentUser } = await supabase
      .from('users')
      .select('role_level')
      .eq('auth_user_id', session.user.id)
      .single()

    if (!currentUser || (currentUser as any).role_level < 4) {
      return NextResponse.json(
        { error: 'No tienes permisos para crear usuarios' },
        { status: 403 }
      )
    }

    // Crear cliente Admin para crear usuario en auth.users
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

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmar email
      user_metadata: {
        full_name,
        role,
      },
    })

    if (authError || !authData.user) {
      console.error('Error creating auth user:', authError)
      return NextResponse.json(
        { error: 'Error al crear usuario en autenticación', details: authError?.message },
        { status: 500 }
      )
    }

    // Calcular role_level
    const role_level = ROLE_LEVELS[role as UserRole]

    // Crear usuario en public.users
    const { data: publicUser, error: publicError } = await adminClient
      .from('users')
      .insert({
        auth_user_id: authData.user.id,
        email,
        full_name,
        role,
        role_level,
        is_active: true,
      })
      .select()
      .single()

    if (publicError) {
      console.error('Error creating public user:', publicError)
      
      // Intentar eliminar usuario de auth si falló la creación en public.users
      await adminClient.auth.admin.deleteUser(authData.user.id)

      return NextResponse.json(
        { error: 'Error al crear usuario en base de datos', details: publicError.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Usuario creado exitosamente',
        user: publicUser,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Unexpected error in POST /api/admin/users:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
