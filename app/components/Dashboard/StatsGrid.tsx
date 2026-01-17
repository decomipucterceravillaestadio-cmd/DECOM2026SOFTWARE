'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
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
      <div className="h-64 bg-slate-100 dark:bg-white/5 rounded-2xl animate-pulse border border-slate-200 dark:border-white/5" />
    )
  }

  return (
    <div className="space-y-8">
      {/* Committee Distribution Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
