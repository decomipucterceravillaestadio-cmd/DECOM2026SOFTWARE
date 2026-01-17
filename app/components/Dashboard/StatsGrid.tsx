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
  color: 'purple' | 'orange' | 'blue' | 'green'
  delay?: number
}

function StatCard({ title, value, icon, color, delay = 0 }: StatCardProps) {
  const styles = {
    purple: {
      card_light: 'bg-gradient-to-br from-white to-purple-50/80 hover:to-purple-100/50 border-purple-200/60',
      text_light: 'text-purple-700',
      icon_light: 'bg-purple-100 text-purple-600 shadow-sm shadow-purple-200',
      glow_light: 'from-purple-500/10',

      // Keep dark mode as is
      dark_border: 'dark:border-white/5',
      dark_text: 'dark:text-purple-400',
      dark_icon: 'dark:bg-purple-500/10',
      glow_dark: 'dark:from-purple-500/20'
    },
    orange: {
      card_light: 'bg-gradient-to-br from-white to-orange-50/80 hover:to-orange-100/50 border-orange-200/60',
      text_light: 'text-orange-700',
      icon_light: 'bg-orange-100 text-orange-600 shadow-sm shadow-orange-200',
      glow_light: 'from-orange-500/10',

      dark_border: 'dark:border-white/5',
      dark_text: 'dark:text-orange-400',
      dark_icon: 'dark:bg-orange-500/10',
      glow_dark: 'dark:from-orange-500/20'
    },
    blue: {
      card_light: 'bg-gradient-to-br from-white to-blue-50/80 hover:to-blue-100/50 border-blue-200/60',
      text_light: 'text-blue-700',
      icon_light: 'bg-blue-100 text-blue-600 shadow-sm shadow-blue-200',
      glow_light: 'from-blue-500/10',

      dark_border: 'dark:border-white/5',
      dark_text: 'dark:text-blue-400',
      dark_icon: 'dark:bg-blue-500/10',
      glow_dark: 'dark:from-blue-500/20'
    },
    green: {
      card_light: 'bg-gradient-to-br from-white to-emerald-50/80 hover:to-emerald-100/50 border-emerald-200/60',
      text_light: 'text-emerald-700',
      icon_light: 'bg-emerald-100 text-emerald-600 shadow-sm shadow-emerald-200',
      glow_light: 'from-emerald-500/10',

      dark_border: 'dark:border-white/5',
      dark_text: 'dark:text-emerald-400',
      dark_icon: 'dark:bg-emerald-500/10',
      glow_dark: 'dark:from-emerald-500/20'
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`
        relative overflow-hidden rounded-2xl p-6 group transition-all duration-300
        hover:shadow-xl hover:-translate-y-1 border
        ${styles[color].card_light}
        dark:bg-[#0F172A]/40 dark:backdrop-blur-xl ${styles[color].dark_border}
        shadow-sm
      `}
    >
      {/* Dynamic Background Glow */}
      <div className={`absolute -right-20 -top-20 w-48 h-48 rounded-full bg-gradient-to-br ${styles[color].glow_light} ${styles[color].glow_dark} blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500`} />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${styles[color].icon_light} dark:bg-opacity-100 dark:border-white/5 dark:bg-transparent ${styles[color].dark_icon} transition-transform group-hover:scale-110 duration-300`}>
            {icon}
          </div>
        </div>

        <div>
          {/* Value with colored text in light mode for vibrance */}
          <h3 className={`text-5xl font-extrabold tracking-tight mb-1 tabular-nums ${styles[color].text_light} dark:text-white`}>
            {value}
          </h3>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </p>
        </div>
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
          <div key={i} className="h-44 bg-slate-100 dark:bg-white/5 rounded-2xl animate-pulse border border-slate-200 dark:border-white/5" />
        ))}
      </div>
    )
  }

  const completedTotal = stats.byStatus.completed + stats.byStatus.approved

  return (
    <div className="space-y-8">
      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Solicitudes"
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
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-[#0F172A]/40 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-white/5 shadow-lg relative overflow-hidden"
      >
        {/* Light decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 dark:bg-[#15539C]/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="mb-8 flex items-center justify-between relative z-10">
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#F49E2C] rounded-full inline-block shadow-sm shadow-orange-200 dark:shadow-none"></span>
              Solicitudes por Comité
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 pl-4">{stats.total} solicitudes registradas en el sistema</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-slate-300 border border-slate-100 dark:border-white/10 shadow-sm">
            <IconChartBar className="w-5 h-5" />
          </div>
        </div>

        <div className="space-y-6 relative z-10">
          {stats.byCommittee.sort((a, b) => b.count - a.count).map((committee, index) => {
            const percentage = Math.round((committee.count / stats.total) * 100) || 0
            return (
              <div key={committee.id} className="group">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                    {committee.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800 dark:text-white tabular-nums">{committee.count}</span>
                    <span className="text-xs font-bold text-[#F49E2C] bg-[#F49E2C]/10 px-2 py-0.5 rounded-md border border-[#F49E2C]/20">
                      {percentage}%
                    </span>
                  </div>
                </div>
                <div className="h-2.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-100 dark:border-transparent">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.5 + (index * 0.1) }}
                    className="h-full bg-gradient-to-r from-[#15539C] to-[#F49E2C] rounded-full relative shadow-[0_0_10px_rgba(244,158,44,0.3)]"
                  >
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                  </motion.div>
                </div>
              </div>
            )
          })}

          {stats.byCommittee.length === 0 && (
            <div className="text-center py-12 opacity-50">
              <IconChartBar className="w-12 h-12 mx-auto mb-3 text-slate-400 dark:text-slate-600" />
              <p className="text-sm uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">Sin datos para mostrar</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
