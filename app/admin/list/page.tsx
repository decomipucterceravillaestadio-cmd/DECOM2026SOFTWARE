'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  IconLayoutDashboard,
  IconCalendar,
  IconSettings,
  IconLogout,
  IconPlus,
  IconBell
} from '@tabler/icons-react'
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar'
import RequestCard from '@/app/components/Dashboard/RequestCard'
import FilterChips from '@/app/components/UI/FilterChips'
import FloatingActionButton from '@/app/components/UI/FloatingActionButton'

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

type FilterType = 'all' | 'pending' | 'in_progress' | 'urgent'

export default function AdminListPage() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  const links = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: <IconLayoutDashboard className="h-5 w-5" />,
    },
    {
      label: 'Lista',
      href: '/admin/list',
      icon: <IconLayoutDashboard className="h-5 w-5" />,
    },
    {
      label: 'Calendario',
      href: '/admin/calendar',
      icon: <IconCalendar className="h-5 w-5" />,
    },
    {
      label: 'Configuración',
      href: '/admin/settings',
      icon: <IconSettings className="h-5 w-5" />,
    },
  ]

  const filters = [
    { id: 'all' as FilterType, label: 'Todas', count: requests.length },
    { id: 'pending' as FilterType, label: 'Pendientes', count: requests.filter(r => r.status === 'pending').length },
    { id: 'in_progress' as FilterType, label: 'En proceso', count: requests.filter(r => r.status === 'in_progress').length },
    { id: 'urgent' as FilterType, label: 'Urgentes', count: requests.filter(r => r.priority_score && r.priority_score >= 8).length },
  ]

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (activeFilter !== 'all') {
        if (activeFilter === 'urgent') {
          params.set('filter', 'urgent')
        } else {
          params.set('status', activeFilter)
        }
      }

      const response = await fetch(`/api/admin/requests?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [activeFilter])

  const filteredRequests = requests.filter(request => {
    switch (activeFilter) {
      case 'pending':
        return request.status === 'pending'
      case 'in_progress':
        return request.status === 'in_progress'
      case 'urgent':
        return request.priority_score && request.priority_score >= 8
      default:
        return true
    }
  })

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const handleRequestClick = (requestId: string) => {
    router.push(`/admin/requests/${requestId}`)
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-neutral-100 dark:bg-neutral-950">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <div className="mb-8">
              <div className="flex items-center gap-2 px-2">
                <IconLayoutDashboard className="h-7 w-7 text-violet-500" />
                <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  DECOM
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-2 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors w-full"
            >
              <IconLogout className="h-5 w-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header con gradiente IPUC */}
        <div className="bg-gradient-to-r from-[#16233B] to-[#15539C] pt-6 pb-0 shadow-md relative z-20">
          <div className="px-4 mb-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/20 flex items-center justify-center size-10">
                <span className="material-symbols-outlined text-white text-[24px]">church</span>
              </div>
              <div>
                <h1 className="text-white text-xl font-bold tracking-tight">Panel DECOM</h1>
                <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Sistema de Solicitudes</p>
              </div>
            </div>
            <div className="relative">
              <div className="size-2 bg-red-500 rounded-full absolute top-0 right-0 border-2 border-[#15539C]"></div>
              <IconBell className="text-white text-[24px]" />
            </div>
          </div>

          {/* Tabs Lista/Calendario */}
          <div className="flex px-4 gap-6 mt-2">
            <Link
              href="/admin/list"
              className="flex flex-col items-center pb-3 border-b-[3px] border-[#F49E2C] text-white transition-all"
            >
              <span className="text-sm font-bold tracking-wide">Lista</span>
            </Link>
            <Link
              href="/admin/calendar"
              className="flex flex-col items-center pb-3 border-b-[3px] border-transparent text-white/60 hover:text-white transition-all"
            >
              <span className="text-sm font-bold tracking-wide">Calendario</span>
            </Link>
          </div>
        </div>

        {/* Filtros horizontales */}
        <div className="bg-neutral-100/95 dark:bg-neutral-900/95 backdrop-blur-sm py-4 pl-4 border-b border-gray-200/50 dark:border-gray-700/50 relative z-10">
          <FilterChips
            filters={filters}
            activeFilter={activeFilter}
            onFilterChange={(filterId) => setActiveFilter(filterId as FilterType)}
          />
        </div>

        {/* Contenido principal */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-500 dark:text-neutral-400">
                  No hay solicitudes {activeFilter !== 'all' ? `con filtro "${filters.find(f => f.id === activeFilter)?.label}"` : ''}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onClick={() => handleRequestClick(request.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FAB para nueva solicitud */}
        <FloatingActionButton
          onClick={() => router.push('/new-request')}
          icon={<IconPlus className="h-6 w-6" />}
        />
      </div>
    </div>
  )
}