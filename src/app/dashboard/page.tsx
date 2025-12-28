'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
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
    { title: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: 'from-blue-500 to-blue-400', trend: '+2.5%', isUp: true },
    { title: 'Total Customers', value: stats?.totalCustomers || 0, icon: Users, color: 'from-green-500 to-green-400', trend: '+4.1%', isUp: true },
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'from-purple-500 to-purple-400', trend: '+12%', isUp: true },
    { title: 'Total Bills', value: stats?.totalBills || 0, icon: FileText, color: 'from-orange-500 to-orange-400', trend: '+8.4%', isUp: true },
    { title: 'Low Stock Items', value: stats?.lowStockCount || 0, icon: AlertTriangle, color: 'from-red-500 to-red-400', trend: '-5%', isUp: false },
    { title: 'Total Revenue', value: stats?.totalRevenue || 0, icon: TrendingUp, color: 'from-emerald-500 to-emerald-400', trend: '+18%', isUp: true },
    { title: 'Total Due', value: stats?.totalDue || 0, icon: TrendingDown, color: 'from-amber-500 to-amber-400', trend: '+2.1%', isUp: false },
    { title: 'Total Paid', value: stats?.totalPaid || 0, icon: DollarSign, color: 'from-cyan-500 to-cyan-400', trend: '+15%', isUp: true },
  ];

  return (
    <DashboardLayout moduleName="Dashboard">
      <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <Card className="shadow-lg border-0 overflow-hidden bg-white/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                {/* Decorative Background Gradient Element */}
                <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>

                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg shadow-blue-500/20`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`flex items-center text-[10px] font-bold uppercase tracking-wider ${stat.isUp ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'} px-2 py-0.5 rounded-full`}>
                        {stat.isUp ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {stat.trend}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-400 capitalize">{stat.title}</p>
                    <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                      {typeof stat.value === 'number' ?
                        <CountUp end={stat.value} duration={1.5} separator="," /> :
                        formatCurrency(stat.value)
                      }
                    </h3>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2">
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.floor(Math.random() * 41) + 40}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full bg-gradient-to-r ${stat.color}`}
                      ></motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-xl border-0 bg-white/50 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-gray-50 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <BarChart className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg">Top Selling Products</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {topProducts.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProducts.slice(0, 5)}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="productName" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                    />
                    <Bar dataKey="totalValue" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-2">
                  <ShoppingCart className="h-8 w-8 opacity-20" />
                  <p>No sales data yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/50 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-gray-50 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                  <PieChart className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg">Payment Distribution</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {paymentStats.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentStats.slice(0, 5)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="paymentCount"
                      nameKey="shopName"
                    >
                      {paymentStats.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-2">
                  <DollarSign className="h-8 w-8 opacity-20" />
                  <p>No payment data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-xl border-0 bg-white/50 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-gray-50 bg-gray-50/50 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Low Performing Products</CardTitle>
              <Badge variant="warning">Alert</Badge>
            </CardHeader>
            <CardContent className="p-6">
              {lowPerforming.length ? (
                <div className="space-y-4">
                  {lowPerforming.slice(0, 5).map((product, idx) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group flex items-center justify-between p-4 bg-white rounded-xl border border-gray-50 shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-default"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{product.productName}</p>
                          <p className="text-xs text-gray-500">{product.brandName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{formatCurrency(product.totalValue)}</p>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-mono">{product.totalQuantity} units sold</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400 italic">No low performance data</div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/50 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-gray-50 bg-gray-50/50 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Top Performing Customers</CardTitle>
              <Badge variant="success">Premium</Badge>
            </CardHeader>
            <CardContent className="p-6">
              {paymentStats.length ? (
                <div className="space-y-4">
                  {paymentStats.slice(0, 5).map((customer, idx) => (
                    <motion.div
                      key={customer._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group flex items-center justify-between p-4 bg-white rounded-xl border border-gray-50 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all cursor-default"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                          {customer.shopName?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{customer.shopName}</p>
                          <p className="text-xs text-gray-500">{customer.customerName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-emerald-600">{formatCurrency(customer.totalPaid)}</p>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{customer.paymentCount} TRANSACTIONS</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400 italic">Gathering transaction data...</div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
