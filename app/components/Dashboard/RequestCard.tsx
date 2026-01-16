'use client'

import { format, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import {
  IconVideo,
  IconCamera,
  IconBrush,
  IconDeviceSpeaker,
  IconBroadcast,
  IconShare,
  IconUsers,
  IconFriends,
  IconMicrophone,
  IconBriefcase,
  IconBook,
  IconVideoPlus,
  IconCalendar,
  IconChevronRight,
  IconClock
} from '@tabler/icons-react'

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
      color: 'bg-[#F49E2C]/10 text-[#F49E2C] border-[#F49E2C]/20',
      dotColor: 'bg-[#F49E2C]',
      barColor: 'bg-[#F49E2C]'
    },
    in_progress: {
      label: 'En proceso',
      color: 'bg-[#15539C]/10 text-[#15539C] border-[#15539C]/20',
      dotColor: 'bg-[#15539C]',
      barColor: 'bg-[#15539C]'
    },
    approved: {
      label: 'Aprobado',
      color: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
      dotColor: 'bg-[#10B981]',
      barColor: 'bg-[#10B981]'
    },
    completed: {
      label: 'Completado',
      color: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
      dotColor: 'bg-[#10B981]',
      barColor: 'bg-[#10B981]'
    },
    rejected: {
      label: 'Rechazado',
      color: 'bg-red-500/10 text-red-500 border-red-500/20',
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
      color: 'bg-red-500/20 text-red-400 border-red-500/30'
    }
  } else if (score >= 5) {
    return {
      label: 'Media',
      color: 'bg-[#15539C]/20 text-[#15539C] border-[#15539C]/30'
    }
  } else {
    return {
      label: 'Baja',
      color: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30'
    }
  }
}

const getMaterialIcon = (type: string) => {
  const icons = {
    'video': IconVideo,
    'photo': IconCamera,
    'design': IconBrush,
    'audio': IconDeviceSpeaker,
    'streaming': IconBroadcast,
    'social': IconShare
  }

  const key = type.toLowerCase()
  const Icon = icons[key as keyof typeof icons] || IconBrush
  return <Icon className="w-3.5 h-3.5" />
}

const getCommitteeIcon = (name: string) => {
  const icons = {
    'damas': IconFriends,
    'jóvenes': IconUsers,
    'alabanza': IconMicrophone,
    'administrativo': IconBriefcase,
    'dominical': IconBook,
    'multimedia': IconVideoPlus
  }

  const key = name.toLowerCase().split(' ')[1] || name.toLowerCase()
  const Icon = icons[key as keyof typeof icons] || IconUsers
  return <Icon className="w-[18px] h-[18px]" />
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
      className="group relative flex flex-col bg-white/5 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden transition-all hover:scale-[1.02] hover:bg-white/10 cursor-pointer border border-white/10"
    >
      {/* Barra lateral de color según estado */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-[4px]", statusConfig.barColor)} />

      <div className="p-5 pl-7">
        {/* Header con comité y prioridad */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-[#15539C]/20 flex items-center justify-center text-[#F49E2C] border border-[#F49E2C]/10 shadow-inner">
              {getCommitteeIcon(request.committee.name)}
            </div>
            <span className="text-white font-black text-[10px] uppercase tracking-widest leading-none">
              {request.committee.name}
            </span>
          </div>

          {/* Badge de prioridad */}
          {priorityConfig && (
            <span className={cn(
              "text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-[0.15em]",
              priorityConfig.color
            )}>
              {priorityConfig.label}
            </span>
          )}
        </div>

        {/* Título del evento */}
        <div className="mb-5 pr-2">
          <h3 className="text-white text-base md:text-lg font-bold leading-tight mb-3 line-clamp-2 group-hover:text-[#F49E2C] transition-colors">
            {request.event_name}
          </h3>

          {/* Fecha y días restantes */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-white/50 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
              <IconCalendar className="w-3.5 h-3.5 text-[#F49E2C]" />
              <span className="text-[11px] font-bold">
                {format(eventDate, 'd MMM yyyy', { locale: es })}
              </span>
            </div>

            <div className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider",
              daysDiff <= 3 && daysDiff >= 0
                ? "bg-[#F49E2C]/20 text-[#F49E2C] border-[#F49E2C]/30 shadow-[0_0_10px_rgba(244,158,44,0.1)]"
                : "bg-white/5 text-white/40 border-white/5"
            )}>
              <IconClock className="w-3.5 h-3.5" />
              <span>{getDaysText()}</span>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px w-full bg-white/5 mb-4" />

        {/* Footer con estado, tipo de material y acción */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Badge de estado */}
            <span className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
              statusConfig.color
            )}>
              <span className={cn("size-1.5 rounded-full animate-pulse", statusConfig.dotColor)} />
              {statusConfig.label}
            </span>

            {/* Icono de tipo de material */}
            <div
              className="size-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 group-hover:text-[#F49E2C] transition-colors shadow-inner"
              title={`Tipo: ${request.material_type}`}
            >
              {getMaterialIcon(request.material_type)}
            </div>
          </div>

          {/* Botón ver detalle */}
          <div className="flex items-center gap-1 text-[#F49E2C] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
            <span className="text-[10px] font-black uppercase tracking-widest">DETALLE</span>
            <IconChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </article>
  )
}