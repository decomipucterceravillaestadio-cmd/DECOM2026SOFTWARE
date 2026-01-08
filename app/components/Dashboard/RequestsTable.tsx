'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/app/components/UI/Badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  IconCalendar,
  IconUser,
  IconAlertCircle,
  IconChevronRight,
  IconSearch
} from '@tabler/icons-react'
import { motion } from 'framer-motion'

interface Request {
  id: string
  event_name: string
  event_date: string
  status: string
  priority_score: number | null
  committee: {
    id: string
    name: string
    color_badge: string
  }
  created_at: string
}

interface RequestsTableProps {
  onSelectRequest: (id: string) => void
}

export default function RequestsTable({ onSelectRequest }: RequestsTableProps) {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [activeStatus, setActiveStatus] = useState('all')

  const fetchRequests = async (status: string) => {
    setLoading(true)
    try {
      const url = status === 'all'
        ? '/api/admin/requests?limit=50'
        : `/api/admin/requests?status=${status}&limit=50`

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setRequests(data.requests)
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests(activeStatus)
  }, [activeStatus])

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: any }> = {
      pending: { label: 'Pendiente', variant: 'warning' },
      in_progress: { label: 'En Progreso', variant: 'info' },
      completed: { label: 'Completado', variant: 'success' },
      approved: { label: 'Aprobado', variant: 'success' },
      rejected: { label: 'Rechazado', variant: 'error' },
    }
    const config = statusMap[status] || { label: status, variant: 'default' }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getPriorityColor = (score: number | null) => {
    if (!score) return 'text-neutral-400 bg-neutral-100'
    if (score >= 8) return 'text-red-700 bg-red-100 font-bold'
    if (score >= 5) return 'text-orange-700 bg-orange-100 font-semibold'
    return 'text-green-700 bg-green-100'
  }

  const handleTabChange = (value: string) => {
    setActiveStatus(value)
  }

  const tabs = [
    { title: 'Todas', value: 'all' },
    { title: 'Pendientes', value: 'pending' },
    { title: 'En Progreso', value: 'in_progress' },
    { title: 'Completadas', value: 'completed' },
  ]

  return (
    <div className="w-full space-y-6">
      {/* Tabs Buttons */}
      <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl w-fit overflow-x-auto max-w-full">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeStatus === tab.value
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
        <RequestsContent
          requests={requests}
          loading={loading}
          onSelectRequest={onSelectRequest}
          getStatusBadge={getStatusBadge}
          getPriorityColor={getPriorityColor}
        />
      </div>
    </div>
  )
}

function RequestsContent({
  requests,
  loading,
  onSelectRequest,
  getStatusBadge,
  getPriorityColor,
}: {
  requests: Request[]
  loading: boolean
  onSelectRequest: (id: string) => void
  getStatusBadge: (status: string) => React.ReactNode
  getPriorityColor: (score: number | null) => string
}) {
  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 animate-pulse">
            <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-1/4" />
              <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
        <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-full mb-4">
          <IconSearch className="w-8 h-8 opacity-50" />
        </div>
        <p className="text-lg font-medium">No se encontraron solicitudes</p>
        <p className="text-sm">Intenta cambiar los filtros o crea una nueva solicitud.</p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile View (Cards) */}
      <div className="block md:hidden divide-y divide-neutral-100 dark:divide-neutral-800">
        {requests.map((request, idx) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onSelectRequest(request.id)}
            className="p-4 active:bg-neutral-50 dark:active:bg-neutral-800 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  {request.committee.name}
                </span>
                <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-lg leading-tight line-clamp-2">
                  {request.event_name}
                </h3>
              </div>
              <div className="shrink-0 ml-3">
                {getStatusBadge(request.status)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-neutral-600 dark:text-neutral-400 mt-4">
              <div className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-800/50 p-2 rounded-lg">
                <IconCalendar className="w-4 h-4 text-violet-500" />
                <span>{format(new Date(request.event_date), 'dd MMM', { locale: es })}</span>
              </div>
              <div className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-800/50 p-2 rounded-lg">
                <IconAlertCircle className="w-4 h-4 text-orange-500" />
                <span className="font-medium">Prioridad: {request.priority_score || '-'}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop View (Table) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-100 dark:border-neutral-800">
              <th className="py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-wider">Evento</th>
              <th className="py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-wider">Comité</th>
              <th className="py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-wider">Fecha Est.</th>
              <th className="py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-wider">Estado</th>
              <th className="py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-wider text-center">Prioridad</th>
              <th className="py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {requests.map((request) => (
              <tr
                key={request.id}
                onClick={() => onSelectRequest(request.id)}
                className="group hover:bg-neutral-50/80 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-violet-600 transition-colors">
                    {request.event_name}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neutral-300" />
                    <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      {request.committee.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <IconCalendar className="w-4 h-4" />
                    {format(new Date(request.event_date), 'dd MMM yyyy', { locale: es })}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="scale-95 origin-left">
                    {getStatusBadge(request.status)}
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm ${getPriorityColor(request.priority_score)}`}>
                    {request.priority_score || '-'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <IconChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
