/**
 * API Route: POST /api/requests
 * Crea una nueva solicitud de material
 * 
 * Validaciones:
 * - committee_id: UUID válido, existe en tabla committees
 * - event_name: 5-200 caracteres
 * - event_info: 5-500 caracteres
 * - event_date: Fecha futura
 * - material_type: Enum válido
 * - contact_whatsapp: Formato válido +57XXXXXXXXXX
 * - bible_verse_text: Requerido si include_bible_verse = true
 * 
 * El endpoint es PÚBLICO (sin autenticación)
 */

import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { createRequestSchema } from '../../lib/validations'
import {
  calculatePlanningStartDate,
  calculateDeliveryDate,
  calculatePriorityScore,
} from '../../lib/dateUtils'
import type { Database } from '../../types/database'
import { ZodError } from 'zod'

export async function POST(request: NextRequest) {
  try {
    // Parse y validar el body
    const body = await request.json()
    const validatedData = createRequestSchema.parse(body)

    // Crear cliente Supabase
    let supabaseResponse = NextResponse.json({
      success: true,
      message: 'Solicitud creada exitosamente',
    })

    const supabase = createSupabaseServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
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
            supabaseResponse = NextResponse.json({
              success: true,
              message: 'Solicitud creada exitosamente',
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Verificar que el comité existe (solo si se proporcionó)
    if (validatedData.committee_id) {
      const { data: committee, error: committeeError } = await supabase
        .from('committees')
        .select('id, name')
        .eq('id', validatedData.committee_id)
        .single()

      if (committeeError || !committee) {
        return NextResponse.json(
          {
            success: false,
            error: 'Comité no encontrado',
          },
          { status: 400 }
        )
      }
    }

    // Calcular fechas automáticas
    const eventDate = new Date(validatedData.event_date)
    const planning_start_date = calculatePlanningStartDate(eventDate)
    const delivery_date = calculateDeliveryDate(eventDate)
    const priority_score = calculatePriorityScore(eventDate)

    // Crear la solicitud
    // Para solicitudes públicas, created_by puede ser NULL o un usuario anónimo
    const { data: requestData, error: createError } = await supabase
      .from('requests')
      .insert({
        committee_id: validatedData.committee_id || null,
        event_name: validatedData.event_name,
        event_info: validatedData.event_info,
        event_date: validatedData.event_date,
        material_type: validatedData.material_type,
        contact_whatsapp: validatedData.contact_whatsapp,
        include_bible_verse: validatedData.include_bible_verse || false,
        bible_verse_text: validatedData.bible_verse_text || null,
        planning_start_date: planning_start_date.toISOString().split('T')[0],
        delivery_date: delivery_date.toISOString().split('T')[0],
        priority_score,
        status: 'Pendiente',
        // Para solicitudes públicas, no hay created_by
        // El sistema asignará un UUID por defecto o usará NULL
      } as any)
      .select()
      .single()

    if (createError) {
      console.error('Error creating request:', createError)
      return NextResponse.json(
        {
          success: false,
          error: 'Error al crear la solicitud',
          details: createError.message,
        },
        { status: 500 }
      )
    }

    // Crear entrada inicial en request_history
    const { error: historyError } = await supabase.from('request_history').insert({
      request_id: requestData.id,
      old_status: null,
      new_status: 'Pendiente',
      change_reason: 'Solicitud creada por formulario público',
      changed_by: null, // Solicitud pública, sin usuario
    })

    if (historyError) {
      console.error('Error creating history entry:', historyError)
      // No es crítico fallar aquí, la solicitud ya fue creada
    }

    // Retornar solicitud creada
    const response = NextResponse.json(
      {
        success: true,
        message: 'Solicitud creada exitosamente',
        data: {
          id: requestData.id,
          event_name: requestData.event_name,
          event_date: requestData.event_date,
          delivery_date: requestData.delivery_date,
          priority_score: requestData.priority_score,
        },
      },
      { status: 201 }
    )

    return response
  } catch (error) {
    console.error('Error en POST /api/requests:', error)

    // Error de validación con Zod
    if (error instanceof ZodError) {
      console.error('Zod validation errors:', error.issues)
      return NextResponse.json(
        {
          success: false,
          error: 'Datos inválidos',
          details: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
      },
      { status: 500 }
    )
  }
}
