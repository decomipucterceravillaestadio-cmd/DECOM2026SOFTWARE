/**
 * Context de Autenticación y Permisos
 * Gestiona el estado del usuario autenticado y sus permisos
 */

'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { AuthUser, UserRole } from '@/app/types/auth'
import { hasPermission, getRoleLevel, canAccessRoute, Permission } from '@/app/lib/permissions'
import type { Database } from '@/app/types/database'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  // Helpers de permisos
  hasPermission: (permission: Permission) => boolean
  roleLevel: number
  canAccessRoute: (route: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Cargar usuario desde la sesión
  const loadUser = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      console.log('🔐 AuthContext loadUser:', { hasSession: !!session })
      
      if (session?.user) {
        // Obtener datos completos del usuario
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('auth_user_id', session.user.id)
          .single()

        console.log('👤 User data from DB:', { userData, error })

        if (userData && !error) {
          setUser(userData as unknown as AuthUser)
          console.log('✅ User set:', userData)
        } else {
          console.error('❌ Error loading user data:', error)
          setUser(null)
        }
      } else {
        console.log('🚫 No session found')
        setUser(null)
      }
    } catch (error) {
      console.error('💥 Error loading user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  // Cargar usuario al montar el componente
  useEffect(() => {
    loadUser()

    // Escuchar cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session) => {
      if (session?.user) {
        loadUser()
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [loadUser, supabase])

  // Cerrar sesión
  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  // Refrescar datos del usuario
  const refreshUser = async () => {
    await loadUser()
  }

  // Helper: Verificar si el usuario tiene un permiso
  const checkPermission = useCallback(
    (permission: Permission): boolean => {
      if (!user) {
        console.log('⚠️ checkPermission: No user')
        return false
      }
      const result = hasPermission(user.role, permission)
      console.log(`🔍 checkPermission(${permission}):`, {
        role: user.role,
        result,
      })
      return result
    },
    [user]
  )

  // Helper: Obtener nivel de rol
  const roleLevel = user ? getRoleLevel(user.role) : 0

  // Helper: Verificar si puede acceder a una ruta
  const checkRoute = useCallback(
    (route: string): boolean => {
      if (!user) return false
      return canAccessRoute(user.role, route)
    },
    [user]
  )

  const value: AuthContextType = {
    user,
    loading,
    signOut,
    refreshUser,
    hasPermission: checkPermission,
    roleLevel,
    canAccessRoute: checkRoute,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook para usar el contexto de autenticación
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * Hook específico para verificar permisos
 */
export function useHasPermission(permission: Permission): boolean {
  const { hasPermission } = useAuth()
  return hasPermission(permission)
}

/**
 * Hook para verificar múltiples permisos (AND)
 */
export function useHasAllPermissions(permissions: Permission[]): boolean {
  const { hasPermission } = useAuth()
  return permissions.every(p => hasPermission(p))
}

/**
 * Hook para verificar múltiples permisos (OR)
 */
export function useHasAnyPermission(permissions: Permission[]): boolean {
  const { hasPermission } = useAuth()
  return permissions.some(p => hasPermission(p))
}

/**
 * Hook para verificar nivel de rol mínimo
 */
export function useHasMinimumLevel(minimumLevel: number): boolean {
  const { roleLevel } = useAuth()
  return roleLevel >= minimumLevel
}

/**
 * HOC para proteger componentes por permiso
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: Permission,
  fallback?: React.ReactNode
) {
  return function ProtectedComponent(props: P) {
    const hasRequiredPermission = useHasPermission(requiredPermission)

    if (!hasRequiredPermission) {
      return <>{fallback || null}</>
    }

    return <Component {...props} />
  }
}

/**
 * HOC para proteger componentes por nivel de rol
 */
export function withMinimumLevel<P extends object>(
  Component: React.ComponentType<P>,
  minimumLevel: number,
  fallback?: React.ReactNode
) {
  return function ProtectedComponent(props: P) {
    const hasLevel = useHasMinimumLevel(minimumLevel)

    if (!hasLevel) {
      return <>{fallback || null}</>
    }

    return <Component {...props} />
  }
}
