/**
 * Tipos de Autenticación
 * Interfaces para manejar users, sessions y autenticación
 */

import type { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js'

// Sistema de roles jerárquico
export type UserRole = 
  | 'admin'       // Nivel 5: Todos los permisos + gestión de usuarios y sistema
  | 'presidente'  // Nivel 4: Gestión de usuarios + CRUD completo
  | 'tesorero'    // Nivel 3: CRUD completo de solicitudes
  | 'secretario'  // Nivel 2: CRUD completo de solicitudes
  | 'vocal'       // Nivel 1: CRUD completo de solicitudes
  | 'decom_admin' // Legacy: equivalente a admin
  | 'comite_member' // Legacy: equivalente a vocal

// Niveles de rol para jerarquía
export const ROLE_LEVELS: Record<UserRole, number> = {
  admin: 5,
  presidente: 4,
  tesorero: 3,
  secretario: 2,
  vocal: 1,
  decom_admin: 5, // Legacy
  comite_member: 1, // Legacy
}

// Nombres legibles de roles
export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  presidente: 'Presidente',
  tesorero: 'Tesorero',
  secretario: 'Secretario',
  vocal: 'Vocal',
  decom_admin: 'Admin DECOM', // Legacy
  comite_member: 'Miembro de Comité', // Legacy
}

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
  role_level?: number // Nivel jerárquico del rol
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
