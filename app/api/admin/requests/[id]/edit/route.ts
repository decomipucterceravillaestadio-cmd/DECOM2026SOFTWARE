import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/app/lib/supabase/server'
import { createAdminClient } from '@/app/lib/supabase/admin'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('🚀 PATCH /api/admin/requests/[id]/edit started')
  try {
    const { id } = await params
    console.log('📌 Request ID:', id)

    const supabase = await createServerClient()
    console.log('✅ Server client created')

    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.log('❌ Auth error:', authError)
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    console.log('👤 User authenticated:', user.id)

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

    // Obtener datos del body
    const body = await request.json()
    const {
      committee_id,
      event_name,
      event_info,
      event_date,
      event_time,
      material_type,
      contact_whatsapp,
      include_bible_verse,
      bible_verse_text
    } = body
    console.log('📝 Edit body:', body)

    // Validaciones básicas
    if (!committee_id || !event_name || !event_info || !event_date || !event_time || !material_type || !contact_whatsapp) {
      console.log('❌ Missing required fields:', { committee_id, event_name, event_info, event_date, event_time, material_type, contact_whatsapp })
      return NextResponse.json(
        { error: 'Todos los campos requeridos deben estar presentes' },
        { status: 400 }
      )
    }

    // Combinar fecha y hora - con manejo de diferentes formatos
    let eventDateTime
    try {
      // Si event_date ya incluye la hora, usarlo directamente
      if (event_date.includes('T')) {
        eventDateTime = new Date(event_date)
      } else {
        // Combinar fecha y hora
        eventDateTime = new Date(`${event_date}T${event_time}:00`)
      }
      
      // Validar que la fecha sea válida
      if (isNaN(eventDateTime.getTime())) {
        throw new Error('Fecha inválida')
      }
      
      console.log('📅 Event date parsed:', eventDateTime.toISOString())
    } catch (dateError) {
      console.error('❌ Error parsing date:', dateError)
      return NextResponse.json(
        { error: 'Formato de fecha inválido' },
        { status: 400 }
      )
    }
    
    // Preparar datos para actualizar
    const updateData: Record<string, any> = {
      committee_id,
      event_name,
      event_info,
      event_date: eventDateTime.toISOString(),
      material_type,
      contact_whatsapp,
      include_bible_verse: include_bible_verse ?? false,
      bible_verse_text: include_bible_verse ? bible_verse_text : null,
      updated_at: new Date().toISOString()
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
      console.error('❌ Update data that failed:', JSON.stringify(updateData, null, 2))
      return NextResponse.json(
        { error: 'Error al actualizar solicitud', details: updateError.message, code: updateError.code, hint: updateError.hint },
        { status: 500 }
      )
    }
    console.log('✅ Request updated successfully:', updatedData)

    // Registrar en historial
    console.log('📋 Creating history entry for edit')
    const { error: historyError } = await adminClient
      .from('request_history')
      .insert({
        request_id: id,
        old_status: updatedData.status,
        new_status: updatedData.status,
        changed_by: user.id,
        change_reason: 'Solicitud editada',
        changed_at: new Date().toISOString()
      })

    if (historyError) {
      console.error('❌ Error creating history:', historyError)
    } else {
      console.log('✅ History entry created successfully')
    }

    console.log('✨ Request edit complete')
    return NextResponse.json({
      success: true,
      message: 'Solicitud actualizada correctamente',
      data: updatedData
    })

  } catch (error) {
    console.error('Error in PATCH /api/admin/requests/[id]/edit:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
