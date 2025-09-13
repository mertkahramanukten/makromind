'use client';

import { ReactNode } from 'react';

interface FieldProps {
  label: string;
  children: ReactNode;
  required?: boolean;
  error?: string;
}

interface InputProps {
  type?: 'text' | 'number' | 'email';
  placeholder?: string;
  value: string | number;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
}

export function Field({ label, children, required, error }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-pink-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function Input({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  min, 
  max, 
  step,
  className = '' 
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value === '' || value === null || value === undefined ? '' : String(value)}
      onChange={(e) => onChange(e.target.value)}
      min={min}
      max={max}
      step={step}
      className={`w-full px-4 py-3 rounded-xl border border-pink-200 bg-pink-50/50 
        focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400
        transition-colors duration-200 placeholder-gray-400
        ${className}`}
    />
  );
}

export function Select({ 
  value, 
  onChange, 
  options, 
  placeholder,
  className = '' 
}: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-3 rounded-xl border border-pink-200 bg-pink-50/50 
        focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400
        transition-colors duration-200
        ${className}`}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function Button({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '' 
}: ButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 focus:ring-pink-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 focus:ring-gray-500'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {children}
    </button>
  );
}
