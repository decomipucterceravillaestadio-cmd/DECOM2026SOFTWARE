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
  const baseStyles = 'inline-flex items-center justify-center font-semibold border';

  const variantStyles = {
    pending: 'bg-decom-status-pending/10 text-decom-status-pending border-decom-status-pending/30',
    planning: 'bg-decom-status-planning/10 text-decom-status-planning border-decom-status-planning/30',
    design: 'bg-decom-status-design/10 text-decom-status-design border-decom-status-design/30',
    ready: 'bg-decom-status-ready/10 text-decom-status-ready border-decom-status-ready/30',
    delivered: 'bg-decom-status-delivered/10 text-decom-status-delivered border-decom-status-delivered/30',
    success: 'bg-green-100 text-green-800 border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
    default: 'bg-gray-100 text-gray-700 border-gray-300'
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs min-h-[1.25rem]',
    md: 'px-3 py-1 text-sm min-h-[1.5rem]',
    lg: 'px-4 py-1.5 text-base min-h-[2rem]'
  };

  const roundedStyle = rounded ? 'rounded-full' : 'rounded-md';

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${roundedStyle} ${className}`}>
      {children}
    </span>
  );
};
