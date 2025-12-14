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
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { formatCurrency, formatDate } from '@/lib/utils';

interface StockForm {
  product: string;
  location: string;
  quantity: number;
  expiryDate: string;
  manufactureDate: string;
  weight: number;
  weightUnit: string;
  mrp: number;
  batchNumber?: string;
}

export default function StockPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { hasRole } = useAuth();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<StockForm>();

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
    reset();
  };

  const onSubmit = async (data: StockForm) => {
    try {
      setIsSubmitting(true);
      if (editingStock) {
        await stockAPI.update(editingStock._id, data);
      } else {
        await stockAPI.create(data);
      }
      await loadData();
      closeModal();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error saving stock');
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
        alert(error.response?.data?.message || 'Error deleting stock');
      }
    }
  };

  const canEdit = hasRole(['Admin', 'Manager']);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
          {canEdit && (
            <Button onClick={() => openModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Stock
            </Button>
          )}
        </div>

        <Card>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>MRP</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    {canEdit && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stocks.map((stock) => (
                    <TableRow key={stock._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{stock.product?.productName}</p>
                          <p className="text-sm text-gray-500">{stock.product?.brandName}</p>
                        </div>
                      </TableCell>
                      <TableCell>{stock.location}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {stock.quantity}
                          {stock.quantity < 3 && (
                            <AlertTriangle className="h-4 w-4 text-red-500 ml-2" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{stock.weight} {stock.weightUnit}</TableCell>
                      <TableCell>{formatCurrency(stock.mrp)}</TableCell>
                      <TableCell>{formatDate(stock.expiryDate)}</TableCell>
                      <TableCell>
                        {stock.quantity < 3 ? (
                          <Badge variant="danger">Low Stock</Badge>
                        ) : stock.quantity < 10 ? (
                          <Badge variant="warning">Medium</Badge>
                        ) : (
                          <Badge variant="success">In Stock</Badge>
                        )}
                      </TableCell>
                      {canEdit && (
                        <TableCell>
                          <div className="flex space-x-2">
                            <button onClick={() => openModal(stock)} className="text-blue-600 hover:text-blue-800">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDelete(stock._id)} className="text-red-600 hover:text-red-800">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                  {stocks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={canEdit ? 8 : 7} className="text-center text-gray-500">
                        No stock entries found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Modal isOpen={isModalOpen} onClose={closeModal} title={editingStock ? 'Edit Stock' : 'Add Stock'} size="lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <Input label="Batch Number" {...register('batchNumber')} />
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
      </div>
    </DashboardLayout>
  );
}
