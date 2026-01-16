/**
 * Proxy de Autenticación (anteriormente middleware)
 * - Refresca la sesión en cada request
 * - Protege rutas que requieren autenticación
 * - Redirige según rol del usuario
 * - Validación de permisos basada en role_level
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from './app/types/database'
import type { UserRole } from './app/types/auth'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
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
  const path = request.nextUrl.pathname

  // Rutas que NO requieren autenticación en el proxy
  // Las rutas de API verifican la autenticación internamente
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
    '/api/public',
    '/api/admin', // Los endpoints API verifican la autenticación internamente
    '/api/test-update'
  ]
  
  const isPublicPath = publicPaths.some(p => 
    path === p || 
    path.startsWith(p + '/')
  )

  // Si es ruta pública o API, dejar pasar
  if (isPublicPath) {
    return response
  }

  // Rutas protegidas (páginas de admin, no APIs)
  const protectedPaths = ['/admin', '/dashboard', '/requests']
  const isProtectedPath = protectedPaths.some(p =>
    path.startsWith(p)
  )

  // Si es ruta protegida y no hay sesión, redirigir
  if (isProtectedPath && !session) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', path)
    return NextResponse.redirect(redirectUrl)
  }

  // Si hay sesión en ruta protegida, verificar rol y permisos
  if (isProtectedPath && session?.user) {
    try {
      // Obtener datos del usuario de la tabla public.users
      const { data: userData, error } = await supabase
        .from('users')
        .select('role, role_level, is_active')
        .eq('auth_user_id', session.user.id)
        .single()

      if (error || !userData) {
        console.error('Error obteniendo usuario:', error)
        return NextResponse.redirect(new URL('/login', request.url))
      }

      // Cast userData para incluir campos que existen pero no están en tipos generados
      const user = userData as any

      // Verificar que el usuario esté activo
      if (user.is_active === false) {
        const errorResponse = NextResponse.redirect(new URL('/login', request.url))
        errorResponse.cookies.set('auth_error', 'Usuario desactivado', {
          maxAge: 60,
        })
        return errorResponse
      }

      const userRole = user.role as UserRole
      const roleLevel = user.role_level ?? 1

      // Rutas que requieren permisos específicos
      if (path.startsWith('/admin/users')) {
        // Solo admin y presidente pueden gestionar usuarios (nivel >= 4)
        if (roleLevel < 4) {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
      }

      // Rutas admin generales - cualquier usuario autenticado con role_level >= 1
      if (path.startsWith('/admin') && roleLevel < 1) {
        return NextResponse.redirect(new URL('/login', request.url))
      }

    } catch (error) {
      console.error('Error en proxy:', error)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Si está autenticado y intenta acceder a login, redirigir a admin
  if (path === '/login' && session) {
    return NextResponse.redirect(new URL('/admin', request.url))
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
