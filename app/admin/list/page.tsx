'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  IconPlus,
  IconClipboardList,
  IconFilter
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/app/contexts/AuthContext'
import RequestCard from '@/app/components/Dashboard/RequestCard'
import FilterChips from '@/app/components/UI/FilterChips'
import { DashboardLayout } from '@/app/components/Dashboard/DashboardLayout'

interface Request {
  id: string
  event_name: string
  event_date: string
  status: string
  priority_score: number | null
  material_type: string
  committee: {
    name: string
    color_badge: string
  }
  created_at: string
}

type FilterType = 'all' | 'Pendiente' | 'En planificación' | 'En diseño' | 'Lista para entrega' | 'Entregada' | 'urgent'

export default function AdminListPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/requests?limit=100')
      if (response.ok) {
        const data = await response.json()
        setRequests(data.requests || [])
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const filteredRequests = requests.filter(request => {
    const matchesFilter = (() => {
      switch (activeFilter) {
        case 'Pendiente':
          return request.status === 'Pendiente'
        case 'En planificación':
          return request.status === 'En planificación'
        case 'En diseño':
          return request.status === 'En diseño'
        case 'Lista para entrega':
          return request.status === 'Lista para entrega'
        case 'Entregada':
          return request.status === 'Entregada'
        case 'urgent':
          return request.priority_score && request.priority_score >= 8
        default:
          return true
      }
    })()

    const matchesSearch = searchTerm.trim() === '' ||
      request.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.committee.name.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const filters = [
    { id: 'all' as FilterType, label: 'Todas', count: requests.length },
    { id: 'Pendiente' as FilterType, label: 'Pendientes', count: requests.filter(r => r.status === 'Pendiente').length },
    { id: 'En planificación' as FilterType, label: 'En Planificación', count: requests.filter(r => r.status === 'En planificación').length },
    { id: 'En diseño' as FilterType, label: 'En Diseño', count: requests.filter(r => r.status === 'En diseño').length },
    { id: 'Lista para entrega' as FilterType, label: 'Listas', count: requests.filter(r => r.status === 'Lista para entrega').length },
    { id: 'urgent' as FilterType, label: 'Urgentes', count: requests.filter(r => r.priority_score && r.priority_score >= 8).length },
  ]

  return (
    <DashboardLayout
      title="Solicitudes"
      showSearch
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#F49E2C]">
            <span onClick={() => router.push('/admin')} className="hover:underline cursor-pointer">Dashboard</span>
            <span className="text-dashboard-card-border">/</span>
            <span className="text-dashboard-text-muted font-medium tracking-normal capitalize">Lista de Solicitudes</span>
          </nav>
          <h1 className="text-2xl font-bold text-dashboard-text-primary tracking-tight transition-colors duration-300">Todas las Solicitudes</h1>
        </div>
        <button
          onClick={() => router.push('/new-request')}
          className="px-5 py-2.5 bg-[#F49E2C] text-[#16233B] rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#F49E2C]/20 shrink-0"
        >
          <IconPlus className="w-5 h-5" />
          NUEVA SOLICITUD
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-dashboard-card backdrop-blur-md rounded-2xl border border-dashboard-card-border p-3 md:p-4 shadow-xl transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-2 overflow-hidden min-w-0 flex-1">
            <div className="bg-decom-primary/10 p-2 rounded-lg text-[#F49E2C] shrink-0">
              <IconFilter className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <FilterChips
                filters={filters}
                activeFilter={activeFilter}
                onFilterChange={(filterId) => setActiveFilter(filterId as FilterType)}
              />
            </div>
          </div>
          <div className="text-[9px] md:text-[10px] font-black text-dashboard-text-muted uppercase tracking-widest bg-dashboard-bg px-2.5 md:px-3 py-1.5 md:py-2 rounded-full border border-dashboard-card-border transition-colors duration-300 whitespace-nowrap shrink-0 self-start sm:self-auto">
            {filteredRequests.length} RESULTADO{filteredRequests.length !== 1 ? 'S' : ''}
          </div>
        </div>
      </div>

      {/* Results Grid */ }
  <div className="space-y-4 pb-20">
    {loading ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-40 bg-dashboard-card-border/10 rounded-2xl animate-pulse border border-dashboard-card-border" />
        ))}
      </div>
    ) : filteredRequests.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-32 text-center opacity-30">
        <div className="size-20 bg-dashboard-card-border/10 rounded-full flex items-center justify-center mb-6">
          <IconClipboardList className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-dashboard-text-primary mb-2">No se encontraron resultados</h3>
        <p className="text-sm">Intenta ajustar los filtros para encontrar lo que buscas.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRequests.map((request, idx) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <RequestCard
              request={request}
              onClick={() => router.push(`/admin/requests/${request.id}`)}
            />
          </motion.div>
        ))}
      </div>
    )}
  </div>
    </DashboardLayout >
  )
}