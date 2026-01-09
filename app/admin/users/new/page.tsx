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
import { createUserSchema, type CreateUserInput } from '@/app/lib/validations'
import { useAuth, useHasPermission } from '@/app/contexts/AuthContext'
import { Permission } from '@/app/lib/permissions'
import { ROLE_LABELS, type UserRole } from '@/app/types/auth'

interface Committee {
  id: string
  name: string
}

export default function NewUserPage() {
  const router = useRouter()
  const { user: currentUser } = useAuth()
  const canCreateUsers = useHasPermission(Permission.CREATE_USERS)
  const canManageUsers = useHasPermission(Permission.VIEW_USERS)
  
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [committees, setCommittees] = useState<Committee[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: 'vocal',
    },
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

  // Cargar comités
  useEffect(() => {
    if (!canCreateUsers) {
      router.push('/admin/users')
      return
    }

    loadCommittees()
  }, [canCreateUsers, router])

  const loadCommittees = async () => {
    try {
      const response = await fetch('/api/committees')
      if (response.ok) {
        const data = await response.json()
        setCommittees(data.committees || [])
      }
    } catch (error) {
      console.error('Error loading committees:', error)
    }
  }

  const onSubmit = async (data: CreateUserInput) => {
    try {
      setIsSubmitting(true)

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear usuario')
      }

      alert('Usuario creado exitosamente')
      router.push('/admin/users')
    } catch (error: any) {
      console.error('Error creating user:', error)
      alert(error.message || 'Error al crear usuario')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!canCreateUsers) {
    return (
      <div className="p-6">
        <p className="text-red-600">No tienes permisos para crear usuarios.</p>
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
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
            {/* Header */}
            <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
        >
          <IconArrowLeft className="w-5 h-5 mr-2" />
          Volver
        </Button>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Nuevo Usuario
        </h1>
        <p className="text-gray-600 mt-1">
          Crea un nuevo usuario en el sistema
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              {...register('email')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
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
              Nombre Completo <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              {...register('full_name')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.full_name ? 'border-red-500' : 'border-gray-300'
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
              Rol <span className="text-red-600">*</span>
            </label>
            <select
              {...register('role')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.role ? 'border-red-500' : 'border-gray-300'
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

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Contraseña <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Mínimo 8 caracteres"
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
              El usuario recibirá esta contraseña para su primer inicio de sesión
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
                  Creando...
                </>
              ) : (
                <>
                  <IconDeviceFloppy className="w-5 h-5 mr-2" />
                  Crear Usuario
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
          </div>
        </div>
      </div>
    </div>
  )
}
