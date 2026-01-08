'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  IconClipboardList,
  IconClock,
  IconLoader,
  IconCheck,
  IconChartBar
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

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  color: string
  delay?: number
}

function StatCard({ title, value, icon, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform hover:scale-110`} />

      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl bg-${color}-50 dark:bg-${color}-900/20 flex items-center justify-center mb-4 text-${color}-600 dark:text-${color}-400`}>
          {icon}
        </div>

        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
          {title}
        </p>
        <h3 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          {value}
        </h3>
      </div>
    </motion.div>
  )
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 bg-neutral-100 dark:bg-neutral-900 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  const completedTotal = stats.byStatus.completed + stats.byStatus.approved

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Solicitudes"
          value={stats.total}
          icon={<IconClipboardList className="w-6 h-6" />}
          color="violet"
          delay={0}
        />
        <StatCard
          title="Pendientes"
          value={stats.byStatus.pending}
          icon={<IconClock className="w-6 h-6" />}
          color="orange"
          delay={0.1}
        />
        <StatCard
          title="En Progreso"
          value={stats.byStatus.in_progress}
          icon={<IconLoader className="w-6 h-6" />}
          color="blue"
          delay={0.2}
        />
        <StatCard
          title="Finalizadas"
          value={completedTotal}
          icon={<IconCheck className="w-6 h-6" />}
          color="green"
          delay={0.3}
        />
      </div>

      {/* Committee Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-6">
          <IconChartBar className="w-5 h-5 text-neutral-500" />
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Solicitudes por Comité
          </h3>
        </div>

        <div className="space-y-4">
          {stats.byCommittee.map((committee, index) => {
            const percentage = Math.round((committee.count / stats.total) * 100) || 0

            return (
              <div key={committee.id} className="group">
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    {committee.name}
                  </span>
                  <span className="text-neutral-500">
                    {committee.count} ({percentage}%)
                  </span>
                </div>
                <div className="h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                    className={`h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 opacity-80 group-hover:opacity-100 transition-opacity`}
                  />
                </div>
              </div>
            )
          })}

          {stats.byCommittee.length === 0 && (
            <p className="text-center text-neutral-500 py-4">No hay datos suficientes</p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
