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
        "fixed bottom-6 right-6 z-50 bg-gradient-to-br from-[#15539C] to-[#16233B] text-white rounded-full size-14 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95",
        className
      )}
    >
      {icon}
    </button>
  )
}