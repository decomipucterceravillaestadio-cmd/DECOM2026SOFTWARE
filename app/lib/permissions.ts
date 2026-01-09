/**
 * Sistema de Permisos basado en Roles
 * Utilidades para validar permisos y controlar acceso
 */

import { UserRole, ROLE_LEVELS } from '@/app/types/auth'

// Definición de permisos del sistema
export enum Permission {
  // Gestión de usuarios
  VIEW_USERS = 'view_users',
  CREATE_USERS = 'create_users',
  EDIT_USERS = 'edit_users',
  DELETE_USERS = 'delete_users',
  
  // Gestión de solicitudes
  VIEW_REQUESTS = 'view_requests',
  CREATE_REQUESTS = 'create_requests',
  EDIT_REQUESTS = 'edit_requests',
  DELETE_REQUESTS = 'delete_requests',
  CHANGE_REQUEST_STATUS = 'change_request_status',
  
  // Gestión de comités
  VIEW_COMMITTEES = 'view_committees',
  EDIT_COMMITTEES = 'edit_committees',
  
  // Calendario
  VIEW_CALENDAR = 'view_calendar',
  TOGGLE_REQUEST_VISIBILITY = 'toggle_request_visibility',
  
  // Estadísticas y reportes
  VIEW_STATS = 'view_stats',
  
  // Configuración del sistema
  MANAGE_SYSTEM = 'manage_system',
}

// Matriz de permisos por rol
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // ADMIN - Todos los permisos
  admin: Object.values(Permission),
  
  // PRESIDENTE - Gestión de usuarios + todos los permisos de niveles inferiores
  presidente: [
    Permission.VIEW_USERS,
    Permission.CREATE_USERS,
    Permission.EDIT_USERS,
    Permission.DELETE_USERS,
    Permission.VIEW_REQUESTS,
    Permission.CREATE_REQUESTS,
    Permission.EDIT_REQUESTS,
    Permission.DELETE_REQUESTS,
    Permission.CHANGE_REQUEST_STATUS,
    Permission.VIEW_COMMITTEES,
    Permission.VIEW_CALENDAR,
    Permission.TOGGLE_REQUEST_VISIBILITY,
    Permission.VIEW_STATS,
  ],
  
  // TESORERO - CRUD completo de solicitudes
  tesorero: [
    Permission.VIEW_REQUESTS,
    Permission.CREATE_REQUESTS,
    Permission.EDIT_REQUESTS,
    Permission.DELETE_REQUESTS,
    Permission.CHANGE_REQUEST_STATUS,
    Permission.VIEW_COMMITTEES,
    Permission.VIEW_CALENDAR,
    Permission.TOGGLE_REQUEST_VISIBILITY,
    Permission.VIEW_STATS,
  ],
  
  // SECRETARIO - CRUD completo de solicitudes (igual que tesorero)
  secretario: [
    Permission.VIEW_REQUESTS,
    Permission.CREATE_REQUESTS,
    Permission.EDIT_REQUESTS,
    Permission.DELETE_REQUESTS,
    Permission.CHANGE_REQUEST_STATUS,
    Permission.VIEW_COMMITTEES,
    Permission.VIEW_CALENDAR,
    Permission.TOGGLE_REQUEST_VISIBILITY,
    Permission.VIEW_STATS,
  ],
  
  // VOCAL - CRUD completo de solicitudes (igual que tesorero y secretario)
  vocal: [
    Permission.VIEW_REQUESTS,
    Permission.CREATE_REQUESTS,
    Permission.EDIT_REQUESTS,
    Permission.DELETE_REQUESTS,
    Permission.CHANGE_REQUEST_STATUS,
    Permission.VIEW_COMMITTEES,
    Permission.VIEW_CALENDAR,
    Permission.TOGGLE_REQUEST_VISIBILITY,
    Permission.VIEW_STATS,
  ],
  
  // Legacy roles
  decom_admin: Object.values(Permission), // Equivalente a admin
  comite_member: [
    Permission.VIEW_REQUESTS,
    Permission.CREATE_REQUESTS,
    Permission.EDIT_REQUESTS,
    Permission.VIEW_CALENDAR,
  ],
}

/**
 * Verifica si un rol tiene un permiso específico
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || []
  return permissions.includes(permission)
}

/**
 * Verifica si un rol tiene varios permisos (AND)
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission))
}

/**
 * Verifica si un rol tiene al menos uno de varios permisos (OR)
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission))
}

/**
 * Verifica si un rol tiene nivel suficiente (útil para jerarquía)
 */
export function hasMinimumRoleLevel(role: UserRole, minimumLevel: number): boolean {
  return ROLE_LEVELS[role] >= minimumLevel
}

/**
 * Verifica si rol1 tiene mayor o igual nivel que rol2
 */
export function hasHigherOrEqualRole(role1: UserRole, role2: UserRole): boolean {
  return ROLE_LEVELS[role1] >= ROLE_LEVELS[role2]
}

/**
 * Obtiene el nivel numérico de un rol
 */
export function getRoleLevel(role: UserRole): number {
  return ROLE_LEVELS[role]
}

/**
 * Verifica si un usuario puede gestionar a otro usuario (por nivel de rol)
 */
export function canManageUser(managerRole: UserRole, targetRole: UserRole): boolean {
  // Admin y Presidente pueden gestionar usuarios
  if (!hasPermission(managerRole, Permission.EDIT_USERS)) {
    return false
  }
  
  // Solo puede gestionar usuarios de nivel inferior o igual
  return ROLE_LEVELS[managerRole] >= ROLE_LEVELS[targetRole]
}

/**
 * Lista de roles disponibles para asignar según el rol del usuario actual
 */
export function getAssignableRoles(currentRole: UserRole): UserRole[] {
  const currentLevel = ROLE_LEVELS[currentRole]
  
  // Solo devolver roles nuevos (sin legacy)
  const modernRoles: UserRole[] = ['admin', 'presidente', 'tesorero', 'secretario', 'vocal']
  
  // Solo puede asignar roles de nivel igual o inferior
  return modernRoles.filter(role => ROLE_LEVELS[role] <= currentLevel)
}

/**
 * Obtiene todos los permisos de un rol
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || []
}

/**
 * Verifica si el rol puede acceder a una ruta específica
 */
export function canAccessRoute(role: UserRole, route: string): boolean {
  // Rutas públicas
  const publicRoutes = ['/login', '/calendar', '/']
  if (publicRoutes.some(r => route.startsWith(r))) {
    return true
  }
  
  // Rutas de administración de usuarios
  if (route.startsWith('/admin/users')) {
    return hasPermission(role, Permission.VIEW_USERS)
  }
  
  // Rutas de solicitudes
  if (route.startsWith('/admin/requests') || route.startsWith('/requests')) {
    return hasPermission(role, Permission.VIEW_REQUESTS)
  }
  
  // Rutas admin generales
  if (route.startsWith('/admin')) {
    return hasMinimumRoleLevel(role, 1) // Cualquier usuario autenticado
  }
  
  // Por defecto denegar
  return false
}
