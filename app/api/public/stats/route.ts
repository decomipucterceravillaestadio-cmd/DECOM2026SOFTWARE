import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '../../../types/database'

export async function GET() {
  try {
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return []
          },
          setAll() {
            // No-op for public API
          },
        },
      }
    )

    // Obtener estadísticas públicas de solicitudes pendientes
    const [
      totalRequests,
      pendingRequests,
      inProgressRequests,
      upcomingEvents
    ] = await Promise.all([
      // Total de solicitudes activas
      supabase
        .from('requests')
        .select('*', { count: 'exact', head: true })
        .in('status', ['Pendiente', 'En planificación', 'En diseño', 'Lista para entrega']),

      // Solicitudes pendientes específicamente
      supabase
        .from('requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pendiente'),

      // Solicitudes en progreso
      supabase
        .from('requests')
        .select('*', { count: 'exact', head: true })
        .in('status', ['En planificación', 'En diseño']),

      // Próximos eventos (próximos 7 días)
      supabase
        .from('requests')
        .select('event_date, event_name, committee:committees(name)')
        .in('status', ['Pendiente', 'En planificación', 'En diseño', 'Lista para entrega'])
        .gte('event_date', new Date().toISOString().split('T')[0])
        .lte('event_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .limit(5)
    ])

    const stats = {
      total_active: totalRequests.count || 0,
      pending: pendingRequests.count || 0,
      in_progress: inProgressRequests.count || 0,
      upcoming_events: upcomingEvents.data || []
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error in GET /api/public/stats:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}