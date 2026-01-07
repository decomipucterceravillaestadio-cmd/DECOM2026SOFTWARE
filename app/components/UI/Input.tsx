import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helpText,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const inputClasses = [
    'decom-input',
    error && 'decom-input-error',
    leftIcon && 'pl-10',
    rightIcon && 'pr-10',
    fullWidth && 'w-full',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="decom-label">
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-decom-text-light">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-decom-text-light">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="decom-error-text">{error}</p>
      )}

      {helpText && !error && (
        <p className="decom-help-text">{helpText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';