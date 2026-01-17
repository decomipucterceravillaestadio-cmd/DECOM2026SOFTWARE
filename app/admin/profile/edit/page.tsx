'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  IconArrowLeft,
  IconCheck,
  IconDeviceFloppy,
  IconUser,
  IconMail,
  IconPhone,
  IconShieldCheck
} from '@tabler/icons-react'
import { Button } from '@/app/components/UI/Button'
import { Input } from '@/app/components/UI/Input'
import { DashboardLayout } from '@/app/components/Dashboard/DashboardLayout'
import { useAuth } from '@/app/contexts/AuthContext'
import { Card } from '@/app/components/UI/Card'
import { motion } from 'framer-motion'
import { FormField, FormSection } from '@/app/components/Forms/FormComponents'

export default function EditProfilePage() {
  const router = useRouter()
  const { user, refreshUser } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.full_name || '',
        email: user.email || '',
        phone: '' // In a real app, this would come from the user object
      })
    }
  }, [user])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm() || !user) return

    setIsSaving(true)
    try {
      const { createClient } = await import('@/app/lib/supabase/client')
      const supabase = createClient()

      const { error } = await supabase
        .from('users')
        .update({
          full_name: formData.name,
          email: formData.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      await refreshUser()
      router.push('/admin/profile')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Error al guardar los cambios: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <DashboardLayout title="Editar Perfil">
      <div className="max-w-3xl mx-auto py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-3 rounded-2xl bg-dashboard-card border border-dashboard-card-border hover:bg-dashboard-bg text-dashboard-text-secondary transition-all hover:scale-105"
          >
            <IconArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-dashboard-text-primary tracking-tight">Editar Perfil</h1>
            <p className="text-sm text-dashboard-text-secondary font-medium mt-1">Actualiza tu información personal y de contacto</p>
          </div>
        </div>

        <Card padding="lg" className="border-dashboard-card-border/50 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 bg-decom-secondary/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-10">
            {/* Avatar Section */}
            <div className="flex flex-col items-center py-4">
              <div className="relative group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-32 h-32 rounded-3xl bg-gradient-to-br from-decom-primary-light to-decom-primary flex items-center justify-center font-black text-5xl text-white shadow-2xl border-4 border-white dark:border-dashboard-card relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
                  {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                </motion.div>
                <div className="absolute -bottom-2 -right-2 bg-decom-secondary text-white p-2.5 rounded-2xl border-4 border-dashboard-card shadow-xl ring-2 ring-decom-secondary/20">
                  <IconCheck className="w-5 h-5 font-black" />
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-dashboard-text-muted">Avatar del Sistema</p>
                <button className="text-[11px] font-bold text-decom-secondary hover:underline mt-1">Cambiar Foto</button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <FormSection
                title="Información Básica"
                description="Estos datos son visibles para otros miembros del comité"
                icon={<IconUser />}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Nombre Completo" error={errors.name} required>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Ej. Juan Pérez"
                      className="rounded-2xl border-2 focus:ring-4"
                    />
                  </FormField>

                  <FormField label="Correo Electrónico" error={errors.email} required>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="ejemplo@ipuc.com"
                      className="rounded-2xl border-2 focus:ring-4"
                    />
                  </FormField>
                </div>
              </FormSection>

              <FormSection
                title="Contacto y Seguridad"
                description="Información adicional para la gestión operativa"
                icon={<IconShieldCheck />}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Teléfono de Contacto" hint="Opcional">
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+57 300 000 0000"
                      className="rounded-2xl border-2 focus:ring-4"
                    />
                  </FormField>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-dashboard-text-primary ml-1 uppercase tracking-wider text-[11px]">Rol Actual</label>
                    <div className="bg-dashboard-bg/50 border-2 border-dashboard-card-border rounded-2xl px-5 py-3.5 text-dashboard-text-secondary font-bold flex items-center justify-between group">
                      <span>{user?.role === 'admin' ? 'Administrador del Sistema' : 'Miembro del Comité'}</span>
                      <IconShieldCheck className="w-5 h-5 text-dashboard-text-muted group-hover:text-decom-secondary transition-colors" />
                    </div>
                  </div>
                </div>
              </FormSection>
            </div>

            <div className="pt-10 flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleSave}
                isLoading={isSaving}
                className="flex-[2] py-4 text-base font-black shadow-xl shadow-decom-secondary/20"
                variant="secondary"
                size="lg"
                leftIcon={<IconDeviceFloppy className="w-5 h-5" />}
              >
                GUARDAR CAMBIOS
              </Button>
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 py-4 text-base font-bold border-2"
                size="lg"
              >
                CANCELAR
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}