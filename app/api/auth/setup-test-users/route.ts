/**
 * API Route: POST /api/auth/setup-test-users
 * SOLO PARA DESARROLLO: Crea usuarios de prueba en Supabase Auth
 * ⚠️ Esta ruta debe eliminarse antes de producción
 */

import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '../../../types/database'

const TEST_USERS = [
  {
    email: 'juan@gmail.com',
    password: 'QWERTYUIOP',
    name: 'Juan',
    role: 'decom_admin',
  },
  {
    email: 'admin@decom.test',
    password: 'DecomAdmin123!',
    name: 'Admin DECOM',
    role: 'decom_admin',
  },
  {
    email: 'manager@decom.test',
    password: 'ManagerDecom123!',
    name: 'Manager DECOM',
    role: 'decom_admin',
  },
  {
    email: 'miembro@comite.test',
    password: 'Miembro123!',
    name: 'Miembro del Comité',
    role: 'comite_member',
  },
]

export async function POST(request: NextRequest) {
  try {
    // Solo permitir en desarrollo
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Esta ruta no está disponible en producción' },
        { status: 403 }
      )
    }

    const supabase = createServerClient<Database>(
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
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
            })
          },
        },
      }
    )

    const results = []

    // Eliminar usuarios de prueba existentes en la tabla users
    await supabase
      .from('users')
      .delete()
      .like('email', '%.test')

    // Crear usuarios con sus UUIDs predefinidos
    const userIds = [
      '550e8400-e29b-41d4-a716-446655440001',
      '550e8400-e29b-41d4-a716-446655440002',
      '550e8400-e29b-41d4-a716-446655440003',
    ]

    for (let i = 0; i < TEST_USERS.length; i++) {
      const testUser = TEST_USERS[i]
      const userId = userIds[i]

      try {
        // Crear en public.users directamente
        const { error: userError } = await supabase.from('users').insert({
          auth_user_id: userId,
          email: testUser.email,
          full_name: testUser.name,
          role: testUser.role,
          is_active: true,
        })

        if (userError) {
          results.push({
            email: testUser.email,
            status: 'error',
            message: `Error creando en tabla users: ${userError.message}`,
          })
          continue
        }

        results.push({
          email: testUser.email,
          status: 'success',
          message: 'Usuario creado en tabla (auth requiere setup manual en Supabase Dashboard)',
          userId,
        })
      } catch (error) {
        results.push({
          email: testUser.email,
          status: 'partial',
          message: 'Usuario creado en tabla users pero auth requiere setup manual',
          userId: userIds[i],
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Usuarios de prueba configurados',
      results,
    })
  } catch (error) {
    console.error('Error en POST /api/auth/setup-test-users:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al configurar usuarios de prueba',
      },
      { status: 500 }
    )
  }
}
