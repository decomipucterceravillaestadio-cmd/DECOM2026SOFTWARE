'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  IconArrowLeft,
  IconEdit,
  IconBell,
  IconLock,
  IconHistory,
  IconBuilding,
  IconHelp,
  IconLogout
} from '@tabler/icons-react'
import { Button } from '@/app/components/UI/Button'
import { Toggle } from '@/app/components/UI'

interface UserProfile {
  name: string
  email: string
  role: string
  committee: string
  avatar?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos del usuario
    const loadUserProfile = async () => {
      try {
        // En una implementación real, esto vendría de una API
        const mockUser: UserProfile = {
          name: 'Juan David',
          email: 'juan.david@ipuc.org.co',
          role: 'Miembro',
          committee: 'Comité DECOM'
        }
        setUser(mockUser)
      } catch (error) {
        console.error('Error loading user profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserProfile()
  }, [])

  const handleLogout = async () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      try {
        // Limpiar datos de sesión
        localStorage.removeItem('userRole')
        localStorage.removeItem('userEmail')

        // Redirigir al login
        router.push('/auth/login')
      } catch (error) {
        console.error('Error during logout:', error)
      }
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const profileOptions = [
    {
      id: 'edit-info',
      icon: <IconEdit className="w-6 h-6" />,
      label: 'Editar información',
      onClick: () => router.push('/admin/profile/edit')
    },
    {
      id: 'notifications',
      icon: <IconBell className="w-6 h-6" />,
      label: 'Notificaciones',
      hasToggle: true,
      toggleValue: notificationsEnabled,
      onToggleChange: setNotificationsEnabled
    },
    {
      id: 'change-password',
      icon: <IconLock className="w-6 h-6" />,
      label: 'Cambiar contraseña',
      onClick: () => router.push('/admin/profile/change-password')
    },
    {
      id: 'request-history',
      icon: <IconHistory className="w-6 h-6" />,
      label: 'Historial de solicitudes',
      onClick: () => router.push('/admin/profile/history')
    },
    {
      id: 'about-decom',
      icon: <IconBuilding className="w-6 h-6" />,
      label: 'Acerca de DECOM',
      onClick: () => router.push('/admin/profile/about')
    },
    {
      id: 'help-support',
      icon: <IconHelp className="w-6 h-6" />,
      label: 'Ayuda y soporte',
      onClick: () => router.push('/admin/profile/help')
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-16 bg-gradient-to-r from-primary-dark to-primary-light"></div>
          <div className="flex flex-col items-center pt-8 px-4">
            <div className="w-20 h-20 bg-gray-300 rounded-full mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-48 mb-4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Error al cargar el perfil</p>
          <Button onClick={() => router.back()} className="mt-4">
            Volver
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center p-4 pb-4 justify-between bg-gradient-to-r from-primary to-primary-light shadow-sm sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="text-white flex size-12 shrink-0 items-center justify-center cursor-pointer hover:bg-white/10 rounded-full transition-colors"
        >
          <IconArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          Mi Perfil
        </h2>
      </div>

      {/* User Profile Section */}
      <div className="flex flex-col items-center pt-8 pb-6 px-4">
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-light to-primary-dark border-[3px] border-secondary shadow-lg flex items-center justify-center">
            <span className="text-white text-2xl font-bold tracking-wider">
              {getInitials(user.name)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-1">
          <p className="text-text-main text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">
            {user.name}
          </p>
          <p className="text-[#647387] text-sm font-medium leading-normal text-center">
            {user.email}
          </p>
          <div className="mt-2 bg-secondary/10 border border-secondary/20 rounded-full px-3 py-1">
            <p className="text-secondary text-xs font-bold leading-none text-center uppercase tracking-wide">
              {user.committee}
            </p>
          </div>
        </div>
      </div>

      {/* Settings List Card */}
      <div className="mx-4 mb-6 flex flex-col rounded-xl bg-white shadow-sm overflow-hidden border border-gray-100">
        {profileOptions.map((option, index) => (
          <div
            key={option.id}
            className={`flex items-center gap-3 bg-white px-5 py-4 min-h-[60px] justify-between ${
              index < profileOptions.length - 1 ? 'border-b border-gray-100' : ''
            } ${option.onClick ? 'hover:bg-gray-50 transition-colors cursor-pointer group' : ''}`}
            onClick={option.onClick}
          >
            <div className="flex items-center gap-4">
              <div className="text-primary-light">
                {option.icon}
              </div>
              <p className="text-text-main text-[15px] font-medium leading-normal flex-1 truncate">
                {option.label}
              </p>
            </div>
            <div className="shrink-0">
              {option.hasToggle ? (
                <Toggle
                  checked={option.toggleValue}
                  onChange={option.onToggleChange}
                />
              ) : (
                <div className="text-secondary">
                  <IconArrowLeft className="w-5 h-5 rotate-180" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="px-4 pb-8">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full bg-white border border-red-500 text-red-500 hover:bg-red-50 min-h-[50px] flex items-center justify-center gap-2 shadow-sm"
        >
          <IconLogout className="w-6 h-6" />
          <span className="font-bold text-base">Cerrar sesión</span>
        </Button>
      </div>
    </div>
  )
}