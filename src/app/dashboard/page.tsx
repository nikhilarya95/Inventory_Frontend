'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { dashboardAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
  Package,
  Users,
  ShoppingCart,
  FileText,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  totalBills: number;
  lowStockCount: number;
  totalRevenue: number;
  totalDue: number;
  totalPaid: number;
}

interface TopProduct {
  _id: string;
  brandName: string;
  productName: string;
  totalQuantity: number;
  totalValue: number;
}

interface PaymentStat {
  _id: string;
  customerName: string;
  shopName: string;
  paymentCount: number;
  totalPaid: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [lowPerforming, setLowPerforming] = useState<TopProduct[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, topRes, lowRes, paymentRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getTopSelling(),
        dashboardAPI.getLowPerforming(),
        dashboardAPI.getPaymentFrequency(),
      ]);

      setStats(statsRes.data);
      setTopProducts(topRes.data);
      setLowPerforming(lowRes.data);
      setPaymentStats(paymentRes.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    { title: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: 'from-blue-500 to-blue-400' },
    { title: 'Total Customers', value: stats?.totalCustomers || 0, icon: Users, color: 'from-green-500 to-green-400' },
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'from-purple-500 to-purple-400' },
    { title: 'Total Bills', value: stats?.totalBills || 0, icon: FileText, color: 'from-orange-500 to-orange-400' },
    { title: 'Low Stock Items', value: stats?.lowStockCount || 0, icon: AlertTriangle, color: 'from-red-500 to-red-400' },
    { title: 'Total Revenue', value: stats?.totalRevenue || 0, icon: TrendingUp, color: 'from-emerald-500 to-emerald-400' },
    { title: 'Total Due', value: stats?.totalDue || 0, icon: TrendingDown, color: 'from-amber-500 to-amber-400' },
    { title: 'Total Paid', value: stats?.totalPaid || 0, icon: DollarSign, color: 'from-cyan-500 to-cyan-400' },
  ];

  return (
    <DashboardLayout>
      <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card className="shadow-lg border-0 overflow-hidden">
                <CardContent className="flex items-center gap-4">
                  <div className={`p-4 rounded-lg bg-gradient-to-br ${stat.color} text-white`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {typeof stat.value === 'number' ? <CountUp end={stat.value} duration={1.5} /> : formatCurrency(stat.value)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              {topProducts.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProducts.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="productName" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="totalValue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">No sales data</div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Customer Payment Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              {paymentStats.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentStats.slice(0, 5)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="paymentCount"
                      nameKey="shopName"
                      label={({ shopName, percent }) => `${shopName} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {paymentStats.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">No payment data</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Low Performing Products</CardTitle>
            </CardHeader>
            <CardContent>
              {lowPerforming.length ? (
                <div className="space-y-3">
                  {lowPerforming.slice(0, 5).map((product) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{product.productName}</p>
                        <p className="text-sm text-gray-500">{product.brandName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatCurrency(product.totalValue)}</p>
                        <p className="text-sm text-gray-500">{product.totalQuantity} units sold</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400">No data available</div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Best Paying Customers</CardTitle>
            </CardHeader>
            <CardContent>
              {paymentStats.length ? (
                <div className="space-y-3">
                  {paymentStats.slice(0, 5).map((customer) => (
                    <motion.div
                      key={customer._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{customer.shopName}</p>
                        <p className="text-sm text-gray-500">{customer.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatCurrency(customer.totalPaid)}</p>
                        <p className="text-sm text-gray-500">{customer.paymentCount} payments</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400">No payment data</div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
