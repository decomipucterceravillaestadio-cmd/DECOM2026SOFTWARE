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
  const colors: Record<string, { bg: string, text: string, decoration: string }> = {
    purple: { bg: 'bg-[#8B5CF6]/10', text: 'text-[#8B5CF6]', decoration: 'decoration-[#8B5CF6]' },
    orange: { bg: 'bg-[#F49E2C]/10', text: 'text-[#F49E2C]', decoration: 'decoration-[#F49E2C]' },
    blue: { bg: 'bg-[#15539C]/10', text: 'text-[#15539C]', decoration: 'decoration-[#15539C]' },
    green: { bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', decoration: 'decoration-[#10B981]' },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-dashboard-card backdrop-blur-md rounded-[12px] p-5 border border-dashboard-card-border flex flex-col items-center text-center group hover:bg-dashboard-card-border/10 transition-all shadow-lg"
    >
      <div className={`w-12 h-12 rounded-full ${colors[color].bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-dashboard-card-border/20`}>
        <div className={colors[color].text}>{icon}</div>
      </div>
      <h3 className="text-[40px] md:text-[48px] font-[700] text-dashboard-text-primary leading-none mb-2 tabular-nums">
        {value}
      </h3>
      <p className="text-[12px] font-bold text-dashboard-text-muted uppercase tracking-[0.15em] group-hover:text-dashboard-text-secondary transition-colors">
        {title}
      </p>
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
          <div key={i} className="h-40 bg-dashboard-card-border/10 rounded-[12px] animate-pulse" />
        ))}
      </div>
    )
  }

  const completedTotal = stats.byStatus.completed + stats.byStatus.approved

  return (
    <div className="space-y-8">
      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total"
          value={stats.total}
          icon={<IconClipboardList className="w-6 h-6" />}
          color="purple"
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
          title="Completados"
          value={completedTotal}
          icon={<IconCheck className="w-6 h-6" />}
          color="green"
          delay={0.3}
        />
      </div>

      {/* Committee Distribution Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-dashboard-card backdrop-blur-md rounded-[12px] p-6 border border-dashboard-card-border shadow-xl transition-all duration-300"
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h3 className="text-[20px] font-semibold text-dashboard-text-primary tracking-tight uppercase">Solicitudes por Comité</h3>
            <p className="text-[14px] text-dashboard-text-muted mt-1">{stats.total} solicitudes totales</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F49E2C]/10 text-[#F49E2C] border border-[#F49E2C]/20">
            <IconChartBar className="w-5 h-5" />
          </div>
        </div>

        <div className="space-y-6">
          {stats.byCommittee.sort((a, b) => b.count - a.count).map((committee, index) => {
            const percentage = Math.round((committee.count / stats.total) * 100) || 0
            return (
              <div key={committee.id} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[14px] font-bold text-dashboard-text-secondary uppercase tracking-widest leading-none">
                    {committee.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-black text-dashboard-text-primary">{committee.count}</span>
                    <span className="text-[12px] font-bold text-[#F49E2C] opacity-80">({percentage}%)</span>
                  </div>
                </div>
                <div className="h-2.5 bg-dashboard-bg rounded-full overflow-hidden border border-dashboard-card-border shadow-inner transition-colors duration-300">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 + (index * 0.1) }}
                    className="h-full bg-gradient-to-r from-[#15539C] to-[#F49E2C] rounded-full shadow-[0_0_15px_rgba(244,158,44,0.3)]"
                  />
                </div>
              </div>
            )
          })}

          {stats.byCommittee.length === 0 && (
            <div className="text-center py-10 opacity-30">
              <IconChartBar className="w-10 h-10 mx-auto mb-2" />
              <p className="text-xs uppercase tracking-widest font-bold">Sin datos disponibles</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
