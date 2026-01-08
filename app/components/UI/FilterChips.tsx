'use client'

import { cn } from '@/lib/utils'

interface Filter {
  id: string
  label: string
  count: number
}

interface FilterChipsProps {
  filters: Filter[]
  activeFilter: string
  onFilterChange: (filterId: string) => void
}

export default function FilterChips({ filters, activeFilter, onFilterChange }: FilterChipsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto hide-scrollbar pr-4">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={cn(
            "flex h-9 shrink-0 items-center justify-center px-4 rounded-full shadow-sm transition-all active:scale-95 whitespace-nowrap",
            activeFilter === filter.id
              ? "bg-[#F49E2C] text-white"
              : "bg-white dark:bg-neutral-800 border border-[#15539C]/30 text-[#15539C] dark:text-[#15539C]"
          )}
        >
          <span className={cn(
            "text-sm font-medium",
            activeFilter === filter.id ? "font-bold" : "font-medium"
          )}>
            {filter.label}
          </span>
          {filter.count > 0 && (
            <span className={cn(
              "ml-2 px-2 py-0.5 rounded-full text-xs font-bold",
              activeFilter === filter.id
                ? "bg-white/20 text-white"
                : "bg-[#15539C]/10 text-[#15539C]"
            )}>
              {filter.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}