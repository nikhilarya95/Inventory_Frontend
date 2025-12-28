'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { stockAPI, productsAPI } from '@/lib/api';
import { Stock, Product } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit, Trash2, AlertTriangle, Search, Filter, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Pagination } from '@/components/ui/Pagination';
import { useMemo } from 'react';

interface StockForm {
  product: string;
  location: string;
  quantity: number;
  expiryDate: string;
  manufactureDate: string;
  weight: number;
  weightUnit: string;
  mrp: number;
  discount: number;
  batchNumber?: string;
}

export default function StockPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { hasRole } = useAuth();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<StockForm>();
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [stockRes, productRes] = await Promise.all([
        stockAPI.getAll(),
        productsAPI.getAll(),
      ]);
      setStocks(stockRes.data);
      setProducts(productRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (stock?: Stock) => {
    if (stock) {
      setEditingStock(stock);
      reset({
        product: stock.product._id,
        location: stock.location,
        quantity: stock.quantity,
        expiryDate: stock.expiryDate.split('T')[0],
        manufactureDate: stock.manufactureDate.split('T')[0],
        weight: stock.weight,
        weightUnit: stock.weightUnit,
        mrp: stock.mrp,
        discount: stock.discount || 0,
        batchNumber: stock.batchNumber,
      });
    } else {
      setEditingStock(null);
      reset({});
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStock(null);
    setStatusMessage(null);
    reset();
  };

  const onSubmit = async (data: StockForm) => {
    try {
      setIsSubmitting(true);
      setStatusMessage(null);
      if (editingStock) {
        await stockAPI.update(editingStock._id, data);
      } else {
        await stockAPI.create(data);
      }
      await loadData();
      setStatusMessage({ type: 'success', text: `Stock ${editingStock ? 'updated' : 'created'} successfully!` });
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error: any) {
      setStatusMessage({ type: 'error', text: error.response?.data?.message || 'Error saving stock' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this stock entry?')) {
      try {
        await stockAPI.delete(id);
        await loadData();
      } catch (error: any) {
        setStatusMessage({ type: 'error', text: error.response?.data?.message || 'Error deleting stock' });
      }
    }
  };

  const canEdit = hasRole(['Admin', 'Manager']);

  const filteredStock = useMemo(() => {
    return stocks.filter(stock =>
      (filterStatus === 'All' ||
        (filterStatus === 'Low Stock' && stock.quantity < 3) ||
        (filterStatus === 'Medium' && stock.quantity >= 3 && stock.quantity < 10) ||
        (filterStatus === 'In Stock' && stock.quantity >= 10)
      ) &&
      (stock.product?.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.product?.brandName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.location?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [stocks, filterStatus, searchQuery]);

  const paginatedStock = useMemo(() => {
    return filteredStock.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredStock, currentPage, itemsPerPage]);

  return (
    <DashboardLayout moduleName="Stock Inventory">
      <div className="space-y-6 w-full animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search stock..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: 'All', label: 'All Statuses' },
                { value: 'In Stock', label: 'In Stock' },
                { value: 'Low Stock', label: 'Low Stock' },
                { value: 'Medium Status', label: 'Medium Status' }
              ]}
              className="h-10"
            />
          </div>
          {canEdit && (
            <Button
              onClick={() => openModal()}
              className="h-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Stock Entry
            </Button>
          )}
        </div>

        <Card className="shadow-md border border-gray-100 overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">Product</TableHead>
                      <TableHead className="font-semibold text-gray-700">Location</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-center">Quantity</TableHead>
                      <TableHead className="font-semibold text-gray-700">Weight</TableHead>
                      <TableHead className="font-semibold text-gray-700">MRP</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-center">Status</TableHead>
                      {canEdit && <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedStock.map((stock) => (
                      <TableRow key={stock._id} className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 animate-slide-up">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{stock.product?.productName}</span>
                            <span className="text-xs text-gray-500">{stock.product?.brandName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 font-medium">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            {stock.location}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center">
                            <span className={`font-bold text-lg ${stock.quantity < 5 ? 'text-red-600' : 'text-gray-900'}`}>
                              {stock.quantity}
                            </span>
                            {stock.quantity < 3 && (
                              <div className="flex items-center gap-1 text-red-500 animate-pulse">
                                <AlertTriangle className="h-3 w-3" />
                                <span className="text-[10px] uppercase font-bold tracking-wider">Critical</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">{stock.weight} {stock.weightUnit}</TableCell>
                        <TableCell className="text-gray-900 font-semibold">{formatCurrency(stock.mrp)}</TableCell>
                        <TableCell className="text-center">
                          {stock.quantity < 3 ? (
                            <Badge variant="danger" className="animate-pulse shadow-sm">Low Stock</Badge>
                          ) : stock.quantity < 10 ? (
                            <Badge variant="warning" className="shadow-sm">Medium</Badge>
                          ) : (
                            <Badge variant="success" className="shadow-sm">In Stock</Badge>
                          )}
                        </TableCell>
                        {canEdit && (
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openModal(stock)}
                                className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(stock._id)}
                                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                    {filteredStock.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={canEdit ? 7 : 6} className="text-center p-8">
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-gray-100 rounded-full">
                              <Search className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">No stock entries found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {!loading && filteredStock.length > 0 && (
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredStock.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
              onItemsPerPageChange={(items) => {
                setItemsPerPage(items);
                setCurrentPage(1);
              }}
              type="table"
            />
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingStock ? 'Edit Stock' : 'Add Stock'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {statusMessage && (
            <div className={`p-4 rounded-xl text-sm font-medium border animate-fade-in ${statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
              {statusMessage.text}
            </div>
          )}
          <Select
            label="Product"
            {...register('product', { required: 'Product is required' })}
            options={products.map(p => ({ value: p._id, label: `${p.brandName} - ${p.productName}` }))}
            error={errors.product?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Location" {...register('location', { required: 'Location is required' })} error={errors.location?.message} />
            <Input label="Quantity" type="number" {...register('quantity', { required: 'Quantity is required', valueAsNumber: true })} error={errors.quantity?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Weight" type="number" step="0.01" {...register('weight', { required: 'Weight is required', valueAsNumber: true })} error={errors.weight?.message} />
            <Select label="Weight Unit" {...register('weightUnit')} options={[{ value: 'g', label: 'Grams' }, { value: 'kg', label: 'Kilograms' }, { value: 'ml', label: 'Milliliters' }, { value: 'l', label: 'Liters' }]} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="MRP" type="number" step="0.01" {...register('mrp', { required: 'MRP is required', valueAsNumber: true })} error={errors.mrp?.message} />
            <Input label="Discount (%)" type="number" step="0.01" {...register('discount', { valueAsNumber: true })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Batch Number" {...register('batchNumber')} />
            <div />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Manufacture Date" type="date" {...register('manufactureDate', { required: 'Manufacture date is required' })} error={errors.manufactureDate?.message} />
            <Input label="Expiry Date" type="date" {...register('expiryDate', { required: 'Expiry date is required' })} error={errors.expiryDate?.message} />
          </div>
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>{editingStock ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
