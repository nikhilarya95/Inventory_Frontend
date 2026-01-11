'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authAPI, companyAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { User, Building2, Lock, CheckCircle, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileForm {
  firstName: string;
  lastName: string;
  phone: string;
  aadharNumber?: string;
  address?: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface CompanyForm {
  name: string;
  address: string;
  phone: string;
  gst?: string;
  email?: string;
}

export default function SettingsPage() {
  const { user, hasRole, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [company, setCompany] = useState<CompanyForm | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const profileForm = useForm<ProfileForm>();
  const passwordForm = useForm<PasswordForm>();
  const companyForm = useForm<CompanyForm>();

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        aadharNumber: user.aadharNumber,
        address: user.address,
      });
    }
    loadCompany();
  }, [user, profileForm.reset]);

  const loadCompany = async () => {
    try {
      const response = await companyAPI.get();
      setCompany(response.data);
      companyForm.reset(response.data);
    } catch (error) {
      console.error('Error loading company:', error);
    }
  };

  const updateProfile = async (data: ProfileForm) => {
    try {
      setIsSubmitting(true);
      await authAPI.updateProfile(data);
      await refreshUser();
      setFeedback({ type: 'success', text: 'Profile updated successfully' });
    } catch (error: any) {
      setFeedback({ type: 'error', text: error.response?.data?.message || 'Error updating profile' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const changePassword = async (data: PasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      setFeedback({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    try {
      setIsSubmitting(true);
      await authAPI.changePassword(data.currentPassword, data.newPassword);
      setFeedback({ type: 'success', text: 'Password changed successfully' });
      passwordForm.reset();
    } catch (error: any) {
      setFeedback({ type: 'error', text: error.response?.data?.message || 'Error changing password' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCompany = async (data: CompanyForm) => {
    try {
      setIsSubmitting(true);
      await companyAPI.update(data);
      await loadCompany();
      setFeedback({ type: 'success', text: 'Company information updated successfully' });
    } catch (error: any) {
      setFeedback({ type: 'error', text: error.response?.data?.message || 'Error updating company' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Change Password', icon: Lock },
    { id: 'company', label: 'Company Info', icon: Building2 },
  ];

  return (
    <DashboardLayout moduleName="Settings">
      <div className="space-y-6">
        <div className="flex space-x-4 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 border-b-2 transition-colors ${activeTab === tab.id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>



        {activeTab === 'profile' && (
          <Card className='p-4 px-6'>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(updateProfile)} className="space-y-4 max-w-full p-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    {...profileForm.register('firstName', { required: 'First name is required' })}
                    error={profileForm.formState.errors.firstName?.message}
                  />
                  <Input
                    label="Last Name"
                    {...profileForm.register('lastName', { required: 'Last name is required' })}
                    error={profileForm.formState.errors.lastName?.message}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      value={user?.username || ''}
                      disabled
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100 text-gray-500"
                    />
                  </div>
                </div>

                <Input
                  label="Phone"
                  {...profileForm.register('phone', {
                    required: 'Phone is required',
                    pattern: { value: /^\d{10}$/, message: 'Phone must be 10 digits' }
                  })}
                  error={profileForm.formState.errors.phone?.message}
                />

                <Input label="Aadhar Number" {...profileForm.register('aadharNumber')} />
                <Input label="Address" {...profileForm.register('address')} />

                <Button type="submit" isLoading={isSubmitting}>Update Profile</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === 'password' && (
          <Card className="p-4 px-6">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(changePassword)} className="space-y-4 max-w-lg">
                <Input
                  label="Current Password"
                  type="password"
                  {...passwordForm.register('currentPassword', { required: 'Current password is required' })}
                  error={passwordForm.formState.errors.currentPassword?.message}
                />
                <Input
                  label="New Password"
                  type="password"
                  {...passwordForm.register('newPassword', {
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  error={passwordForm.formState.errors.newPassword?.message}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  {...passwordForm.register('confirmPassword', { required: 'Please confirm password' })}
                  error={passwordForm.formState.errors.confirmPassword?.message}
                />
                <Button type="submit" isLoading={isSubmitting}>Change Password</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === 'company' && (
          <Card className="p-4 px-6">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={companyForm.handleSubmit(updateCompany)} className="space-y-4 max-w-lg">
                <Input
                  label="Company Name"
                  {...companyForm.register('name', { required: 'Company name is required' })}
                  error={companyForm.formState.errors.name?.message}
                  disabled={!hasRole(['Admin'])}
                />
                <Input
                  label="Address"
                  {...companyForm.register('address', { required: 'Address is required' })}
                  error={companyForm.formState.errors.address?.message}
                  disabled={!hasRole(['Admin'])}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Phone"
                    {...companyForm.register('phone', {
                      required: 'Phone is required',
                      pattern: { value: /^\d{10}$/, message: 'Phone must be 10 digits' }
                    })}
                    error={companyForm.formState.errors.phone?.message}
                    disabled={!hasRole(['Admin'])}
                  />
                  <Input
                    label="GST Number"
                    {...companyForm.register('gst')}
                    disabled={!hasRole(['Admin'])}
                  />
                </div>
                <Input
                  label="Email"
                  type="email"
                  {...companyForm.register('email')}
                  disabled={!hasRole(['Admin'])}
                />

                {hasRole(['Admin']) ? (
                  <Button type="submit" isLoading={isSubmitting}>Update Company Info</Button>
                ) : (
                  <p className="text-sm text-gray-500">Only Admin can edit company information</p>
                )}
              </form>
            </CardContent>
          </Card>
        )}

        <AnimatePresence mode="wait">
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`fixed bottom-8 right-8 z-50 p-4 rounded-2xl border-l-4 shadow-2xl backdrop-blur-md ${feedback.type === 'success'
                ? 'bg-green-50/90 border-green-500 text-green-700'
                : 'bg-red-50/90 border-red-500 text-red-700'
                }`}
            >
              <div className="flex items-center gap-3 pr-8 relative">
                <div className={`p-2 rounded-full ${feedback.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {feedback.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-sm tracking-tight">{feedback.type === 'success' ? 'Success' : 'Attention'}</p>
                  <p className="text-sm opacity-90">{feedback.text}</p>
                </div>
                <button
                  onClick={() => setFeedback(null)}
                  className="absolute -right-2 top-0 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
