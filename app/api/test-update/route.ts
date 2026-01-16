import { NextResponse } from 'next/server'
import { createAdminClient } from '@/app/lib/supabase/admin'

export async function POST() {
  console.log('🧪 TEST: Iniciando test de actualización')
  
  try {
    const adminClient = createAdminClient()
    console.log('✅ TEST: Admin client creado')
    
    // Intentar actualizar la solicitud específica
    const requestId = '61f95fde-0519-4f0a-ab8c-4c327e805fda'
    const newStatus = 'En diseño'
    
    console.log('🔄 TEST: Intentando actualizar:', { requestId, newStatus })
    
    const { data, error } = await adminClient
      .from('requests')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single()
    
    if (error) {
      console.error('❌ TEST: Error:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        code: error.code,
        details: error 
      })
    }
    
    console.log('✅ TEST: Actualización exitosa:', data)
    return NextResponse.json({ success: true, data })
    
  } catch (error) {
    console.error('❌ TEST: Exception:', error)
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 })
  }
}
