'use client'

import { useState, useEffect } from 'react'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import { 
  IconClipboardList, 
  IconClock, 
  IconChecks, 
  IconAlertCircle 
} from '@tabler/icons-react'

interface Stats {
  total: number
  byStatus: {
    pending: number
    in_progress: number
    completed: number
    approved: number
    rejected: number
  }
  byCommittee: Array<{
    id: string
    name: string
    color_badge: string
    count: number
  }>
}

export default function StatsGrid() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading || !stats) {
    return (
      <div className="animate-pulse">
        <BentoGrid>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
          ))}
        </BentoGrid>
      </div>
    )
  }

  const items = [
    {
      title: 'Total de Solicitudes',
      description: `${stats.total} solicitudes registradas`,
      header: (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-500 to-purple-500">
          <IconClipboardList className="h-12 w-12 text-white" />
        </div>
      ),
      icon: <IconClipboardList className="h-4 w-4 text-neutral-500" />,
      className: 'md:col-span-1',
    },
    {
      title: 'Pendientes',
      description: `${stats.byStatus.pending} solicitudes esperando revisión`,
      header: (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-yellow-500 to-orange-500">
          <IconClock className="h-12 w-12 text-white" />
        </div>
      ),
      icon: <IconClock className="h-4 w-4 text-neutral-500" />,
      className: 'md:col-span-1',
    },
    {
      title: 'En Progreso',
      description: `${stats.byStatus.in_progress} solicitudes activas`,
      header: (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500">
          <IconAlertCircle className="h-12 w-12 text-white" />
        </div>
      ),
      icon: <IconAlertCircle className="h-4 w-4 text-neutral-500" />,
      className: 'md:col-span-1',
    },
    {
      title: 'Completadas',
      description: `${stats.byStatus.completed + stats.byStatus.approved} solicitudes finalizadas`,
      header: (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-500 to-emerald-500">
          <IconChecks className="h-12 w-12 text-white" />
        </div>
      ),
      icon: <IconChecks className="h-4 w-4 text-neutral-500" />,
      className: 'md:col-span-2',
    },
    {
      title: 'Por Comité',
      description: (
        <div className="space-y-2">
          {stats.byCommittee.slice(0, 3).map((committee) => (
            <div key={committee.id} className="flex items-center justify-between">
              <span className="text-xs">{committee.name}</span>
              <span className={`px-2 py-1 rounded-full text-xs bg-${committee.color_badge}-100 text-${committee.color_badge}-800`}>
                {committee.count}
              </span>
            </div>
          ))}
        </div>
      ),
      header: (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pink-500 to-rose-500">
          <IconClipboardList className="h-12 w-12 text-white" />
        </div>
      ),
      icon: <IconClipboardList className="h-4 w-4 text-neutral-500" />,
      className: 'md:col-span-1',
    },
  ]

  return (
    <BentoGrid className="max-w-7xl mx-auto">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={item.className}
        />
      ))}
    </BentoGrid>
  )
}
