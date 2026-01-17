'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  IconArrowLeft,
  IconEye,
  IconEyeOff,
  IconDeviceFloppy,
  IconUserEdit,
  IconHash,
  IconMail,
  IconUser,
  IconShieldLock,
  IconPower
} from '@tabler/icons-react'
import { DashboardLayout } from '@/app/components/Dashboard/DashboardLayout'
import { Button } from '@/app/components/UI/Button'
import { Card } from '@/app/components/UI/Card'
import { Input } from '@/app/components/UI/Input'
import { Select } from '@/app/components/UI/Select'
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

  const resolvedParams = use(params)
  const userId = resolvedParams.id

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
      <DashboardLayout title="Error de Permisos">
        <Card className="p-12 text-center border-red-500/20 bg-red-500/5">
          <div className="p-4 bg-red-500/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <IconShieldLock className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-dashboard-text-primary mb-2">Acceso Denegado</h2>
          <p className="text-dashboard-text-secondary mb-8 font-medium">No tienes permisos para editar usuarios.</p>
          <Button onClick={() => router.push('/admin/users')} variant="primary">
            Volver al Listado
          </Button>
        </Card>
      </DashboardLayout>
    )
  }

  if (isLoading) {
    return (
      <DashboardLayout title="Editando Usuario">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-decom-primary/10 border-t-decom-secondary rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <IconUserEdit className="w-6 h-6 text-decom-secondary" />
            </div>
          </div>
          <p className="mt-6 text-dashboard-text-secondary font-bold animate-pulse">Cargando datos del usuario...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Editar Usuario">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-3 rounded-2xl bg-dashboard-card border border-dashboard-card-border hover:border-decom-secondary/50 text-dashboard-text-secondary hover:text-decom-secondary transition-all shadow-sm group"
            >
              <IconArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <IconUserEdit className="w-5 h-5 text-decom-secondary" />
                <h2 className="text-2xl font-black text-dashboard-text-primary tracking-tight uppercase">
                  Editar Perfil
                </h2>
              </div>
              <p className="text-sm text-dashboard-text-secondary font-medium">
                Actualiza la información y permisos de {user?.full_name || 'este usuario'}
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-decom-primary/10 rounded-2xl border border-decom-primary/20">
            <IconHash className="w-4 h-4 text-decom-primary-light" />
            <span className="text-xs font-black text-decom-primary-light tracking-widest">{userId}</span>
          </div>
        </div>

        {/* Form Card */}
        <Card className="overflow-hidden border-dashboard-card-border/50 shadow-2xl relative">
          {/* Decorative gradient blur */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-decom-secondary/5 blur-[100px] -z-10 rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-decom-primary/5 blur-[100px] -z-10 rounded-full" />

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Email */}
              <Input
                label="Correo Electrónico"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="usuario@ejemplo.com"
                leftIcon={<IconMail className="w-5 h-5 opacity-50" />}
                autoComplete="email"
              />

              {/* Nombre completo */}
              <Input
                label="Nombre Completo"
                type="text"
                {...register('full_name')}
                error={errors.full_name?.message}
                placeholder="Nombre y apellidos"
                leftIcon={<IconUser className="w-5 h-5 opacity-50" />}
                autoComplete="name"
              />

              {/* Rol */}
              <Select
                label="Rol del Usuario"
                {...register('role')}
                error={errors.role?.message}
                options={[
                  { value: 'admin', label: ROLE_LABELS.admin },
                  { value: 'presidente', label: ROLE_LABELS.presidente },
                  { value: 'tesorero', label: ROLE_LABELS.tesorero },
                  { value: 'secretario', label: ROLE_LABELS.secretario },
                  { value: 'vocal', label: ROLE_LABELS.vocal },
                  { value: 'decom_admin', label: ROLE_LABELS.decom_admin },
                  { value: 'comite_member', label: ROLE_LABELS.comite_member },
                ]}
                helpText="El rol determina qué acciones puede realizar el usuario en el sistema"
              />

              {/* Nueva contraseña */}
              <div className="space-y-2">
                <label className="decom-label">Nueva Contraseña (opcional)</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dashboard-text-muted">
                    <IconShieldLock className="w-5 h-5 opacity-50" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="Solo si deseas cambiarla"
                    className={`decom-input pl-10 pr-12 ${errors.password ? 'decom-input-error' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-dashboard-bg transition-colors text-dashboard-text-muted hover:text-decom-secondary"
                  >
                    {showPassword ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="decom-error-text">{errors.password.message}</p>}
                <p className="text-[11px] text-dashboard-text-muted font-medium">Dejar en blanco para mantener la contraseña actual</p>
              </div>
            </div>

            <div className="pt-6 border-t border-dashboard-card-border/50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Active Status Toggle */}
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      {...register('is_active')}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-dashboard-bg border border-dashboard-card-border rounded-full peer peer-checked:bg-decom-success transition-all duration-300" />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-dashboard-text-muted rounded-full peer-checked:translate-x-6 peer-checked:bg-white transition-all duration-300 shadow-sm" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-dashboard-text-primary tracking-tight">Usuario Activo</span>
                    <span className="text-[10px] text-dashboard-text-muted font-bold uppercase tracking-wider">Permitir acceso al sistema</span>
                  </div>
                </label>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none border border-transparent hover:border-dashboard-card-border"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    leftIcon={<IconDeviceFloppy className="w-5 h-5" />}
                    className="flex-1 sm:flex-none px-12 shadow-xl shadow-decom-primary/20"
                  >
                    GUARDAR CAMBIOS
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Card>

        {/* Danger Zone */}
        <div className="pt-8">
          <Card className="border-red-500/20 bg-red-500/5 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
                <IconPower className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-dashboard-text-primary tracking-tight">Estado de la cuenta</h3>
                <p className="text-sm text-dashboard-text-secondary font-medium">Al desactivar un usuario, este perderá acceso inmediato a la plataforma.</p>
              </div>
            </div>
            <Button
              variant="danger"
              size="sm"
              className="font-black tracking-widest text-[10px]"
              onClick={() => {
                if (confirm('¿Estás seguro de que deseas cambiar el estado de este usuario?')) {
                  // logic handled by form toggle usually, but here as a quick action if needed
                }
              }}
            >
              GESTIONAR ACCESO
            </Button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
