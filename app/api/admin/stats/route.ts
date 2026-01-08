import { NextResponse } from 'next/server'
import { createServerClient } from '@/app/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServerClient()
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener estadísticas agregadas
    const [
      totalRequests,
      pendingRequests,
      inProgressRequests,
      completedRequests,
      approvedRequests,
      rejectedRequests,
      requestsByCommittee
    ] = await Promise.all([
      // Total de solicitudes
      supabase
        .from('requests')
        .select('*', { count: 'exact', head: true }),
      
      // Solicitudes pendientes
      supabase
        .from('requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pendiente'),
      
      // Solicitudes en progreso (en_planificacion + en_diseño)
      supabase
        .from('requests')
        .select('*', { count: 'exact', head: true })
        .in('status', ['en_planificacion', 'en_diseño']),
      
      // Solicitudes completadas (lista + entregada)
      supabase
        .from('requests')
        .select('*', { count: 'exact', head: true })
        .in('status', ['lista', 'entregada']),
      
      // Solicitudes aprobadas (usando lista como aprobada)
      supabase
        .from('requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'lista'),
      
      // Solicitudes rechazadas (no hay estado de rechazado, así que 0)
      Promise.resolve({ count: 0 }),
      
      // Solicitudes por comité
      supabase
        .from('requests')
        .select(`
          committee_id,
          committee:committees (
            id,
            name,
            color_badge
          )
        `)
    ])

    // Procesar solicitudes por comité
    const committeeStats = requestsByCommittee.data?.reduce((acc: any, req: any) => {
      const committeeId = req.committee_id
      if (!acc[committeeId]) {
        acc[committeeId] = {
          id: committeeId,
          name: req.committee?.name || 'Desconocido',
          color_badge: req.committee?.color_badge || 'gray',
          count: 0
        }
      }
      acc[committeeId].count++
      return acc
    }, {}) || {}

    const stats = {
      total: totalRequests.count || 0,
      byStatus: {
        pending: pendingRequests.count || 0,
        in_progress: inProgressRequests.count || 0,
        completed: completedRequests.count || 0,
        approved: approvedRequests.count || 0,
        rejected: rejectedRequests.count || 0
      },
      byCommittee: Object.values(committeeStats)
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error in GET /api/admin/stats:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
