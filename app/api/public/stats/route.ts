import { NextResponse } from 'next/server'

export async function GET() {
  console.log('[STATS API] Request received at:', new Date().toISOString())
  
  try {
    // Respuesta simple mientras diagnosticamos
    const stats = {
      total_active: 5,
      pending: 2,
      in_progress: 1,
      upcoming_events: []
    }

    console.log('[STATS API] Responding with:', stats)
    return NextResponse.json(stats)

  } catch (error: any) {
    console.error('[STATS API] Error:', error?.message)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        message: error?.message 
      },
      { status: 500 }
    )
  }
}