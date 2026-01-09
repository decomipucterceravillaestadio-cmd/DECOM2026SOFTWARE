import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/app/lib/supabase/server'
import { startOfMonth, endOfMonth, format } from 'date-fns'

interface PublicCalendarEvent {
  id: string
  event_name: string
  event_date: string
  status: string
  priority_score: number | null
  material_type: string
  planning_start_date: string | null
  delivery_date: string | null
  created_at: string | null
}

interface PublicDayEvents {
  date: string
  count: number
  events: PublicCalendarEvent[]
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Obtener parámetros (sin autenticación requerida)
    const searchParams = request.nextUrl.searchParams
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString())

    // Validar parámetros
    if (month < 1 || month > 12 || year < 2020 || year > 2100) {
      return NextResponse.json(
        { error: 'Parámetros inválidos' },
        { status: 400 }
      )
    }

    // Calcular rango de fechas
    const startDate = startOfMonth(new Date(year, month - 1))
    const endDate = endOfMonth(new Date(year, month - 1))

    // Obtener solo campos públicos y eventos visibles
    const { data, error } = await supabase
      .from('requests')
      .select('id, event_name, event_date, status, priority_score, material_type, planning_start_date, delivery_date, created_at')
      .gte('event_date', format(startDate, 'yyyy-MM-dd'))
      .lte('event_date', format(endDate, 'yyyy-MM-dd'))
      .neq('status', 'rejected') // No mostrar rechazadas
      .eq('visible_in_public_calendar', true) // Solo eventos visibles públicamente
      .order('event_date', { ascending: true })

    if (error) {
      console.error('Error fetching public calendar:', error)
      return NextResponse.json(
        { error: 'Error al obtener calendario' },
        { status: 500 }
      )
    }

    // Agrupar por fecha
    const eventsByDate: Record<string, PublicCalendarEvent[]> = {}
    
    data?.forEach((event) => {
      const dateKey = event.event_date
      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = []
      }
      eventsByDate[dateKey].push(event as PublicCalendarEvent)
    })

    // Convertir a array de DayEvents
    const calendar: PublicDayEvents[] = Object.entries(eventsByDate).map(([date, events]) => ({
      date,
      count: events.length,
      events
    }))

    // Estadísticas agregadas (sin información sensible)
    const stats = {
      total: data?.length || 0,
      byStatus: {
        pendiente: data?.filter(e => e.status === 'pendiente').length || 0,
        en_progreso: data?.filter(e => e.status === 'en_planificacion' || e.status === 'en_diseño').length || 0,
        completado: data?.filter(e => e.status === 'lista' || e.status === 'entregada').length || 0,
      },
      byType: {
        flyer: data?.filter(e => e.material_type === 'flyer').length || 0,
        banner: data?.filter(e => e.material_type === 'banner').length || 0,
        video: data?.filter(e => e.material_type === 'video').length || 0,
        redes_sociales: data?.filter(e => e.material_type === 'redes_sociales').length || 0,
        otro: data?.filter(e => e.material_type === 'otro').length || 0,
      }
    }

    return NextResponse.json({
      year,
      month,
      calendar,
      stats
    })

  } catch (error) {
    console.error('Error in GET /api/public/calendar:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
