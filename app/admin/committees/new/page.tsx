'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  IconArrowLeft,
  IconDeviceFloppy
} from '@tabler/icons-react'
import { DashboardLayout } from '@/app/components/Dashboard/DashboardLayout'
import { Button } from '@/app/components/UI/Button'
import { Card } from '@/app/components/UI/Card'
import { useAuth, useHasPermission } from '@/app/contexts/AuthContext'
import { Permission } from '@/app/lib/permissions'

const committeeSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'Máximo 100 caracteres'),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
  color_badge: z.string().min(1, 'El color es requerido'),
})

type CommitteeFormData = z.infer<typeof committeeSchema>

const colorOptions = [
  { value: 'bg-blue-500', label: 'Azul', color: 'bg-blue-500' },
  { value: 'bg-green-500', label: 'Verde', color: 'bg-green-500' },
  { value: 'bg-purple-500', label: 'Morado', color: 'bg-purple-500' },
  { value: 'bg-pink-500', label: 'Rosa', color: 'bg-pink-500' },
  { value: 'bg-yellow-500', label: 'Amarillo', color: 'bg-yellow-500' },
  { value: 'bg-red-500', label: 'Rojo', color: 'bg-red-500' },
  { value: 'bg-indigo-500', label: 'Índigo', color: 'bg-indigo-500' },
  { value: 'bg-orange-500', label: 'Naranja', color: 'bg-orange-500' },
]

export default function NewCommitteePage() {
  const router = useRouter()
  const { user: currentUser } = useAuth()
  const canCreateCommittees = useHasPermission(Permission.EDIT_COMMITTEES)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CommitteeFormData>({
    resolver: zodResolver(committeeSchema),
    defaultValues: {
      color_badge: 'bg-blue-500',
    },
  })

  const selectedColor = watch('color_badge')

  const onSubmit = async (data: CommitteeFormData) => {
    try {
      setIsSubmitting(true)

      const response = await fetch('/api/admin/committees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.error || 'Error al crear el comité')
        return
      }

      router.push('/admin/committees')
    } catch (error) {
      console.error('Error creating committee:', error)
      alert('Error al crear el comité')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!canCreateCommittees) {
    router.push('/admin/committees')
    return null
  }

  return (
    <DashboardLayout title="Nuevo Comité">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/committees')}
            className="p-2"
          >
            <IconArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-dashboard-text-primary">Nuevo Comité</h1>
            <p className="text-dashboard-text-secondary mt-1">
              Crea un nuevo comité en el sistema
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-dashboard-text-primary mb-2">
                Nombre del Comité *
              </label>
              <input
                type="text"
                {...register('name')}
                className="w-full px-3 py-2 border border-dashboard-card-border rounded-lg bg-dashboard-card text-dashboard-text-primary focus:outline-none focus:ring-2 focus:ring-[#15539C] focus:border-transparent"
                placeholder="Ej: Jóvenes, Damas, Alabanza..."
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-dashboard-text-primary mb-2">
                Descripción
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-dashboard-card-border rounded-lg bg-dashboard-card text-dashboard-text-primary focus:outline-none focus:ring-2 focus:ring-[#15539C] focus:border-transparent resize-none"
                placeholder="Describe brevemente el propósito del comité..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Color Badge */}
            <div>
              <label className="block text-sm font-medium text-dashboard-text-primary mb-3">
                Color Identificador *
              </label>
              <div className="grid grid-cols-4 gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setValue('color_badge', color.value)}
                    className={`flex items-center gap-2 p-3 border-2 rounded-lg transition-all ${
                      selectedColor === color.value
                        ? 'border-[#15539C] bg-[#15539C]/10'
                        : 'border-dashboard-card-border hover:border-dashboard-card-border/60'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${color.color}`} />
                    <span className="text-sm text-dashboard-text-primary">{color.label}</span>
                  </button>
                ))}
              </div>
              {errors.color_badge && (
                <p className="mt-1 text-sm text-red-500">{errors.color_badge.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-dashboard-card-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/committees')}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <IconDeviceFloppy className="h-4 w-4" />
                {isSubmitting ? 'Creando...' : 'Crear Comité'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}