'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { customersAPI } from '@/lib/api';
import { Customer } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit, Trash2, Search, Filter, Mail, Phone, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { formatCurrency } from '@/lib/utils';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';
import { useMemo } from 'react';

interface CustomerForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shopName: string;
  gst?: string;
  address: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSort, setFilterSort] = useState<string>('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const { hasRole } = useAuth();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CustomerForm>();
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await customersAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedCustomers = useMemo(() => {
    return customers.filter(customer => {
      const query = searchQuery.toLowerCase();
      const ownerName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
      return (
        customer.shopName.toLowerCase().includes(query) ||
        ownerName.includes(query) ||
        customer.email.toLowerCase().includes(query)
      );
    }).sort((a, b) => {
      const ownerNameA = `${a.firstName} ${a.lastName}`;
      const ownerNameB = `${b.firstName} ${b.lastName}`;
      if (filterSort === 'name-desc') return ownerNameB.localeCompare(ownerNameA);
      if (filterSort === 'shop-asc') return a.shopName.localeCompare(b.shopName);
      if (filterSort === 'shop-desc') return b.shopName.localeCompare(a.shopName);
      return ownerNameA.localeCompare(ownerNameB);
    });
  }, [searchQuery, customers, filterSort]);

  const paginatedCustomers = useMemo(() => {
    return filteredAndSortedCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredAndSortedCustomers, currentPage, itemsPerPage]);

  const openModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      reset({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        shopName: customer.shopName,
        gst: customer.gst,
        address: customer.address,
      });
    } else {
      setEditingCustomer(null);
      reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        shopName: '',
        gst: '',
        address: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
    setStatusMessage(null);
    reset();
  };

  const onSubmit = async (data: CustomerForm) => {
    try {
      setIsSubmitting(true);
      setStatusMessage(null);
      if (editingCustomer) {
        await customersAPI.update(editingCustomer._id, data);
      } else {
        await customersAPI.create(data);
      }
      await loadCustomers();
      setStatusMessage({ type: 'success', text: `Customer ${editingCustomer ? 'updated' : 'created'} successfully!` });
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error: any) {
      setStatusMessage({ type: 'error', text: error.response?.data?.message || 'Error saving customer' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        await customersAPI.delete(id);
        await loadCustomers();
      } catch (error: any) {
        setStatusMessage({ type: 'error', text: error.response?.data?.message || 'Error deleting customer' });
      }
    }
  };

  const canEdit = hasRole(['Admin', 'Manager']);

  return (
    <DashboardLayout moduleName="Customer Directory">
      <div className="space-y-6 w-full animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, shop or email..."
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
                { value: 'shop-asc', label: 'Shop (A-Z)' },
                { value: 'shop-desc', label: 'Shop (Z-A)' }
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
              Add Customer
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
            </div>
          </div>
        ) : filteredAndSortedCustomers.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <Search className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No customers found</h3>
            <p className="text-gray-500 max-w-xs mx-auto mt-1">
              {searchQuery ? `No results for "${searchQuery}". Try a different search term.` : "Start by adding your first customer to the directory."}
            </p>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCustomers.map((customer) => (
                <div
                  key={customer._id}
                  className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full animate-slide-up"
                >
                  {/* Visual Header */}
                  <div className="h-24 bg-gradient-to-br from-blue-600 to-indigo-700 p-4 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="relative z-10 flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-lg truncate shadow-sm">{customer.shopName}</p>
                        <p className="text-blue-100 text-sm font-medium truncate opacity-90">
                          {customer.firstName} {customer.lastName}
                        </p>
                      </div>
                      {canEdit && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openModal(customer)}
                            className="h-8 w-8 p-0 bg-white/10 hover:bg-white/20 text-white border-none rounded-lg transition-all"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(customer._id)}
                            className="h-8 w-8 p-0 bg-white/10 hover:bg-red-500/20 text-white hover:text-red-200 border-none rounded-lg transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Floating "Customer ID" Badge */}
                  <div className="absolute top-24 left-4 bg-white shadow-md px-3 py-1 rounded-full text-xs font-medium">
                    ID: {customer.customerId}
                  </div>

                  {/* Content */}
                  <div className="p-5 pt-9 flex-1 space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                          <Mail className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Address</p>
                          <p className="text-sm font-medium truncate">{customer.email || 'No email'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                          <Phone className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Phone Number</p>
                          <p className="text-sm font-medium truncate">{customer.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 text-gray-600">
                        <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Address</p>
                          <p className="text-sm font-medium line-clamp-2 leading-relaxed">
                            {customer.address || 'No address provided'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {customer.gst && (
                      <div className="pt-3 border-t border-gray-50">
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                          GST: {customer.gst}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {!loading && filteredAndSortedCustomers.length > 0 && (
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredAndSortedCustomers.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={(page) => setCurrentPage(page)}
                  onItemsPerPageChange={(items) => {
                    setItemsPerPage(items);
                    setCurrentPage(1);
                  }}
                  type="card"
                />
              </div>
            )}
          </>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingCustomer ? 'Edit Customer' : 'Add New Customer'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {statusMessage && (
            <div className={`p-4 rounded-xl text-sm font-medium border animate-fade-in ${statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
              {statusMessage.text}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">First Name</label>
              <Input
                {...register('firstName', { required: 'First name is required' })}
                placeholder="Ex: John"
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Last Name</label>
              <Input
                {...register('lastName', { required: 'Last name is required' })}
                placeholder="Ex: Doe"
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Shop / Business Name</label>
            <Input
              {...register('shopName', { required: 'Shop name is required' })}
              placeholder="Ex: Doe Enterprises"
              className={errors.shopName ? 'border-red-500' : ''}
            />
            {errors.shopName && <p className="text-xs text-red-500">{errors.shopName.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email Address</label>
              <Input
                {...register('email')}
                type="email"
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Phone Number</label>
              <Input
                {...register('phone', { required: 'Phone number is required' })}
                placeholder="+91 98765 43210"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">GST Number (Optional)</label>
            <Input
              {...register('gst')}
              placeholder="Ex: 22AAAAA0000A1Z5"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Full Address</label>
            <textarea
              {...register('address', { required: 'Address is required' })}
              className={`w-full min-h-[100px] p-3 rounded-lg border bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm ${errors.address ? 'border-red-500' : 'border-gray-200'}`}
              placeholder="Full shop/business address..."
            />
            {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="secondary"
              onClick={closeModal}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
            >
              {editingCustomer ? 'Update Customer' : 'Add Customer'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
