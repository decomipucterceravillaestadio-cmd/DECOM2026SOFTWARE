import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/app/lib/supabase/server'
import { createAdminClient } from '@/app/lib/supabase/admin'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/app/types/database'
import { UserRole } from '@/app/types/auth'

type Request = Database['public']['Tables']['requests']['Row']
type RequestHistory = Database['public']['Tables']['request_history']['Row']
type Committee = Database['public']['Tables']['committees']['Row']
type User = Database['public']['Tables']['users']['Row']

interface RequestDetail extends Request {
  committee: Committee
  creator: User
  history: Array<RequestHistory & { changed_by_user: User | null }>
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerClient()

    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener solicitud con relaciones
    const { data: requestData, error: requestError } = await supabase
      .from('requests')
      .select(`
        *,
        committee:committees (*),
        creator:users!requests_created_by_fkey (*)
      `)
      .eq('id', id)
      .single()

    if (requestError || !requestData) {
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      )
    }

    // Obtener historial con información de usuarios
    const { data: historyData, error: historyError } = await supabase
      .from('request_history')
      .select(`
        *,
        changed_by_user:users!request_history_changed_by_fkey (*)
      `)
      .eq('request_id', id)
      .order('changed_at', { ascending: false })

    if (historyError) {
      console.error('Error fetching history:', historyError)
    }

    return NextResponse.json({
      ...requestData,
      history: historyData || []
    })

  } catch (error) {
    console.error('Error in GET /api/admin/requests/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('🚀 PATCH /api/admin/requests/[id] started')
  try {
    const { id } = await params
    console.log('📌 Request ID:', id)

    const supabase = await createServerClient()
    console.log('✅ Server client created')

    let adminClient
    try {
      adminClient = createAdminClient()
      console.log('✅ Admin client created')
    } catch (adminError) {
      console.error('❌ Failed to create admin client:', adminError)
      return NextResponse.json(
        { error: 'Error de configuración del servidor', details: String(adminError) },
        { status: 500 }
      )
    }

    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.log('❌ Auth error:', authError)
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    console.log('👤 User authenticated:', user.id)

    // Obtener rol del usuario para verificar permisos
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('auth_user_id', user.id)
      .single()

    if (userError || !userData) {
      console.log('❌ User data error:', userError)
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Verificar permisos
    const { hasPermission, Permission } = await import('@/app/lib/permissions')
    if (!hasPermission(userData.role as UserRole, Permission.CHANGE_REQUEST_STATUS)) {
      console.log('❌ Permission denied for user:', userData.role)
      return NextResponse.json({ error: 'No tienes permisos para cambiar el estado de solicitudes' }, { status: 403 })
    }
    console.log('✅ Permission granted for status change')

    // Obtener datos del body
    const body = await request.json()
    const { status: newStatus, change_reason, visible_in_public_calendar } = body
    console.log('📝 PATCH body:', { newStatus, change_reason, visible_in_public_calendar })

    if (!newStatus && visible_in_public_calendar === undefined) {
      return NextResponse.json(
        { error: 'Se requiere al menos un campo para actualizar' },
        { status: 400 }
      )
    }

    // Obtener estado actual
    const { data: currentRequest, error: fetchError } = await supabase
      .from('requests')
      .select('status')
      .eq('id', id)
      .single()

    if (fetchError || !currentRequest) {
      console.log('❌ Request not found:', fetchError)
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      )
    }

    const oldStatus = currentRequest.status
    console.log('📊 Current status:', { oldStatus, newStatus })

    // Preparar datos para actualizar
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    }

    if (newStatus) {
      updateData.status = newStatus
    }

    if (visible_in_public_calendar !== undefined) {
      updateData.visible_in_public_calendar = visible_in_public_calendar
    }

    console.log('🔄 Update data:', updateData)

    // Actualizar solicitud
    const { data: updatedData, error: updateError } = await adminClient
      .from('requests')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Error updating request:', updateError)
      console.error('❌ Full error details:', JSON.stringify(updateError, null, 2))
      return NextResponse.json(
        { error: 'Error al actualizar solicitud', details: updateError.message, code: updateError.code },
        { status: 500 }
      )
    }
    console.log('✅ Request updated successfully:', updatedData)

    // Registrar en historial solo si cambió el estado
    if (newStatus && newStatus !== oldStatus) {
      console.log('📋 Creating history entry:', { request_id: id, oldStatus, newStatus, changed_by: user.id })
      const { error: historyError } = await adminClient
        .from('request_history')
        .insert({
          request_id: id,
          old_status: oldStatus,
          new_status: newStatus,
          changed_by: user.id,
          change_reason: change_reason || null,
          changed_at: new Date().toISOString()
        })

      if (historyError) {
        console.error('❌ Error creating history:', historyError)
      } else {
        console.log('✅ History entry created successfully')
      }
    }

    console.log('✨ Request update complete')
    return NextResponse.json({
      success: true,
      message: 'Solicitud actualizada correctamente'
    })

  } catch (error) {
    console.error('Error in PATCH /api/admin/requests/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/requests/[id]
 * Elimina una solicitud específica
 */
// DELETE /api/admin/requests/[id]
// Archiva (Soft Delete) una solicitud específica
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerClient()

    // 1. Verificar sesión actual
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // 2. Obtener datos del cuerpo (motivo)
    const body = await request.json().catch(() => ({}))
    const { reason } = body

    if (!reason) {
      return NextResponse.json(
        { error: 'Se requiere motivo para eliminar' },
        { status: 400 }
      )
    }

    // 3. Ejecutar Soft Delete usando función de base de datos con SECURITY DEFINER
    // Esta función bypasea RLS a nivel de PostgreSQL
    const adminClient = createAdminClient()
    
    const { data, error: rpcError } = await adminClient
      .rpc('soft_delete_request', {
        p_request_id: id,
        p_auth_user_id: user.id,
        p_reason: reason
      })

    if (rpcError) {
      console.error('Error calling soft_delete_request function:', rpcError)
      return NextResponse.json(
        { error: 'Error al archivar la solicitud', details: rpcError.message },
        { status: 500 }
      )
    }

    // Verificar el resultado de la función
    const result = data as { success: boolean; error?: string; message?: string }
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Error al archivar la solicitud' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: result.message || 'Solicitud archivada correctamente'
    })

  } catch (error) {
    console.error('Error in DELETE /api/admin/requests/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
