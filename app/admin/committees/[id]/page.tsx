'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconTrash
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

interface Committee {
  id: string
  name: string
  description: string | null
  color_badge: string
  created_at: string
  updated_at: string
}

export default function EditCommitteePage() {
  const router = useRouter()
  const params = useParams()
  const committeeId = params.id as string
  const { user: currentUser } = useAuth()
  const canEditCommittees = useHasPermission(Permission.EDIT_COMMITTEES)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [committee, setCommittee] = useState<Committee | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CommitteeFormData>({
    resolver: zodResolver(committeeSchema),
  })

  const selectedColor = watch('color_badge')

  useEffect(() => {
    if (!canEditCommittees) {
      router.push('/admin/committees')
      return
    }
    loadCommittee()
  }, [canEditCommittees, committeeId, router])

  const loadCommittee = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/committees/${committeeId}`)
      if (response.ok) {
        const data = await response.json()
        setCommittee(data.committee)
        reset({
          name: data.committee.name,
          description: data.committee.description || '',
          color_badge: data.committee.color_badge,
        })
      } else {
        router.push('/admin/committees')
      }
    } catch (error) {
      console.error('Error loading committee:', error)
      router.push('/admin/committees')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: CommitteeFormData) => {
    try {
      setIsSubmitting(true)

      const response = await fetch(`/api/admin/committees/${committeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.error || 'Error al actualizar el comité')
        return
      }

      router.push('/admin/committees')
    } catch (error) {
      console.error('Error updating committee:', error)
      alert('Error al actualizar el comité')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este comité? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/committees/${committeeId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/admin/committees')
      } else {
        alert('Error al eliminar el comité')
      }
    } catch (error) {
      console.error('Error deleting committee:', error)
      alert('Error al eliminar el comité')
    }
  }

  if (!canEditCommittees || isLoading) {
    return (
      <DashboardLayout title="Editar Comité">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#15539C]"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!committee) {
    return null
  }

  return (
    <DashboardLayout title="Editar Comité">
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
            <h1 className="text-2xl font-bold text-dashboard-text-primary">Editar Comité</h1>
            <p className="text-dashboard-text-secondary mt-1">
              Modifica la información del comité
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
            <div className="flex justify-between items-center pt-6 border-t border-dashboard-card-border">
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center gap-2"
              >
                <IconTrash className="h-4 w-4" />
                Eliminar Comité
              </Button>

              <div className="flex gap-3">
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
                  {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}