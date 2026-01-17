import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  children,
  ...props
}) => {
  const baseStyles = 'font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dashboard-bg inline-flex items-center justify-center gap-2 active:scale-[0.98]';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-decom-primary-light to-decom-primary text-white shadow-md hover:shadow-xl hover:shadow-decom-primary/20 focus:ring-decom-primary/30',
    secondary: 'bg-gradient-to-r from-decom-secondary to-[#E88D1B] text-white shadow-md hover:shadow-xl hover:shadow-decom-secondary/20 focus:ring-decom-secondary/30',
    outline: 'border-2 border-decom-primary-light text-decom-primary-light bg-transparent hover:bg-decom-primary-light hover:text-white focus:ring-decom-primary-light/30',
    ghost: 'text-decom-primary-light hover:bg-decom-primary-light/10 focus:ring-decom-primary-light/20',
    accent: 'bg-gradient-to-r from-decom-secondary to-[#E88D1B] text-white shadow-md hover:shadow-xl hover:shadow-decom-secondary/20 focus:ring-decom-secondary/30',
    danger: 'bg-gradient-to-r from-decom-error to-[#C62828] text-white shadow-md hover:shadow-xl hover:shadow-decom-error/20 focus:ring-decom-error/30',
    success: 'bg-gradient-to-r from-decom-success to-[#2E7D32] text-white shadow-md hover:shadow-xl hover:shadow-decom-success/20 focus:ring-decom-success/30'
  };

  const sizeStyles = {
    sm: 'px-3 py-2 text-xs min-h-[2.25rem]',
    md: 'px-5 py-2.5 text-sm min-h-[2.75rem]',
    lg: 'px-7 py-3.5 text-base min-h-[3.25rem]'
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], fullWidth && 'w-full', className)}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span className="truncate">{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
