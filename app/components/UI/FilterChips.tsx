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
    <div className="flex gap-3 overflow-x-auto hide-scrollbar pr-4 py-1">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={cn(
            "flex h-10 shrink-0 items-center justify-center px-5 rounded-xl shadow-sm transition-all active:scale-95 whitespace-nowrap border",
            activeFilter === filter.id
              ? "bg-decom-secondary text-white border-decom-secondary shadow-lg shadow-decom-secondary/20"
              : "bg-dashboard-card border-dashboard-card-border text-dashboard-text-secondary hover:border-decom-secondary/50 hover:text-decom-secondary"
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
              "ml-2.5 px-2 py-0.5 rounded-lg text-[10px] font-black",
              activeFilter === filter.id
                ? "bg-white/20 text-white"
                : "bg-dashboard-bg text-dashboard-text-primary"
            )}>
              {filter.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}