import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
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
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center gap-2';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-decom-primary to-decom-primary/80 text-white hover:from-decom-primary/90 hover:to-decom-primary/70 shadow-md hover:shadow-lg focus:ring-decom-primary',
    secondary: 'bg-gradient-to-r from-decom-secondary to-decom-secondary/90 text-decom-text-dark hover:from-decom-secondary/90 hover:to-decom-secondary/80 shadow-md hover:shadow-lg focus:ring-decom-secondary',
    outline: 'border-2 border-decom-primary text-decom-primary bg-transparent hover:bg-decom-primary hover:text-white focus:ring-decom-primary',
    ghost: 'text-decom-primary hover:bg-decom-primary/10 focus:ring-decom-primary'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm min-h-[2rem]',
    md: 'px-4 py-2 text-base min-h-[2.5rem]',
    lg: 'px-6 py-3 text-lg min-h-[3rem]'
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {!isLoading && leftIcon && leftIcon}
      {children}
      {!isLoading && rightIcon && rightIcon}
    </button>
  );
};
