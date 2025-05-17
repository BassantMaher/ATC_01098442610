import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', fullWidth = false, ...props }, ref) => {
    const inputClasses = [
      'block rounded-md shadow-sm border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100',
      'focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400',
      'bg-white dark:bg-gray-700',
      'disabled:opacity-70 disabled:cursor-not-allowed',
      error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '',
      fullWidth ? 'w-full' : '',
      className,
    ].join(' ');

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label 
            htmlFor={props.id} 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;