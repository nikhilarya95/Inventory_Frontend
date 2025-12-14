'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { productsAPI } from '@/lib/api';
import { Product } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface ProductForm {
  brandName: string;
  productName: string;
  hsnNumber?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { hasRole } = useAuth();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductForm>();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      reset({
        brandName: product.brandName,
        productName: product.productName,
        hsnNumber: product.hsnNumber,
      });
    } else {
      setEditingProduct(null);
      reset({ brandName: '', productName: '', hsnNumber: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    reset();
  };

  const onSubmit = async (data: ProductForm) => {
    try {
      setIsSubmitting(true);
      if (editingProduct) {
        await productsAPI.update(editingProduct._id, data);
      } else {
        await productsAPI.create(data);
      }
      await loadProducts();
      closeModal();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error saving product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        await loadProducts();
      } catch (error: any) {
        alert(error.response?.data?.message || 'Error deleting product');
      }
    }
  };

  const canEdit = hasRole(['Admin']);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          {canEdit && (
            <Button onClick={() => openModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
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
                    <TableHead>Brand Name</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>HSN Number</TableHead>
                    {canEdit && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>{product.brandName}</TableCell>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell>{product.hsnNumber || '-'}</TableCell>
                      {canEdit && (
                        <TableCell>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openModal(product)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                  {products.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={canEdit ? 4 : 3} className="text-center text-gray-500">
                        No products found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Modal isOpen={isModalOpen} onClose={closeModal} title={editingProduct ? 'Edit Product' : 'Add Product'}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Brand Name"
              {...register('brandName', { required: 'Brand name is required' })}
              error={errors.brandName?.message}
            />
            <Input
              label="Product Name"
              {...register('productName', { required: 'Product name is required' })}
              error={errors.productName?.message}
            />
            <Input
              label="HSN Number"
              {...register('hsnNumber')}
            />
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                {editingProduct ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
