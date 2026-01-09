/**
 * Script de prueba para verificar permisos
 * Ejecutar: node test-permissions.js
 */

// Simular los permisos
const Permission = {
  VIEW_USERS: 'view_users',
  CREATE_USERS: 'create_users',
  EDIT_USERS: 'edit_users',
  DELETE_USERS: 'delete_users',
}

const ROLE_PERMISSIONS = {
  admin: Object.values(Permission),
  presidente: [
    Permission.VIEW_USERS,
    Permission.CREATE_USERS,
    Permission.EDIT_USERS,
    Permission.DELETE_USERS,
  ],
  tesorero: [],
  secretario: [],
  vocal: [],
}

function hasPermission(role, permission) {
  const permissions = ROLE_PERMISSIONS[role] || []
  return permissions.includes(permission)
}

// Pruebas
console.log('=== TEST DE PERMISOS ===\n')

const roles = ['admin', 'presidente', 'tesorero', 'secretario', 'vocal']

roles.forEach(role => {
  console.log(`Rol: ${role}`)
  console.log(`  VIEW_USERS: ${hasPermission(role, Permission.VIEW_USERS)}`)
  console.log(`  CREATE_USERS: ${hasPermission(role, Permission.CREATE_USERS)}`)
  console.log(`  EDIT_USERS: ${hasPermission(role, Permission.EDIT_USERS)}`)
  console.log(`  DELETE_USERS: ${hasPermission(role, Permission.DELETE_USERS)}`)
  console.log('')
})
