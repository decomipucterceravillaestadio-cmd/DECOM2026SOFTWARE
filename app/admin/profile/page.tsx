'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  IconBell,
  IconLogout,
  IconEdit,
  IconLock,
  IconHistory,
  IconBuilding,
  IconHelp,
  IconChevronRight
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/app/contexts/AuthContext'
import { Toggle } from '@/app/components/UI'
import { DashboardLayout } from '@/app/components/Dashboard/DashboardLayout'

export default function ProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const profileOptions = [
    {
      id: 'edit-info',
      icon: <IconEdit className="w-5 h-5" />,
      label: 'Editar información',
      onClick: () => router.push('/admin/profile/edit')
    },
    {
      id: 'notifications',
      icon: <IconBell className="w-5 h-5" />,
      label: 'Notificaciones',
      hasToggle: true,
      toggleValue: notificationsEnabled,
      onToggleChange: setNotificationsEnabled
    },
    {
      id: 'change-password',
      icon: <IconLock className="w-5 h-5" />,
      label: 'Cambiar contraseña',
      onClick: () => router.push('/admin/profile/change-password')
    },
    {
      id: 'about-decom',
      icon: <IconBuilding className="w-5 h-5" />,
      label: 'Acerca de DECOM',
      onClick: () => router.push('/admin/profile/about')
    },
    {
      id: 'help-support',
      icon: <IconHelp className="w-5 h-5" />,
      label: 'Ayuda y soporte',
      onClick: () => router.push('/admin/profile/help')
    }
  ]

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const getInitials = (name?: string | null) => {
    if (!name) return 'U'
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <DashboardLayout title="Mi Perfil">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Hero Card */}
        <div className="relative overflow-hidden bg-dashboard-card backdrop-blur-md rounded-3xl border border-dashboard-card-border p-8 shadow-2xl flex flex-col md:flex-row items-center gap-8 group transition-all duration-300">
          {/* Background Decor */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#F49E2C]/5 rounded-full blur-3xl group-hover:bg-[#F49E2C]/10 transition-colors duration-500" />

          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#15539C] to-decom-primary flex items-center justify-center text-3xl font-black text-white shadow-2xl ring-4 ring-[#F49E2C]/20 ring-offset-4 ring-offset-dashboard-bg transition-transform group-hover:scale-105 duration-300">
              {getInitials(user?.full_name)}
            </div>
            <button
              onClick={() => router.push('/admin/profile/edit')}
              className="absolute -bottom-2 -right-2 bg-[#F49E2C] text-[#16233B] p-2 rounded-xl border-4 border-dashboard-card shadow-xl hover:scale-110 transition-transform"
            >
              <IconEdit className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2 relative z-10">
            <h1 className="text-3xl font-bold text-dashboard-text-primary tracking-tight">{user?.full_name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <p className="text-dashboard-text-secondary font-medium text-sm">{user?.email}</p>
              <span className="w-1.5 h-1.5 rounded-full bg-dashboard-card-border" />
              <div className="px-3 py-1 bg-[#F49E2C]/10 border border-[#F49E2C]/20 rounded-full text-[10px] font-black text-[#F49E2C] uppercase tracking-widest">
                {user?.role}
              </div>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profileOptions.map((option) => (
            <div
              key={option.id}
              onClick={option.onClick}
              className={cn(
                "flex items-center justify-between p-5 bg-dashboard-card backdrop-blur-sm border border-dashboard-card-border rounded-2xl transition-all shadow-md group relative overflow-hidden",
                option.onClick ? "hover:bg-dashboard-card-border/10 cursor-pointer hover:border-[#F49E2C]/30 hover:-translate-y-1" : ""
              )}
            >
              {/* Hover accent */}
              {option.onClick && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F49E2C] scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />}

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-dashboard-bg text-[#F49E2C] border border-dashboard-card-border opacity-80 group-hover:opacity-100 group-hover:bg-[#15539C] group-hover:text-white transition-all">
                  {option.icon}
                </div>
                <span className="text-sm font-bold text-dashboard-text-secondary group-hover:text-dashboard-text-primary transition-colors">{option.label}</span>
              </div>

              <div className="shrink-0 relative z-10">
                {option.hasToggle ? (
                  <div className="scale-90">
                    <Toggle
                      checked={option.toggleValue}
                      onChange={option.onToggleChange}
                    />
                  </div>
                ) : (
                  <IconChevronRight className="w-5 h-5 text-dashboard-text-muted group-hover:text-[#F49E2C] transition-all" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Logout Footer Section */}
        <div className="pt-6 border-t border-dashboard-card-border flex flex-col items-center gap-6 pb-20">
          <button
            onClick={handleLogout}
            className="w-full max-w-xs flex items-center justify-center gap-3 px-8 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-red-500/5 group"
          >
            <IconLogout className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Cerrar Sesión Segura
          </button>
          <div className="text-center space-y-1 opacity-20">
            <p className="text-[10px] font-black uppercase tracking-widest text-dashboard-text-primary">Versión 2.5.0 • DECOM 2026</p>
            <p className="text-[9px] font-bold text-dashboard-text-primary">IPUC Villa Estadio • Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}