'use client'

import { useRouter, useParams } from 'next/navigation'
import {
  IconArrowLeft
} from '@tabler/icons-react'
import RequestDetailModal from '@/app/components/Dashboard/RequestDetailModal'
import { DashboardLayout } from '@/app/components/Dashboard/DashboardLayout'

export default function RequestDetailPage() {
  const router = useRouter()
  const params = useParams()

  const handleClose = () => {
    router.back()
  }

  const handleUpdate = () => {
    // Opcional: podrías recargar datos si es necesario
  }

  return (
    <DashboardLayout title="Detalle de Solicitud">
      <div className="max-w-7xl mx-auto">
        {/* Header con botón de regreso */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-dashboard-text-secondary hover:text-[#F49E2C] transition-colors mb-4 group"
          >
            <IconArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Volver</span>
          </button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-dashboard-text-primary tracking-tight">
                Gestión de Solicitud
              </h1>
              <p className="text-dashboard-text-muted font-medium">
                Información completa y control de estados
              </p>
            </div>
            <div className="text-[10px] font-black text-dashboard-text-muted uppercase tracking-[0.2em] bg-dashboard-card border border-dashboard-card-border px-4 py-2 rounded-full shadow-sm">
              ID: {params.id}
            </div>
          </div>
        </div>

        {/* Modal de detalle - modo embebido sin overlay */}
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
