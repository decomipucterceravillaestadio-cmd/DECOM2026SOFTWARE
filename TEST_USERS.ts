/**
 * CREDENCIALES DE PRUEBA - DECOM SYSTEM
 * 
 * ✅ COMPLETADO: Los usuarios han sido creados en Supabase Auth
 * via migración SQL: create_test_users_with_uuids (2026-01-06)
 */

export const TEST_USERS = {
  // Admin con acceso completo al panel
  admin: {
    email: 'admin@decom.test',
    password: 'DecomAdmin123!',
    role: 'decom_admin',
    userId: '550e8400-e29b-41d4-a716-446655440001',
    description: 'Administrador del sistema con acceso completo',
  },

  // Manager con permisos de coordinador
  manager: {
    email: 'manager@decom.test',
    password: 'ManagerDecom123!',
    role: 'decom_admin',
    userId: '550e8400-e29b-41d4-a716-446655440002',
    description: 'Coordinador DECOM con acceso a solicitudes',
  },

  // Miembro de comité (acceso limitado)
  member: {
    email: 'miembro@comite.test',
    password: 'Miembro123!',
    role: 'comite_member',
    userId: '550e8400-e29b-41d4-a716-446655440003',
    description: 'Miembro de comité (NO tiene acceso al panel)',
  }
}

/**
 * TESTING RÁPIDO
 * ==============
 * 
 * 1️⃣  FORMULARIO (Público):
 *    - URL: http://localhost:3000
 *    - Llena y envía el formulario de 2 pasos
 *    - No requiere login
 * 
 * 2️⃣  LOGIN ADMIN (Acceso al panel):
 *    - URL: http://localhost:3000/login
 *    - Email: admin@decom.test
 *    - Password: DecomAdmin123!
 *    - Esperado: Redirige a /dashboard
 * 
 * 3️⃣  LOGOUT:
 *    - Botón en la interfaz o /api/auth/logout
 * 
 * ENDPOINTS:
 * POST /api/auth/login - Autenticación
 * POST /api/auth/logout - Cerrar sesión
 * GET /api/committees - Listar comités (público)
 * POST /api/requests - Crear solicitud (público)
 */
