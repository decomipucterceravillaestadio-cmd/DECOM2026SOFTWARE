'use client'

import { cn } from '@/lib/utils'

interface FloatingActionButtonProps {
  onClick: () => void
  icon: React.ReactNode
  className?: string
}

export default function FloatingActionButton({
  onClick,
  icon,
  className
}: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-8 right-8 z-50 bg-gradient-to-br from-decom-secondary to-[#E88D1B] text-white rounded-2xl size-14 shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-decom-secondary/30",
        className
      )}
    >
      <div className="size-6">{icon}</div>
    </button>
  )
}