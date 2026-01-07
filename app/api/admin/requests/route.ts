import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/app/lib/supabase/server'
import { Database } from '@/app/types/database'

type Request = Database['public']['Tables']['requests']['Row']
type Committee = Database['public']['Tables']['committees']['Row']

interface RequestWithCommittee extends Request {
  committee: Committee
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener parámetros de búsqueda
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const committee_id = searchParams.get('committee_id')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sort = searchParams.get('sort') || 'created_at'
    const order = searchParams.get('order') || 'desc'
    
    const offset = (page - 1) * limit

    // Construir query base
    let query = supabase
      .from('requests')
      .select(`
        *,
        committee:committees (
          id,
          name,
          description,
          color_badge
        )
      `, { count: 'exact' })

    // Aplicar filtros
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    if (committee_id) {
      query = query.eq('committee_id', committee_id)
    }

    // Aplicar ordenamiento y paginación
    query = query
      .order(sort, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching requests:', error)
      return NextResponse.json(
        { error: 'Error al obtener solicitudes' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      requests: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Error in GET /api/admin/requests:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
