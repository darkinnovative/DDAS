import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function Input({
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  const baseStyles = `w-full px-4 py-3 border rounded-lg text-sm transition-all duration-200 
    focus:outline-none focus:ring-2 focus:border-transparent bg-gray-50 focus:bg-white
    dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:bg-gray-600`;
  
  const errorStyles = error 
    ? 'border-red-300 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-400' 
    : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400';
  
  const iconPadding = icon 
    ? iconPosition === 'left' ? 'pl-12' : 'pr-12'
    : '';

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`${baseStyles} ${errorStyles} ${iconPadding} ${className}`}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Textarea({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  const baseStyles = `w-full px-4 py-3 border rounded-lg text-sm resize-none transition-all duration-200 
    focus:outline-none focus:ring-2 focus:border-transparent bg-gray-50 focus:bg-white
    dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:bg-gray-600`;
  
  const errorStyles = error 
    ? 'border-red-300 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-400' 
    : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400';

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`${baseStyles} ${errorStyles} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
}
