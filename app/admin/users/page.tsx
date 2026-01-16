'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconFilter,
  IconLayoutDashboard,
  IconClipboardList,
  IconUser,
  IconLogout,
  IconCalendar,
  IconUsers,
  IconMenu2
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/app/components/UI/Button'
import { RoleBadge } from '@/app/components/Auth/RoleBadge'
import { useAuth, useHasPermission } from '@/app/contexts/AuthContext'
import { Permission } from '@/app/lib/permissions'
import type { UserRole } from '@/app/types/auth'

interface User {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  role_level: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const pathname = usePathname()
  const { user: currentUser, loading: authLoading } = useAuth()
  const canViewUsers = useHasPermission(Permission.VIEW_USERS)
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const baseLinks = [
    { label: 'Dashboard', href: '/admin', icon: <IconLayoutDashboard className="h-5 w-5" /> },
    { label: 'Nueva Solicitud', href: '/new-request', icon: <IconPlus className="h-5 w-5" /> },
    { label: 'Solicitudes', href: '/admin/list', icon: <IconClipboardList className="h-5 w-5" /> },
    { label: 'Calendario', href: '/admin/calendar', icon: <IconCalendar className="h-5 w-5" /> },
  ]

  const links = [
    ...baseLinks,
    { label: 'Gestión de Usuarios', href: '/admin/users', icon: <IconUsers className="h-5 w-5" /> },
    { label: 'Perfil', href: '/admin/profile', icon: <IconUser className="h-5 w-5" /> },
  ]

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (mounted && canViewUsers) loadUsers()
  }, [mounted, canViewUsers])

  useEffect(() => {
    let filtered = users.filter(u =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [users, searchQuery])

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
                    <IconUsers className="h-5 w-5 text-white" />
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
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop */}
      <nav className="hidden md:flex w-64 flex-col bg-[#1a2847] border-r border-white/10 transition-all duration-300 shadow-xl z-30">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-[#15539C] flex items-center justify-center border border-[#F49E2C]/30 shadow-[0_0_15px_rgba(244,158,44,0.1)]">
            <IconUsers className="h-5 w-5 text-white" />
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
      </nav>

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <header className="h-16 shrink-0 bg-[#1a2847]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 md:px-8 z-40 transition-colors">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-white/50 hover:text-[#F49E2C] transition-colors">
              <IconMenu2 className="w-6 h-6" />
            </button>
            <h2 className="text-white font-bold text-lg hidden sm:block tracking-tight uppercase">Usuarios</h2>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative hidden lg:block">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 bg-[#16233B]/50 border border-white/10 rounded-xl pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#F49E2C]/50 transition-all w-64"
              />
            </div>
            <button
              onClick={() => router.push('/admin/users/new')}
              className="px-4 py-2 bg-[#F49E2C] text-[#16233B] rounded-lg font-bold text-xs flex items-center gap-2"
            >
              <IconPlus className="w-4 h-4" />
              NUEVO USUARIO
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth bg-gradient-to-br from-transparent via-transparent to-[#15539C]/5">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Usuario</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Rol</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Estado</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  [1, 2, 3].map(i => <tr key={i} className="animate-pulse h-16 bg-white/5"><td colSpan={4}></td></tr>)
                ) : filteredUsers.map((user, idx) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-white/5 transition-all"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#15539C] to-[#16233B] flex items-center justify-center font-bold text-white border border-white/10">
                          {(user.full_name || user.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-[#F49E2C] transition-colors">{user.full_name || 'Sin nombre'}</p>
                          <p className="text-[10px] text-white/30">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      {user.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-500/10 text-green-400 border border-green-500/20">
                          <IconCheck className="w-3 h-3" /> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20">
                          <IconX className="w-3 h-3" /> Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg hover:bg-white/10 text-white/30 hover:text-white transition-all">
                          <IconEdit className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-all">
                          <IconTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}
