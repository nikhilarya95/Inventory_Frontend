'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Boxes,
  Users,
  UserCircle,
  ShoppingCart,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['Admin', 'Manager', 'Sales Man'] },
  { name: 'Products', href: '/products', icon: Package, roles: ['Admin', 'Manager', 'Sales Man'] },
  { name: 'Stock', href: '/stock', icon: Boxes, roles: ['Admin', 'Manager', 'Sales Man'] },
  { name: 'Customers', href: '/customers', icon: UserCircle, roles: ['Admin', 'Manager', 'Sales Man'] },
  { name: 'Orders', href: '/orders', icon: ShoppingCart, roles: ['Admin', 'Manager', 'Sales Man'] },
  { name: 'Bills', href: '/bills', icon: FileText, roles: ['Admin', 'Manager', 'Sales Man'] },
  { name: 'Payments', href: '/payments', icon: CreditCard, roles: ['Admin', 'Manager', 'Sales Man'] },
  { name: 'Users', href: '/users', icon: Users, roles: ['Admin'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['Admin', 'Manager', 'Sales Man'] },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout, hasRole } = useAuth();

  const filteredNavigation = navigation.filter(item => hasRole(item.roles));

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="flex flex-col w-64 bg-gray-900 min-h-screen">
      {/* Header with close button for mobile */}
      <div className="flex items-center justify-between h-16 bg-gray-800 px-4">
        <h1 className="text-xl font-bold text-white">Inventory</h1>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {/* Navigation */}
      <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleLinkClick}
              className={cn(
                'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* User info and logout */}
      <div className="px-3 py-4 border-t border-gray-700">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </span>
            </div>
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-400 truncate">{user?.roles?.join(', ')}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
          <span className="truncate">Logout</span>
        </button>
      </div>
    </div>
  );
}
