'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  IconArrowLeft
} from '@tabler/icons-react'
import RequestDetailModal from '@/app/components/Dashboard/RequestDetailModal'
import { DashboardLayout } from '@/app/components/Dashboard/DashboardLayout'

export default function RequestDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClose = () => {
    router.back()
  }

  const handleUpdate = () => {
    // Refresh logic if needed
  }

  if (!mounted) return null

  return (
    <DashboardLayout title="Detalle de Solicitud">
      <div className="max-w-5xl mx-auto py-6">
        {/* Header with back button */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-dashboard-text-secondary hover:text-decom-secondary transition-all mb-4 group font-black text-[10px] uppercase tracking-widest"
            >
              <IconArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Volver Atrás
            </button>
            <h1 className="text-3xl font-black text-dashboard-text-primary tracking-tight">
              Gestión de Solicitud
            </h1>
            <p className="text-dashboard-text-muted font-medium">
              Información detallada y seguimiento de estado
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-dashboard-card border border-dashboard-card-border px-4 py-2 rounded-xl shadow-sm">
              <span className="text-[10px] font-black text-dashboard-text-muted uppercase tracking-widest">ID de Solicitud</span>
              <p className="text-xs font-mono font-bold text-dashboard-text-primary px-1">{params.id}</p>
            </div>
          </div>
        </div>

        {/* Modal component in embedded mode */}
        <div className="relative">
          <RequestDetailModal
            requestId={params.id as string}
            onClose={handleClose}
            onUpdate={handleUpdate}
            embedded={true}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
