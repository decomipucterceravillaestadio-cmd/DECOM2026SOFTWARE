import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
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

  // Colores IPUC corporativos
  const variantStyles = {
    // Primario: Navy azul corporativo
    primary: 'bg-gradient-to-r from-[#15539C] to-[#16233B] text-white hover:shadow-lg active:scale-95 focus:ring-[#15539C]/20',
    // Secundario: Naranja corporativo
    secondary: 'bg-gradient-to-r from-[#F49E2C] to-[#E88D1B] text-white hover:shadow-lg active:scale-95 focus:ring-[#F49E2C]/20',
    // Outline: Borde azul corporativo
    outline: 'border-2 border-[#15539C] text-[#15539C] bg-transparent hover:bg-[#15539C] hover:text-white active:scale-95 focus:ring-[#15539C]/20',
    // Ghost: Sin fondo
    ghost: 'text-[#15539C] hover:bg-[#15539C]/10 active:bg-[#15539C]/20 focus:ring-[#15539C]/20',
    // Accent: Naranja para acciones importantes
    accent: 'bg-gradient-to-r from-[#F49E2C] to-[#E88D1B] text-white hover:shadow-lg active:scale-95 focus:ring-[#F49E2C]/20'
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
