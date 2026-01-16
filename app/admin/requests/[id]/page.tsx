'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  IconLayoutDashboard,
  IconClipboardList,
  IconUser,
  IconLogout,
  IconPlus,
  IconCalendar,
  IconUsers,
  IconArrowLeft
} from '@tabler/icons-react'
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar'
import RequestDetailModal from '@/app/components/Dashboard/RequestDetailModal'
import { useAuth, useHasPermission } from '@/app/contexts/AuthContext'
import { Permission } from '@/app/lib/permissions'

export default function RequestDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading } = useAuth()
  const canManageUsers = useHasPermission(Permission.VIEW_USERS)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // Base links que todos ven
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
      href: '/admin/list',
      icon: <IconClipboardList className="h-5 w-5" />,
    },
    {
      label: 'Calendario',
      href: '/admin/calendar',
      icon: <IconCalendar className="h-5 w-5" />,
    },
  ]

  // Link de gestión de usuarios solo para admin/presidente
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

  const handleClose = () => {
    router.back()
  }

  const handleUpdate = () => {
    // Opcional: podrías recargar datos si es necesario
  }

  if (!mounted || loading) return null

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-neutral-950 flex-col md:flex-row">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <div className="mb-8">
              <div className="flex items-center gap-2 px-2">
                <IconCalendar className="h-7 w-7 text-white" />
                <span className="text-xl font-bold text-white tracking-tight">
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
              className="flex items-center gap-2 px-2 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors w-full group"
            >
              <IconLogout className="h-5 w-5 group-hover:text-red-400" />
              Cerrar Sesión
            </button>
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex-1 overflow-y-auto bg-decom-bg-light dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          {/* Header con botón de regreso */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mb-4"
            >
              <IconArrowLeft className="w-5 h-5" />
              Volver
            </button>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Detalle de Solicitud
            </h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              Información completa y gestión de la solicitud
            </p>
          </div>

          {/* Modal de detalle - modo embebido sin overlay */}
          <div className="relative">
            <RequestDetailModal
              requestId={params.id as string}
              onClose={handleClose}
              onUpdate={handleUpdate}
              embedded={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
