'use client';

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SelectProps {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  showSearch?: boolean;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ className, label, error, options, value, onChange, placeholder = 'Select an option', disabled, name, id, showSearch }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    // Merge forwarded ref and local ref
    useEffect(() => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(containerRef.current);
      } else {
        ref.current = containerRef.current;
      }
    }, [ref]);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
      if (onChange) {
        onChange({ target: { value: optionValue, name } });
      }
      setIsOpen(false);
      setSearchTerm('');
    };

    const filteredOptions = options.filter(opt =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className={cn("w-full relative", className)} ref={containerRef}>
        {label && (
          <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5 ml-0.5">
            {label}
          </label>
        )}
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={cn(
              'flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2 text-left text-gray-900 transition-all duration-200',
              'hover:border-blue-400 hover:ring-2 hover:ring-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500',
              'disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed',
              'shadow-sm',
              isOpen && 'ring-4 ring-blue-100 border-blue-500 shadow-md',
              error && 'border-red-500 focus:ring-red-100 focus:border-red-500'
            )}
          >
            <span className={cn("block truncate", !selectedOption && "text-gray-400")}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown
              size={18}
              strokeWidth={2.5}
              className={cn("text-gray-400 transition-transform duration-200", isOpen && "rotate-180 text-blue-500")}
            />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.1 }}
                className="absolute left-0 right-0 z-[100] mt-2 rounded-2xl border border-gray-100 bg-white shadow-2xl overflow-hidden min-w-full"
                style={{ top: '100%' }}
              >
                {(showSearch || options.length > 8) && (
                  <div className="p-2 border-b border-gray-50 bg-gray-50/50">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search..."
                        autoFocus
                        className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                )}
                <div className="max-h-[300px] overflow-y-auto py-2 custom-scrollbar">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSelect(option.value)}
                        className={cn(
                          "w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center justify-between",
                          value === option.value
                            ? "bg-blue-50 text-blue-700 font-semibold"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        <span className="truncate">{option.label}</span>
                        {value === option.value && (
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-400 text-sm">
                      No options found
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
