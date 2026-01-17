'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconSearch,
  IconUsers
} from '@tabler/icons-react'
import { motion, AnimatePresence } from 'framer-motion'
import { RoleBadge } from '@/app/components/Auth/RoleBadge'
import { useAuth, useHasPermission } from '@/app/contexts/AuthContext'
import { Permission } from '@/app/lib/permissions'
import type { UserRole } from '@/app/types/auth'
import { DashboardLayout } from '@/app/components/Dashboard/DashboardLayout'
import { Button } from '@/app/components/UI/Button'
import { Card } from '@/app/components/UI/Card'
import { Skeleton } from '@/app/components/UI/Skeleton'

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
  const { user: currentUser } = useAuth()
  const canViewUsers = useHasPermission(Permission.VIEW_USERS)
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

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

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas desactivar al usuario ${userName}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, is_active: false } : u))
        alert('Usuario desactivado exitosamente')
      } else {
        const data = await response.json()
        alert(data.error || 'Error al desactivar usuario')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error al procesar la solicitud')
    }
  }

  useEffect(() => {
    if (canViewUsers) loadUsers()
  }, [canViewUsers])

  useEffect(() => {
    let filtered = users.filter(u =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [users, searchQuery])

  return (
    <DashboardLayout
      title="Gestión de Usuarios"
      showSearch
      searchTerm={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-decom-secondary/10 rounded-2xl text-decom-secondary">
            <IconUsers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-dashboard-text-primary tracking-tight">
              Listado de Usuarios
            </h2>
            <p className="text-sm text-dashboard-text-secondary font-medium">Gestiona los accesos y roles de la plataforma</p>
          </div>
        </div>

        <Button
          onClick={() => router.push('/admin/users/new')}
          variant="secondary"
          size="md"
          leftIcon={<IconPlus className="w-5 h-5" />}
          className="shadow-xl shadow-decom-secondary/20"
        >
          NUEVO USUARIO
        </Button>
      </div>

      <Card padding="none" className="overflow-hidden border-dashboard-card-border/50 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dashboard-bg/50 border-b border-dashboard-card-border">
                <th className="px-6 py-5 text-[10px] font-black text-dashboard-text-muted uppercase tracking-[0.2em]">Usuario</th>
                <th className="px-6 py-5 text-[10px] font-black text-dashboard-text-muted uppercase tracking-[0.2em]">Rol Asignado</th>
                <th className="px-6 py-5 text-[10px] font-black text-dashboard-text-muted uppercase tracking-[0.2em]">Estado</th>
                <th className="px-6 py-5 text-[10px] font-black text-dashboard-text-muted uppercase tracking-[0.2em] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashboard-card-border/50">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  [1, 2, 3, 4, 5].map(i => (
                    <tr key={i} className="h-20">
                      <td className="px-6 py-4"><div className="flex items-center gap-3"><Skeleton variant="circular" width={40} height={40} /><div className="space-y-2"><Skeleton width={120} height={14} /><Skeleton width={80} height={10} /></div></div></td>
                      <td className="px-6 py-4"><Skeleton width={100} height={24} variant="rectangular" className="rounded-full" /></td>
                      <td className="px-6 py-4"><Skeleton width={80} height={24} variant="rectangular" className="rounded-full" /></td>
                      <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2"><Skeleton width={32} height={32} /><Skeleton width={32} height={32} /></div></td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-50">
                        <IconSearch className="w-12 h-12 text-dashboard-text-muted" />
                        <p className="text-lg font-bold text-dashboard-text-secondary">No se encontraron usuarios</p>
                        <p className="text-sm text-dashboard-text-muted">Intenta con otra búsqueda o agrega un nuevo usuario</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.map((user, idx) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group hover:bg-dashboard-bg/40 transition-all cursor-default"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-decom-primary-light to-decom-primary flex items-center justify-center font-black text-white border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
                          {(user.full_name || user.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-dashboard-text-primary group-hover:text-decom-secondary transition-colors">{user.full_name || 'Sin nombre'}</p>
                          <p className="text-[11px] font-bold text-dashboard-text-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <RoleBadge role={user.role} size="sm" />
                    </td>
                    <td className="px-6 py-5">
                      {user.is_active ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-decom-success/10 text-decom-success border border-decom-success/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-decom-success animate-pulse" /> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-decom-error/10 text-decom-error border border-decom-error/20">
                          <IconX className="w-3 h-3" /> Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                          className="p-2.5 rounded-xl hover:bg-decom-secondary/10 text-dashboard-text-muted hover:text-decom-secondary transition-all group/btn shadow-sm hover:shadow-md border border-transparent hover:border-decom-secondary/20"
                        >
                          <IconEdit className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.full_name || user.email)}
                          className="p-2.5 rounded-xl hover:bg-decom-error/10 text-dashboard-text-muted hover:text-decom-error transition-all group/btn shadow-sm hover:shadow-md border border-transparent hover:border-decom-error/20"
                        >
                          <IconTrash className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  )
}
