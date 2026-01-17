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
  IconUserPlus,
  IconMail,
  IconUser,
  IconShieldLock,
  IconKey
} from '@tabler/icons-react'
import { DashboardLayout } from '@/app/components/Dashboard/DashboardLayout'
import { Button } from '@/app/components/UI/Button'
import { Card } from '@/app/components/UI/Card'
import { Input } from '@/app/components/UI/Input'
import { Select } from '@/app/components/UI/Select'
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
      <DashboardLayout title="Acceso Denegado">
        <Card className="p-12 text-center border-red-500/20 bg-red-500/5">
          <div className="p-4 bg-red-500/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <IconShieldLock className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-dashboard-text-primary mb-2">Sin Permisos</h2>
          <p className="text-dashboard-text-secondary mb-8 font-medium">No tienes autorización para crear nuevos usuarios.</p>
          <Button onClick={() => router.push('/admin/users')} variant="primary">
            Volver al Listado
          </Button>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Nuevo Usuario">
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
                <IconUserPlus className="w-5 h-5 text-decom-secondary" />
                <h2 className="text-2xl font-black text-dashboard-text-primary tracking-tight uppercase">
                  Registrar Usuario
                </h2>
              </div>
              <p className="text-sm text-dashboard-text-secondary font-medium">
                Crea un nuevo perfil de acceso para el sistema
              </p>
            </div>
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
                label="Correo Electrónico *"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="usuario@ejemplo.com"
                leftIcon={<IconMail className="w-5 h-5 opacity-50" />}
                autoComplete="off"
              />

              {/* Nombre completo */}
              <Input
                label="Nombre Completo *"
                type="text"
                {...register('full_name')}
                error={errors.full_name?.message}
                placeholder="Nombre y apellidos"
                leftIcon={<IconUser className="w-5 h-5 opacity-50" />}
                autoComplete="off"
              />

              {/* Rol */}
              <Select
                label="Rol Asignado *"
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
                helpText="Selecciona el nivel de permisos que tendrá el usuario"
              />

              {/* Contraseña inicial */}
              <div className="space-y-2">
                <label className="decom-label font-black text-[11px] uppercase tracking-wider flex items-center gap-2">
                  <IconKey className="w-3.5 h-3.5" /> Contraseña Inicial *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dashboard-text-muted">
                    <IconShieldLock className="w-5 h-5 opacity-50" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="Mínimo 8 caracteres"
                    className={`decom-input pl-10 pr-12 ${errors.password ? 'decom-input-error' : ''}`}
                    autoComplete="new-password"
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
                <p className="text-[11px] text-dashboard-text-muted font-medium">El usuario podrá cambiarla después de su primer ingreso</p>
              </div>
            </div>

            <div className="pt-8 border-t border-dashboard-card-border/50">
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 w-full">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none border border-transparent hover:border-dashboard-card-border px-8"
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
                  CREAR USUARIO
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {/* Info Box */}
        <div className="bg-decom-primary/5 border border-decom-primary/10 rounded-3xl p-6 flex gap-4">
          <div className="p-3 bg-white dark:bg-white/5 rounded-2xl shadow-sm h-fit">
            <IconShieldLock className="w-6 h-6 text-decom-primary-light" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-dashboard-text-primary uppercase tracking-tight">Seguridad y Acceso</h4>
            <p className="text-xs text-dashboard-text-secondary leading-relaxed font-medium">
              Todos los usuarios creados deben cumplir con las políticas de seguridad de la organización.
              Asegúrate de asignar el rol correcto para evitar accesos no autorizados a información sensible.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
