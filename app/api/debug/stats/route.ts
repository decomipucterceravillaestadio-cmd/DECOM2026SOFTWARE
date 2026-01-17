import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET() {
  try {
    const supabase = createServerClient(
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

    // Test 1: Check if we can connect to Supabase
    const connectionTest = await supabase
      .from('requests')
      .select('count()', { count: 'exact', head: true })

    // Test 2: Get actual data
    const allRequests = await supabase
      .from('requests')
      .select('id, status, event_date, event_name')
      .limit(5)

    // Test 3: Count by status
    const statusCounts = {
      total: await supabase
        .from('requests')
        .select('*', { count: 'exact', head: true }),
      pending: await supabase
        .from('requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pendiente'),
      planning: await supabase
        .from('requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'En planificación'),
      design: await supabase
        .from('requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'En diseño'),
    }

    return NextResponse.json({
      connectionTest: {
        error: connectionTest.error?.message,
        count: connectionTest.count,
      },
      sampleRequests: {
        data: allRequests.data,
        error: allRequests.error?.message,
      },
      statusCounts: {
        total: statusCounts.total.count,
        pending: statusCounts.pending.count,
        planning: statusCounts.planning.count,
        design: statusCounts.design.count,
      },
      allErrors: [
        connectionTest.error?.message,
        allRequests.error?.message,
        statusCounts.total.error?.message,
      ].filter(Boolean),
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error?.message || 'Unknown error',
      stack: error?.stack,
    })
  }
}
