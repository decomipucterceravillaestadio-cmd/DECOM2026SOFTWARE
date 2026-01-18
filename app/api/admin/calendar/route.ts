import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/app/lib/supabase/server'
import { startOfMonth, endOfMonth, format } from 'date-fns'

interface CalendarEvent {
  id: string
  event_name: string
  event_date: string
  status: string
  priority_score: number | null
  material_type: string
  committee: {
    name: string
    color_badge: string
  }
}

interface DayEvents {
  date: string
  count: number
  events: CalendarEvent[]
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener parámetros
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

    // Obtener solicitudes del mes
    const { data, error } = await supabase
      .from('requests')
      .select(`
        id,
        event_name,
        event_date,
        status,
        priority_score,
        material_type,
        committee:committees (
          name,
          color_badge
        )
      `)
      .is('deleted_at', null)
      .gte('event_date', format(startDate, 'yyyy-MM-dd'))
      .lte('event_date', format(endDate, 'yyyy-MM-dd'))
      .order('event_date', { ascending: true })

    if (error) {
      console.error('Error fetching calendar events:', error)
      return NextResponse.json(
        { error: 'Error al obtener eventos' },
        { status: 500 }
      )
    }

    // Agrupar por fecha
    const eventsByDate: Record<string, CalendarEvent[]> = {}
    
    data?.forEach((event: any) => {
      const dateKey = event.event_date
      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = []
      }
      eventsByDate[dateKey].push(event)
    })

    // Convertir a array de DayEvents
    const calendar: DayEvents[] = Object.entries(eventsByDate).map(([date, events]) => ({
      date,
      count: events.length,
      events
    }))

    return NextResponse.json({
      year,
      month,
      calendar,
      total: data?.length || 0
    })

  } catch (error) {
    console.error('Error in GET /api/admin/calendar:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
