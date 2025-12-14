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
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { formatCurrency } from '@/lib/utils';

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
  const { hasRole } = useAuth();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CustomerForm>();

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
      reset({});
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
    reset();
  };

  const onSubmit = async (data: CustomerForm) => {
    try {
      setIsSubmitting(true);
      if (editingCustomer) {
        await customersAPI.update(editingCustomer._id, data);
      } else {
        await customersAPI.create(data);
      }
      await loadCustomers();
      closeModal();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error saving customer');
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
        alert(error.response?.data?.message || 'Error deleting customer');
      }
    }
  };

  const canEdit = hasRole(['Admin', 'Manager']);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          {canEdit && (
            <Button onClick={() => openModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
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
              <Table><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {customers.map((customer) => (
    <div
      key={customer._id}
  className="group relative rounded-2xl border bg-white shadow-sm 
             hover:shadow-2xl transition-all duration-300 ease-out 
             transform hover:scale-[1.03] cursor-pointer overflow-hidden"
   >
      {/* Top Gradient Header */}
      <div className="h-28 bg-gradient-to-r from-primary-600 to-primary-400 p-4 text-white flex justify-between">
        <div>
          <p className="text-lg font-semibold">{customer.shopName}</p>
          <p className="text-sm opacity-90">
            {customer.firstName} {customer.lastName}
          </p>
        </div>

        {/* Edit/Delete Buttons */}
        {canEdit && (
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => openModal(customer)}
              className="bg-white/10 hover:bg-white/20 p-1 rounded-md transition"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(customer._id)}
              className="bg-white/10 hover:bg-white/20 p-1 rounded-md transition"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-5 space-y-3">
        <div>
          <p className="text-xs text-gray-500">Email</p>
          <p className="text-sm font-medium">{customer.email}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Phone</p>
          <p className="text-sm font-medium">{customer.phone}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">GST Number</p>
          <p className="text-sm font-medium">{customer.gst || '-'}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Address</p>
          <p className="text-sm font-medium">{customer.address}</p>
        </div>

        {/* Total Due With Badge */}
        <div className="pt-2">
          <p className="text-xs text-gray-500">Total Due</p>

          <span
            className={`inline-block mt-1 px-3 py-1 text-sm font-semibold rounded-full 
            ${
              customer.totalDue > 0
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {formatCurrency(customer.totalDue)}
          </span>
        </div>
      </div>

      {/* Floating "Customer ID" Badge */}
      <div className="absolute top-24 left-4 bg-white shadow-md px-3 py-1 rounded-full text-xs font-medium">
        ID: {customer.customerId}
      </div>
    </div>
  ))}

  {customers.length === 0 && (
    <p className="text-gray-500 text-center col-span-full">No customers found</p>
  )}
</div>

              </Table>
            )}
          </CardContent>
        </Card>

        <Modal isOpen={isModalOpen} onClose={closeModal} title={editingCustomer ? 'Edit Customer' : 'Add Customer'} size="lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" {...register('firstName', { required: 'First name is required' })} error={errors.firstName?.message} />
              <Input label="Last Name" {...register('lastName', { required: 'Last name is required' })} error={errors.lastName?.message} />
            </div>
            <Input label="Shop Name" {...register('shopName', { required: 'Shop name is required' })} error={errors.shopName?.message} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Email" type="email" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} error={errors.email?.message} />
              <Input label="Phone" {...register('phone', { required: 'Phone is required', pattern: { value: /^\d{10}$/, message: 'Phone must be 10 digits' } })} error={errors.phone?.message} />
            </div>
            <Input label="GST Number" {...register('gst')} />
            <Input label="Address" {...register('address', { required: 'Address is required' })} error={errors.address?.message} />
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button type="submit" isLoading={isSubmitting}>{editingCustomer ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
