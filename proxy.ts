/**
 * Proxy de Autenticación (anteriormente middleware)
 * - Refresca la sesión en cada request
 * - Protege rutas que requieren autenticación
 * - Redirige según rol del usuario
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from './app/types/database'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
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
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: Refrescar sesión automáticamente
  const { data: { session } } = await supabase.auth.getSession()

  // Rutas que NO requieren autenticación
  const publicPaths = [
    '/login',
    '/new-request', 
    '/calendar', 
    '/setup', 
    '/confirmation',
    '/',
    '/api/auth',
    '/api/committees',
    '/api/requests',
    '/api/public'
  ]
  
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith(path + '/')
  )

  // Si es ruta pública, dejar pasar
  if (isPublicPath) {
    return response
  }

  // Rutas protegidas (admin)
  const protectedPaths = ['/admin', '/dashboard', '/api/admin']
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  // Si es ruta protegida y no hay sesión, redirigir
  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * INCLUYE /api para refrescar sesión
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
