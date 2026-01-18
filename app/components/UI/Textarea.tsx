import React, { forwardRef, useId } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helpText,
  fullWidth = true,
  resize = 'vertical',
  className = '',
  id,
  ...props
}, ref) => {
  const generatedId = useId();
  const textareaId = id || `textarea-${generatedId}`;

  const textareaClasses = [
    'decom-input',
    'resize-' + resize,
    'min-h-[80px]',
    error && 'decom-input-error',
    fullWidth && 'w-full',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={textareaId} className="decom-label">
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        className={textareaClasses}
        {...props}
      />

      {error && (
        <p className="decom-error-text">{error}</p>
      )}

      {helpText && !error && (
        <p className="decom-help-text">{helpText}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';