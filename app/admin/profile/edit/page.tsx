'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  IconArrowLeft,
  IconCheck,
  IconX
} from '@tabler/icons-react'
import { Button } from '@/app/components/UI/Button'
import { Input } from '@/app/components/UI/Input'

interface UserProfile {
  name: string
  email: string
  phone?: string
  committee: string
}

export default function EditProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Simular carga de datos del usuario
    const loadUserProfile = async () => {
      try {
        const mockUser: UserProfile = {
          name: 'Juan David',
          email: 'juan.david@ipuc.org.co',
          phone: '+57 300 123 4567',
          committee: 'Comité DECOM'
        }
        setUser(mockUser)
        setFormData({
          name: mockUser.name,
          email: mockUser.email,
          phone: mockUser.phone || ''
        })
      } catch (error) {
        console.error('Error loading user profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserProfile()
  }, [])

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
    if (!validateForm()) return

    setIsSaving(true)
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000))

      // En una implementación real, aquí iría la llamada a la API
      console.log('Saving profile:', formData)

      router.push('/admin/profile')
    } catch (error) {
      console.error('Error saving profile:', error)
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-16 bg-gradient-to-r from-decom-primary to-decom-primary-light"></div>
          <div className="p-4 space-y-4">
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="h-12 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center p-4 pb-4 justify-between bg-gradient-to-r from-decom-primary to-decom-primary-light shadow-sm sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="text-white flex size-12 shrink-0 items-center justify-center cursor-pointer hover:bg-white/10 rounded-full transition-colors"
        >
          <IconArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          Editar Perfil
        </h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="text-white flex size-12 shrink-0 items-center justify-center cursor-pointer hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <IconCheck className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Form */}
      <div className="p-4 space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center py-6">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-decom-primary-light to-decom-primary border-[3px] border-decom-secondary shadow-lg flex items-center justify-center">
              <span className="text-white text-2xl font-bold tracking-wider">
                {user?.name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-decom-secondary rounded-full flex items-center justify-center shadow-lg">
              <IconCheck className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-sm text-gray-600 text-center">
            Toca para cambiar la foto de perfil
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ingresa tu nombre completo"
              error={errors.name}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Ingresa tu correo electrónico"
              error={errors.email}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono (opcional)
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Ingresa tu número de teléfono"
            />
          </div>

          {/* Read-only field for committee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comité
            </label>
            <div className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-gray-700">
              {user?.committee}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              El comité no se puede cambiar desde esta pantalla
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full"
            size="lg"
          >
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </div>
    </div>
  )
}