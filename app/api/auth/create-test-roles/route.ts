/**
 * API Route: POST /api/auth/create-test-roles
 * Crea usuarios de prueba para todos los roles del sistema
 * Solo para desarrollo/testing
 */

import { createAdminClient } from '@/app/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabaseAdmin = createAdminClient()
    
    const testUsers = [
      {
        email: 'admin@gmail.com',
        password: 'QWERTYUIOP',
        full_name: 'Administrador Sistema',
        role: 'admin' as const,
      },
      {
        email: 'presidente@gmail.com',
        password: 'QWERTYUIOP',
        full_name: 'Presidente Comité',
        role: 'presidente' as const,
      },
      {
        email: 'tesorero@gmail.com',
        password: 'QWERTYUIOP',
        full_name: 'Tesorero Comité',
        role: 'tesorero' as const,
      },
      {
        email: 'secretario@gmail.com',
        password: 'QWERTYUIOP',
        full_name: 'Secretario Comité',
        role: 'secretario' as const,
      },
      {
        email: 'vocal@gmail.com',
        password: 'QWERTYUIOP',
        full_name: 'Vocal Comité',
        role: 'vocal' as const,
      },
    ]

    const results = []

    for (const user of testUsers) {
      try {
        // 1. Crear usuario en Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            full_name: user.full_name,
          },
        })

        if (authError) {
          // Si el usuario ya existe, intentar obtenerlo
          if (authError.message.includes('already registered')) {
            const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
            const existingUser = existingUsers.users.find(u => u.email === user.email)
            
            if (existingUser) {
              // Actualizar en public.users
              const { error: updateError } = await (supabaseAdmin as any)
                .from('public.users')
                .upsert({
                  auth_user_id: existingUser.id,
                  email: user.email,
                  full_name: user.full_name,
                  role: user.role,
                  is_active: true,
                  updated_at: new Date().toISOString(),
                })

              results.push({
                email: user.email,
                status: updateError ? 'error' : 'updated',
                message: updateError ? updateError.message : 'Usuario existente actualizado',
              })
              continue
            }
          }
          
          results.push({
            email: user.email,
            status: 'error',
            message: authError.message,
          })
          continue
        }

        if (!authData.user) {
          results.push({
            email: user.email,
            status: 'error',
            message: 'No se pudo crear usuario en Auth',
          })
          continue
        }

        // 2. Crear/Actualizar en public.users
        const { error: dbError } = await (supabaseAdmin as any).from('public.users').upsert({
          auth_user_id: authData.user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (dbError) {
          results.push({
            email: user.email,
            status: 'partial',
            message: `Usuario creado en Auth pero error en DB: ${dbError.message}`,
          })
          continue
        }

        results.push({
          email: user.email,
          status: 'success',
          message: 'Usuario creado exitosamente',
          userId: authData.user.id,
        })
      } catch (error) {
        results.push({
          email: user.email,
          status: 'error',
          message: error instanceof Error ? error.message : 'Error desconocido',
        })
      }
    }

    const successCount = results.filter(r => r.status === 'success' || r.status === 'updated').length
    
    return NextResponse.json({
      success: true,
      message: `${successCount}/${testUsers.length} usuarios procesados exitosamente`,
      results,
    })
  } catch (error) {
    console.error('Error creando usuarios de prueba:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error al crear usuarios de prueba',
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}
