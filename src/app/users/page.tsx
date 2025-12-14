'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { usersAPI } from '@/lib/api';
import { User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface UserForm {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  aadharNumber?: string;
  address?: string;
  roles: string[];
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const { hasRole, user: currentUser } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserForm>();

  useEffect(() => {
    if (!hasRole(['Admin'])) {
      router.push('/dashboard');
      return;
    }
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setSelectedRoles(user.roles);
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        aadharNumber: user.aadharNumber,
        address: user.address,
        password: '',
      });
    } else {
      setEditingUser(null);
      setSelectedRoles(['Sales Man']);
      reset({});
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setSelectedRoles([]);
    reset();
  };

  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const onSubmit = async (data: UserForm) => {
    if (selectedRoles.length === 0) {
      alert('Please select at least one role');
      return;
    }

    try {
      setIsSubmitting(true);
      const userData = { ...data, roles: selectedRoles };
      if (editingUser) {
        const { password, username, ...updateData } = userData;
        await usersAPI.update(editingUser._id, updateData);
      } else {
        await usersAPI.create(userData);
      }
      await loadUsers();
      closeModal();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error saving user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (id === currentUser?._id) {
      alert('You cannot delete your own account');
      return;
    }
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.delete(id);
        await loadUsers();
      } catch (error: any) {
        alert(error.response?.data?.message || 'Error deleting user');
      }
    }
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, 'default' | 'success' | 'info' | 'danger'> = {
      Admin: 'danger',
      Manager: 'info',
      'Sales Man': 'success',
    };
    return <Badge key={role} variant={colors[role] || 'default'}>{role}</Badge>;
  };

  if (!hasRole(['Admin'])) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-900">User Management</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal()}
            className="inline-flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition"
          >
            <Plus className="h-5 w-5 mr-2" /> Add User
          </motion.button>
        </div>

        {/* Animated User Cards */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {users.map(user => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0,0,0,0.12)' }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xl">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-gray-500">{user.email}</p>
                      <div className="flex gap-2 mt-2">
                        {user.roles.map(getRoleBadge)}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => alert('View user details')} // replace with actual view logic
                      className="px-3 py-1 rounded bg-indigo-500 text-white flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" /> View
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openModal(user)}
                      className="px-3 py-1 rounded bg-blue-500 text-white flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" /> Edit
                    </motion.button>
                    {user._id !== currentUser?._id && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(user._id)}
                        className="px-3 py-1 rounded bg-red-500 text-white flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* User Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal} title={editingUser ? 'Edit User' : 'Add User'} size="lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="First Name" {...register('firstName', { required: 'First name is required' })} error={errors.firstName?.message} />
              <Input label="Last Name" {...register('lastName', { required: 'Last name is required' })} error={errors.lastName?.message} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Username" {...register('username', { required: !editingUser ? 'Username required' : false })} error={errors.username?.message} disabled={!!editingUser} />
              <Input label="Email" type="email" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} error={errors.email?.message} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Phone" {...register('phone', { required: 'Phone is required', pattern: { value: /^\d{10}$/, message: 'Phone must be 10 digits' } })} error={errors.phone?.message} />
              <Input label={editingUser ? 'New Password (leave blank to keep)' : 'Password'} type="password" {...register('password', { required: !editingUser ? 'Password is required' : false, minLength: { value: 6, message: 'Min 6 chars' } })} error={errors.password?.message} />
            </div>
            <Input label="Aadhar Number" {...register('aadharNumber')} />
            <Input label="Address" {...register('address')} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
              <div className="flex flex-wrap gap-2">
                {['Admin', 'Manager', 'Sales Man'].map(role => (
                  <motion.button key={role} type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => toggleRole(role)} className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedRoles.includes(role) ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{role}</motion.button>
                ))}
              </div>
              {selectedRoles.length === 0 && <p className="text-red-500 text-sm mt-1">Please select at least one role</p>}
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button type="submit" isLoading={isSubmitting}>{editingUser ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
