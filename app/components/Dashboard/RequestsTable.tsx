'use client'

import { useState, useEffect } from 'react'
import { Tabs } from '@/components/ui/tabs'
import { Badge } from '@/app/components/UI/Badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

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
    if (!score) return 'text-neutral-400'
    if (score >= 8) return 'text-red-500 font-bold'
    if (score >= 5) return 'text-orange-500 font-semibold'
    return 'text-neutral-500'
  }

  const handleTabChange = (value: string) => {
    setActiveStatus(value)
  }

  const tabs = [
    {
      title: 'Todas',
      value: 'all',
      content: (
        <RequestsContent 
          requests={requests} 
          loading={loading}
          onSelectRequest={onSelectRequest}
          getStatusBadge={getStatusBadge}
          getPriorityColor={getPriorityColor}
        />
      ),
    },
    {
      title: 'Pendientes',
      value: 'pending',
      content: (
        <RequestsContent 
          requests={requests} 
          loading={loading}
          onSelectRequest={onSelectRequest}
          getStatusBadge={getStatusBadge}
          getPriorityColor={getPriorityColor}
        />
      ),
    },
    {
      title: 'En Progreso',
      value: 'in_progress',
      content: (
        <RequestsContent 
          requests={requests} 
          loading={loading}
          onSelectRequest={onSelectRequest}
          getStatusBadge={getStatusBadge}
          getPriorityColor={getPriorityColor}
        />
      ),
    },
    {
      title: 'Completadas',
      value: 'completed',
      content: (
        <RequestsContent 
          requests={requests} 
          loading={loading}
          onSelectRequest={onSelectRequest}
          getStatusBadge={getStatusBadge}
          getPriorityColor={getPriorityColor}
        />
      ),
    },
  ]

  return (
    <div className="w-full">
      {/* Tabs Buttons */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeStatus === tab.value
                ? 'bg-violet-500 text-white'
                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700'
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <RequestsContent 
        requests={requests} 
        loading={loading}
        onSelectRequest={onSelectRequest}
        getStatusBadge={getStatusBadge}
        getPriorityColor={getPriorityColor}
      />
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
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500">
        No hay solicitudes para mostrar
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-b border-neutral-200 dark:border-neutral-800">
          <tr>
            <th className="py-3 px-4 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
              Evento
            </th>
            <th className="py-3 px-4 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
              Fecha
            </th>
            <th className="py-3 px-4 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
              Comité
            </th>
            <th className="py-3 px-4 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
              Estado
            </th>
            <th className="py-3 px-4 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
              Prioridad
            </th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr
              key={request.id}
              onClick={() => onSelectRequest(request.id)}
              className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer transition-colors"
            >
              <td className="py-4 px-4">
                <div className="font-medium text-neutral-900 dark:text-neutral-100">
                  {request.event_name}
                </div>
              </td>
              <td className="py-4 px-4 text-sm text-neutral-600 dark:text-neutral-400">
                {format(new Date(request.event_date), 'dd MMM yyyy', { locale: es })}
              </td>
              <td className="py-4 px-4">
                <Badge variant="default">{request.committee.name}</Badge>
              </td>
              <td className="py-4 px-4">
                {getStatusBadge(request.status)}
              </td>
              <td className="py-4 px-4">
                <span className={getPriorityColor(request.priority_score)}>
                  {request.priority_score || '-'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
