'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  IconLayoutDashboard,
  IconCalendar,
  IconLogout,
  IconPlus,
  IconBell,
  IconClipboardList,
  IconUsers,
  IconUser,
  IconSearch,
  IconMenu2,
  IconX,
  IconEdit,
  IconLock,
  IconHistory,
  IconBuilding,
  IconHelp,
  IconChevronRight
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth, useHasPermission } from '@/app/contexts/AuthContext'
import { Permission } from '@/app/lib/permissions'
import { Toggle } from '@/app/components/UI'

export default function ProfilePage() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading: authLoading } = useAuth()
  const canManageUsers = useHasPermission(Permission.VIEW_USERS)

  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

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
      id: 'request-history',
      icon: <IconHistory className="w-5 h-5" />,
      label: 'Historial de solicitudes',
      onClick: () => router.push('/admin/profile/history')
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

  const isActive = (href: string) => pathname === href || (href !== '/admin' && pathname?.startsWith(href))

  if (!mounted || authLoading) return null

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#16233B] text-[#F8FAFC] flex-row font-sans">

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#1a2847] shadow-2xl z-[70] md:hidden flex flex-col p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#15539C] flex items-center justify-center border border-[#F49E2C]/30 shadow-[0_0_15px_rgba(244,158,44,0.1)]">
                    <IconUser className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold tracking-tight text-white uppercase mt-0.5">DECOM</span>
                </div>
                <button onClick={() => setOpen(false)} className="p-2 text-white/50 hover:text-[#F49E2C] transition-colors">
                  <IconX className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto">
                {links.map((link, idx) => (
                  <button
                    key={idx}
                    onClick={() => { router.push(link.href); setOpen(false); }}
                    className={cn(
                      "flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-medium transition-all group w-full text-left",
                      isActive(link.href)
                        ? "bg-[#15539C]/20 text-[#F49E2C] shadow-sm border border-[#F49E2C]/20"
                        : "text-white/60 hover:bg-[#15539C]/10 hover:text-white"
                    )}
                  >
                    {link.icon}
                    <span className="mt-0.5">{link.label}</span>
                  </button>
                ))}
              </div>

              <div className="pt-6 border-t border-white/10 mt-auto">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 px-4 py-4 text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all w-full"
                >
                  <IconLogout className="h-5 w-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop */}
      <nav className="hidden md:flex w-64 flex-col bg-[#1a2847] border-r border-white/10 transition-all duration-300 shadow-xl z-30">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-[#15539C] flex items-center justify-center border border-[#F49E2C]/30 shadow-[0_0_15px_rgba(244,158,44,0.1)]">
            <IconUser className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white uppercase mt-0.5">DECOM</span>
        </div>

        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {links.map((link, idx) => (
            <button
              key={idx}
              onClick={() => router.push(link.href)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group w-full text-left",
                isActive(link.href)
                  ? "bg-[#15539C]/20 text-[#F49E2C] shadow-sm border border-[#F49E2C]/20"
                  : "text-white/60 hover:bg-[#15539C]/10 hover:text-white"
              )}
            >
              <div className={cn("transition-colors", isActive(link.href) ? "text-[#F49E2C]" : "group-hover:text-white")}>
                {link.icon}
              </div>
              <span className="mt-0.5">{link.label}</span>
              {isActive(link.href) && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#F49E2C] shadow-[0_0_8px_rgba(244,158,44,0.5)]" />
              )}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all w-full"
          >
            <IconLogout className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Top Header Bar */}
        <header className="h-16 shrink-0 bg-[#1a2847]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 md:px-8 z-40 transition-colors">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-white/50 hover:text-[#F49E2C] transition-colors" aria-label="Menu">
              <IconMenu2 className="w-6 h-6" />
            </button>
            <h2 className="text-white font-bold text-lg hidden sm:block tracking-tight uppercase">Mi Perfil</h2>
            <div className="h-6 w-[1px] bg-white/10 mx-2 hidden sm:block" />
            <p className="text-[10px] font-black text-[#F49E2C]/80 uppercase tracking-widest hidden lg:block">Configuración de Usuario</p>
          </div>

          <div className="flex items-center gap-2 md:gap-5">
            <button className="relative p-2.5 rounded-xl text-white/50 hover:text-[#F49E2C] hover:bg-white/5 transition-all group" aria-label="Notificaciones">
              <IconBell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#F49E2C] rounded-full border-2 border-[#1a2847]" />
            </button>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#15539C] to-[#16233B] flex items-center justify-center font-black text-sm text-white shadow-lg ring-2 ring-white/10">
              {getInitials(user?.full_name)}
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth bg-gradient-to-br from-transparent via-transparent to-[#15539C]/5">

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Hero Card */}
            <div className="relative overflow-hidden bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl flex flex-col md:flex-row items-center gap-8 group">
              {/* Background Decor */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#F49E2C]/5 rounded-full blur-3xl group-hover:bg-[#F49E2C]/10 transition-colors duration-500" />

              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#15539C] to-[#16233B] flex items-center justify-center text-3xl font-black text-white shadow-2xl ring-4 ring-[#F49E2C]/20 ring-offset-4 ring-offset-[#16233B] transition-transform group-hover:scale-105 duration-300">
                  {getInitials(user?.full_name)}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#F49E2C] text-[#16233B] p-2 rounded-xl border-4 border-[#16233B] shadow-xl">
                  <IconEdit className="w-4 h-4" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left space-y-2 relative z-10">
                <h1 className="text-3xl font-bold text-white tracking-tight">{user?.full_name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <p className="text-white/40 font-medium text-sm">{user?.email}</p>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  <div className="px-3 py-1 bg-[#F49E2C]/10 border border-[#F49E2C]/20 rounded-full text-[10px] font-black text-[#F49E2C] uppercase tracking-widest">
                    {user?.role}
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profileOptions.map((option, idx) => (
                <div
                  key={option.id}
                  onClick={option.onClick}
                  className={cn(
                    "flex items-center justify-between p-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl transition-all shadow-md group relative overflow-hidden",
                    option.onClick ? "hover:bg-white/10 cursor-pointer hover:border-[#F49E2C]/30 hover:-translate-y-1" : ""
                  )}
                >
                  {/* Hover accent */}
                  {option.onClick && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F49E2C] scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />}

                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[#16233B] text-[#F49E2C] border border-white/5 opacity-80 group-hover:opacity-100 group-hover:bg-[#15539C] transition-all">
                      {option.icon}
                    </div>
                    <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">{option.label}</span>
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
                      <IconChevronRight className="w-5 h-5 text-white/20 group-hover:text-[#F49E2C] transition-all" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Logout Footer Section */}
            <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-6 pb-20">
              <button
                onClick={handleLogout}
                className="w-full max-w-xs flex items-center justify-center gap-3 px-8 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-red-500/5 group"
              >
                <IconLogout className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Cerrar Sesión Segura
              </button>
              <div className="text-center space-y-1 opacity-20">
                <p className="text-[10px] font-black uppercase tracking-widest text-white">Versión 2.5.0 • DECOM 2026</p>
                <p className="text-[9px] font-bold text-white">IPUC Villa Estadio • Todos los derechos reservados</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}