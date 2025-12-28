'use client';

import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onMenuClick?: () => void;
  moduleName?: string;
}

export function Header({ onMenuClick, moduleName }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Mobile menu button and module name */}
        <div className="flex items-center flex-1 gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Module Name */}
          {moduleName && (
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{moduleName}</h1>
          )}

          {/* Search bar */}
          {/* <div className="relative flex-1 max-w-md lg:max-w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            />
          </div> */}
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User info */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </span>
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">
              {user?.firstName} {user?.lastName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
