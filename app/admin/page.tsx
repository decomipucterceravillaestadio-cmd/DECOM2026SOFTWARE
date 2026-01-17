'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  IconClipboardList,
  IconPlus,
  IconCalendar,
  IconUsers,
} from '@tabler/icons-react'
import StatsGrid from '@/app/components/Dashboard/StatsGrid'
import RequestsTable from '@/app/components/Dashboard/RequestsTable'
import RequestDetailModal from '@/app/components/Dashboard/RequestDetailModal'
import { useAuth, useHasPermission } from '@/app/contexts/AuthContext'
import { Permission } from '@/app/lib/permissions'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { DashboardLayout } from '@/app/components/Dashboard/DashboardLayout'

export default function AdminDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const canManageUsers = useHasPermission(Permission.VIEW_USERS)
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  return (
    <DashboardLayout
      title="Dashboard"
      showSearch
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
    >
      {/* Welcome Section */}
      <div className="space-y-1">
        <h1 className="text-3xl md:text-[32px] font-bold text-dashboard-text-primary tracking-tight">
          {getGreeting()}, <span className="font-extrabold text-[#F49E2C]">{user?.full_name?.split(' ')[0] || 'Administrador'}</span>
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-dashboard-text-secondary text-sm font-medium">
            {format(new Date(), "eeee, d 'de' MMMM", { locale: es })}
          </p>
          {/* Breadcrumbs */}
          <nav className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-dashboard-text-muted">
            <span className="hover:text-[#F49E2C] cursor-pointer transition-colors">Home</span>
            <span className="text-dashboard-card-border">/</span>
            <span className="text-[#F49E2C]/80">Dashboard</span>
          </nav>
        </div>
      </div>

      {/* Quick Action Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Nueva Solicitud', icon: <IconPlus className="w-10 h-10" />, href: '/new-request' },
          { label: 'Calendario', icon: <IconCalendar className="w-10 h-10" />, href: '/admin/calendar' },
          { label: 'Lista Completa', icon: <IconClipboardList className="w-10 h-10" />, href: '/admin/list' },
          { label: 'Usuarios', icon: <IconUsers className="w-10 h-10" />, href: '/admin/users' }
        ].filter(item => item.label !== 'Usuarios' || canManageUsers).map((action, i) => (
          <button
            key={i}
            onClick={() => router.push(action.href)}
            className="group relative flex items-center gap-5 p-5 bg-dashboard-card backdrop-blur-md border border-dashboard-card-border rounded-[12px] transition-all duration-300 hover:bg-decom-primary/10 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20 active:scale-95 text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity translate-x-4 -translate-y-4">
              {action.icon}
            </div>
            <div className="p-3 rounded-xl bg-dashboard-bg text-[#F49E2C] group-hover:bg-[#F49E2C] group-hover:text-white transition-all shadow-inner group-hover:scale-110 border border-dashboard-card-border">
              <div className="w-6 h-6 flex items-center justify-center">
                {action.icon}
              </div>
            </div>
            <div className="z-10">
              <p className="text-dashboard-text-primary font-bold text-lg leading-tight tracking-tight group-hover:text-[#F49E2C] transition-colors">{action.label}</p>
              <p className="text-[10px] text-dashboard-text-muted font-bold uppercase tracking-widest mt-0.5">Acceso Rápido</p>
            </div>
          </button>
        ))}
      </section>

      <div className="grid grid-cols-12 gap-6 pb-10">
        {/* Stats area */}
        <section className="col-span-12" key={`stats-${refreshKey}`}>
          <StatsGrid />
        </section>

        {/* Recent Requests Table Section */}
        <section className="col-span-12 space-y-4" key={`table-${refreshKey}`}>
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[20px] font-bold text-dashboard-text-primary tracking-tight flex items-center gap-3">
              <div className="w-1 h-5 bg-[#F49E2C] rounded-full" />
              Solicitudes Recientes
            </h2>
            <button
              onClick={() => router.push('/admin/list')}
              className="px-5 py-2 rounded-[10px] bg-dashboard-card border border-dashboard-card-border text-dashboard-text-secondary text-xs font-bold hover:bg-decom-primary hover:text-white hover:border-[#F49E2C]/50 transition-all active:scale-95 shadow-lg shadow-black/10"
            >
              VER TODAS
            </button>
          </div>

          <div className="bg-dashboard-card backdrop-blur-md rounded-[16px] border border-dashboard-card-border shadow-2xl overflow-hidden p-1">
            <RequestsTable onSelectRequest={setSelectedRequestId} searchTerm={searchTerm} />
          </div>
        </section>
      </div>

      <RequestDetailModal
        requestId={selectedRequestId}
        onClose={() => setSelectedRequestId(null)}
        onUpdate={handleRefresh}
      />
    </DashboardLayout>
  )
}
