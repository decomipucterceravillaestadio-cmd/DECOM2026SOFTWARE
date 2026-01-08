'use client'

import { format, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'

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

interface RequestCardProps {
  request: Request
  onClick: () => void
}

const getStatusConfig = (status: string) => {
  const configs = {
    pending: {
      label: 'Pendiente',
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      dotColor: 'bg-yellow-500',
      barColor: 'bg-yellow-500'
    },
    in_progress: {
      label: 'En proceso',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      dotColor: 'bg-blue-500',
      barColor: 'bg-blue-500'
    },
    approved: {
      label: 'Aprobado',
      color: 'bg-green-50 text-green-700 border-green-200',
      dotColor: 'bg-green-500',
      barColor: 'bg-green-500'
    },
    completed: {
      label: 'Completado',
      color: 'bg-green-50 text-green-700 border-green-200',
      dotColor: 'bg-green-500',
      barColor: 'bg-green-500'
    },
    rejected: {
      label: 'Rechazado',
      color: 'bg-red-50 text-red-700 border-red-200',
      dotColor: 'bg-red-500',
      barColor: 'bg-red-500'
    }
  }
  return configs[status as keyof typeof configs] || configs.pending
}

const getPriorityConfig = (score: number | null) => {
  if (!score) return null

  if (score >= 8) {
    return {
      label: 'Alta',
      color: 'bg-red-50 text-red-600 border-red-100'
    }
  } else if (score >= 5) {
    return {
      label: 'Media',
      color: 'bg-blue-50 text-blue-600 border-blue-100'
    }
  } else {
    return {
      label: 'Baja',
      color: 'bg-green-50 text-green-600 border-green-100'
    }
  }
}

const getMaterialIcon = (type: string) => {
  const icons = {
    'video': 'videocam',
    'photo': 'photo_camera',
    'design': 'brush',
    'audio': 'speaker',
    'streaming': 'stream',
    'social': 'share'
  }

  const key = type.toLowerCase()
  return icons[key as keyof typeof icons] || 'design_services'
}

const getCommitteeIcon = (name: string) => {
  const icons = {
    'damas': 'diversity_1',
    'jóvenes': 'hiking',
    'alabanza': 'mic_external_on',
    'administrativo': 'admin_panel_settings',
    'dominical': 'menu_book',
    'multimedia': 'video_camera_front'
  }

  const key = name.toLowerCase().split(' ')[1] || name.toLowerCase()
  return icons[key as keyof typeof icons] || 'groups'
}

export default function RequestCard({ request, onClick }: RequestCardProps) {
  const statusConfig = getStatusConfig(request.status)
  const priorityConfig = getPriorityConfig(request.priority_score)
  const eventDate = new Date(request.event_date)
  const today = new Date()
  const daysDiff = differenceInDays(eventDate, today)

  const getDaysText = () => {
    if (daysDiff < 0) return 'Vencido'
    if (daysDiff === 0) return 'Hoy'
    if (daysDiff === 1) return 'Mañana'
    return `${daysDiff} días`
  }

  return (
    <article
      onClick={onClick}
      className="group relative flex flex-col bg-white dark:bg-neutral-900 rounded-xl shadow-sm overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer border border-gray-100 dark:border-neutral-800"
    >
      {/* Barra lateral de color según estado */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-[5px]", statusConfig.barColor)} />

      <div className="p-4 pl-5">
        {/* Header con comité y prioridad */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-[#15539C]/10 flex items-center justify-center text-[#15539C]">
              <span className="material-symbols-outlined text-[18px]">
                {getCommitteeIcon(request.committee.name)}
              </span>
            </div>
            <span className="text-neutral-900 dark:text-neutral-100 font-semibold text-sm">
              {request.committee.name}
            </span>
          </div>

          {/* Badge de prioridad */}
          {priorityConfig && (
            <span className={cn(
              "text-[10px] font-bold px-2 py-1 rounded-full border uppercase tracking-wide",
              priorityConfig.color
            )}>
              {priorityConfig.label}
            </span>
          )}
        </div>

        {/* Título del evento */}
        <div className="mb-4">
          <h3 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold leading-tight mb-2">
            {request.event_name}
          </h3>

          {/* Fecha y días restantes */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-gray-500 bg-gray-50 dark:bg-neutral-800 px-2 py-1 rounded-lg">
              <span className="material-symbols-outlined text-[#F49E2C] text-[18px]">calendar_month</span>
              <span className="text-xs font-medium pt-0.5">
                {format(eventDate, 'd MMM yyyy', { locale: es })}
              </span>
            </div>

            <span className={cn(
              "text-[10px] font-bold px-2 py-1 rounded-full shadow-sm",
              daysDiff <= 3 && daysDiff >= 0
                ? "bg-[#F49E2C] text-white"
                : "bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300"
            )}>
              {getDaysText()}
            </span>
          </div>
        </div>

        {/* Footer con estado, tipo de material y acción */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-neutral-700">
          <div className="flex items-center gap-2">
            {/* Badge de estado */}
            <span className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border",
              statusConfig.color
            )}>
              <span className={cn("size-1.5 rounded-full animate-pulse", statusConfig.dotColor)} />
              {statusConfig.label}
            </span>

            {/* Icono de tipo de material */}
            <div
              className="size-6 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center"
              title={`Tipo: ${request.material_type}`}
            >
              <span className="material-symbols-outlined text-[#15539C] text-[14px]">
                {getMaterialIcon(request.material_type)}
              </span>
            </div>
          </div>

          {/* Botón ver detalle */}
          <button className="flex items-center gap-1 text-[#15539C] text-xs font-bold hover:underline decoration-[#15539C] decoration-2 underline-offset-4 transition-all">
            Ver detalle
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
      </div>
    </article>
  )
}