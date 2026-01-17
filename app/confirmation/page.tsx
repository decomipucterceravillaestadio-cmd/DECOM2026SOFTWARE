'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../components/UI/Button'
import { Card } from '../components/UI/Card'
import { Layout } from '../components/Layout'
import {
  IconCheck,
  IconClock,
  IconBrandWhatsapp,
  IconAlertTriangle,
  IconCalendar,
  IconArrowRight,
  IconHome,
  IconPlus
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const requestId = searchParams.get('requestId')

  const [stats, setStats] = useState<{
    total_active: number
    pending: number
    in_progress: number
    upcoming_events: Array<{
      event_date: string
      event_name: string
      committee: { name: string }
    }>
  } | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/public/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-dashboard-bg py-12 px-4 flex items-center justify-center relative overflow-hidden">
      {/* Dark Mode Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-decom-primary-light/20 rounded-full blur-[120px] pointer-events-none opacity-0 dark:opacity-50"></div>

      <motion.div
        className="max-w-3xl w-full mx-auto space-y-8 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Success Header */}
        <motion.div variants={itemVariants} className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-decom-success to-emerald-600 shadow-2xl shadow-decom-success/30 ring-4 ring-white dark:ring-white/10 mb-2"
          >
            <IconCheck className="w-12 h-12 text-white" strokeWidth={3} />
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-4xl font-black text-[#16233B] dark:text-white tracking-tight">
              ¡Solicitud Recibida!
            </h1>
            <p className="text-lg text-dashboard-text-secondary dark:text-blue-100/70 max-w-lg mx-auto font-medium">
              Hemos registrado tu solicitud correctamente en el sistema.
            </p>
          </div>
        </motion.div>

        {/* Status Timeline Card */}
        <motion.div variants={itemVariants}>
          <div className="bg-dashboard-card dark:bg-slate-800/40 border border-dashboard-card-border dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-xl shadow-decom-primary/5 dark:shadow-2xl overflow-hidden relative backdrop-blur-xl">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-decom-primary-light/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <h3 className="text-lg font-black text-[#16233B] dark:text-white mb-6 flex items-center gap-2">
              <span className="bg-decom-primary-light/10 dark:bg-blue-500/20 p-2 rounded-lg text-decom-primary-light dark:text-blue-300">
                <IconClock size={20} />
              </span>
              Próximos Pasos
            </h3>

            <div className="space-y-0 relative">
              {/* Vertical Line - Perfectly Aligned */}
              <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-decom-status-ready via-decom-border dark:via-gray-700 to-decom-border/20 dark:to-gray-800/20 z-0"></div>

              {/* Step 1: Registered (Completed) */}
              <div className="relative flex gap-6 pb-8 group z-10">
                <div className="shrink-0 relative">
                  <div className="w-10 h-10 rounded-full bg-decom-status-ready border-4 border-white dark:border-slate-800 shadow-lg flex items-center justify-center relative z-10">
                    <IconCheck size={20} className="text-white" strokeWidth={3} />
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <div className="bg-white/50 dark:bg-slate-700/50 border border-decom-status-ready/20 dark:border-emerald-500/20 rounded-xl p-4 shadow-sm backdrop-blur-sm hover:bg-white dark:hover:bg-slate-700/80 hover:shadow-md transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h4 className="font-bold text-[#16233B] dark:text-white text-lg">Solicitud Registrada</h4>
                      <span className="self-start sm:self-auto text-[10px] font-black uppercase tracking-wider text-decom-status-ready bg-decom-status-ready/10 dark:bg-emerald-500/20 dark:text-emerald-400 px-2 py-1 rounded-md border border-decom-status-ready/20 dark:border-emerald-500/20">
                        Completado
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-dashboard-text-secondary dark:text-blue-200/70">
                      <span>Tu número de referencia es:</span>
                      <code className="bg-[#16233B]/5 dark:bg-[#0F172A] text-[#16233B] dark:text-blue-200 px-2 py-0.5 rounded-md font-mono font-bold border border-[#16233B]/10 dark:border-blue-500/30 select-all">
                        {requestId?.slice(0, 8) || '...'}
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Evaluation (Active/Pending) */}
              <div className="relative flex gap-6 pb-8 group z-10">
                <div className="shrink-0 relative">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-2 border-decom-status-pending shadow-lg shadow-decom-status-pending/20 flex items-center justify-center relative z-10">
                    <div className="w-3 h-3 rounded-full bg-decom-status-pending animate-pulse"></div>
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <div className="bg-white dark:bg-slate-800 border-l-4 border-l-decom-status-pending border-y border-r border-gray-100 dark:border-slate-700/50 rounded-r-xl rounded-l-md p-4 shadow-sm hover:shadow-md transition-all">
                    <h4 className="font-bold text-[#16233B] dark:text-white mb-1">Revisión del Equipo</h4>
                    <p className="text-sm text-dashboard-text-secondary dark:text-gray-400 leading-relaxed">
                      El equipo DECOM analizará tu requerimiento y verificará la disponibilidad en la agenda.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3: Contact (Future) */}
              <div className="relative flex gap-6 group z-10 opacity-60">
                <div className="shrink-0 relative">
                  <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center relative z-10">
                    <IconBrandWhatsapp size={20} className="text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <div className="p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                    <h4 className="font-bold text-dashboard-text-muted dark:text-gray-500 mb-1">Contacto</h4>
                    <p className="text-sm text-dashboard-text-muted dark:text-gray-600 leading-relaxed">
                      Te escribiremos al WhatsApp registrado para confirmar detalles o solicitar más información.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>

        {/* Workload Stats Card - Styled nicely */}
        <motion.div variants={itemVariants}>
          <div className="bg-gradient-to-br from-white to-orange-50/50 dark:from-slate-800/80 dark:to-slate-900/80 border border-orange-100 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-decom-secondary to-orange-600 rounded-lg text-white shadow-lg shadow-decom-secondary/20">
                <IconAlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#16233B] dark:text-white">Carga de Trabajo Actual</h3>
                <p className="text-xs font-bold text-decom-secondary uppercase tracking-wider">Estado del Sistema</p>
              </div>
            </div>

            <p className="text-sm text-dashboard-text-secondary dark:text-gray-400 mb-6 leading-relaxed max-w-2xl">
              Nuestra prioridad se basa en la fecha del evento. Tu solicitud ha entrado a la cola de procesamiento.
            </p>

            {statsLoading ? (
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-dashboard-card dark:bg-slate-800 animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : stats ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ y: -3 }}
                  className="bg-white dark:bg-slate-700/30 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col items-center justify-center text-center gap-1"
                >
                  <span className="text-3xl font-black text-[#16233B] dark:text-white">{stats.total_active}</span>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-dashboard-text-muted">Solicitudes Activas</span>
                </motion.div>

                <motion.div
                  whileHover={{ y: -3 }}
                  className="bg-white dark:bg-slate-700/30 p-4 rounded-2xl border border-orange-100 dark:border-white/5 shadow-sm flex flex-col items-center justify-center text-center gap-1 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-12 h-12 bg-orange-500/10 rounded-bl-full -mr-2 -mt-2"></div>
                  <span className="text-3xl font-black text-decom-status-pending">{stats.pending}</span>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-dashboard-text-muted">En Cola</span>
                </motion.div>

                <motion.div
                  whileHover={{ y: -3 }}
                  className="bg-white dark:bg-slate-700/30 p-4 rounded-2xl border border-blue-100 dark:border-white/5 shadow-sm flex flex-col items-center justify-center text-center gap-1"
                >
                  <span className="text-3xl font-black text-decom-status-planning">{stats.in_progress}</span>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-dashboard-text-muted">En Diseño</span>
                </motion.div>
              </div>
            ) : (
              <div className="text-center p-4 text-sm text-gray-500 dark:text-gray-400">No disponible</div>
            )}
          </div>
        </motion.div>

        {/* Upcoming Events Preview - Keeping it compact */}
        {stats && stats.upcoming_events?.length > 0 && (
          <motion.div variants={itemVariants} className="bg-dashboard-card dark:bg-slate-800/60 border border-dashboard-card-border dark:border-white/10 rounded-2xl p-6 overflow-hidden backdrop-blur-md">
            <h4 className="text-sm font-black uppercase tracking-widest text-dashboard-text-muted mb-4 flex items-center gap-2">
              <IconCalendar size={16} /> Próximos Eventos
            </h4>
            <div className="space-y-3">
              {stats.upcoming_events.slice(0, 3).map((event, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#16233B] dark:text-white">{event.event_name}</span>
                    <span className="text-xs text-dashboard-text-secondary dark:text-gray-400">{event.committee?.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#16233B] dark:text-blue-300 block">
                      {new Date(event.event_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <Link href="/calendar" className="w-full">
            <Button variant="outline" fullWidth className="h-14 border-2 rounded-2xl hover:bg-white dark:hover:bg-white/10 hover:border-decom-primary/30 dark:hover:border-white/30 dark:bg-transparent dark:text-white dark:border-white/20 group">
              <span className="flex items-center gap-2 font-bold text-[#16233B] dark:text-white">
                <IconCalendar className="text-dashboard-text-muted group-hover:text-[#16233B] dark:group-hover:text-white transition-colors" />
                Ver Calendario Público
              </span>
            </Button>
          </Link>
          <Link href="/new-request" className="w-full">
            <Button variant="primary" fullWidth className="h-14 bg-gradient-to-r from-decom-primary to-[#0f172a] dark:from-blue-600 dark:to-blue-800 hover:shadow-xl hover:shadow-decom-primary/20 rounded-2xl group">
              <span className="flex items-center gap-2 font-bold text-white">
                <IconPlus className="group-hover:rotate-90 transition-transform" />
                Crear Nueva Solicitud
              </span>
            </Button>
          </Link>
        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="text-center pt-8 pb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-dashboard-text-muted hover:text-decom-primary dark:hover:text-white transition-colors">
            <IconHome size={16} /> Volver al Inicio
          </Link>
        </motion.div>

      </motion.div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Layout title="Solicitud Confirmada">
      <Suspense fallback={
        <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-decom-primary dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-decom-primary dark:text-white font-bold animate-pulse">Cargando...</p>
          </div>
        </div>
      }>
        <ConfirmationContent />
      </Suspense>
    </Layout>
  )
}
