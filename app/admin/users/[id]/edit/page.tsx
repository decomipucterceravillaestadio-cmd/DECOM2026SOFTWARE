'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  IconArrowLeft,
  IconEye,
  IconEyeOff,
  IconDeviceFloppy,
  IconLayoutDashboard,
  IconClipboardList,
  IconUser,
  IconLogout,
  IconPlus,
  IconCalendar,
  IconUsers
} from '@tabler/icons-react'
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar'
import { Button } from '@/app/components/UI/Button'
import { updateUserSchema, type UpdateUserInput } from '@/app/lib/validations'
import { useAuth, useHasPermission } from '@/app/contexts/AuthContext'
import { Permission } from '@/app/lib/permissions'
import { ROLE_LABELS, type UserRole } from '@/app/types/auth'

interface User {
  id: string
  email: string
  full_name: string | null
  role: string
  is_active: boolean
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditUserPage({ params }: PageProps) {
  const router = useRouter()
  const { user: currentUser } = useAuth()
  const canEditUsers = useHasPermission(Permission.EDIT_USERS)
  const canManageUsers = useHasPermission(Permission.VIEW_USERS)

  const [open, setOpen] = useState(false)
  const [userId, setUserId] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
  })

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

  // Obtener ID del usuario desde params
  useEffect(() => {
    params.then((p) => {
      setUserId(p.id)
    })
  }, [params])

  // Cargar datos del usuario
  useEffect(() => {
    if (!canEditUsers) {
      router.push('/admin/users')
      return
    }

    if (!userId) return

    loadUser()
  }, [canEditUsers, router, userId])

  const loadUser = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/users/${userId}`)

      if (!response.ok) {
        throw new Error('Error al cargar usuario')
      }

      const data = await response.json()
      setUser(data.user)

      // Pre-poblar formulario
      reset({
        email: data.user.email,
        full_name: data.user.full_name || '',
        role: data.user.role as UserRole,
        is_active: data.user.is_active,
      })
    } catch (error) {
      console.error('Error loading user:', error)
      alert('Error al cargar usuario')
      router.push('/admin/users')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: UpdateUserInput) => {
    try {
      setIsSubmitting(true)

      // Si la contraseña está vacía, no la enviar
      const payload: any = { ...data }
      if (!payload.password) {
        delete payload.password
      }

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al actualizar usuario')
      }

      alert('Usuario actualizado exitosamente')
      router.push('/admin/users')
    } catch (error: any) {
      console.error('Error updating user:', error)
      alert(error.message || 'Error al actualizar usuario')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!canEditUsers) {
    return (
      <div className="p-6">
        <p className="text-red-600">No tienes permisos para editar usuarios.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuario...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-neutral-950 flex-col md:flex-row">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            {/* Logo */}
            <div className="mb-8 pl-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-decom-primary-light to-decom-primary flex items-center justify-center">
                  <IconLayoutDashboard className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">
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
              className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors w-full group"
            >
              <IconLogout className="h-5 w-5 group-hover:text-red-400" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex flex-1 flex-col overflow-hidden bg-decom-bg-light dark:bg-neutral-950 relative">
        {/* Header con gradiente IPUC (Fixed) */}
        <div className="bg-gradient-to-r from-decom-primary to-decom-primary-light pt-6 pb-2 shadow-md relative z-20 shrink-0">
          <div className="px-4 mb-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-white hover:bg-white/10 p-2 h-auto rounded-xl"
              >
                <IconArrowLeft className="w-6 h-6" />
              </Button>
              <div>
                <h1 className="text-white text-xl font-bold tracking-tight">Editar Usuario</h1>
                <p className="text-white/70 text-xs font-medium uppercase tracking-wider">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto relative z-10 p-4 md:p-6">
          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="usuario@ejemplo.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Nombre completo */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  {...register('full_name')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.full_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Juan Pérez"
                />
                {errors.full_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
                )}
              </div>

              {/* Rol */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Rol
                </label>
                <select
                  {...register('role')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.role ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="admin">{ROLE_LABELS.admin}</option>
                  <option value="presidente">{ROLE_LABELS.presidente}</option>
                  <option value="tesorero">{ROLE_LABELS.tesorero}</option>
                  <option value="secretario">{ROLE_LABELS.secretario}</option>
                  <option value="vocal">{ROLE_LABELS.vocal}</option>
                  <option value="decom_admin">{ROLE_LABELS.decom_admin}</option>
                  <option value="comite_member">{ROLE_LABELS.comite_member}</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Selecciona el rol que determinará los permisos del usuario
                </p>
              </div>

              {/* Nueva contraseña (opcional) */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nueva Contraseña (opcional)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Dejar vacío para mantener contraseña actual"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <IconEyeOff className="w-5 h-5" />
                    ) : (
                      <IconEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Solo completa este campo si deseas cambiar la contraseña del usuario
                </p>
              </div>

              {/* Estado */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('is_active')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-semibold text-gray-900">
                    Usuario activo
                  </span>
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  Los usuarios inactivos no podrán iniciar sesión en el sistema
                </p>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <IconDeviceFloppy className="w-5 h-5 mr-2" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
