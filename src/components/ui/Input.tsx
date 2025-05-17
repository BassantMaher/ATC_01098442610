import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', fullWidth = false, leftIcon, ...props }, ref) => {
    const inputClasses = [
      'block rounded-lg',
      'px-4 py-2',
      leftIcon ? 'pl-10' : '',
      'border border-gray-300 dark:border-gray-600',
      'text-gray-900 dark:text-gray-100',
      'focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400',
      'bg-white dark:bg-gray-700',
      'disabled:opacity-70 disabled:cursor-not-allowed',
      'transition-all duration-200',
      'shadow-sm hover:shadow-md dark:shadow-none dark:hover:shadow-none',
      error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '',
      fullWidth ? 'w-full' : '',
      className,
    ].join(' ');

    return (
      <div className={fullWidth ? 'w-full relative' : 'relative'}>
        {label && (
          <label 
            htmlFor={props.id} 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative w-full">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={inputClasses}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

export default Input;