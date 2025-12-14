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

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, hasRole } = useAuth();

  const filteredNavigation = navigation.filter(item => hasRole(item.roles));

  return (
    <div className="flex flex-col w-64 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-center h-16 bg-gray-800">
        <h1 className="text-xl font-bold text-white">Inventory</h1>
      </div>
      
      <div className="flex-1 px-4 py-6 space-y-1">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="px-4 py-4 border-t border-gray-700">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-white font-medium">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-400">{user?.roles?.join(', ')}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
