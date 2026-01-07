import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  interactive?: boolean;
  bordered?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  interactive = false,
  bordered = true,
  shadow = 'sm',
  rounded = 'lg'
}) => {
  const baseStyles = 'bg-white transition-all duration-200';

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  const shadowStyles = {
    none: '',
    sm: 'shadow-card',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  const roundedStyles = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  };

  const borderStyle = bordered ? 'border border-decom-border' : '';
  const hoverStyles = hover || interactive ? 'hover:shadow-card-hover cursor-pointer' : '';

  return (
    <div className={`${baseStyles} ${paddingStyles[padding]} ${shadowStyles[shadow]} ${roundedStyles[rounded]} ${borderStyle} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};
