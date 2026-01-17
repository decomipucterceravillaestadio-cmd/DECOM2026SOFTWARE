import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'pending' | 'planning' | 'design' | 'ready' | 'delivered' | 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = true,
  className = ''
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold border transition-colors duration-200';

  const variantStyles = {
    pending: 'bg-decom-status-pending/10 text-decom-status-pending border-decom-status-pending/30',
    planning: 'bg-decom-status-planning/10 text-decom-status-planning border-decom-status-planning/30',
    design: 'bg-decom-status-design/10 text-decom-status-design border-decom-status-design/30',
    ready: 'bg-decom-status-ready/10 text-decom-status-ready border-decom-status-ready/30',
    delivered: 'bg-decom-status-delivered/10 text-decom-status-delivered border-decom-status-delivered/30',
    success: 'bg-decom-success/10 text-decom-success border-decom-success/30',
    warning: 'bg-decom-warning/10 text-decom-warning border-decom-warning/30',
    error: 'bg-decom-error/10 text-decom-error border-decom-error/30',
    info: 'bg-decom-info/10 text-decom-info border-decom-info/30',
    default: 'bg-dashboard-text-secondary/10 text-dashboard-text-secondary border-dashboard-text-secondary/30'
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px] min-h-[1.25rem] uppercase tracking-wider',
    md: 'px-3 py-1 text-[11px] min-h-[1.5rem] uppercase tracking-widest',
    lg: 'px-4 py-1.5 text-xs min-h-[2rem] uppercase tracking-widest'
  };

  const roundedStyle = rounded ? 'rounded-full' : 'rounded-md';

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${roundedStyle} ${className}`}>
      {children}
    </span>
  );
};
