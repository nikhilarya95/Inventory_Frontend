'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5 ml-0.5">
            {label}
          </label>
        )}
        <div className="relative group">
          <select
            ref={ref}
            id={id}
            className={cn(
              'block w-full rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm px-4 py-2.5 text-gray-900 appearance-none transition-all duration-200',
              'hover:border-blue-400 hover:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500',
              'disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed',
              'shadow-sm hover:shadow-md focus:shadow-lg',
              error && 'border-red-500 focus:ring-red-100 focus:border-red-500',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-white text-gray-900 py-2">
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors duration-200">
            <ChevronDown size={18} strokeWidth={2.5} />
          </div>
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

Select.displayName = 'Select';
