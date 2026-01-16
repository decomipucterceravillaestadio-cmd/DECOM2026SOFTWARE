'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  IconChevronRight,
  IconSearch,
  IconDots,
  IconChevronLeft
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
  searchTerm?: string
}

export default function RequestsTable({ onSelectRequest, searchTerm = '' }: RequestsTableProps) {
  const [requests, setRequests] = useState<Request[]>([])
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [activeStatus, setActiveStatus] = useState('all')
  const [page, setPage] = useState(1)

  const fetchRequests = async (status: string) => {
    setLoading(true)
    try {
      const url = status === 'all'
        ? '/api/admin/requests?limit=10'
        : `/api/admin/requests?status=${status}&limit=10`

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setRequests(data.requests || [])
        setFilteredRequests(data.requests || [])
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

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRequests(requests)
    } else {
      const filtered = requests.filter(request =>
        request.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.committee.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredRequests(filtered)
    }
  }, [requests, searchTerm])

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; class: string }> = {
      pending: { label: 'Pendiente', class: 'bg-[#F49E2C]/10 text-[#F49E2C] border-[#F49E2C]/20' },
      in_progress: { label: 'En Progreso', class: 'bg-[#15539C]/10 text-[#15539C] border-[#15539C]/20' },
      completed: { label: 'Completado', class: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' },
      approved: { label: 'Aprobado', class: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' },
      rejected: { label: 'Rechazado', class: 'bg-red-500/10 text-red-500 border-red-500/20' },
    }
    const config = statusMap[status] || { label: status, class: 'bg-white/10 text-white/50 border-white/20' }
    return (
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${config.class}`}>
        {config.label}
      </span>
    )
  }

  const tabs = [
    { title: 'TODAS', value: 'all' },
    { title: 'PENDIENTES', value: 'pending' },
    { title: 'EN PROGRESO', value: 'in_progress' },
    { title: 'COMPLETADOS', value: 'completed' },
  ]

  return (
    <div className="w-full">
      {/* Table Filters */}
      <div className="flex items-center gap-2 p-4 border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveStatus(tab.value)}
            className={`px-4 py-2 rounded-lg text-[11px] font-bold tracking-wider transition-all ${activeStatus === tab.value
                ? 'bg-[#F49E2C] text-[#16233B] shadow-lg shadow-[#F49E2C]/20'
                : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-6 py-4 text-[12px] font-bold text-white/30 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-[12px] font-bold text-white/30 uppercase tracking-wider">Solicitud / Evento</th>
              <th className="px-6 py-4 text-[12px] font-bold text-white/30 uppercase tracking-wider">Comité</th>
              <th className="px-6 py-4 text-[12px] font-bold text-white/30 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4 text-[12px] font-bold text-white/30 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-4 text-[12px] font-bold text-white/30 uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-6 h-16 bg-white/5"></td>
                </tr>
              ))
            ) : filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <IconSearch className="w-10 h-10 mx-auto text-white/10 mb-4" />
                  <p className="text-white/20 font-bold uppercase tracking-widest text-xs">No se encontraron solicitudes</p>
                </td>
              </tr>
            ) : (
              filteredRequests.map((request, idx) => (
                <motion.tr
                  key={request.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => onSelectRequest(request.id)}
                  className="group hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-[11px] font-mono font-bold text-white/30 group-hover:text-[#F49E2C]/50 transition-colors">#{request.id.slice(0, 8)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-[14px] font-bold text-white group-hover:text-[#F49E2C] transition-colors">{request.event_name}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-[12px] text-white/50">{request.committee.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-[12px] text-white/40 group-hover:text-white/60 transition-colors">
                      {format(new Date(request.event_date), 'dd/MM/yyyy', { locale: es })}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-white/10 text-white/20 hover:text-white transition-all">
                        <IconDots className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-[#15539C]/10 text-[#15539C] group-hover:bg-[#15539C] group-hover:text-white transition-all border border-[#15539C]/20">
                        <IconChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
        <p className="text-[12px] text-white/30">
          Mostrando <span className="text-white/60 font-bold">{filteredRequests.length}</span> resultados
        </p>
        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            className="p-2 rounded-lg border border-white/10 text-white/30 hover:text-white hover:border-white/20 disabled:opacity-20 transition-all"
          >
            <IconChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(p => (
              <button
                key={p}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${page === p ? 'bg-[#F49E2C] text-[#16233B]' : 'text-white/30 hover:bg-white/5 hover:text-white'
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            className="p-2 rounded-lg border border-white/10 text-white/30 hover:text-white hover:border-white/20 transition-all"
          >
            <IconChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
