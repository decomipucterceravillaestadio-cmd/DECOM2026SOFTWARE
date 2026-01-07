/**
 * Tipos de Autenticación
 * Interfaces para manejar users, sessions y autenticación
 */

import type { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js'

export type UserRole = 'comite_member' | 'decom_admin'

export interface User extends SupabaseUser {
  id: string
  email: string
}

export interface Session extends SupabaseSession {
  user: User
}

export interface AuthUser {
  id: string
  auth_user_id: string | null
  email: string
  full_name: string | null
  role: UserRole
  preferred_committee_id: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User | null
  session: Session | null
  error: Error | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  user?: AuthUser
  error?: string
}
