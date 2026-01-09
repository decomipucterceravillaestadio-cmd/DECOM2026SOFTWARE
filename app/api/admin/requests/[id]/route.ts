import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/app/lib/supabase/server'
import { createAdminClient } from '@/app/lib/supabase/admin'
import { Database } from '@/app/types/database'

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
  try {
    const { id } = await params
    const supabase = await createServerClient()
    const adminClient = createAdminClient()
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener datos del body
    const body = await request.json()
    const { status: newStatus, change_reason, visible_in_public_calendar } = body

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
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      )
    }

    const oldStatus = currentRequest.status

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

    // Actualizar solicitud
    const { error: updateError } = await adminClient
      .from('requests')
      .update(updateData)
      .eq('id', id)

    if (updateError) {
      console.error('Error updating request:', updateError)
      return NextResponse.json(
        { error: 'Error al actualizar solicitud' },
        { status: 500 }
      )
    }

    // Registrar en historial solo si cambió el estado
    if (newStatus && newStatus !== oldStatus) {
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
        console.error('Error creating history:', historyError)
      }
    }

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
