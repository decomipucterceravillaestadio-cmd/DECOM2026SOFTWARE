'use client'

import { useAuth } from '@/app/contexts/AuthContext'
import { Permission } from '@/app/lib/permissions'
import { hasPermission } from '@/app/lib/permissions'

export default function DebugAuthPage() {
  const { user, loading, hasPermission: checkPerm } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔍 Debug de Autenticación</h1>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Estado de Carga</h2>
          <p className="text-lg">
            {loading ? (
              <span className="text-yellow-600">⏳ Cargando...</span>
            ) : (
              <span className="text-green-600">✅ Cargado</span>
            )}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Datos del Usuario</h2>
          {user ? (
            <div className="space-y-2">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Auth User ID:</strong> {user.auth_user_id || 'null'}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Nombre:</strong> {user.full_name || 'Sin nombre'}</p>
              <p><strong>Rol:</strong> <span className="font-bold text-blue-600">{user.role}</span></p>
              <p><strong>Role Level:</strong> {user.role_level}</p>
              <p><strong>Activo:</strong> {user.is_active ? '✅ Sí' : '❌ No'}</p>
            </div>
          ) : (
            <p className="text-red-600">❌ No hay usuario cargado</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Permisos del Usuario</h2>
          {user ? (
            <div className="space-y-2">
              <p><strong>VIEW_USERS:</strong> {checkPerm(Permission.VIEW_USERS) ? '✅' : '❌'}</p>
              <p><strong>CREATE_USERS:</strong> {checkPerm(Permission.CREATE_USERS) ? '✅' : '❌'}</p>
              <p><strong>EDIT_USERS:</strong> {checkPerm(Permission.EDIT_USERS) ? '✅' : '❌'}</p>
              <p><strong>DELETE_USERS:</strong> {checkPerm(Permission.DELETE_USERS) ? '✅' : '❌'}</p>
              <p><strong>VIEW_REQUESTS:</strong> {checkPerm(Permission.VIEW_REQUESTS) ? '✅' : '❌'}</p>
              <p><strong>CREATE_REQUESTS:</strong> {checkPerm(Permission.CREATE_REQUESTS) ? '✅' : '❌'}</p>
            </div>
          ) : (
            <p className="text-gray-500">Sin usuario autenticado</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Test Directo de Permisos</h2>
          {user ? (
            <div className="space-y-2">
              <p><strong>hasPermission('{user.role}', VIEW_USERS):</strong> {hasPermission(user.role, Permission.VIEW_USERS) ? '✅ TRUE' : '❌ FALSE'}</p>
              <p><strong>hasPermission('{user.role}', CREATE_USERS):</strong> {hasPermission(user.role, Permission.CREATE_USERS) ? '✅ TRUE' : '❌ FALSE'}</p>
            </div>
          ) : (
            <p className="text-gray-500">Sin usuario autenticado</p>
          )}
        </div>

        <div className="mt-6">
          <a 
            href="/admin"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            ← Volver al Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
