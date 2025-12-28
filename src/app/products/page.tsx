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
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';
import { useMemo } from 'react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSort, setFilterSort] = useState<string>('Name A-Z');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { hasRole } = useAuth();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductForm>();
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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

  const filteredAndSortedProducts = useMemo(() => {
    return products.filter(product => {
      const query = searchQuery.toLowerCase();
      return (
        product.brandName.toLowerCase().includes(query) ||
        product.productName.toLowerCase().includes(query) ||
        product.hsnNumber?.toLowerCase().includes(query)
      );
    }).sort((a, b) => {
      if (filterSort === 'Name Z-A') return b.productName.localeCompare(a.productName);
      if (filterSort === 'Brand A-Z') return a.brandName.localeCompare(b.brandName);
      if (filterSort === 'Brand Z-A') return b.brandName.localeCompare(a.brandName);
      return a.productName.localeCompare(b.productName);
    });
  }, [searchQuery, products, filterSort]);

  const paginatedProducts = useMemo(() => {
    return filteredAndSortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredAndSortedProducts, currentPage, itemsPerPage]);

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
    setStatusMessage(null);
    reset();
  };

  const onSubmit = async (data: ProductForm) => {
    try {
      setIsSubmitting(true);
      setStatusMessage(null);
      if (editingProduct) {
        await productsAPI.update(editingProduct._id, data);
      } else {
        await productsAPI.create(data);
      }
      await loadProducts();
      setStatusMessage({ type: 'success', text: `Product ${editingProduct ? 'updated' : 'created'} successfully!` });
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error: any) {
      setStatusMessage({ type: 'error', text: error.response?.data?.message || 'Error saving product' });
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
        setStatusMessage({ type: 'error', text: error.response?.data?.message || 'Error deleting product' });
      }
    }
  };

  const canEdit = hasRole(['Admin']);

  return (
    <DashboardLayout moduleName="Product Catalog">
      <div className="space-y-6 w-full animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by brand, name or HSN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              value={filterSort}
              onChange={(e) => setFilterSort(e.target.value)}
              options={[
                { value: 'name-asc', label: 'Name (A-Z)' },
                { value: 'name-desc', label: 'Name (Z-A)' },
                { value: 'brand-asc', label: 'Brand (A-Z)' },
                { value: 'brand-desc', label: 'Brand (Z-A)' }
              ]}
              className="h-10"
            />
          </div>
          {canEdit && (
            <Button
              onClick={() => openModal()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 h-10 px-6"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
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
                      <TableHead className="font-semibold text-gray-700">Brand Name</TableHead>
                      <TableHead className="font-semibold text-gray-700">Product Name</TableHead>
                      <TableHead className="font-semibold text-gray-700">HSN Number</TableHead>
                      {canEdit && <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProducts.map((product) => (
                      <TableRow key={product._id} className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 animate-slide-up">
                        <TableCell className="font-medium text-blue-600">{product.brandName}</TableCell>
                        <TableCell className="font-medium text-gray-900">{product.productName}</TableCell>
                        <TableCell className="text-gray-600">{product.hsnNumber || '-'}</TableCell>
                        {canEdit && (
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openModal(product)}
                                className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(product._id)}
                                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                    {filteredAndSortedProducts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={canEdit ? 4 : 3} className="text-center p-8">
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-gray-100 rounded-full">
                              <Search className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">No products found</p>
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

        {!loading && filteredAndSortedProducts.length > 0 && (
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredAndSortedProducts.length}
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

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingProduct ? 'Edit Product' : 'Add Product'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {statusMessage && (
            <div className={`p-4 rounded-xl text-sm font-medium border animate-fade-in ${statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
              {statusMessage.text}
            </div>
          )}
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
    </DashboardLayout>
  );
}
