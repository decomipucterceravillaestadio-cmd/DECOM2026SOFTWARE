'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  IconClipboardList,
  IconPlus,
  IconCalendar,
  IconUsers,
  IconArrowRight,
  IconSparkles
} from '@tabler/icons-react'
import StatsGrid from '@/app/components/Dashboard/StatsGrid'
import RequestsTable from '@/app/components/Dashboard/RequestsTable'
import RequestDetailModal from '@/app/components/Dashboard/RequestDetailModal'
import { useAuth, useHasPermission } from '@/app/contexts/AuthContext'
import { Permission } from '@/app/lib/permissions'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { DashboardLayout } from '@/app/components/Dashboard/DashboardLayout'
import { motion } from 'framer-motion'

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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#15539C] to-[#15539C]/80 p-8 shadow-2xl mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-medium backdrop-blur-sm"
            >
              <IconSparkles className="w-3 h-3 text-[#F49E2C]" />
              <span>Panel de Control</span>
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              {getGreeting()}, <span className="text-[#F49E2C]">{user?.full_name?.split(' ')[0] || 'Administrador'}</span>
            </h1>
            <p className="text-blue-100 text-lg font-medium max-w-xl">
              Bienvenido de nuevo. Aquí tienes un resumen de la actividad reciente y las tareas pendientes.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1">
            <p className="text-blue-200 text-sm font-medium uppercase tracking-wider">Hoy es</p>
            <p className="text-white text-xl font-bold capitalize">
              {format(new Date(), "eeee, d 'de' MMMM", { locale: es })}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Accesos Rápidos</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Nueva Solicitud', icon: <IconPlus className="w-6 h-6" />, href: '/new-request', color: 'bg-blue-500', text: 'text-blue-500' },
            { label: 'Calendario', icon: <IconCalendar className="w-6 h-6" />, href: '/admin/calendar', color: 'bg-orange-500', text: 'text-orange-500' },
            { label: 'Lista Completa', icon: <IconClipboardList className="w-6 h-6" />, href: '/admin/list', color: 'bg-purple-500', text: 'text-purple-500' },
            { label: 'Usuarios', icon: <IconUsers className="w-6 h-6" />, href: '/admin/users', color: 'bg-emerald-500', text: 'text-emerald-500' }
          ].filter(item => item.label !== 'Usuarios' || canManageUsers).map((action, i) => (
            <button
              key={i}
              onClick={() => router.push(action.href)}
              className="group relative flex items-center gap-4 p-4 bg-white dark:bg-[#0F172A]/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-left overflow-hidden"
            >
              <div className={`p-3 rounded-xl bg-slate-50 dark:bg-white/5 ${action.text} group-hover:scale-110 transition-transform duration-300 border border-slate-100 dark:border-white/10`}>
                {action.icon}
              </div>
              <div className="flex-1 z-10">
                <p className="text-slate-700 dark:text-slate-200 font-bold text-base leading-tight group-hover:text-blue-600 dark:group-hover:text-white transition-colors">{action.label}</p>
                <div className="flex items-center gap-1 mt-1 text-xs font-medium text-slate-400 group-hover:text-blue-500 transition-colors">
                  <span>Ir ahora</span>
                  <IconArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-12 gap-8 pb-10">
        {/* Stats area */}
        <section className="col-span-12" key={`stats-${refreshKey}`}>
          <StatsGrid />
        </section>

        {/* Recent Requests Table Section */}
        <section className="col-span-12 space-y-5" key={`table-${refreshKey}`}>
          <div className="flex items-center justify-between px-2">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#F49E2C] rounded-full inline-block shadow-sm shadow-orange-200 dark:shadow-none"></span>
                Solicitudes Recientes
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 pl-4">Gestione las últimas solicitudes recibidas</p>
            </div>

            <button
              onClick={() => router.push('/admin/list')}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-[#0F172A]/40 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all active:scale-95 shadow-sm"
            >
              <span>Ver todas</span>
              <IconArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="bg-white dark:bg-[#0F172A]/40 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl overflow-hidden p-1">
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
