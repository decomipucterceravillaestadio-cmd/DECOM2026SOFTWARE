'use client'

import React, { forwardRef } from 'react'

interface ToggleProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ checked = false, onChange, disabled = false, className = '' }, ref) => {
    return (
      <label className={`relative inline-flex items-center cursor-pointer transition-opacity duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-dashboard-card-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-decom-secondary transition-colors duration-200"></div>
      </label>
    )
  }
)

Toggle.displayName = 'Toggle'

export default Toggle