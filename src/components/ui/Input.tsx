'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5 ml-0.5">
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            ref={ref}
            id={id}
            type={inputType}
            className={cn(
              'block w-full rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-all duration-200',
              'hover:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500',
              'disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed',
              'shadow-sm hover:shadow-md focus:shadow-lg',
              error && 'border-red-500 focus:ring-red-100 focus:border-red-500',
              isPassword && 'pr-11',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5 text-xs font-medium text-red-500 ml-1"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
