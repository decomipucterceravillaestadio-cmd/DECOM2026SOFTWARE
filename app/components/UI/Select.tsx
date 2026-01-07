import React, { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helpText?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helpText,
  options,
  placeholder,
  fullWidth = true,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  const selectClasses = [
    'decom-input',
    error && 'decom-input-error',
    fullWidth && 'w-full',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={selectId} className="decom-label">
          {label}
        </label>
      )}

      <select
        ref={ref}
        id={selectId}
        className={selectClasses}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="decom-error-text">{error}</p>
      )}

      {helpText && !error && (
        <p className="decom-help-text">{helpText}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';