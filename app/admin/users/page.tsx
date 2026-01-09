'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconFilter,
  IconLayoutDashboard,
  IconClipboardList,
  IconUser,
  IconLogout,
  IconCalendar,
  IconUsers
} from '@tabler/icons-react'
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar'
import { Button } from '@/app/components/UI/Button'
import { RoleBadge } from '@/app/components/Auth/RoleBadge'
import { useAuth, useHasPermission } from '@/app/contexts/AuthContext'
import { Permission } from '@/app/lib/permissions'
import type { UserRole, ROLE_LABELS } from '@/app/types/auth'

interface User {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  role_level: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const { user: currentUser, loading: authLoading } = useAuth()
  const canViewUsers = useHasPermission(Permission.VIEW_USERS)
  const canCreateUsers = useHasPermission(Permission.CREATE_USERS)
  const canEditUsers = useHasPermission(Permission.EDIT_USERS)
  const canDeleteUsers = useHasPermission(Permission.DELETE_USERS)
  const canManageUsers = useHasPermission(Permission.VIEW_USERS)

  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  // Links del sidebar
  const baseLinks = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: <IconLayoutDashboard className="h-5 w-5" />,
    },
    {
      label: 'Nueva Solicitud',
      href: '/new-request',
      icon: <IconPlus className="h-5 w-5" />,
    },
    {
      label: 'Solicitudes',
      href: '/admin',
      icon: <IconClipboardList className="h-5 w-5" />,
    },
    {
      label: 'Calendario',
      href: '/admin/calendar',
      icon: <IconCalendar className="h-5 w-5" />,
    },
  ]

  const adminLinks = canManageUsers ? [
    {
      label: 'Gestión de Usuarios',
      href: '/admin/users',
      icon: <IconUsers className="h-5 w-5" />,
    }
  ] : []

  const links = [
    ...baseLinks,
    ...adminLinks,
    {
      label: 'Perfil',
      href: '/admin/profile',
      icon: <IconUser className="h-5 w-5" />,
    },
  ]

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  // Debug: ver qué está pasando
  useEffect(() => {
    console.log('🔍 Admin Users Page Debug:', {
      currentUser,
      authLoading,
      canViewUsers,
      role: currentUser?.role,
      role_level: currentUser?.role_level,
    })
  }, [currentUser, authLoading, canViewUsers])

  // Cargar usuarios
  useEffect(() => {
    // Esperar a que termine de cargar la autenticación
    if (authLoading) {
      return
    }

    // Si no tiene permisos después de cargar, redirigir
    if (!canViewUsers) {
      console.error('❌ No tiene permiso VIEW_USERS, redirigiendo...')
      router.push('/admin')
      return
    }

    loadUsers()
  }, [canViewUsers, router, authLoading])

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...users]

    // Filtro por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filtro por rol
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    // Filtro por estado
    if (statusFilter === 'active') {
      filtered = filtered.filter((user) => user.is_active)
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter((user) => !user.is_active)
    }

    setFilteredUsers(filtered)
  }, [users, searchQuery, roleFilter, statusFilter])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/users')
      
      if (!response.ok) {
        throw new Error('Error al cargar usuarios')
      }

      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!canDeleteUsers) {
      alert('No tienes permisos para desactivar usuarios')
      return
    }

    if (!confirm('¿Estás seguro de desactivar este usuario? No podrá iniciar sesión.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al desactivar usuario')
      }

      alert('Usuario desactivado exitosamente')
      loadUsers()
    } catch (error: any) {
      console.error('Error deleting user:', error)
      alert(error.message || 'Error al desactivar usuario')
    }
  }

  const handleActivateUser = async (userId: string) => {
    if (!canEditUsers) {
      alert('No tienes permisos para activar usuarios')
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: true }),
      })

      if (!response.ok) {
        throw new Error('Error al activar usuario')
      }

      alert('Usuario activado exitosamente')
      loadUsers()
    } catch (error) {
      console.error('Error activating user:', error)
      alert('Error al activar usuario')
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!canViewUsers) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-red-600 text-5xl mb-4">🔒</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
            <p className="text-gray-600 mb-4">
              No tienes permisos para acceder a la gestión de usuarios.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Tu rol: <strong>{currentUser?.role || 'Desconocido'}</strong>
            </p>
            <Button
              variant="primary"
              onClick={() => router.push('/admin')}
            >
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-neutral-950 flex-col md:flex-row">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 border-r border-gray-300 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            {/* Logo */}
            <div className="mb-8 pl-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#15539C] to-[#16233B] flex items-center justify-center">
                  <IconLayoutDashboard className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-[#16233B] tracking-tight">
                  DECOM
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          
          <div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full group"
            >
              <IconLogout className="h-5 w-5 group-hover:stroke-red-600" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex flex-1 flex-col overflow-hidden bg-[#F5F5F5] relative">
        <div className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            {/* Header */}
            <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Gestión de Usuarios
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredUsers.length} {filteredUsers.length === 1 ? 'usuario' : 'usuarios'}
            </p>
          </div>

          {canCreateUsers && (
            <Button
              variant="primary"
              size="md"
              onClick={() => router.push('/admin/users/new')}
            >
              <IconPlus className="w-5 h-5 mr-2" />
              Nuevo Usuario
            </Button>
          )}
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
          {/* Búsqueda */}
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filtros de rol y estado */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <IconFilter className="w-5 h-5 text-gray-500" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los roles</option>
                <option value="admin">Admin</option>
                <option value="presidente">Presidente</option>
                <option value="tesorero">Tesorero</option>
                <option value="secretario">Secretario</option>
                <option value="vocal">Vocal</option>
                <option value="decom_admin">DECOM Admin (Legacy)</option>
                <option value="comite_member">Miembro Comité (Legacy)</option>
              </select>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-600 mb-4">No se encontraron usuarios</p>
          {canCreateUsers && (
            <Button
              variant="primary"
              size="md"
              onClick={() => router.push('/admin/users/new')}
            >
              <IconPlus className="w-5 h-5 mr-2" />
              Crear Primer Usuario
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Vista móvil: Cards */}
          <div className="block md:hidden divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {user.full_name || 'Sin nombre'}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="ml-2">
                    {user.is_active ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <IconCheck className="w-3 h-3 mr-1" />
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <IconX className="w-3 h-3 mr-1" />
                        Inactivo
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <RoleBadge role={user.role} size="sm" />
                </div>

                <div className="flex gap-2">
                  {canEditUsers && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                    >
                      <IconEdit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                  )}

                  {canDeleteUsers && user.is_active && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <IconTrash className="w-4 h-4 mr-1" />
                      Desactivar
                    </Button>
                  )}

                  {canEditUsers && !user.is_active && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleActivateUser(user.id)}
                    >
                      <IconCheck className="w-4 h-4 mr-1" />
                      Activar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Vista desktop: Tabla */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Creación
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold">
                            {user.full_name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.full_name || 'Sin nombre'}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RoleBadge role={user.role} size="sm" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.is_active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <IconCheck className="w-3 h-3 mr-1" />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <IconX className="w-3 h-3 mr-1" />
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('es-CO')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {canEditUsers && (
                          <button
                            onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar usuario"
                          >
                            <IconEdit className="w-5 h-5" />
                          </button>
                        )}

                        {canDeleteUsers && user.is_active && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Desactivar usuario"
                          >
                            <IconTrash className="w-5 h-5" />
                          </button>
                        )}

                        {canEditUsers && !user.is_active && (
                          <button
                            onClick={() => handleActivateUser(user.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Activar usuario"
                          >
                            <IconCheck className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
          </div>
        </div>
      </div>
    </div>
  )
}
