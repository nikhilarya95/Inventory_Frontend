import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token', { path: '/' });
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (username: string, password: string) => 
    api.post('/auth/login', { username, password }),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { currentPassword, newPassword }),
};

export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

export const productsAPI = {
  getAll: () => api.get('/products'),
  getBrands: () => api.get('/products/brands'),
  getByBrand: (brandName: string) => api.get(`/products/by-brand/${encodeURIComponent(brandName)}`),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

export const stockAPI = {
  getAll: () => api.get('/stock'),
  getLowStock: () => api.get('/stock/low-stock'),
  getByProduct: (productId: string) => api.get(`/stock/product/${productId}`), // <-- fixed
  getById: (id: string) => api.get(`/stock/${id}`),
  create: (data: any) => api.post('/stock', data),
  update: (id: string, data: any) => api.put(`/stock/${id}`, data),
  delete: (id: string) => api.delete(`/stock/${id}`),
};

export const customersAPI = {
  getAll: () => api.get('/customers'),
  search: (query: string) => api.get(`/customers/search?q=${encodeURIComponent(query)}`),
  getById: (id: string) => api.get(`/customers/${id}`),
  create: (data: any) => api.post('/customers', data),
  update: (id: string, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
};

export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (data: any) => api.post('/orders', data),
  update: (id: string, data: any) => api.put(`/orders/${id}`, data),
  delete: (id: string) => api.delete(`/orders/${id}`),
};

export const billsAPI = {
  getAll: () => api.get('/bills'),
  getByCustomer: (customerId: string) => api.get(`/bills/customer/${customerId}`),
  getById: (id: string) => api.get(`/bills/${id}`),
  checkCredit: (customerId: string) => api.post(`/bills/check-credit/${customerId}`),
  create: (data: any) => api.post('/bills', data),
  update: (id: string, data: any) => api.put(`/bills/${id}`, data),
  delete: (id: string) => api.delete(`/bills/${id}`),
};

export const paymentsAPI = {
  getAll: () => api.get('/payments'),
  getByCustomer: (customerId: string) => api.get(`/payments/customer/${customerId}`),
  getById: (id: string) => api.get(`/payments/${id}`),
  create: (data: any) => api.post('/payments', data),
  update: (id: string, data: any) => api.put(`/payments/${id}`, data),
  delete: (id: string) => api.delete(`/payments/${id}`),
};

export const companyAPI = {
  get: () => api.get('/company'),
  update: (data: any) => api.put('/company', data),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getTopSelling: () => api.get('/dashboard/top-selling'),
  getLowPerforming: () => api.get('/dashboard/low-performing'),
  getPaymentFrequency: () => api.get('/dashboard/payment-frequency'),
  getRecentOrders: () => api.get('/dashboard/recent-orders'),
  getRecentPayments: () => api.get('/dashboard/recent-payments'),
};

export default api;
