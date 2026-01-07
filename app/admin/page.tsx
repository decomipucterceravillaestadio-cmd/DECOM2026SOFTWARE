'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  IconLayoutDashboard, 
  IconClipboardList, 
  IconSettings,
  IconLogout,
  IconPlus
} from '@tabler/icons-react'
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar'
import StatsGrid from '@/app/components/Dashboard/StatsGrid'
import RequestsTable from '@/app/components/Dashboard/RequestsTable'
import RequestDetailModal from '@/app/components/Dashboard/RequestDetailModal'

export default function AdminDashboard() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const links = [
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
      label: 'Configuración',
      href: '/admin/settings',
      icon: <IconSettings className="h-5 w-5" />,
    },
  ]

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-neutral-100 dark:bg-neutral-950">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            {/* Logo */}
            <div className="mb-8">
              <div className="flex items-center gap-2 px-2">
                <IconLayoutDashboard className="h-7 w-7 text-violet-500" />
                <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
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
              className="flex items-center gap-2 px-2 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors w-full"
            >
              <IconLogout className="h-5 w-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                Panel de Administración DECOM
              </h1>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                Gestiona todas las solicitudes de material gráfico
              </p>
            </div>

            {/* Stats Grid */}
            <div className="mb-12" key={`stats-${refreshKey}`}>
              <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
                Estadísticas Generales
              </h2>
              <StatsGrid />
            </div>

            {/* Requests Table */}
            <div key={`table-${refreshKey}`}>
              <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
                Solicitudes
              </h2>
              <RequestsTable onSelectRequest={setSelectedRequestId} />
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <RequestDetailModal
        requestId={selectedRequestId}
        onClose={() => setSelectedRequestId(null)}
        onUpdate={handleRefresh}
      />
    </div>
  )
}
