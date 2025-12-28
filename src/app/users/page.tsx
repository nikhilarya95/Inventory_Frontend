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
import { Plus, Edit, Trash2, Eye, Search, Filter, Mail, Phone, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';

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
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
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
      // Initial load, filteredUsers will be set by the useEffect below
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Filtering effect triggered:', { searchQuery, filterRole, usersLength: users.length });
    const filtered = users.filter(user => {
      const query = searchQuery.toLowerCase();
      const roleMatches = filterRole === 'All' || user.roles.includes(filterRole as any);
      const searchMatches = (
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.phone.includes(query) ||
        user.roles.some(role => role.toLowerCase().includes(query))
      );
      const matches = roleMatches && searchMatches;
      console.log(`User ${user.firstName} matches query "${query}" and role "${filterRole}":`, matches);
      return matches;
    });
    console.log('Setting filtered users:', filtered.length);
    setFilteredUsers(filtered);
  }, [searchQuery, filterRole, users]);

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
    setStatusMessage(null);
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
      setStatusMessage({ type: 'error', text: 'Please select at least one role' });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatusMessage(null);
      const userData = { ...data, roles: selectedRoles };
      if (editingUser) {
        const { username, ...updateData } = userData;
        // Only include password if it's not empty
        if (!userData.password) {
          delete (updateData as any).password;
        }
        await usersAPI.update(editingUser._id, updateData);
      } else {
        await usersAPI.create(userData);
      }
      await loadUsers();
      setStatusMessage({ type: 'success', text: `User ${editingUser ? 'updated' : 'created'} successfully!` });
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error: any) {
      console.error('User save error:', error);
      const errorMessage = error.response?.data?.message ||
        (error.response?.data?.errors ? error.response.data.errors.map((e: any) => e.msg).join(', ') : null) ||
        'Error saving user';
      setStatusMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewUser = async (user: User) => {
    try {
      const response = await usersAPI.getById(user._id);
      setViewingUser(response.data);
      setIsViewModalOpen(true);
    } catch (error: any) {
      console.error('Error fetching user details:', error);
      setStatusMessage({ type: 'error', text: 'Error fetching user details: ' + (error.response?.data?.message || 'Unknown error') });
    }
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewingUser(null);
  };

  const handleDelete = async (id: string) => {
    if (id === currentUser?._id) {
      setStatusMessage({ type: 'error', text: 'You cannot delete your own account' });
      return;
    }
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.delete(id);
        await loadUsers();
        setStatusMessage({ type: 'success', text: 'User deleted successfully' });
      } catch (error: any) {
        setStatusMessage({ type: 'error', text: error.response?.data?.message || 'Error deleting user' });
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
    <DashboardLayout moduleName="User Management">
      <div className="space-y-6 w-full animate-fade-in">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              options={[
                { value: 'All', label: 'All Roles' },
                { value: 'Admin', label: 'Admin' },
                { value: 'Manager', label: 'Manager' },
                { value: 'Sales Man', label: 'Sales Man' }
              ]}
              className="h-10"
            />
          </div>
          <Button
            onClick={() => openModal()}
            className="flex items-center gap-2 h-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            Add New User
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <Search className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No users found</h3>
            <p className="text-gray-500 max-w-xs mx-auto mt-1">
              {searchQuery ? `No results for "${searchQuery}". Try a different search term.` : "User directory is currently empty."}
            </p>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredUsers
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map(user => (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ y: -5 }}
                      className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
                    >
                      {/* Visual Header */}
                      <div className="h-24 bg-gradient-to-br from-indigo-600 to-blue-700 p-4 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="relative z-10 flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-xl border border-white/30 shadow-inner">
                              {user.firstName?.[0]}{user.lastName?.[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-bold text-base truncate shadow-sm">{user.firstName} {user.lastName}</p>
                              <p className="text-blue-100 text-xs font-medium truncate opacity-90">@{user.username}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewUser(user)}
                              className="h-8 w-8 p-0 bg-white/10 hover:bg-white/20 text-white border-none rounded-lg transition-all"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openModal(user)}
                              className="h-8 w-8 p-0 bg-white/10 hover:bg-white/20 text-white border-none rounded-lg transition-all"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {user._id !== currentUser?._id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(user._id)}
                                className="h-8 w-8 p-0 bg-white/10 hover:bg-red-500/20 text-white hover:text-red-200 border-none rounded-lg transition-all"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {user.roles.map(getRoleBadge)}
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex items-center gap-3 text-gray-600">
                            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                              <Mail className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Address</p>
                              <p className="text-sm font-medium truncate">{user.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-gray-600">
                            <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                              <Phone className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Phone Number</p>
                              <p className="text-sm font-medium truncate">{user.phone}</p>
                            </div>
                          </div>
                        </div>

                        {user.address && (
                          <div className="pt-3 border-t border-gray-50 flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-500 line-clamp-1">{user.address}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>

            {!loading && filteredUsers.length > 0 && (
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredUsers.length}
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

      {/* User Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingUser ? 'Edit User' : 'Add User'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg text-sm font-medium ${statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}
            >
              {statusMessage.text}
            </motion.div>
          )}
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

      {/* View User Modal */}
      <Modal isOpen={isViewModalOpen} onClose={closeViewModal} title="User Details" size="md">
        {viewingUser && (
          <div className="space-y-4">
            {/* User Avatar and Basic Info */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                {viewingUser.firstName?.[0]}{viewingUser.lastName?.[0]}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {viewingUser.firstName} {viewingUser.lastName}
                </h3>
                <p className="text-gray-500">@{viewingUser.username}</p>
                <div className="flex gap-2 mt-2">
                  {viewingUser.roles.map(getRoleBadge)}
                </div>
              </div>
            </div>

            {/* User Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{viewingUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{viewingUser.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-gray-900">{viewingUser.address || 'Not provided'}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Aadhar Number</label>
                  <p className="text-gray-900">{viewingUser.aadharNumber || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="text-gray-900">
                    {viewingUser.isActive ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Inactive
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-gray-900">
                    {new Date(viewingUser.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="secondary" onClick={closeViewModal}>
                Close
              </Button>
              <Button
                type="button"
                onClick={() => {
                  closeViewModal();
                  openModal(viewingUser);
                }}
              >
                Edit User
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
