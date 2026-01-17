'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconUsers
} from '@tabler/icons-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth, useHasPermission } from '@/app/contexts/AuthContext'
import { Permission } from '@/app/lib/permissions'
import { DashboardLayout } from '@/app/components/Dashboard/DashboardLayout'
import { Button } from '@/app/components/UI/Button'
import { Card } from '@/app/components/UI/Card'
import { Skeleton } from '@/app/components/UI/Skeleton'

interface Committee {
  id: string
  name: string
  description: string | null
  color_badge: string
  created_at: string
  updated_at: string
}

export default function AdminCommitteesPage() {
  const router = useRouter()
  const { user: currentUser } = useAuth()
  const canViewCommittees = useHasPermission(Permission.VIEW_COMMITTEES)
  const canEditCommittees = useHasPermission(Permission.EDIT_COMMITTEES)
  const [committees, setCommittees] = useState<Committee[]>([])
  const [filteredCommittees, setFilteredCommittees] = useState<Committee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deletingCommitteeId, setDeletingCommitteeId] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const loadCommittees = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/committees')
      if (response.ok) {
        const data = await response.json()
        setCommittees(data.committees || [])
      } else {
        console.error('Error loading committees')
      }
    } catch (error) {
      console.error('Error loading committees:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!canViewCommittees) {
      router.push('/admin')
      return
    }
    loadCommittees()
  }, [canViewCommittees, router])

  useEffect(() => {
    const filtered = committees.filter(committee =>
      committee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (committee.description && committee.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    setFilteredCommittees(filtered)
  }, [committees, searchQuery])

  const handleDelete = async (committeeId: string) => {
    const committee = committees.find(c => c.id === committeeId)
    const committeeName = committee?.name || 'este comité'

    if (!confirm(`¿Estás seguro de que quieres eliminar el comité "${committeeName}"? Esta acción no se puede deshacer y puede afectar a las solicitudes existentes.`)) {
      return
    }

    try {
      setDeletingCommitteeId(committeeId)

      const response = await fetch(`/api/admin/committees/${committeeId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Mostrar notificación de éxito
        setNotification({
          type: 'success',
          message: `El comité "${committeeName}" ha sido eliminado exitosamente.`
        })

        // Limpiar notificación después de 4 segundos
        setTimeout(() => setNotification(null), 4000)

        // Animación suave: esperar un poco antes de remover de la lista
        setTimeout(() => {
          setCommittees(prev => prev.filter(c => c.id !== committeeId))
          setDeletingCommitteeId(null)
        }, 300)
      } else {
        const errorData = await response.json()
        setNotification({
          type: 'error',
          message: errorData.error || 'Error al eliminar el comité'
        })
        setDeletingCommitteeId(null)
        setTimeout(() => setNotification(null), 4000)
      }
    } catch (error) {
      console.error('Error deleting committee:', error)
      setNotification({
        type: 'error',
        message: 'Error al eliminar el comité. Inténtalo de nuevo.'
      })
      setDeletingCommitteeId(null)
      setTimeout(() => setNotification(null), 4000)
    }
  }

  if (!canViewCommittees) {
    return null
  }

  return (
    <DashboardLayout
      title="Gestión de Comités"
      showSearch={true}
      searchTerm={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-dashboard-text-primary">Comités</h1>
            <p className="text-dashboard-text-secondary mt-1">
              Gestiona los comités disponibles en el sistema
            </p>
          </div>
          {canEditCommittees && (
            <Button
              onClick={() => router.push('/admin/committees/new')}
              className="flex items-center gap-2"
            >
              <IconPlus className="h-4 w-4" />
              Nuevo Comité
            </Button>
          )}
        </div>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`mb-6 p-4 rounded-lg border ${
                notification.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {notification.type === 'success' ? (
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-sm font-medium">{notification.message}</p>
                <button
                  onClick={() => setNotification(null)}
                  className={`ml-auto p-1 rounded-full hover:bg-opacity-20 ${
                    notification.type === 'success' ? 'hover:bg-green-200' : 'hover:bg-red-200'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Committees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-16" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </Card>
            ))
          ) : filteredCommittees.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <IconUsers className="h-12 w-12 text-dashboard-text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-dashboard-text-primary mb-2">
                {searchQuery ? 'No se encontraron comités' : 'No hay comités registrados'}
              </h3>
              <p className="text-dashboard-text-secondary">
                {searchQuery ? 'Intenta con otros términos de búsqueda' : 'Comienza creando tu primer comité'}
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredCommittees.map((committee) => (
                <motion.div
                  key={committee.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                    y: -20,
                    transition: { duration: 0.3, ease: "easeInOut" }
                  }}
                  transition={{
                    layout: { duration: 0.3 },
                    opacity: { duration: 0.2 },
                    y: { duration: 0.3 }
                  }}
                  className="relative"
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${committee.color_badge}`} />
                        <h3 className="font-semibold text-dashboard-text-primary">
                          {committee.name}
                        </h3>
                      </div>
                      {canEditCommittees && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/committees/${committee.id}`)}
                            className="p-2"
                            disabled={deletingCommitteeId === committee.id}
                          >
                            <IconEdit className="h-4 w-4" />
                          </Button>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(committee.id)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 relative transition-all duration-200"
                              disabled={deletingCommitteeId === committee.id}
                            >
                              {deletingCommitteeId === committee.id ? (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="absolute inset-0 flex items-center justify-center"
                                >
                                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  whileHover={{
                                    rotate: [0, -10, 10, -10, 0],
                                    transition: { duration: 0.5 }
                                  }}
                                >
                                  <IconTrash className="h-4 w-4" />
                                </motion.div>
                              )}
                            </Button>
                          </motion.div>
                        </div>
                      )}
                    </div>

                    <p className="text-dashboard-text-secondary text-sm mb-4">
                      {committee.description || 'Sin descripción'}
                    </p>

                    <div className="text-xs text-dashboard-text-muted">
                      Creado: {new Date(committee.created_at).toLocaleDateString('es-ES')}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}